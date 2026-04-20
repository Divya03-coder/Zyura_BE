import { Request } from "express";
import { AppError } from "../../utils/app_error";
import { buildGoalContentFilter } from "../../utils/findContentQueryBuilder";
import { updatePointHelper } from "../../utils/updatePointHelper";
import { Account_Model } from "../auth/auth.schema";
import { ClinicalCaseModel } from "../clinical_case/clinical_case.schema";
import { FlashcardModel } from "../flash_card/flash_card.schema";
import { McqBankModel } from "../mcq_bank/mcq_bank.schema";
import { notes_model } from "../notes/notes.schema";
import { osce_model } from "../osce/osce.schema";
import { accuracy_model, goal_model } from "./goal.schema";
import { formatHoursToHHMM } from "./goal.utils";

const create_new_goal_into_db = async (req: Request) => {
  const user = req?.user;
  const isAlreadyGoalExists = await goal_model
    .findOne({ studentId: user?.accountId })
    .lean();
  if (isAlreadyGoalExists) {
    throw new AppError("Goal already exists for this student.", 403);
  }
  const createGoal = await goal_model.create({
    ...req.body,
    studentId: user?.accountId,
  });
  // finding all content count based on goal filter
  const updateFilter = buildGoalContentFilter(createGoal.toObject(), {});
  const [totalMcq, totalFlashcard, totalClinicalCase, totalOsce, totalNotes] =
    await Promise.all([
      McqBankModel.countDocuments(updateFilter),
      FlashcardModel.countDocuments(updateFilter),
      ClinicalCaseModel.countDocuments(updateFilter),
      osce_model.countDocuments(updateFilter),
      notes_model.countDocuments(updateFilter),
    ]);

  await goal_model.findByIdAndUpdate(createGoal._id, {
    totalMcqs: totalMcq,
    totalClinicalCases: totalClinicalCase,
    totalOsces: totalOsce,
    totalNotes,
    totalFlashcards: totalFlashcard,
  });
  await updatePointHelper(user?.role as string, user?.accountId as string);
  return createGoal;
};

const get_goals_by_student_id_from_db = async (req: Request) => {
  const user = req?.user;
  const goals = await goal_model
    .find({
      studentId: user?.accountId,
      goalStatus: "IN_PROGRESS",
    })
    .lean();

  // compute progress info for each goal
  const enrichedGoals = goals.map((goal) => {
    const start = new Date(goal.startDate);
    const end = new Date(goal.endDate);
    const now = new Date();

    // 1️⃣ Total days of goal period
    const diffMs = end.getTime() - start.getTime();
    const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // 2️⃣ Study hours needed
    const totalRequiredHours = totalDays * goal.studyHoursPerDay;

    // 3️⃣ Completed hours
    const completedHours = goal.totalCompletedStudyHours || 0;

    // 4️⃣ Progress %
    const progressPercentage = Number(
      ((goal.totalCompletedMcqs +
        goal.totalCompletedClinicalCases +
        goal.totalCompletedOsces +
        goal.totalCompletedNotes +
        goal.totalCompletedFlashcards) /
        (goal.totalMcqs +
          goal.totalClinicalCases +
          goal.totalOsces +
          goal.totalNotes +
          goal.totalFlashcards)) *
      100,
    ).toFixed(2);

    // 5️⃣ Days left from today
    const daysLeft = Math.max(
      0,
      Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    );

    // 6️⃣ Hours remaining
    const remainingHours = formatHoursToHHMM(
      totalRequiredHours - completedHours
    );
    const completedTimeHHMM = formatHoursToHHMM(completedHours);


    return {
      ...goal,
      totalDays,
      totalRequiredHours,
      progressPercentage,
      daysLeft,
      remainingHours,
      completedHours: completedTimeHHMM,
      totalCompletedStudyHours: formatHoursToHHMM(goal?.totalCompletedStudyHours || 0),
      todayStudyHours: formatHoursToHHMM(goal?.todayStudyHours || 0),
    };
  });

  return enrichedGoals;
};

