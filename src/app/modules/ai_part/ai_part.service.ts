import { Request } from "express";
import fs from "fs";
import { configs } from "../../configs";
import { AppError } from "../../utils/app_error";
import { isAccountExist } from "../../utils/isAccountExist";
import { daily_ai_request_model } from "../analytics/analytics.schema";
import { ClinicalCaseModel } from "../clinical_case/clinical_case.schema";
import { FlashcardModel } from "../flash_card/flash_card.schema";
import { McqBankModel } from "../mcq_bank/mcq_bank.schema";
import {
  T_MyContent_flashcard,
  T_MyContent_mcq,
  T_MyContent_notes,
} from "../my_content/my_content.interface";
import {
  my_content_clinicalCase_model,
  my_content_flashcard_model,
  my_content_mcq_bank_model,
  my_content_notes_model,
} from "../my_content/my_content.schema";
import { notes_model } from "../notes/notes.schema";
import { osce_model } from "../osce/osce.schema";
import { study_planner_model } from "../study_planner/study_planner.schema";
import { study_planner_validations } from "../study_planner/study_planner.validation";
const today = new Date().toISOString().split("T")[0];

const chat_with_ai_tutor_from_ai = async (req: Request) => {
  const question = req?.body?.question;
  const payload = {
    user_id: req?.user?.accountId,
    question,
    role: req?.user?.role,
    thread_id: req?.body?.thread_id,
  };
  const response = await fetch((configs.ai_api as string) + "/api/v1/tutor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  await daily_ai_request_model.updateOne(
    { date: today },
    { $inc: { count: 1 } },
    { upsert: true },
  );
  const data = await response.json();
  return data;
};

const get_all_chat_history_from_ai = async (req: Request) => {
  const user = req?.user;
  const thread_id = req?.query?.thread_id;
  const response = await fetch(
    (configs.ai_api as string) + "/api/v1/api/chat/history",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user?.accountId, thread_id }),
    },
  );
  const data = await response.json();
  await daily_ai_request_model.updateOne(
    { date: today },
    { $inc: { count: 1 } },
    { upsert: true },
  );
  return data;
};

const get_all_chat_thread_title_from_ai = async (req: Request) => {
  const user = req?.user;
  const response = await fetch(
    (configs.ai_api as string) + "/api/v1/thread-title",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user?.accountId }),
    },
  );
  const data = await response.json();
  await daily_ai_request_model.updateOne(
    { date: today },
    { $inc: { count: 1 } },
    { upsert: true },
  );
  return data;
};

