import { Request } from "express";
import { AppError } from "../../utils/app_error";
import { updatePointHelper } from "../../utils/updatePointHelper";
import {
  my_content_clinicalCase_model,
  my_content_flashcard_model,
  my_content_mcq_bank_model,
  my_content_notes_model,
} from "./my_content.schema";

const get_all_my_generated_mcq_from_db = async (req: Request) => {
  const user = req?.user;
  const {
    page = 1,
    limit = 10,
    searchTerm = "",
    subject,
    topic,
    system,
    subtopic,
  } = req.query;

  // Convert pagination to numbers
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const query: any = {};

  // Filter: Student
  query.studentId = user?.accountId;

  // Search
  if (searchTerm) {
    query.$or = [{ title: { $regex: searchTerm, $options: "i" } }];
  }

  // Filters
  if (subject) query.subject = subject;
  if (system) query.system = system;
  if (topic) query.topic = topic;
  if (subtopic) query.subtopic = subtopic;

  // Pagination
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch data
  const result = await my_content_mcq_bank_model
    .find(query)
    .select("-mcqs -tracking.recommendedContent")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean();

  // Count total
  const total = await my_content_mcq_bank_model.countDocuments(query);

  return {
    data: result,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const get_single_my_generated_mcq_from_db = async (id: string) => {
  const result = await my_content_mcq_bank_model.findById(id);
  return result;
};

const get_all_my_generated_flashcard_from_db = async (req: Request) => {
  const user = req?.user;
  const {
    page = 1,
    limit = 10,
    searchTerm = "",
    subject,
    topic,
    system,
    subtopic,
  } = req.query;

  // Convert pagination to numbers
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const query: any = {};

  // Filter: Student
  query.studentId = user?.accountId;

  // Search
  if (searchTerm) {
    query.$or = [{ title: { $regex: searchTerm, $options: "i" } }];
  }

  // Filters
  if (subject) query.subject = subject;
  if (system) query.system = system;
  if (topic) query.topic = topic;
  if (subtopic) query.subtopic = subtopic;

  // Pagination
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch data
  const result = await my_content_flashcard_model
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean();

  // Count total
  const total = await my_content_flashcard_model.countDocuments(query);

  return {
    data: result,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const get_single_my_generated_flashcard_from_db = async (id: string) => {
  const result = await my_content_flashcard_model.findById(id);
  return result;
};
const get_all_my_generated_clinicalCase_from_db = async (req: Request) => {
  const user = req?.user;
  const {
    page = 1,
    limit = 10,
    searchTerm = "",
    subject,
    topic,
    system,
    subtopic,
  } = req.query;

  // Convert pagination to numbers
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const query: any = {};

  // Filter: Student
  query.studentId = user?.accountId;

  // Search
  if (searchTerm) {
    query.$or = [{ caseTitle: { $regex: searchTerm, $options: "i" } }];
  }

  // Filters
  if (subject) query.subject = subject;
  if (system) query.system = system;
  if (topic) query.topic = topic;
  if (subtopic) query.subtopic = subtopic;

  // Pagination
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch data
  const result = await my_content_clinicalCase_model
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean();

  // Count total
  const total = await my_content_clinicalCase_model.countDocuments(query);

  return {
    data: result,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const get_single_my_generated_clinicalCase_from_db = async (id: string) => {
  const result = await my_content_clinicalCase_model.findById(id);
  return result;
};

const update_tracking = async (req: Request) => {
  const {
    totalMcqCount,
    totalAttemptCount,
    correctMcqCount,
    wrongMcqCount,
    timeTaken,
  } = req.body;
  const id = req?.params?.id as string;

  // 🔒 Safety checks
  const safeTotalMcq = Math.max(totalMcqCount ?? 0, 0);
  const safeAttempt = Math.max(totalAttemptCount ?? 0, 0);
  const safeCorrect = Math.max(correctMcqCount ?? 0, 0);
  const safeWrong = Math.max(wrongMcqCount ?? 0, 0);

  const unattemptedCount = safeTotalMcq - safeAttempt;

  const progress =
    safeTotalMcq === 0 ? 0 : Math.round((safeAttempt / safeTotalMcq) * 100);

  const correctPercentage =
    safeTotalMcq === 0 ? 0 : Math.round((safeCorrect / safeTotalMcq) * 100);

  const wrongPercentage =
    safeTotalMcq === 0 ? 0 : Math.round((safeWrong / safeTotalMcq) * 100);

  const unattemptedPercentage =
    safeTotalMcq === 0
      ? 0
      : Math.round((unattemptedCount / safeTotalMcq) * 100);

  const trackingUpdate = {
    "tracking.totalMcqCount": safeTotalMcq,
    "tracking.totalAttemptCount": safeAttempt,
    "tracking.correctMcqCount": safeCorrect,
    "tracking.wrongMcqCount": safeWrong,
    "tracking.timeTaken": timeTaken ?? "0",
    "tracking.progress": progress,
    "tracking.correctPercentage": correctPercentage,
    "tracking.wrongPercentage": wrongPercentage,
    "tracking.unattemptedPercentage": unattemptedPercentage,
  };
  const result = await my_content_mcq_bank_model.findByIdAndUpdate(
    id,
    {
      isCompleted: true,
      $set: trackingUpdate,
    },
    {
      new: true,
    }
  );
  await updatePointHelper(
    req?.user?.role as string,
    req?.user?.accountId as string
  );
  return result;
};

const get_all_my_generated_notes_from_db = async (req: Request) => {
  const user = req?.user;
  const { page = 1, limit = 10, searchTerm = "" } = req.query;

  // Convert pagination to numbers
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const query: any = {};

  // Filter: Student
  query.studentId = user?.accountId;

  // Search
  if (searchTerm) {
    query.$or = [{ title: { $regex: searchTerm, $options: "i" } }];
  }
  // Pagination
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch data
  const result = await my_content_notes_model
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean();

  // Count total
  const total = await my_content_notes_model.countDocuments(query);

  return {
    data: result,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};
const get_single_my_generated_notes_from_db = async (id: string) => {
  const result = await my_content_notes_model.findById(id);
  return result;
};

const delete_my_content_from_delete = async (req: Request) => {
  const { id, key } = req?.params;
  let result;
  if (key === "mcq") {
    result = await my_content_mcq_bank_model.findByIdAndDelete(id);
  } else if (key === "flashcard") {
    result = await my_content_flashcard_model.findByIdAndDelete(id);
  } else if (key === "clinicalcase") {
    result = await my_content_clinicalCase_model.findByIdAndDelete(id);
  } else if (key === "notes") {
    result = await my_content_notes_model.findByIdAndDelete(id);
  }
  if (!result) {
    throw new AppError("Content not found", 404);
  }
  return result;
};

export const my_content_service = {
  get_all_my_generated_mcq_from_db,
  get_single_my_generated_mcq_from_db,
  get_all_my_generated_flashcard_from_db,
  get_single_my_generated_flashcard_from_db,
  get_all_my_generated_clinicalCase_from_db,
  get_single_my_generated_clinicalCase_from_db,
  update_tracking,
  get_all_my_generated_notes_from_db,
  get_single_my_generated_notes_from_db,
  delete_my_content_from_delete,
};
