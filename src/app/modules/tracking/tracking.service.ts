import { Request } from "express";
import { buildGoalContentFilter } from "../../utils/findContentQueryBuilder";
import { isAccountExist } from "../../utils/isAccountExist";
import { updatePointHelper } from "../../utils/updatePointHelper";
import { Account_Model } from "../auth/auth.schema";
import { ClinicalCaseModel } from "../clinical_case/clinical_case.schema";
import { FlashcardModel } from "../flash_card/flash_card.schema";
import { goal_model } from "../goal/goal.schema";
import { McqBankModel } from "../mcq_bank/mcq_bank.schema";
import {
  my_content_clinicalCase_model,
  my_content_flashcard_model,
  my_content_mcq_bank_model,
} from "../my_content/my_content.schema";
import { notes_model } from "../notes/notes.schema";
import { osce_model } from "../osce/osce.schema";
import { Student_Model } from "../student/student.schema";

type AnyDoc = { _id?: any;[key: string]: any };

// null-safe completion marker
const markCompleted = <T extends AnyDoc>(
  doc: (T & { isCompleted?: boolean }) | null,
  finishedIds?: any[],
) => {
  if (!doc) return null;

  const docId = String(doc._id);
  const isDone =
    Array.isArray(finishedIds) &&
    finishedIds.some((x) => String(x) === docId);

  // lean() object => safe copy + attach extra field
  return { ...doc, isCompleted: Boolean(isDone) };
};


const get_student_and_professional_leaderboard_from_db = async (req: Request) => {
  const email = req?.user?.email;
  const role = req?.user?.role;

  const isAccount = (await isAccountExist(email as string, "profile_id")) as any;

  let type: string | undefined;

  if (role === "STUDENT") type = isAccount?.profile_id?.studentType;
  else if (role === "PROFESSIONAL") type = isAccount?.profile_id?.professionName;

  if (!type) return []; // or throw error

  const leaderboard = await Student_Model.aggregate([
    // Only matching students
    { $match: { studentType: type } },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        role: { $literal: "STUDENT" },
        title: "$studentType",
        point: { $ifNull: ["$point", 0] },
      },
    },
    {
      $unionWith: {
        coll: "professional_profile",
        pipeline: [
          { $match: { professionName: type } },
          {
            $project: {
              firstName: 1,
              lastName: 1,
              role: { $literal: "PROFESSIONAL" },
              title: "$professionName",
              point: { $ifNull: ["$point", 0] },
            },
          },
        ],
      },
    },
    { $sort: { point: -1 } },
    { $limit: 3 },
  ]);

  return leaderboard;
};

const get_my_performance_from_db = async (req: Request) => {
  const accountId = req?.user?.accountId;

  // ===== Fetch Data =====
  const mcqs = await my_content_mcq_bank_model
    .find({ studentId: accountId })
    .select("tracking")
    .lean();

  const flashcards = await my_content_flashcard_model
    .find({ studentId: accountId })
    .select("flashCards")
    .lean();

  const clinicalCases = (await my_content_clinicalCase_model
    .find({ studentId: accountId })
    .select("tracking")
    .lean()) as any;

  // ===== MCQ Performance =====
  let totalMcq = 0;
  let correctMcq = 0;

  mcqs.forEach((m) => {
    totalMcq += m.tracking?.totalMcqCount || 0;
    correctMcq += m.tracking?.correctMcqCount || 0;
  });

  const mcqPerformance =
    totalMcq > 0 ? Math.round((correctMcq / totalMcq) * 100) : 0;

  // ===== Flashcard Performance =====
  const totalFlashcards = flashcards.reduce(
    (sum, f) => sum + (f.flashCards?.length || 0),
    0
  );

  const flashcardPerformance = totalFlashcards > 0 ? 100 : 0;
  // because stored flashcards === studied flashcards

  // ===== Clinical Case Performance =====
  let totalCaseMcq = 0;
  let correctCaseMcq = 0;

  clinicalCases.forEach((c: any) => {
    totalCaseMcq += c?.tracking?.totalMcqCount || 0;
    correctCaseMcq += c?.tracking?.correctMcqCount || 0;
  });

  const clinicalCasePerformance =
    totalCaseMcq > 0 ? Math.round((correctCaseMcq / totalCaseMcq) * 100) : 0;

  // ===== OSCE =====
  const oscePerformance = 0;

  return {
    mcq: mcqPerformance,
    flashcard: flashcardPerformance,
    clinicalCase: clinicalCasePerformance,
    osce: oscePerformance,
  };
};

