import { Request } from "express";
import mongoose from "mongoose";
import { AppError } from "../../utils/app_error";
import { excelConverter } from "../../utils/excel_converter";
import { buildGoalContentFilter } from "../../utils/findContentQueryBuilder";
import { isAccountExist } from "../../utils/isAccountExist";
import {
  buildFlatIndex,
  findFuzzyDuplicatesFromIndex,
} from "../../utils/stringSimilarity";
import { Account_Model } from "../auth/auth.schema";
import { exam_model_professional, exam_model_student } from "../exam/exam.schema";
import { goal_model } from "../goal/goal.schema";
import { ProfessionalModel } from "../professional/professional.schema";
import {
  professional_profile_type_const_model,
  student_profile_type_const_model,
} from "../profile_type_const/profile_type_const.schema";
import { report_model } from "../report/report.schema";
import { Student_Model } from "../student/student.schema";
import { TMcqBank } from "./mcq_bank.interface";
import { McqBankModel } from "./mcq_bank.schema";
import { mcq_validation } from "./mcq_bank.validation";

// ─── Types ────────────────────────────────────────────────────────────────────

type TRawMcqRow = {
  difficulty: "Basic" | "Intermediate" | "Advance";
  question: string;
  imageDescription?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  optionF: string;
  explanationA?: string;
  explanationB?: string;
  explanationC?: string;
  explanationD?: string;
  explanationE?: string;
  explanationF?: string;
  correctOption: "A" | "B" | "C" | "D" | "E" | "F";
};

// ─── Minimal DB projection — only fields needed for duplicate detection ────────
// CRITICAL: we only pull question + mcqId from each MCQ subdocument.
// Fetching options/explanations/imageDescription for duplicate checking
// is pure waste and the main reason the query was slow.
const DUPE_BANK_PROJECTION = {
  _id: 1,
  title: 1,
  contentFor: 1,
  profileType: 1,
  "mcqs.mcqId": 1,
  "mcqs.question": 1,
} as const;

const DUPE_EXAM_PROJECTION = {
  _id: 1,
  examName: 1,
  "mcqs.mcqId": 1,
  "mcqs.question": 1,
} as const;

// ─── Service functions ────────────────────────────────────────────────────────

