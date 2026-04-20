// socket.ts
import { Server, Socket } from "socket.io";
import { configs } from "./app/configs";
import { goal_model } from "./app/modules/goal/goal.schema";
import { jwtHelpers } from "./app/utils/JWT";

// accountId => { socketId, loginTime }
export const onlineUsers = new Map<
  string,
  { socketId: string; loginTime: number }
>();

let io: Server;

const TIMEZONE = "Asia/Dhaka";

// ✅ Dhaka date: "YYYY-MM-DD"
function getDhakaDateStr(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;

  return `${y}-${m}-${d}`;
}

// ✅ yesterday from "YYYY-MM-DD"
function getYesterday(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  // create UTC date to avoid local timezone drift
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);

  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

// ✅ ensure daily bucket reset if date changed
async function ensureTodayBucket(accountId: string, today: string) {
  const acc = await goal_model
    .findOne({ studentId: accountId, goalStatus: "IN_PROGRESS" })
    .lean();

  // if first time or date changed → reset todayStudyHours to 0 and set todayStudyDate
  if (!acc?.todayStudyDate || acc.todayStudyDate !== today) {
    await goal_model.findOneAndUpdate(
      { studentId: accountId, goalStatus: "IN_PROGRESS" },
      { todayStudyDate: today, todayStudyHours: 0 },
    );
  }
}

export function setupSocket(_io: Server) {
  io = _io;

  io.on("connection", async (socket: Socket) => {
    try {
      const authToken = socket.handshake.query.token as string;
      const key = socket.handshake.query.key as string;
      if (!authToken) return;

      const verifiedUser = jwtHelpers.verifyToken(
        authToken,
        configs.jwt.access_token as string,
      );

      if (!verifiedUser?.email || !verifiedUser?.accountId) return;

      // ⏱ session start
      onlineUsers.set(verifiedUser.accountId, {
        socketId: socket.id,
        loginTime: Date.now(),
      });

      const today = getDhakaDateStr(new Date());

      // ✅ daily bucket ensure
      await ensureTodayBucket(verifiedUser.accountId, today);

      socket.on("disconnect", async () => {
        try {
          const userData = onlineUsers.get(verifiedUser.accountId);
          if (!userData) {
            onlineUsers.delete(verifiedUser.accountId);
            return;
          }

          const loginTime = userData.loginTime;
          const logoutTime = Date.now();

          const durationMs = logoutTime - loginTime;
          const durationHours = Number(
            (durationMs / (1000 * 60 * 60)).toFixed(2),
          ); // ✅ number

          const todayNow = getDhakaDateStr(new Date());

          // ✅ Ensure today bucket (in case date changed while connected)
          await ensureTodayBucket(verifiedUser.accountId, todayNow);

          // ✅ get active goal to determine per-day target
          const activeGoal = await goal_model
            .findOne({
              studentId: verifiedUser.accountId,
              goalStatus: "IN_PROGRESS",
            })
            .lean();

          // ✅ update goal progress (completed study hours add)
          // NOTE: totalCompletedStudyHours must be Number in schema
          await goal_model.findByIdAndUpdate(activeGoal?._id, {
            $inc: { totalCompletedStudyHours: durationHours },
          });

          // ✅ Read account before increment to detect threshold crossing
          const beforeAcc = await goal_model.findById(activeGoal?._id).lean();
          // for total time
          const beforeTodayHours =
            beforeAcc?.todayStudyDate === todayNow
              ? (beforeAcc?.todayStudyHours ?? 0)
              : 0;

          const afterTodayHours = Number(
            (beforeTodayHours + durationHours).toFixed(2),
          );

          //for mcq
          const beforeMcqTodayHours =
            beforeAcc?.todayStudyDate === todayNow
              ? (beforeAcc?.totalMcqStudyHours ?? 0)
              : 0;

          const afterTodayMcqHours = Number(
            (beforeMcqTodayHours + durationHours).toFixed(2),
          );

          //for clinical case
          const beforeTodayClinicalCaseHours =
            beforeAcc?.todayStudyDate === todayNow
              ? (beforeAcc?.totalClinicalCaseStudyHours ?? 0)
              : 0;

          const afterTodayClinicalCaseHours = Number(
            (beforeTodayClinicalCaseHours + durationHours).toFixed(2),
          );
          //for osce
          const beforeTodayOsceHours =
            beforeAcc?.todayStudyDate === todayNow
              ? (beforeAcc?.totalOsceStudyHours ?? 0)
              : 0;

          const afterTodayOsceHours = Number(
            (beforeTodayOsceHours + durationHours).toFixed(2),
          );

          // ✅ save today's hours
          const updateData: any = {
            todayStudyDate: todayNow,
            todayStudyHours: afterTodayHours,
          };

          if (key === "mcq") updateData.totalMcqStudyHours = afterTodayMcqHours;
          if (key === "clinical_case")
            updateData.totalClinicalCaseStudyHours =
              afterTodayClinicalCaseHours;
          if (key === "osce")
            updateData.totalOsceStudyHours = afterTodayOsceHours;

          await goal_model.findOneAndUpdate(
            { _id: activeGoal?._id },
            updateData,
          );

          const targetHours = activeGoal?.studyHoursPerDay ?? 0;
          const wasBelow = beforeTodayHours < targetHours;
          const isNowMeet = targetHours > 0 && afterTodayHours >= targetHours;

          if (isNowMeet) {
            // if already counted today, do nothing
            const lastStreakDate = beforeAcc?.lastStreakDate ?? null;
            const currentStreak = beforeAcc?.streak ?? 0;

            if (lastStreakDate !== todayNow) {
              const yesterday = getYesterday(todayNow);

              let newStreak = 1;
              if (lastStreakDate === yesterday) {
                newStreak = currentStreak + 1;
              } else {
                newStreak = 1; // break -> restart
              }
              await goal_model.findOneAndUpdate(
                { _id: activeGoal?._id },
                { streak: newStreak, lastStreakDate: todayNow },
              );
            }

            // optional: you can emit event when streak updated
            if (wasBelow)
              io.emit("streak", {
                accountId: verifiedUser.accountId,
                date: todayNow,
              });
          }

          onlineUsers.delete(verifiedUser.accountId);
          io.emit("presence", {
            accountId: verifiedUser.accountId,
            online: false,
          });
        } catch (err) {
          console.error("disconnect error:", err);
          onlineUsers.delete(verifiedUser.accountId);
        }
      });
    } catch (err) {
      console.error("socket connection error:", err);
    }
  });
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}