const update_goal_into_into_db = async (req: Request) => {
  const user = req?.user;
  // to be implemented
  await Account_Model.findOneAndUpdate(
    { email: user?.email },
    {
      finishedMcqBankIds: [],
      finishedFlashcardIds: [],
      finishedClinicalCaseIds: [],
      finishedOsceIds: [],
      dailyChallengeContentId: null,
      dailyChallengeContentLastUpdated: null,
      isDailyChallengeCompleted: false,
    },
  );
  const updateFilter = buildGoalContentFilter(req?.body, {});
  const [
    totalMcqs,
    totalFlashcards,
    totalClinicalCases,
    totalOsces,
    totalNotes,
  ] = await Promise.all([
    McqBankModel.countDocuments(updateFilter),
    FlashcardModel.countDocuments(updateFilter),
    ClinicalCaseModel.countDocuments(updateFilter),
    osce_model.countDocuments(updateFilter),
    notes_model.countDocuments(updateFilter),
  ]);

  await accuracy_model.findOneAndUpdate(
    { accountId: user?.accountId },
    {
      mcq: {
        totalAttempted: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
      },
      clinicalCase: {
        totalAttempted: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
      },
      osce: {
        totalAttempted: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
      }
    }
  );
  return await goal_model.findOneAndUpdate(
    { studentId: user?.accountId },
    {
      ...req.body,
      goalStatus: "IN_PROGRESS",
      totalCompletedStudyHours: 0,
      todayStudyDate: null,
      todayStudyHours: 0,
      totalMcqStudyHours: 0,
      totalClinicalCaseStudyHours: 0,
      totalOsceStudyHours: 0,
      streak: 0,
      lastStreakDate: null,

      // update content counts
      totalCompletedMcqs: 0,
      totalCompletedClinicalCases: 0,
      totalCompletedOsces: 0,
      totalCompletedNotes: 0,
      totalCompletedFlashcards: 0,

      totalMcqs,
      totalClinicalCases,
      totalOsces,
      totalNotes,
      totalFlashcards,
    },
    { new: true, upsert: true },
  );
};
const delete_goal_from_db = async (req: Request) => {
  const user = req?.user;
  return await goal_model.deleteMany({ studentId: user?.accountId });
};

const update_goal_accuracy_and_progress_for_mcq_and_flashcard_clinicalCase_into_db =
  async (req: Request) => {
    const accountId = req?.user?.accountId;
    const {
      totalCorrect = 0,
      totalIncorrect = 0,
      totalAttempted = 0,
      key,
      bankId,
    } = req?.body;
    const goal = await goal_model.findOne({ studentId: accountId });
    if (!goal) throw new AppError("Goal not found", 404);

    // for goal progress update
    const goalUpdateBody: Record<string, any> = {};
    if (key === "mcq") {
      goalUpdateBody["totalCompletedMcqs"] = goal.totalCompletedMcqs + 1;
    } else if (key === "flashcard") {
      goalUpdateBody["totalCompletedFlashcards"] =
        goal.totalCompletedFlashcards + 1;
    } else if (key === "clinicalcase") {
      goalUpdateBody["totalCompletedClinicalCases"] =
        goal.totalCompletedClinicalCases + 1;
    }
    await goal_model.findOneAndUpdate({ _id: goal._id }, goalUpdateBody, {
      upsert: true,
    });
    // for finish content update
    await Account_Model.updateOne(
      { _id: accountId },
      {
        $addToSet: {
          ...(key === "mcq"
            ? { finishedMcqBankIds: bankId }
            : key === "flashcard"
              ? { finishedFlashcardIds: bankId }
              : key === "clinicalcase"
                ? { finishedClinicalCaseIds: bankId }
                : {}),
        },
      },
    );

    //for point update
    await updatePointHelper(
      req?.user?.role as string,
      req?.user?.accountId as string,
    );

    // for accuracy update
    const incBody: Record<string, number> = {};
    if (key === "mcq") {
      incBody["mcq.totalAttempted"] = totalAttempted;
      incBody["mcq.totalCorrect"] = totalCorrect;
      incBody["mcq.totalIncorrect"] = totalIncorrect;
    } else if (key === "clinicalcase") {
      incBody["clinicalCase.totalAttempted"] = totalAttempted;
      incBody["clinicalCase.totalCorrect"] = totalCorrect;
      incBody["clinicalCase.totalIncorrect"] = totalIncorrect;
    }

    await accuracy_model.findOneAndUpdate(
      { accountId },
      {
        $inc: incBody,
        $setOnInsert: { accountId },
      },
      { upsert: true, new: true },
    );

    return "success";
  };

