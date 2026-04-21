import { Request } from "express";
import { AppError } from "../../utils/app_error";
import { excelConverter } from "../../utils/excel_converter";
import { isAccountExist } from "../../utils/isAccountExist";
import {
  buildFlatIndex,
  findFuzzyDuplicatesFromIndex,
} from "../../utils/stringSimilarity";
import { ProfessionalModel } from "../professional/professional.schema";
import { McqBankModel } from "../mcq_bank/mcq_bank.schema";
import { T_Exam_Professional, T_Exam_Student, TRawMcqRow } from "./exam.interface";
import { exam_model_professional, exam_model_student } from "./exam.schema";

// ─── Minimal projections (only fields needed for duplicate detection) ──────────
// Excludes options/explanations/images — the bulk of document size.
// This is what cuts the wire payload by ~80% vs fetching full documents.

const DUPE_BANK_PROJECTION = {
  _id: 1,
  title: 1,
  "mcqs.mcqId": 1,
  "mcqs.question": 1,
} as const;

const DUPE_EXAM_PROJECTION = {
  _id: 1,
  examName: 1,
  "mcqs.mcqId": 1,
  "mcqs.question": 1,
} as const;

// ─── Shared helpers ───────────────────────────────────────────────────────────

const validateCorrectOption = (
  correctOption: string,
  options: { option: string }[],
) => {
  const availableLabels = options.map((o) => o.option);
  if (!availableLabels.includes(correctOption)) {
    throw new AppError(
      `correctOption "${correctOption}" is not among the available options: ${availableLabels.join(", ")}`,
      400,
    );
  }
};

const buildMcqUpdateFields = (
  mcqId: string,
  updatedQuestionData: Record<string, any>,
) => {
  const updateFields: Record<string, any> = {};

  if (updatedQuestionData.question)
    updateFields["mcqs.$[mcqItem].question"] = updatedQuestionData.question;

  if (updatedQuestionData.imageDescription)
    updateFields["mcqs.$[mcqItem].imageDescription"] =
      updatedQuestionData.imageDescription;

  if (updatedQuestionData.correctOption)
    updateFields["mcqs.$[mcqItem].correctOption"] =
      updatedQuestionData.correctOption;

  return updateFields;
};

const buildOptionUpdates = (updatedQuestionData: Record<string, any>) => {
  const LABELS = ["A", "B", "C", "D", "E", "F"] as const;
  const arrayFilters: Record<string, any>[] = [];
  const updateFields: Record<string, any> = {};

  LABELS.forEach((label) => {
    const textKey = `option${label}`;
    const expKey = `explanation${label}`;
    const hasText = updatedQuestionData[textKey] !== undefined;
    const hasExp = updatedQuestionData[expKey] !== undefined;

    if (hasText || hasExp) {
      const filterIdentifier = `opt${label.toLowerCase()}`;
      arrayFilters.push({ [`${filterIdentifier}.option`]: label });

      if (hasText)
        updateFields[
          `mcqs.$[mcqItem].options.$[${filterIdentifier}].optionText`
        ] = updatedQuestionData[textKey];

      if (hasExp)
        updateFields[
          `mcqs.$[mcqItem].options.$[${filterIdentifier}].explanation`
        ] = updatedQuestionData[expKey];
    }
  });

  return { optionUpdateFields: updateFields, arrayFilters };
};

// ─── Student ──────────────────────────────────────────────────────────────────

const upload_new_student_exam_with_bulk_mcq_into_db = async (req: Request) => {
  const body = req?.body;
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
    ].filter((opt) => opt?.optionText !== "");

    return {
      question: item?.question,
      imageDescription: item?.imageDescription || undefined,
      options,
      correctOption: item?.correctOption?.trim()?.toUpperCase() as
        | "A" | "B" | "C" | "D" | "E" | "F",
      mcqId: `MCQ-${String(idx + 1).padStart(6, "0")}`,
    };
  });

  refineData.forEach((mcq: any) => {
    validateCorrectOption(mcq.correctOption, mcq.options);
  });

  const payload: T_Exam_Student = {
    ...body,
    mcqs: refineData,
    totalQuestions: refineData.length,
  };
  return await exam_model_student.create(payload);
};

const upload_new_student_exam_with_manual_mcq_into_db = async (req: Request) => {
  const body = req?.body;
  body.totalQuestions = body?.mcqs?.length || 0;
  body.mcqs = body?.mcqs?.map((item: any, idx: number) => ({
    ...item,
    mcqId: `MCQ-${String(idx + 1).padStart(6, "0")}`,
  }));

  body.mcqs.forEach((mcq: any) => {
    validateCorrectOption(mcq.correctOption, mcq.options);
  });

  return await exam_model_student.create(body);
};

