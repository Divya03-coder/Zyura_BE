import { Request } from "express";
import { AppError } from "../../utils/app_error";
import { excelConverter } from "../../utils/excel_converter";
import { buildGoalContentFilter } from "../../utils/findContentQueryBuilder";
import { Account_Model } from "../auth/auth.schema";
import { goal_model } from "../goal/goal.schema";
import { ProfessionalModel } from "../professional/professional.schema";
import { professional_profile_type_const_model, student_profile_type_const_model } from "../profile_type_const/profile_type_const.schema";
import { Student_Model } from "../student/student.schema";
import { TClinicalCase } from "./clinical_case.interface";
import { ClinicalCaseModel } from "./clinical_case.schema";
import { clinical_case_validations } from "./clinical_case.validation";

/**
 * Multipart `data` JSON: taxonomy + clinical case title from step 1 (`title`, same as manual create).
 * Optional per-row `caseTitle` in the sheet overrides `title` / `caseTitle` in `data` for that row only.
 */
type TClinicalBulkBody = {
  subject?: string;
  system?: string;
  topic?: string;
  subtopic?: string;
  contentFor?: "student" | "professional";
  profileType?: string;
  /** Step 1 “Clinical Case Title” (preferred) */
  title?: string;
  caseTitle?: string;
};

const MAX_LABS = 12;
const MAX_MCQS = 15;

const asStr = (v: unknown): string =>
  v === null || v === undefined ? "" : String(v).trim();

