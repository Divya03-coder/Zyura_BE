import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { ai_part_service } from "./ai_part.service";

const chat_with_ai_tutor = catchAsync(async (req, res) => {
  const result = await ai_part_service.chat_with_ai_tutor_from_ai(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ai response fetched successfully!",
    data: result,
  });
});
const get_all_chat_history = catchAsync(async (req, res) => {
  const result = await ai_part_service.get_all_chat_history_from_ai(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ai chat history fetched successfully!",
    data: result,
  });
});
const get_all_chat_thread_title = catchAsync(async (req, res) => {
  const result = await ai_part_service.get_all_chat_thread_title_from_ai(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ai chat thread title fetched successfully!",
    data: result,
  });
});
const generate_new_study_plan = catchAsync(async (req, res) => {
  const result = await ai_part_service.generate_new_study_plan_from_ai(req);
  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ai study plan generated successfully!",
    data: result,
  });
});
const generate_flashcard = catchAsync(async (req, res) => {
  const result = await ai_part_service.generate_flashcard_from_ai(req);
  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ai flashcard generated successfully!",
    data: result,
  });
});
const generate_mcq = catchAsync(async (req, res) => {
  const result = await ai_part_service.generate_mcq_from_ai(req);
  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ai mcq generated successfully!",
    data: result,
  });
});

const generate_clinical_case = catchAsync(async (req, res) => {
  const result = await ai_part_service.generate_clinical_case_from_ai(req);
  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Clinical case generated successfully!",
    data: result,
  });
});
const get_all_content_title_suggestion = catchAsync(async (req, res) => {
  const result = await ai_part_service.get_all_content_title_suggestion_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Content fetched successfully!",
    data: result,
  });
});
const mcq_generator = catchAsync(async (req, res) => {
  const result = await ai_part_service.mcq_generator_from_ai(req);
  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Mcq generated successfully!",
    data: result,
  });
});
const generate_note = catchAsync(async (req, res) => {
  const result = await ai_part_service.generate_note_from_ai(req);
  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Note generated successfully!",
    data: result,
  });
});
const generate_recommendation = catchAsync(async (req, res) => {
  const result = await ai_part_service.generate_recommendation_from_ai(req);
  manageResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Recommendation generated successfully!",
    data: result,
  });
});



export const ai_part_controller = {
  chat_with_ai_tutor,
  get_all_chat_history,
  get_all_chat_thread_title,
  generate_new_study_plan,
  generate_flashcard,
  generate_mcq,
  generate_clinical_case,
  get_all_content_title_suggestion,
  mcq_generator,
  generate_note,
  generate_recommendation
};