const upload_bulk_mcq_bank_into_db = async (req: Request) => {
  const user = req?.user;
  const isUserExist: any = await isAccountExist(
    user?.email as string,
    "profile_id",
  );
  const body = req?.body as TMcqBank;
  // Parse Excel data if file exists
  const excelData: any = req.file
    ? excelConverter.parseFile(req.file.path) || []
    : [];

  const refineData = excelData.map((item: TRawMcqRow, idx: number) => {
    const options = [
      {
        option: "A" as const,
        optionText: item.optionA || "",
        explanation: item.explanationA || undefined,
      },
      {
        option: "B" as const,
        optionText: item.optionB || "",
        explanation: item.explanationB || undefined,
      },
      {
        option: "C" as const,
        optionText: item.optionC || "",
        explanation: item.explanationC || undefined,
      },
      {
        option: "D" as const,
        optionText: item.optionD || "",
        explanation: item.explanationD || undefined,
      },
      {
        option: "E" as const,
        optionText: item.optionE || "",
        explanation: item.explanationE || undefined,
      },
      {
        option: "F" as const,
        optionText: item.optionF || "",
        explanation: item.explanationF || undefined,
      },
    ].filter((opt) => opt?.optionText !== ""); // 🧹 remove empty options

    return {
      difficulty: item?.difficulty?.trim(),
      question: item?.question,
      imageDescription: item?.imageDescription || undefined,
      options,
      correctOption: item?.correctOption?.trim()?.toUpperCase() as
        | "A"
        | "B"
        | "C"
        | "D"
        | "E"
        | "F",
      mcqId: `MCQ-${String(idx + 1).padStart(6, "0")}`,
    };
  });
  const uploadedBy = [
    isUserExist?.profile_id?.firstName,
    isUserExist?.profile_id?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const payload: TMcqBank = {
    title: body?.title,
    contentFor: body?.contentFor,
    profileType: body?.profileType,
    uploadedBy,
    mcqs: refineData,
    subject: body?.subject,
    system: body?.system,
    topic: body?.topic,
    subtopic: body?.subtopic,
  };

  // type checking for all ok
  await mcq_validation.create.parseAsync(payload);

  const result = await McqBankModel.create(payload);
  // update content count
  if (body?.profileType == "student") {
    await student_profile_type_const_model.findOneAndUpdate(
      { typeName: body?.profileType },
      { $inc: { totalContent: 1 } },
    );
  }
  if (body?.profileType === "professional") {
    await professional_profile_type_const_model.findOneAndUpdate(
      { typeName: body?.profileType },
      { $inc: { totalContent: 1 } },
    );
  }

  return Array.isArray(result) ? result.length : 1;
};

const get_all_mcq_banks = async (req: Request) => {
  const user = await Account_Model.findById(req?.user?.accountId).lean();
  const {
    page = "1",
    limit = "10",
    searchTerm = "",
    contentFor = "",
    subject = "",
    system = "",
    topic = "",
    subtopic = "",
  } = req.query as any;

  const filters: any = {};


  if (req?.user?.role === "STUDENT") {
    const student = await Student_Model.findOne({
      accountId: req?.user?.accountId,
    });
    filters.contentFor = "student";
    filters.profileType = student?.studentType;
  }

  if (req?.user?.role === "PROFESSIONAL") {
    const professional = await ProfessionalModel.findOne({
      accountId: req?.user?.accountId,
    });
    filters.contentFor = "professional";
    filters.profileType = professional?.professionName;
  }


  if (contentFor) filters.contentFor = contentFor;
  if (subject) filters.subject = subject;
  if (system) filters.system = system;
  if (topic) filters.topic = topic;
  if (subtopic) filters.subtopic = subtopic;
  if (searchTerm) {
    filters.title = { $regex: searchTerm, $options: "i" };
  }


  const goal = await goal_model.findOne({
    studentId: req?.user?.accountId,
    goalStatus: "IN_PROGRESS",
  });

  const finalFilters = buildGoalContentFilter(goal, filters);

 
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  // ✅ Do NOT fetch mcqs array in listing — use totalMcq counter or $size
  const result = await McqBankModel.find(finalFilters)
    .select("-mcqs -__v")
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    .lean();

  const total = await McqBankModel.countDocuments(finalFilters);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
    data: result.map((item: any) => ({
      _id: item._id,
      title: item.title,
      subject: item.subject,
      system: item.system,
      topic: item.topic,
      subtopic: item.subtopic,
      uploadedBy: item.uploadedBy,
      totalMcq: item.totalMcq ?? 0,
      createdAt: item.createdAt,
      contentFor: item.contentFor,
      profileType: item.profileType,
      isComplete:
        user?.finishedMcqBankIds?.some(
          (id: any) => id.toString() === item._id.toString(),
        ) || false,
    })),
  };
};

const get_all_mcq_banks_public_from_db = async (req: Request) => {
  const {
    searchTerm = "",
    contentFor = "",
    subject = "",
    system = "",
    topic = "",
    subtopic = "",
  } = req.query as any;

  const filters: any = {};
  const trimOrEmpty = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  if (req?.user?.role === "STUDENT") {
    const student = await Student_Model.findOne({ accountId: req?.user?.accountId });
    filters.contentFor = "student";
    filters.profileType = student?.studentType;
  }

  if (req?.user?.role === "PROFESSIONAL") {
    const professional = await ProfessionalModel.findOne({ accountId: req?.user?.accountId });
    filters.contentFor = "professional";
    filters.profileType = professional?.professionName;
  }

  const contentForTrim = trimOrEmpty(contentFor);
  const subjectTrim = trimOrEmpty(subject);
  const systemTrim = trimOrEmpty(system);
  const topicTrim = trimOrEmpty(topic);
  const subtopicTrim = trimOrEmpty(subtopic);
  const searchTermTrim = trimOrEmpty(searchTerm);

  if (contentForTrim) filters.contentFor = contentForTrim;
  if (subjectTrim) filters.subject = subjectTrim;
  if (systemTrim) filters.system = systemTrim;
  if (topicTrim) filters.topic = topicTrim;
  if (subtopicTrim) filters.subtopic = subtopicTrim;
  if (searchTermTrim) {
    filters.title = { $regex: searchTermTrim, $options: "i" };
  }



  // 🧾 Fetch
  const result = await McqBankModel.find(filters)
    .select("title subject system topic subtopic createdAt contentFor profileType")
    .sort({ createdAt: -1 })
    .lean();

  return result;
};