const get_all_student_exam_from_db = async (req: Request) => {
  const { searchTerm, subject, profileType, page, limit } =
    req?.query as Record<string, string>;

  const query: Record<string, any> = {};

  if (searchTerm) query.examName = { $regex: searchTerm, $options: "i" };
  if (subject) query.subject = subject;
  if (profileType) query.profileType = profileType;

  if (req?.user?.role === "STUDENT") {
    const isStudent = (await isAccountExist(
      req?.user?.email as string,
      "profile_id",
    )) as any;
    query.profileType = isStudent?.profile_id?.studentType;
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.max(Number(limit) || 10, 1);
  const skip = (pageNumber - 1) * pageLimit;

  const [data, total] = await Promise.all([
    exam_model_student
      .find(query)
      .select("-mcqs")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit),
    exam_model_student.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      total,
      page: pageNumber,
      limit: pageLimit,
      totalPages: Math.ceil(total / pageLimit),
    },
  };
};

const get_single_student_exam_from_db = async (req: Request) => {
  const { id } = req?.params as Record<string, string>;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await exam_model_student.findById(id).lean();

  const total = result?.mcqs?.length || 0;
  const skip = (page - 1) * limit;
  const paginatedMcqs = result?.mcqs?.slice(skip, skip + limit);

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

const update_student_exam_into_db = async (req: Request) => {
  const { id } = req?.params as Record<string, string>;
  return await exam_model_student
    .findByIdAndUpdate(id, req?.body, { new: true })
    .select("-mcqs");
};

const update_student_exam_specific_mcq_into_db = async (req: Request) => {
  const { examId, mcqId } = req?.params as Record<string, string>;
  const updatedQuestionData = req?.body;

  if (updatedQuestionData.correctOption) {
    const exam = await exam_model_student
      .findOne({ _id: examId, "mcqs.mcqId": mcqId }, { "mcqs.$": 1 })
      .lean();
    const currentOptions = exam?.mcqs?.[0]?.options ?? [];
    validateCorrectOption(updatedQuestionData.correctOption, currentOptions);
  }

  const scalarFields = buildMcqUpdateFields(mcqId, updatedQuestionData);
  const { optionUpdateFields, arrayFilters } = buildOptionUpdates(updatedQuestionData);

  return await exam_model_student
    .findOneAndUpdate(
      { _id: examId, "mcqs.mcqId": mcqId },
      { $set: { ...scalarFields, ...optionUpdateFields } },
      {
        new: true,
        arrayFilters: [{ "mcqItem.mcqId": mcqId }, ...arrayFilters],
      },
    )
    .select("-mcqs");
};

const delete_student_exam_from_db = async (req: Request) => {
  const { id } = req?.params as Record<string, string>;
  return await exam_model_student.findByIdAndDelete(id).select("-mcqs");
};

const add_more_mcq_into_student_exam_into_db = async (req: Request) => {
  const { id } = req?.params as Record<string, string>;
  const body = req?.body?.mcqs;
  const existingMcqBank = await exam_model_student
    .findById(id)
    .select("-mcqs")
    .lean();
  if (!existingMcqBank) throw new AppError("Exam not found", 404);
  const lastMcqIndex = existingMcqBank?.totalQuestions ?? 0;

  const payload = body.map((item: any, idx: number) => ({
    ...item,
    mcqId: `MCQ-${String(lastMcqIndex + idx + 1).padStart(6, "0")}`,
  }));

  payload.forEach((mcq: any) => {
    validateCorrectOption(mcq.correctOption, mcq.options);
  });

  return await exam_model_student
    .findByIdAndUpdate(
      id,
      {
        $push: { mcqs: { $each: payload } },
        $inc: { totalQuestions: payload.length },
      },
      { new: true },
    )
    .select("-mcqs");
};

const delete_specific_mcq_from_student_exam_from_db = async (req: Request) => {
  const { examId, mcqId } = req?.params as Record<string, string>;
  return await exam_model_student
    .findByIdAndUpdate(
      examId,
      { $pull: { mcqs: { mcqId } }, $inc: { totalQuestions: -1 } },
      { new: true },
    )
    .select("-mcqs");
};

// ─── Professional ─────────────────────────────────────────────────────────────

const upload_new_professional_exam_with_bulk_mcq_into_db = async (
  req: Request,
) => {
  const body = req?.body;
  const excelData: any = req?.file
    ? excelConverter.parseFile(req?.file?.path) || []
    : [];

  const refineData = excelData.map((item: TRawMcqRow, idx: number) => {
    const options = [
      { option: "A" as const, optionText: String(item.optionA) || "", explanation: String(item.explanationA) || undefined },
      { option: "B" as const, optionText: String(item.optionB) || "", explanation: String(item.explanationB) || undefined },
      { option: "C" as const, optionText: String(item.optionC) || "", explanation: String(item.explanationC) || undefined },
      { option: "D" as const, optionText: String(item.optionD) || "", explanation: String(item.explanationD) || undefined },
      { option: "E" as const, optionText: String(item.optionE) || "", explanation: String(item.explanationE) || undefined },
      { option: "F" as const, optionText: String(item.optionF) || "", explanation: String(item.explanationF) || undefined },
    ].filter((opt) => opt?.optionText?.trim() !== "");

    return {
      question: item?.question,
      imageDescription: item?.imageDescription || undefined,
      options,
      correctOption: item?.correctOption?.trim()?.toUpperCase() as
        | "A" | "B" | "C" | "D" | "E" | "F",
      mcqId: `MCQ-${String(idx + 1).padStart(6, "0")}`,
    };
  });

  refineData.forEach((mcq: any) => {
    validateCorrectOption(mcq.correctOption, mcq.options);
  });

  const payload: T_Exam_Professional = {
    ...body,
    mcqs: refineData,
    totalQuestions: refineData.length,
  };
  return await exam_model_professional.create(payload);
};

const upload_new_professional_exam_with_manual_mcq_into_db = async (
  req: Request,
) => {
  const body = req?.body;
  body.totalQuestions = body?.mcqs?.length || 0;
  body.mcqs = body?.mcqs?.map((item: any, idx: number) => ({
    ...item,
    mcqId: `MCQ-${String(idx + 1).padStart(6, "0")}`,
  }));

  body.mcqs.forEach((mcq: any) => {
    validateCorrectOption(mcq.correctOption, mcq.options);
  });

  return await exam_model_professional.create(body);
};

const get_all_professional_exam_from_db = async (req: Request) => {
  const { searchTerm, subject, professionName, page, limit } =
    req?.query as Record<string, string>;

  const query: Record<string, any> = {};

  if (searchTerm) query.examName = { $regex: searchTerm, $options: "i" };
  if (subject) query.subject = subject;
  if (professionName) query.professionName = professionName;

  if (req?.user?.role === "PROFESSIONAL") {
    const isProfessional = (await isAccountExist(
      req?.user?.email as string,
      "profile_id",
    )) as any;
    query.professionName = isProfessional?.profile_id?.professionName;
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.max(Number(limit) || 10, 1);
  const skip = (pageNumber - 1) * pageLimit;

  const [data, total] = await Promise.all([
    exam_model_professional
      .find(query)
      .select("-mcqs")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit),
    exam_model_professional.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      total,
      page: pageNumber,
      limit: pageLimit,
      totalPages: Math.ceil(total / pageLimit),
    },
  };
};

const get_single_professional_exam_from_db = async (req: Request) => {
  const { id } = req?.params as Record<string, string>;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await exam_model_professional.findById(id).lean();

  const total = result?.mcqs?.length || 0;
  const skip = (page - 1) * limit;
  const paginatedMcqs = result?.mcqs?.slice(skip, skip + limit);

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

const update_professional_exam_into_db = async (req: Request) => {
  const { id } = req?.params as Record<string, string>;
  return await exam_model_professional
    .findByIdAndUpdate(id, req?.body, { new: true })
    .select("-mcqs");
};

const update_professional_exam_specific_mcq_into_db = async (req: Request) => {
  const { examId, mcqId } = req?.params as Record<string, string>;
  const updatedQuestionData = req?.body;

  if (updatedQuestionData.correctOption) {
    const exam = await exam_model_professional
      .findOne({ _id: examId, "mcqs.mcqId": mcqId }, { "mcqs.$": 1 })
      .lean();
    const currentOptions = exam?.mcqs?.[0]?.options ?? [];
    validateCorrectOption(updatedQuestionData.correctOption, currentOptions);
  }

  const scalarFields = buildMcqUpdateFields(mcqId, updatedQuestionData);
  const { optionUpdateFields, arrayFilters } = buildOptionUpdates(updatedQuestionData);

  return await exam_model_professional
    .findOneAndUpdate(
      { _id: examId, "mcqs.mcqId": mcqId },
      { $set: { ...scalarFields, ...optionUpdateFields } },
      {
        new: true,
        arrayFilters: [{ "mcqItem.mcqId": mcqId }, ...arrayFilters],
      },
    )
    .select("-mcqs");
};

const delete_professional_exam_from_db = async (req: Request) => {
  const { id } = req?.params as Record<string, string>;
  return await exam_model_professional.findByIdAndDelete(id).select("-mcqs");
};

const add_more_mcq_into_professional_exam_into_db = async (req: Request) => {
  const { id } = req?.params as Record<string, string>;
  const body = req?.body?.mcqs;
  const existingMcqBank = await exam_model_professional
    .findById(id)
    .select("-mcqs")
    .lean();
  if (!existingMcqBank) throw new AppError("Exam not found", 404);
  const lastMcqIndex = existingMcqBank?.totalQuestions ?? 0;

  const payload = body.map((item: any, idx: number) => ({
    ...item,
    mcqId:
      item.mcqId ||
      `MCQ-${String(lastMcqIndex + idx + 1).padStart(6, "0")}`,
  }));

  payload.forEach((mcq: any) => {
    validateCorrectOption(mcq.correctOption, mcq.options);
  });

  return await exam_model_professional
    .findByIdAndUpdate(
      id,
      {
        $push: { mcqs: { $each: payload } },
        $inc: { totalQuestions: payload.length },
      },
      { new: true },
    )
    .select("-mcqs");
};

const delete_specific_mcq_from_professional_exam_from_db = async (
  req: Request,
) => {
  const { examId, mcqId } = req?.params as Record<string, string>;
  return await exam_model_professional
    .findByIdAndUpdate(
      examId,
      { $pull: { mcqs: { mcqId } }, $inc: { totalQuestions: -1 } },
      { new: true },
    )
    .select("-mcqs");
};

// ─── ✅ check_duplicate_question_in_exams — fully optimized ──────────────────

const check_duplicate_question_in_exams = async (req: Request) => {
  const { question, excludeExamId, examType } = req.body;

  if (!question || typeof question !== "string") {
    throw new AppError("Question text is required", 400);
  }

  // ── 1. Scope exam filter by role ──────────────────────────────────────────
  const examFilter: Record<string, any> = {};

  if (examType === "professional") {
    if (req?.user?.role === "PROFESSIONAL") {
      const professional = await ProfessionalModel.findOne(
        { accountId: req?.user?.accountId },
        { professionName: 1 },
      ).lean();
      if (professional?.professionName) {
        examFilter.professionName = professional.professionName;
      }
    }
    // Admin: no filter — check all professional exams
  } else {
    // student exams
    if (req?.user?.role === "STUDENT") {
      const isStudent = (await isAccountExist(
        req?.user?.email as string,
        "profile_id",
      )) as any;
      const studentType = isStudent?.profile_id?.studentType;
      if (studentType) examFilter.profileType = studentType;
    }
    // Admin: no filter — check all student exams
  }

  const examModel =
    examType === "professional" ? exam_model_professional : exam_model_student;

  // ── 2. Parallel fetch — minimal projection only ───────────────────────────
  const [examDocs, bankDocs] = await Promise.all([
    (examModel as any).find(examFilter, DUPE_EXAM_PROJECTION).lean(),
    McqBankModel.find({}, DUPE_BANK_PROJECTION).lean(),
  ]);

  // ── 3. Normalise exam shape to match McqDocument ──────────────────────────
  const normalisedExams = (examDocs as any[]).map((e: any) => ({
    _id: e._id,
    examName: e.examName ?? "Unknown Exam",
    mcqs: e.mcqs ?? [],
  }));

  // ── 4. Single flat index over all sources + single fuzzy scan ─────────────
  const flatIndex = buildFlatIndex(
    [...normalisedExams, ...(bankDocs as any[])] as any,
    excludeExamId,
  );

  const duplicates = findFuzzyDuplicatesFromIndex(
    question,
    flatIndex,
    0.85,
    10,
  );

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
    count: duplicates.length,
    bestMatch: duplicates[0] ?? null,
  };
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const exam_service = {
  // student
  upload_new_student_exam_with_bulk_mcq_into_db,
  upload_new_student_exam_with_manual_mcq_into_db,
  get_all_student_exam_from_db,
  get_single_student_exam_from_db,
  update_student_exam_into_db,
  update_student_exam_specific_mcq_into_db,
  delete_student_exam_from_db,
  add_more_mcq_into_student_exam_into_db,
  delete_specific_mcq_from_student_exam_from_db,

  // professional
  upload_new_professional_exam_with_bulk_mcq_into_db,
  upload_new_professional_exam_with_manual_mcq_into_db,
  get_all_professional_exam_from_db,
  get_single_professional_exam_from_db,
  update_professional_exam_into_db,
  update_professional_exam_specific_mcq_into_db,
  delete_professional_exam_from_db,
  add_more_mcq_into_professional_exam_into_db,
  delete_specific_mcq_from_professional_exam_from_db,

  // duplicate check
  check_duplicate_question_in_exams,
};