const generate_new_study_plan_from_ai = async (req: Request) => {
  const isAccount = await isAccountExist(req?.user?.email as string, "profile_id") as any;
  const payload = req?.body;
  if (req?.user?.role == "STUDENT") {
    payload.contentFor = "student";
    payload.profileType = isAccount?.profile_id?.profileType
  }
  if (req?.user?.role == "PROFESSIONAL") {
    payload.contentFor = "professional";
    payload.profileType = isAccount?.profile_id?.professionName
  }
  const response = await fetch(configs.ai_api + "/api/v1/study_planner/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  const parseData = await study_planner_validations.create.parseAsync(data);
  const result = await study_planner_model.create({
    ...parseData,
    accountId: req?.user?.accountId,
    status: "in_progress",
  });
  await daily_ai_request_model.updateOne(
    { date: today },
    { $inc: { count: 1 } },
    { upsert: true },
  );
  return result;
};

const generate_flashcard_from_ai = async (req: Request) => {
  const payload = req.body;
  const formData = new FormData();
  formData.append("quiz_name", payload.quiz_name);
  formData.append("subject", payload.subject);
  formData.append("system", payload.system);
  formData.append("topic", payload.topic);
  formData.append("sub_topic", payload.sub_topic);
  formData.append("question_type", payload.question_type);
  formData.append("question_count", payload.question_count);
  formData.append("difficulty_level", payload.difficulty_level);
  formData.append("user_prompt", payload.user_prompt);

  if (req.file) {
    const fileBuffer = fs.readFileSync(req.file.path);
    const blob = new Blob([fileBuffer], { type: req.file.mimetype });
    formData.append("file", blob, req.file.originalname);
  }
  const response = await fetch(`${configs.ai_api}/api/v1/flash-cards`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  // saving payload
  const finalPayload: Partial<T_MyContent_flashcard> = {
    title: payload?.quiz_name,
    subject: payload?.subject,
    system: payload?.system,
    topic: payload?.topic,
    subtopic: payload?.sub_topic,
    flashCards: [...data],
    studentId: req?.user?.accountId,
  };

  const result = await my_content_flashcard_model.create(finalPayload);
  await daily_ai_request_model.updateOne(
    { date: today },
    { $inc: { count: 1 } },
    { upsert: true },
  );
  return result;
};

const generate_mcq_from_ai = async (req: Request) => {
  const body = req?.body;
  const payload: any = {
    quiz_name: body?.quiz_name,
    subject: body?.subject,
    system: body?.system,
    topic: body?.topic,
    sub_topic: body?.sub_topic,
    question_type: body?.question_type,
    question_count: body?.question_count,
    difficulty_level: body?.difficulty_level,
  };
  // find mcq bank;
  payload.question_count = Number(payload?.question_count);

  if (payload?.question_type == "hybrid") {
    const mcqBank = await McqBankModel.findById(body?.mcq_bank_id).lean();

    if (!mcqBank) {
      throw new AppError("MCQ Bank not found", 404);
    }

    const limit = Math.round(payload.question_count / 2);

    // return N questions from bank
    const selectedQuestions = mcqBank.mcqs.slice(0, limit);

    payload.mcq_list = JSON.stringify(selectedQuestions);
  }
  const response = await fetch((configs.ai_api as string) + "/api/v1/mcq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  // save it later
  const finalPayload: Partial<T_MyContent_mcq> = {
    title: payload?.quiz_name || data?.title,
    subject: payload?.subject,
    system: payload?.system,
    topic: payload?.topic,
    subtopic: payload?.sub_topic,
    mcqs: data?.mcqs,
    studentId: req?.user?.accountId,
    tracking: {
      totalMcqCount: Number(payload?.question_count),
      totalAttemptCount: 0,
      correctMcqCount: 0,
      wrongMcqCount: 0,
      timeTaken: "0",
      progress: 0,
      correctPercentage: 0,
      wrongPercentage: 0,
      unattemptedPercentage: 0,
      recommendedContent: [],
    },
  };
  const result = await my_content_mcq_bank_model.create(finalPayload);
  await daily_ai_request_model.updateOne(
    { date: today },
    { $inc: { count: 1 } },
    { upsert: true },
  );
  return result;
};

const generate_clinical_case_from_ai = async (req: Request) => {
  const payload = req?.body;
  // form data
  const formData = new FormData();
  if (payload?.prompt) {
    formData.append("prompt", JSON.stringify(payload?.prompt));
  }
  if (req?.file) {
    const fileBuffer = fs.readFileSync(req.file.path);
    const blob = new Blob([fileBuffer], { type: req.file.mimetype });
    formData.append("file", blob, req.file.originalname);
  }

  const response = await fetch(
    (configs.ai_api as string) + "/api/v1/api/v1/clinical-case/",
    {
      method: "POST",
      body: formData,
    },
  );
  const data = await response.json();
  // save it later
  const finalPayload: Partial<T_MyContent_mcq> = {
    ...data?.clinical_case,
    studentId: req?.user?.accountId,
  };
  const result = await my_content_clinicalCase_model.create(finalPayload);
  await daily_ai_request_model.updateOne(
    { date: today },
    { $inc: { count: 1 } },
    { upsert: true },
  );
  return result;
};

const get_all_content_title_suggestion_from_db = async (req: Request) => {
  const key = req?.query?.key || "mcq" as any;

  const modelMap: any = {
    mcq: {
      model: McqBankModel,
      arrayField: "mcqs",
    },
    flashcard: {
      model: FlashcardModel,
      arrayField: "flashCards",
    },
    clinicalcase: {
      model: ClinicalCaseModel,
      titleField: "caseTitle",
    },
    osce: {
      model: osce_model,
      titleField: "name",
    },
    notes: {
      model: notes_model,
      titleField: "title",
    },
  };

  if (!modelMap[key]) {
    return {
      success: false,
      message: "Invalid key",
    };
  }

  const config = modelMap[key];

  let result;

  // ✅ MCQ & Flashcard → array length only
  if (config.arrayField) {
    result = await config.model.aggregate([
      {
        $project: {
          title: 1,
          subject: 1,
          system: 1,
          topic: 1,
          subtopic: 1,
          totalItems: { $size: `$${config.arrayField}` },
          contentFor: 1,
          profileType: 1,
        },
      },
    ]);
  }
  // ✅ Others → normal title mapping
  else {
    result = await config.model
      .find({})
      .select(`${config.titleField} subject system topic subtopic contentFor profileType`)
      .lean()
      .then((data: any[]) =>
        data.map((item) => ({
          ...item,
          title: item[config.titleField],
        })),
      );
  }

  await daily_ai_request_model.updateOne(
    { date: today },
    { $inc: { count: 1 } },
    { upsert: true },
  );

  return result;
};

const mcq_generator_from_ai = async (req: Request) => {
  const payload = req?.body;
  // form data
  const formData = new FormData();

  formData.append("prompt", JSON.stringify(payload?.prompt));
  formData.append("d_level", JSON.stringify(payload?.d_level));
  formData.append("q_count", JSON.stringify(payload?.q_count));

  if (req?.file) {
    const fileBuffer = fs.readFileSync(req.file.path);
    const blob = new Blob([fileBuffer], { type: req.file.mimetype });
    formData.append("file", blob, req.file.originalname);
  }

  const response = await fetch(
    (configs.ai_api as string) + "/api/v1/mcq_generate",
    {
      method: "POST",
      body: formData,
    },
  );
  const data = await response.json();
  const finalPayload: Partial<T_MyContent_mcq> = {
    title: payload?.quiz_name || data?.title,
    subject: payload?.subject,
    system: payload?.system,
    topic: payload?.topic,
    subtopic: payload?.sub_topic,
    mcqs: [...data?.mcqs],
    studentId: req?.user?.accountId,
    tracking: {
      totalMcqCount: Number(payload?.q_count),
      totalAttemptCount: 0,
      correctMcqCount: 0,
      wrongMcqCount: 0,
      timeTaken: "0",
      progress: 0,
      correctPercentage: 0,
      wrongPercentage: 0,
      unattemptedPercentage: 0,
      recommendedContent: [],
    },
  };
  const result = await my_content_mcq_bank_model.create(finalPayload);
  await daily_ai_request_model.updateOne(
    { date: today },
    { $inc: { count: 1 } },
    { upsert: true },
  );
  return result;
};

const generate_note_from_ai = async (req: Request) => {
  const payload = req?.body;
  // form data
  const formData = new FormData();

  formData.append("make_your_note", JSON.stringify(payload?.make_your_note));
  formData.append("topic_name", JSON.stringify(payload?.topic_name));
  formData.append("note_format", JSON.stringify(payload?.note_format));

  if (req?.file) {
    const fileBuffer = fs.readFileSync(req.file.path);
    const blob = new Blob([fileBuffer], { type: req.file.mimetype });
    formData.append("file", blob, req.file.originalname);
  }

  const response = await fetch(
    (configs.ai_api as string) + "/api/v1/generate_notes",
    {
      method: "POST",
      body: formData,
    },
  );
  const data = await response.json();
  const finalPayload: Partial<T_MyContent_notes> = {
    ...data,
    studentId: req?.user?.accountId,
  };
  const result = await my_content_notes_model.create(finalPayload);
  await daily_ai_request_model.updateOne(
    { date: today },
    { $inc: { count: 1 } },
    { upsert: true },
  );
  return result;
};

const generate_recommendation_from_ai = async (req: Request) => {
  const contentId = req?.params?.contentId;
  // find content exist or not
  const isMyMcqExist = await my_content_mcq_bank_model.findById(contentId).lean();
  if (!isMyMcqExist) {
    throw new AppError("Content not found", 404);
  }
  // get user profile
  const payload: any = {};
  const isAccount = await isAccountExist(req?.user?.email as string, "profile_id") as any;
  const body = req?.body;
  const roleMeta =
    req?.user?.role === "STUDENT"
      ? { content_for: "student", profile_type: isAccount?.profile_id?.studentType }
      : req?.user?.role === "PROFESSIONAL"
        ? { content_for: "professional", profile_type: isAccount?.profile_id?.professionName }
        : {};

  // build structure
  payload.original_quiz_metadata = {
    subject: isMyMcqExist?.subject,
    system: isMyMcqExist?.system,
    topic: isMyMcqExist?.topic,
    sub_topic: isMyMcqExist?.subtopic,
    ...roleMeta,
    exam_format: "USMLE"
  };
  payload.incorrect_answers = [...body]


  // hit ai api
  const res = await fetch((configs.ai_api as string) + "/api/v1/recommendation/mcq", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  // add recommendation
  await my_content_mcq_bank_model.updateOne(
    { _id: contentId },
    { "tracking.recommendedContent": data }
  );

  // update ai count
  await daily_ai_request_model.updateOne(
    { date: today },
    { $inc: { count: 1 } },
    { upsert: true },
  );
  return data;
}
export const ai_part_service = {
  chat_with_ai_tutor_from_ai,
  get_all_chat_history_from_ai,
  get_all_chat_thread_title_from_ai,
  generate_new_study_plan_from_ai,
  generate_flashcard_from_ai,
  generate_mcq_from_ai,
  generate_clinical_case_from_ai,
  get_all_content_title_suggestion_from_db,
  mcq_generator_from_ai,
  generate_note_from_ai,
  generate_recommendation_from_ai
};