const splitList = (raw: unknown): string[] => {
  if (raw === null || raw === undefined) return [];
  const s = String(raw).trim();
  if (!s) return [];
  return s
    .split(/\||;|\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
};

const diagLetters = ["A", "B", "C", "D"] as const;
const mcqLetters = ["A", "B", "C", "D", "E", "F"] as const;

const increment_profile_content_counts = async (
  cases: Pick<TClinicalCase, "contentFor" | "profileType">[],
) => {
  const keyCount = new Map<string, number>();
  for (const c of cases) {
    const k = `${c.contentFor}\t${c.profileType}`;
    keyCount.set(k, (keyCount.get(k) || 0) + 1);
  }
  for (const [k, n] of keyCount) {
    const [contentFor, profileType] = k.split("\t");
    if (!profileType || n <= 0) continue;
    if (contentFor === "student") {
      await student_profile_type_const_model.findOneAndUpdate(
        { typeName: profileType },
        { $inc: { totalContent: n } },
      );
    }
    if (contentFor === "professional") {
      await professional_profile_type_const_model.findOneAndUpdate(
        { typeName: profileType },
        { $inc: { totalContent: n } },
      );
    }
  }
};

/**
 * Excel columns (first sheet), one row = one clinical case.
 *
 * Core: patientPresentation, historyOfPresentIllness, physicalExamination,
 * imaging, difficultyLevel (Basic | Intermediate | Advance)
 *
 * caseTitle: use multipart `data`.title or `data`.caseTitle (step 1). Optional column
 * `caseTitle` in a row overrides for that row only.
 *
 * Taxonomy: multipart `data` only (subject, system, topic, optional subtopic,
 * contentFor, profileType).
 *
 * Labs: lab1Name, lab1Value … lab12Name, lab12Value
 *
 * Diagnosis: diagnosisQuestion, diagnosisOptionA–D, diagnosisCorrectOption (A–D),
 * diagnosisExplanation
 * Optional per option: diagnosisOptionA_supportingEvidence, diagnosisOptionA_refutingEvidence (pipe | semicolon | newline separated)
 *
 * Follow-up MCQs: mcq1_question, mcq1_correctOption, mcq1_optionAText, mcq1_optionAExplanation … F (repeat mcq2_, … up to 15)
 */
const row_to_clinical_case = (
  row: Record<string, unknown>,
  body: TClinicalBulkBody,
): TClinicalCase => {
  const subject = asStr(body.subject);
  const system = asStr(body.system);
  const topic = asStr(body.topic);
  const subtopic = asStr(body.subtopic);
  const contentFor = asStr(body.contentFor) as TClinicalCase["contentFor"];
  const profileType = asStr(body.profileType);

  const laboratoryResults: TClinicalCase["laboratoryResults"] = [];
  for (let i = 1; i <= MAX_LABS; i++) {
    const name = asStr(row[`lab${i}Name`]);
    const value = asStr(row[`lab${i}Value`]);
    if (name && value) laboratoryResults.push({ name, value });
  }

  const diagnosisOptions = diagLetters.map((L) => ({
    optionName: L,
    optionValue: asStr(row[`diagnosisOption${L}`]),
    supportingEvidence: splitList(row[`diagnosisOption${L}_supportingEvidence`]),
    refutingEvidence: splitList(row[`diagnosisOption${L}_refutingEvidence`]),
  }));

  const diagnosisCorrectRaw = asStr(row.diagnosisCorrectOption).toUpperCase();
  const diagnosisCorrect = diagnosisCorrectRaw.slice(0, 1) as
    | "A"
    | "B"
    | "C"
    | "D";

  const mcqs: TClinicalCase["mcqs"] = [];
  for (let m = 1; m <= MAX_MCQS; m++) {
    const question = asStr(row[`mcq${m}_question`]);
    if (!question) continue;
    const options = mcqLetters
      .map((L) => ({
        option: L,
        optionText: asStr(row[`mcq${m}_option${L}Text`]),
        explanation: asStr(row[`mcq${m}_option${L}Explanation`]) || undefined,
      }))
      .filter((o) => o.optionText !== "");
    if (options.length < 4) continue;
    const co = asStr(row[`mcq${m}_correctOption`]).toUpperCase().slice(0, 1);
    if (!["A", "B", "C", "D", "E", "F"].includes(co)) continue;
    mcqs.push({
      question,
      options,
      correctOption: co as TClinicalCase["mcqs"][number]["correctOption"],
    });
  }

  const caseTitle =
    asStr(row.caseTitle) ||
    asStr(body.caseTitle) ||
    asStr(body.title);

  return {
    caseTitle,
    patientPresentation: asStr(row.patientPresentation),
    historyOfPresentIllness: asStr(row.historyOfPresentIllness),
    physicalExamination: asStr(row.physicalExamination),
    imaging: asStr(row.imaging),
    difficultyLevel: asStr(row.difficultyLevel) as TClinicalCase["difficultyLevel"],
    laboratoryResults,
    diagnosisQuestion: {
      question: asStr(row.diagnosisQuestion),
      diagnosisOptions,
    },
    correctOption: {
      optionName: diagnosisCorrect,
      explanation: asStr(row.diagnosisExplanation),
    },
    mcqs,
    subject,
    system,
    topic,
    subtopic: subtopic || undefined,
    contentFor,
    profileType,
  };
};

const upload_bulk_clinical_cases_into_db = async (req: Request) => {
  const excelData = (
    req.file ? excelConverter.parseFile(req.file.path) || [] : []
  ) as Record<string, unknown>[];
  if (!excelData.length) {
    throw new AppError("No rows found in uploaded file", 400);
  }

  const body = (req.body || {}) as TClinicalBulkBody;

  const require_bulk_data_taxonomy = (b: TClinicalBulkBody) => {
    const missing: string[] = [];
    if (!asStr(b.subject)) missing.push("subject");
    if (!asStr(b.system)) missing.push("system");
    if (!asStr(b.topic)) missing.push("topic");
    if (!asStr(b.contentFor)) missing.push("contentFor");
    if (!asStr(b.profileType)) missing.push("profileType");
    if (!asStr(b.caseTitle) && !asStr(b.title)) {
      missing.push("title (step 1 Clinical Case Title — or send caseTitle in `data`)");
    }
    if (missing.length) {
      throw new AppError(
        `Multipart field \`data\` must be valid JSON with: ${missing.join(", ")}`,
        400,
      );
    }
    if (b.contentFor !== "student" && b.contentFor !== "professional") {
      throw new AppError(
        "`data.contentFor` must be \"student\" or \"professional\"",
        400,
      );
    }
  };
  require_bulk_data_taxonomy(body);

  const payloads: TClinicalCase[] = [];
  type RowErr = { row: number; message: string };
  const errors: RowErr[] = [];

  for (let i = 0; i < excelData.length; i++) {
    const row = excelData[i] as Record<string, unknown>;
    try {
      const built = row_to_clinical_case(row, body);
      const need = (v: string, label: string) => {
        if (!v?.trim()) throw new Error(`${label} is required`);
      };
      need(built.caseTitle, "caseTitle");
      need(built.patientPresentation, "patientPresentation");
      need(built.historyOfPresentIllness, "historyOfPresentIllness");
      need(built.physicalExamination, "physicalExamination");
      need(built.imaging, "imaging");
      need(built.difficultyLevel, "difficultyLevel");
      need(built.diagnosisQuestion.question, "diagnosisQuestion");
      need(built.correctOption.explanation, "diagnosisExplanation");
      if (
        !["Basic", "Intermediate", "Advance"].includes(built.difficultyLevel)
      ) {
        throw new Error(
          "difficultyLevel must be Basic, Intermediate, or Advance",
        );
      }
      if (!["A", "B", "C", "D"].includes(built.correctOption.optionName)) {
        throw new Error(
          "diagnosisCorrectOption must be A, B, C, or D",
        );
      }
      if (
        built.diagnosisQuestion.diagnosisOptions.some(
          (o) => !o.optionValue?.trim(),
        )
      ) {
        throw new Error(
          "All four diagnosis options (diagnosisOptionA–D) must be non-empty",
        );
      }
      const parsed =
        await clinical_case_validations.create.parseAsync(built);
      payloads.push(parsed as unknown as TClinicalCase);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Validation failed";
      errors.push({ row: i + 2, message });
    }
  }

  if (!payloads.length) {
    const hint =
      errors[0] &&
      `Row ${errors[0].row}: ${errors[0].message}`;
    throw new AppError(
      hint
        ? `No valid rows. ${hint}`
        : "No valid clinical case rows to insert",
      400,
    );
  }

  await ClinicalCaseModel.insertMany(payloads);
  await increment_profile_content_counts(payloads);

  return {
    insertedCount: payloads.length,
    skippedCount: errors.length,
    errors,
  };
};

const create_new_clinical_case_and_save_on_db = async (req: Request) => {
  const payload = req?.body;
  const result = await ClinicalCaseModel.create(payload);


  // update content count
  if (payload?.contentFor == "student") {
    await student_profile_type_const_model.findOneAndUpdate(
      { typeName: payload?.profileType },
      { $inc: { totalContent: 1 } },
    );
  }
  if (payload?.contentFor == "professional") {
    await professional_profile_type_const_model.findOneAndUpdate(
      { typeName: payload?.profileType },
      { $inc: { totalContent: 1 } },
    );
  }
  return result;
};

const get_all_clinical_case_from_db = async (req: Request) => {
  const user = await Account_Model.findById(req?.user?.accountId).lean();
  const query = req?.query as any;

  let {
    page = 1,
    limit = 10,
    searchTerm = "",
    contentFor,
    subject,
    system,
    topic,
    subtopic,
  } = query;

  const filter: any = {};
  const trimOrEmpty = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const searchTermTrim = trimOrEmpty(searchTerm);
  const contentForTrim = trimOrEmpty(contentFor);
  const subjectTrim = trimOrEmpty(subject);
  const systemTrim = trimOrEmpty(system);
  const topicTrim = trimOrEmpty(topic);
  const subtopicTrim = trimOrEmpty(subtopic);

  // 🧠 Role-based filters
  if (req?.user?.role === "STUDENT") {
    const student = await Student_Model.findOne({
      accountId: req?.user?.accountId,
    });
    filter.contentFor = "student";
    filter.profileType = student?.studentType;
  }

  if (req?.user?.role === "PROFESSIONAL") {
    const professional = await ProfessionalModel.findOne({
      accountId: req?.user?.accountId,
    });
    filter.contentFor = "professional";
    filter.profileType = professional?.professionName;
  }

  // 🔍 Global search
  if (searchTermTrim) {
    filter.$or = [{ caseTitle: { $regex: searchTermTrim, $options: "i" } }];
  }

  // 🎯 Individual filters (regex-based – unchanged)
  if (contentForTrim) filter.contentFor = contentForTrim;
  if (subjectTrim) filter.subject = { $regex: subjectTrim, $options: "i" };
  if (systemTrim) filter.system = { $regex: systemTrim, $options: "i" };
  if (topicTrim) filter.topic = { $regex: topicTrim, $options: "i" };
  if (subtopicTrim) filter.subtopic = { $regex: subtopicTrim, $options: "i" };

  // 🎯 Apply Goal-based Filter
  const goal = await goal_model.findOne({
    studentId: req?.user?.accountId,
    goalStatus: "IN_PROGRESS",
  });

  const finalFilter = buildGoalContentFilter(goal, filter);

  // 🔢 Pagination
  const skip = (Number(page) - 1) * Number(limit);

  const [result, total] = await Promise.all([
    ClinicalCaseModel.find(finalFilter)
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    ClinicalCaseModel.countDocuments(finalFilter),
  ]);

  const finalResult = result.map((item: any) => {
    const isComplete =
      user?.finishedClinicalCaseIds?.some(
        (id: any) => id.toString() === item._id.toString(),
      ) || false;

    return {
      ...item, // item is now a plain object
      isComplete,
    };
  });

  return {
    data: finalResult,
    meta: {
      page: Number(page),
      limit: Number(limit),
      skip,
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const get_single_clinical_case_from_db = async (caseId: string) => {
  const isCaseExist = await ClinicalCaseModel.findById(caseId).lean();
  if (!isCaseExist) {
    throw new AppError("Case not found!!", 404);
  }
  return isCaseExist;
};

const update_clinical_case_by_id_into_db = async (req: Request) => {
  const { caseId } = req?.params;
  const payload = req?.body;
  const isCaseExist = await ClinicalCaseModel.findById(caseId).lean();
  if (!isCaseExist) {
    throw new AppError("Case not found!!", 404);
  }
  const result = await ClinicalCaseModel.findByIdAndUpdate(caseId, payload, {
    new: true,
  });
  return result;
};
const delete_clinical_case_by_id_from_db = async (caseId: string) => {
  const result = await ClinicalCaseModel.findByIdAndDelete(caseId);
  if (!result) {
    throw new AppError("Case not found!!", 404);
  }
  await student_profile_type_const_model.findOneAndUpdate(
    { typeName: result?.profileType },
    { $inc: { totalContent: -1 } },
  );
  await professional_profile_type_const_model.findOneAndUpdate(
    { typeName: result?.profileType },
    { $inc: { totalContent: -1 } },
  );
  return result;
};

export const clinical_case_services = {
  create_new_clinical_case_and_save_on_db,
  upload_bulk_clinical_cases_into_db,
  get_all_clinical_case_from_db,
  get_single_clinical_case_from_db,
  update_clinical_case_by_id_into_db,
  delete_clinical_case_by_id_from_db,
};
