import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { notes_service } from "./notes.service";

const create_new_notes = catchAsync(async (req, res) => {
  const result = await notes_service.create_new_notes_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New notes created successfully!",
    data: result,
  });
});
const get_all_notes = catchAsync(async (req, res) => {
  const result = await notes_service.get_all_notes_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notes fetched successfully!",
    data: result?.data,
    meta: result?.meta,
  });
});
const get_single_notes = catchAsync(async (req, res) => {
  const result = await notes_service.get_single_notes_from_db(req?.params?.noteId as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notes fetched successfully!",
    data: result,
  });
});
const delete_single_notes = catchAsync(async (req, res) => {
  const result = await notes_service.delete_single_notes_from_db(req?.params?.noteId as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notes deleted successfully!",
    data: result,
  });
});
const update_download_count = catchAsync(async (req, res) => {
  const result = await notes_service.update_download_count_into_db(req?.params?.noteId as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Download count updated successfully!",
    data: result,
  });
});

const update_note = catchAsync(async (req, res) => {
  const result = await notes_service.update_note_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Note updated successfully!",
    data: result,
  });
});

export const notes_controller = {
  create_new_notes,
  get_all_notes,
  get_single_notes,
  delete_single_notes,
  update_download_count,
  update_note
};