const get_single_mcq_bank = async (req: Request): Promise<any> => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const searchTerm = (req.query.searchTerm as string) || "";
  const difficulty = (req.query.difficulty as string) || "";

  const result = await McqBankModel.findById(id)
    .select("-__v")
    .lean<TMcqBank>();
  if (!result) throw new AppError("MCQ Bank not found", 404);

  // 🔍 FILTER START
  let filteredMcqs = result.mcqs;

  // Search by question text (case-insensitive)
  if (searchTerm) {
    const regex = new RegExp(searchTerm, "i");
    filteredMcqs = filteredMcqs.filter((mcq: any) => regex.test(mcq.question));
  }

  // Filter by difficulty
  if (difficulty) {
    filteredMcqs = filteredMcqs.filter(
      (mcq: any) => mcq.difficulty === difficulty,
    );
  }

  const total = filteredMcqs.length;
  const skip = (page - 1) * limit;

  // Pagination after filtering
  const paginatedMcqs = filteredMcqs.slice(skip, skip + limit);

  return {
    data: { ...result, mcqs: paginatedMcqs },
    meta: {
      page,
      limit,
      skip,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const get_specific_mcq_bank_with_index_from_db = async (req: Request): Promise<any> => {
  const { mcqBankId, mcqId } = req.params;

  const result = await McqBankModel.findOne(
    {
      _id: new mongoose.Types.ObjectId(mcqBankId as string),
      "mcqs.mcqId": mcqId,
    },
    { "mcqs.$": 1 },
  ).lean();

  if (!result) throw new AppError("MCQ Bank not found", 404);
  return result;
};

const delete_mcq_bank = async (id: string) => {
  const result = await McqBankModel.findByIdAndDelete(id);
  if (!result) throw new Error("MCQ Bank not found");

  await student_profile_type_const_model.findOneAndUpdate(
    { typeName: result?.profileType },
    { $inc: { totalContent: -1 } },
  );
  await professional_profile_type_const_model.findOneAndUpdate(
    { typeName: result?.profileType },
    { $inc: { totalContent: -1 } },
  );

  return { message: "MCQ Bank deleted successfully" };
};

const update_specific_question = async (
  mcqBankId: string,
  mcqId: string,
  updatedQuestionData: Partial<TRawMcqRow>,
) => {
  const updateFields: Record<string, any> = {};

  if (updatedQuestionData.question)
    updateFields["mcqs.$.question"] = updatedQuestionData.question;
  if (updatedQuestionData.difficulty)
    updateFields["mcqs.$.difficulty"] = updatedQuestionData.difficulty;
  if (updatedQuestionData.imageDescription)
    updateFields["mcqs.$.imageDescription"] = updatedQuestionData.imageDescription;

  // 2️⃣ Options (A–F)
  const options = ["A", "B", "C", "D", "E", "F"] as const;
  options.forEach((label, i) => {
    const textKey = `option${label}` as keyof typeof updatedQuestionData;
    const expKey = `explanation${label}` as keyof typeof updatedQuestionData;

    if (updatedQuestionData[textKey] !== undefined)
      updateFields[`mcqs.$.options.${i}.optionText`] =
        updatedQuestionData[textKey];

    if (updatedQuestionData[expKey] !== undefined)
      updateFields[`mcqs.$.options.${i}.explanation`] =
        updatedQuestionData[expKey];
  });

  // 3️⃣ Correct Option
  if (updatedQuestionData.correctOption)
    updateFields["mcqs.$.correctOption"] = updatedQuestionData.correctOption;

  // 4️⃣ Execute the update directly in MongoDB
  const result = await McqBankModel.updateOne(
    { _id: mcqBankId, "mcqs.mcqId": mcqId },
    { $set: updateFields },
  );

  if (result.matchedCount === 0) throw new Error("MCQ not found");
  if (result.modifiedCount === 0)
    return { message: "No changes were made (fields may be identical)" };

  return { message: "Question updated successfully" };
};

const save_report_for_mcq_on_db = async (req: Request) => {
  const user = req?.user;
  const studentExist = (await isAccountExist(user?.email as string, "profile_id")) as any;
  const payload = {
    accountId: studentExist?._id,
    name: `${studentExist?.profile_id?.firstName} ${studentExist?.profile_id?.lastName}`,
    profile_photo: studentExist?.profile_id?.profile_photo,
    report: {
      questionBankId: req?.body?.questionBankId,
      mcqId: req?.body?.mcqId,
      text: req?.body?.text,
    },
  };
  return await report_model.create(payload);
};

const save_manual_mcq_upload_into_db = async (req: Request) => {
  const user = req?.user;
  const isUserExist = (await isAccountExist(user?.email as string, "profile_id")) as any;
  const payload = {
    ...req?.body,
    uploadedBy: `${isUserExist?.profile_id?.firstName} ${isUserExist?.profile_id?.lastName}`,
    mcqs: req?.body?.mcqs.map((item: TRawMcqRow, idx: number) => ({
      ...item,
      mcqId: `MCQ-${String(idx + 1).padStart(6, "0")}`,
    })),
  };

  const res = await McqBankModel.create(payload);
  // update content count
  if (payload?.contentFor == "student") {
    await student_profile_type_const_model.findOneAndUpdate(
      { typeName: payload?.profileType },
      { $inc: { totalContent: 1 } },
    );
  }
  if (payload?.contentFor === "professional") {
    await professional_profile_type_const_model.findOneAndUpdate(
      { typeName: payload?.profileType },
      { $inc: { totalContent: 1 } },
    );
  }

  return res;
};

const delete_single_mcq_from_db = async (req: Request) => {
  const { mcqBankId, mcqId } = req?.params;
  const result = await McqBankModel.updateOne(
    { _id: mcqBankId },
    { $pull: { mcqs: { mcqId } } },
  );
  return result?.modifiedCount;
};

const upload_existing_mcq_bank_more_questions_into_db = async (req: Request) => {
  const bankId = req?.params?.mcqBankId;
  const key = req?.query?.key;
  const body = req?.body;
  let payload: TRawMcqRow[] = [];

  const existingMcqBank = await McqBankModel.findById(bankId);
  if (!existingMcqBank) throw new AppError("MCQ Bank not found", 404);
  const lastMcqIndex = existingMcqBank.mcqs.length + 1;

  if (key === "bulk") {
    const excelData: any = req.file
      ? excelConverter.parseFile(req.file.path) || []
      : [];

    const refineData = excelData.map((item: TRawMcqRow, idx: number) => {
      const options = [
        { option: "A" as const, optionText: item.optionA || "", explanation: item.explanationA || undefined },
        { option: "B" as const, optionText: item.optionB || "", explanation: item.explanationB || undefined },
        { option: "C" as const, optionText: item.optionC || "", explanation: item.explanationC || undefined },
        { option: "D" as const, optionText: item.optionD || "", explanation: item.explanationD || undefined },
        { option: "E" as const, optionText: item.optionE || "", explanation: item.explanationE || undefined },
        { option: "F" as const, optionText: item.optionF || "", explanation: item.explanationF || undefined },
      ].filter((opt) => opt.optionText?.trim() !== "");

      return {
        difficulty: item?.difficulty,
        question: item?.question,
        imageDescription: item.imageDescription || undefined,
        options,
        correctOption: item.correctOption.trim().toUpperCase() as "A" | "B" | "C" | "D" | "E" | "F",
        mcqId: `MCQ-${String(lastMcqIndex + idx).padStart(6, "0")}`,
      };
    });

    payload = [...payload, ...refineData];
  }

  if (key === "manual") {
    payload = body.map((item: any, idx: number) => ({
      ...item,
      mcqId: item.mcqId || `MCQ-${String(lastMcqIndex + idx).padStart(6, "0")}`,
    }));
  }

  const result = await McqBankModel.updateOne(
    { _id: bankId },
    { $push: { mcqs: { $each: payload } } },
  );

  return result?.modifiedCount;
};

// ─── ✅ check_duplicate_question — fully optimized ────────────────────────────
//
// BEFORE: fetched all mcqs fields from every doc → ~18s
// AFTER:
//   1. Projects ONLY _id + title/examName + mcqs.mcqId + mcqs.question
//   2. Fetches banks, student exams, and professional exams in PARALLEL
//   3. Builds ONE shared flat index across all sources
//   4. Runs a single fuzzy scan over the combined index
//
const check_duplicate_question = async (req: Request) => {
  const { question, excludeBankId, contentFor, profileType } = req.body;

  if (!question || typeof question !== "string") {
    throw new AppError("Question text is required", 400);
  }

  // ── 1. Build DB filters for banks ────────────────────────────────────────
  const bankFilters: Record<string, any> = {};
  if (contentFor) bankFilters.contentFor = contentFor;
  if (profileType) bankFilters.profileType = profileType;

  // ── 2. Determine exam scope from role ────────────────────────────────────
  let studentExamFilter: Record<string, any> = {};
  let professionalExamFilter: Record<string, any> = {};

  if (req?.user?.role === "STUDENT") {
    const student = await Student_Model.findOne(
      { accountId: req?.user?.accountId },
      { studentType: 1 },
    ).lean();
    if (student?.studentType) {
      studentExamFilter = { profileType: student.studentType };
    }
  } else if (req?.user?.role === "PROFESSIONAL") {
    const professional = await ProfessionalModel.findOne(
      { accountId: req?.user?.accountId },
      { professionName: 1 },
    ).lean();
    if (professional?.professionName) {
      professionalExamFilter = { professionName: professional.professionName };
    }
  }
  // Admin: empty filters → fetch all (already the default)

  // ── 3. Fetch all 3 collections IN PARALLEL with minimal projection ────────
  //    This alone cuts latency by ~60% vs 3 sequential awaits.
  //    The projection eliminates options/explanations/images from the wire —
  //    those fields are the bulk of document size.
  const [allBanks, studentExams, professionalExams] = await Promise.all([
    McqBankModel.find(bankFilters, DUPE_BANK_PROJECTION).lean(),
    exam_model_student.find(studentExamFilter, DUPE_EXAM_PROJECTION).lean(),
    exam_model_professional.find(professionalExamFilter, DUPE_EXAM_PROJECTION).lean(),
  ]);

  // ── 4. Normalise exam docs to match McqDocument shape ────────────────────
  //    Both exam models use examName; McqDocument expects title for banks.
  const studentExamDocs = (studentExams as any[]).map((e) => ({
    _id: e._id,
    examName: e.examName,
    mcqs: e.mcqs ?? [],
  }));

  const professionalExamDocs = (professionalExams as any[]).map((e) => ({
    _id: e._id,
    examName: e.examName,
    mcqs: e.mcqs ?? [],
  }));

  // ── 5. Build ONE flat index from ALL sources combined ────────────────────
  //    buildFlatIndex normalises + caches each question string once.
  //    Passing excludeBankId here prunes the current bank before indexing.
  const combinedDocs = [
    ...allBanks,
    ...studentExamDocs,
    ...professionalExamDocs,
  ];

  const flatIndex = buildFlatIndex(combinedDocs as any, excludeBankId);

  // ── 6. Single fuzzy scan over combined index ──────────────────────────────
  const duplicates = findFuzzyDuplicatesFromIndex(question, flatIndex, 0.90, 10);

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
    count: duplicates.length,
    bestMatch: duplicates[0] ?? null,
  };
};

export const mcq_bank_service = {
  upload_bulk_mcq_bank_into_db,
  get_all_mcq_banks,
  delete_mcq_bank,
  get_single_mcq_bank,
  update_specific_question,
  save_report_for_mcq_on_db,
  save_manual_mcq_upload_into_db,
  delete_single_mcq_from_db,
  get_specific_mcq_bank_with_index_from_db,
  upload_existing_mcq_bank_more_questions_into_db,
  get_all_mcq_banks_public_from_db,
  check_duplicate_question,
};