const get_all_highlights_content_of_this_week_from_db = async (
  req: Request,
) => {
  const email = req?.user?.email;
  const role = req?.user?.role as string;

  const isAccount = (await isAccountExist(email as string, "profile_id")) as any;

  const goal = await goal_model
    .findOne({
      studentId: isAccount?._id,
      goalStatus: "IN_PROGRESS",
    })
    .lean();

  if (!goal) return;
  const filters: any = {};
  const finalFilters = buildGoalContentFilter(goal ?? null, filters);
  finalFilters.contentFor = role.toLocaleLowerCase();
  finalFilters.profileType = isAccount?.profile_id?.studentType

  // Fetch top viewed / downloaded per content type
  const [mcqBankRaw, flashcardRaw, clinicalCaseRaw, osceRaw, noteRaw] =
    await Promise.all([
      McqBankModel.findOne(finalFilters)
        .sort("-viewCount")
        .select("-mcqs")
        .lean(),

      FlashcardModel.findOne(finalFilters)
        .sort("-viewCount")
        .select("-flashCards")
        .lean(),

      ClinicalCaseModel.findOne(finalFilters)
        .sort("-viewCount")
        .lean(),

      osce_model.findOne(finalFilters)
        .sort("-viewCount")
        .lean(),

      notes_model.findOne(finalFilters)
        .sort("-downloadCount")
        .lean(),
    ]);

  // Attach completion flags safely (if doc is null => returns null)
  const mcqBank = markCompleted(mcqBankRaw as any, isAccount?.finishedMcqBankIds);
  const flashcard = markCompleted(
    flashcardRaw as any,
    isAccount?.finishedFlashcardIds,
  );
  const clinicalCase = markCompleted(
    clinicalCaseRaw as any,
    isAccount?.finishedClinicalCaseIds,
  );
  const osce = markCompleted(osceRaw as any, isAccount?.finishedOsceIds);
  const note = markCompleted(noteRaw as any, isAccount?.finishedNoteIds);

  // Your original return shape (osce commented)
  return {
    mcqBank,
    flashcard,
    clinicalCase,
    // osce,
    note,
  };
};

// const get_my_daily_challenge_content_from_db = async (req: Request) => {
//   const email = req?.user?.email;
//   const accountId = req?.user?.accountId;

//   if (!email || !accountId) return [];

//   // 1) if already saved for today, return it
//   const account = await Account_Model.findOne({ email }).lean();
//   if (!account) return [];

//   const today = new Date();
//   const lastUpdated = account?.dailyChallengeContentLastUpdated;

//   if (lastUpdated) {
//     const lastUpdatedDate = new Date(lastUpdated);
//     if (lastUpdatedDate.toDateString() === today.toDateString()) {
//       const savedId = account?.dailyChallengeContentId;
//       if (savedId) {
//         const dailyChallengeContent = await McqBankModel.findById(savedId).lean();
//         if (dailyChallengeContent) {
//           const advanceMcqs =
//             dailyChallengeContent.mcqs?.filter((mcq: any) => mcq?.difficulty === "Advance") ?? [];
//           dailyChallengeContent.mcqs = advanceMcqs.slice(0, 20)
//           return dailyChallengeContent;
//         }
//       }
//       // fall-through: savedId missing or deleted doc -> create new
//     }
//   }

//   // 2) create new from goal filter, pick top viewCount
//   const goal = await goal_model
//     .findOne({
//       studentId: accountId,
//       goalStatus: "IN_PROGRESS",
//     })
//     .lean();