const update_goal_accuracy_and_progress_for_osce_into_db = async (
  req: Request,
) => {
  const accountId = req?.user?.accountId;
  const {
    osceId,
    totalCorrect = 0,
    totalIncorrect = 0,
    totalAttempted = 0,
  } = req?.body;

  const goal = await goal_model.findOne({ studentId: accountId });
  if (!goal) throw new AppError("Goal not found", 404);

  // goal progress update
  await goal_model.findOneAndUpdate(
    { _id: goal._id },
    {
      totalCompletedOsces: goal.totalCompletedOsces + 1,
    },
    { upsert: true },
  );
  // finished osce update

  await Account_Model.findOneAndUpdate(
    { _id: accountId },
    {
      $addToSet: {
        finishedOsceIds: osceId,
      },
    },
    { upsert: true },
  );
  // point update
  await updatePointHelper(
    req?.user?.role as string,
    req?.user?.accountId as string,
  );
  // accuracy update
  await accuracy_model.findOneAndUpdate(
    { accountId },
    {
      $inc: {
        "osce.totalAttempted": totalAttempted,
        "osce.totalCorrect": totalCorrect,
        "osce.totalIncorrect": totalIncorrect,
      },
      $setOnInsert: { accountId },
    },
    { upsert: true, new: true },
  );

  return "success";
};

const get_overview_for_student_and_professional_from_db = async (
  req: Request,
) => {
  const accountId = req?.user?.accountId;
  const goal = await goal_model.findOne({ studentId: accountId }).lean();

  const accuracy = await accuracy_model.findOne({ accountId }).lean();

  // compute overall progress
  let overallProgress = 0;
  let totalMcqProgress = 0;
  let totalClinicalCaseProgress = 0;
  let osecProgress = 0;

  if (accuracy) {
    const mcqProgress =
      (accuracy?.mcq?.totalCorrect / accuracy?.mcq?.totalAttempted) * 100;

    const clinicalCaseProgress =
      (accuracy?.clinicalCase?.totalCorrect /
        accuracy?.clinicalCase?.totalAttempted) *
      100;

    const osceProgress =
      (accuracy?.osce?.totalCorrect / accuracy?.osce?.totalAttempted) * 100;

    totalMcqProgress = mcqProgress || 0;
    totalClinicalCaseProgress = clinicalCaseProgress || 0;
    osecProgress = osceProgress || 0;
    overallProgress =
      (totalMcqProgress + totalClinicalCaseProgress + osecProgress) / 3;
  }

  return {
    progress: {
      overall: overallProgress.toFixed(2) || 0,
      mcq: totalMcqProgress.toFixed(2) || 0,
      clinicalCase: totalClinicalCaseProgress.toFixed(2) || 0,
      osce: osecProgress.toFixed(2) || 0,
    },
    timeCount: {
      todayStudy: formatHoursToHHMM(goal?.todayStudyHours || 0),
      mcq: formatHoursToHHMM(goal?.totalMcqStudyHours || 0),
      clinicalCase: formatHoursToHHMM(goal?.totalClinicalCaseStudyHours || 0),
      osce: formatHoursToHHMM(goal?.totalOsceStudyHours || 0),
    },
    steak: goal?.streak || 0,
  };
};

export const goal_service = {
  create_new_goal_into_db,
  get_goals_by_student_id_from_db,
  update_goal_into_into_db,
  delete_goal_from_db,
  update_goal_accuracy_and_progress_for_mcq_and_flashcard_clinicalCase_into_db,
  update_goal_accuracy_and_progress_for_osce_into_db,
  get_overview_for_student_and_professional_from_db,
};
