import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { my_content_service } from "./my_content.service";

const get_all_my_generated_mcq = catchAsync(async (req, res) => {
  const result = await my_content_service.get_all_my_generated_mcq_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Mcq fetched successfully!",
    data: result?.data,
    meta: result?.meta,
  });
});
const get_single_my_generated_mcq = catchAsync(async (req, res) => {
  const result = await my_content_service.get_single_my_generated_mcq_from_db(req?.params?.id as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Mcq fetched successfully!",
    data: result,
  });
});
const get_all_my_generated_flashcard = catchAsync(async (req, res) => {
  const result = await my_content_service.get_all_my_generated_flashcard_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flashcard fetched successfully!",
    data: result?.data,
    meta: result?.meta,
  });
});
const get_single_my_generated_flashcard = catchAsync(async (req, res) => {
  const result = await my_content_service.get_single_my_generated_flashcard_from_db(req?.params?.id as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flashcard fetched successfully!",
    data: result,
  });
});
const get_all_my_generated_clinicalCase = catchAsync(async (req, res) => {
  const result = await my_content_service.get_all_my_generated_clinicalCase_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "clinical case fetched successfully!",
    data: result?.data,
    meta: result?.meta,
  });
});
const get_single_my_generated_clinicalCase = catchAsync(async (req, res) => {
  const result = await my_content_service.get_single_my_generated_clinicalCase_from_db(req?.params?.id as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "clinical case fetched successfully!",
    data: result,
  });
});

const update_tracking = catchAsync(async (req, res) => {
  const result = await my_content_service.update_tracking(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tracking updated successfully!",
    data: result,
  });
});

const get_all_my_generated_notes = catchAsync(async (req, res) => {
  const result = await my_content_service.get_all_my_generated_notes_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notes fetched successfully!",
    data: result?.data,
    meta: result?.meta,
  });
});
const get_single_my_generated_notes = catchAsync(async (req, res) => {
  const result = await my_content_service.get_single_my_generated_notes_from_db(req?.params?.id as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Note fetched successfully!",
    data: result,
  });
});
const delete_my_content = catchAsync(async (req, res) => {
  const result = await my_content_service.delete_my_content_from_delete(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deleted successfully!",
    data: result,
  });
});
export const my_content_controller = {
  get_all_my_generated_mcq,
  get_single_my_generated_mcq,
  get_single_my_generated_flashcard,
  get_all_my_generated_flashcard,
  get_all_my_generated_clinicalCase,
  get_single_my_generated_clinicalCase,
  update_tracking,
  get_all_my_generated_notes,
  get_single_my_generated_notes,
  delete_my_content
};