//   if (!goal) return;
//   const filters: any = {};
//   const finalFilters = buildGoalContentFilter(goal ?? null, filters);
//   finalFilters.contentFor = req?.user?.role.toLocaleLowerCase();
//   finalFilters.profileType = account?.profile_type;

//   const dailyChallengeContent = await McqBankModel
//     .findOne(finalFilters)
//     .sort({ viewCount: -1, updatedAt: -1 })
//     .lean();

//   if (!dailyChallengeContent?._id) {
//     return { dailyChallengeContent: null, mcqs: [] };
//   }

//   const advanceMcqs =
//     dailyChallengeContent.mcqs?.filter((mcq: any) => mcq?.difficulty === "Advance") ?? [];

//   dailyChallengeContent.mcqs = advanceMcqs.slice(0, 20)

//   await Account_Model.updateOne(
//     { email },
//     {
//       $set: {
//         dailyChallengeContentId: dailyChallengeContent._id,
//         dailyChallengeContentLastUpdated: new Date(),
//         isDailyChallengeCompleted: false,
//       },
//     }
//   );

//   return dailyChallengeContent;
// };

const get_my_daily_challenge_content_from_db = async (req: Request) => {
  const email = req?.user?.email;
  const accountId = req?.user?.accountId;
  const role = req?.user?.role?.toLowerCase();

  if (!email || !accountId) {
    return { dailyChallengeContent: null, mcqs: [] };
  }

  // Get account
  const account = await Account_Model.findOne({ email }).populate("profile_id").lean() as any;
  if (!account) {
    return { dailyChallengeContent: null, mcqs: [] };
  }

  // check if already generated today
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  if (
    account.dailyChallengeContentLastUpdated &&
    new Date(account.dailyChallengeContentLastUpdated) >= startOfToday &&
    account.dailyChallengeContentId
  ) {
    const existingContent = await McqBankModel.findById(
      account.dailyChallengeContentId
    ).lean();

    if (existingContent) {
      const advanceMcqs =
        existingContent.mcqs?.filter(
          (mcq: any) => mcq?.difficulty === "Advance"
        ) ?? [];

      return {
        ...existingContent,
        mcqs: advanceMcqs.slice(0, 20),
      };
    }
  }

  // Generate new daily challenge
  
  const goal = await goal_model
    .findOne({
      studentId: accountId,
      goalStatus: "IN_PROGRESS",
    })
    .lean();

  if (!goal) {
    return { dailyChallengeContent: null, mcqs: [] };
  }

  const filters: any = {};
  const finalFilters = buildGoalContentFilter(goal, filters);

  finalFilters.contentFor = role;
  finalFilters.profileType = account?.profile_id?.studentType;

  const newContent = await McqBankModel.findOne(finalFilters)
    .sort({ viewCount: -1, updatedAt: -1 })
    .lean();

  if (!newContent?._id) {
    return { dailyChallengeContent: null, mcqs: [] };
  }

  const advanceMcqs =
    newContent.mcqs?.filter(
      (mcq: any) => mcq?.difficulty === "Advance"
    ) ?? [];

  const limitedMcqs = advanceMcqs.slice(0, 20);

  // ===============================
  // 3️⃣ Update account for today
  // ===============================

  await Account_Model.updateOne(
    { email },
    {
      $set: {
        dailyChallengeContentId: newContent._id,
        dailyChallengeContentLastUpdated: new Date(),
        isDailyChallengeCompleted: false,
      },
    }
  );

  return {
    ...newContent,
    mcqs: limitedMcqs,
  };
};
const update_daily_challenge_content_status_into_db = async (req: Request) => {
  const email = req?.user?.email;
  await updatePointHelper(
    req?.user?.role as string,
    req?.user?.accountId as string,
    10
  );
  await Account_Model.findOneAndUpdate({ email }, { $set: { isDailyChallengeCompleted: true } }).lean();
  return "Daily challenge status updated successfully";
}


export const tracking_service = {
  get_student_and_professional_leaderboard_from_db,
  get_my_performance_from_db,
  get_all_highlights_content_of_this_week_from_db,
  get_my_daily_challenge_content_from_db,
  update_daily_challenge_content_status_into_db
};
