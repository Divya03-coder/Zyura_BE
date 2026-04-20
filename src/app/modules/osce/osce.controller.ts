import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { osce_service } from "./osce.service";

const create_new_osce = catchAsync(async (req, res) => {
  const result = await osce_service.create_new_osce_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New osce created successfully!",
    data: result,
  });
});
const get_all_osce = catchAsync(async (req, res) => {
  const result = await osce_service.get_all_osce_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Osce fetched successfully!",
    data: result,
  });
});
const get_single_osce = catchAsync(async (req, res) => {
  const result = await osce_service.get_single_osce_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Osce fetched successfully!",
    data: result,
  });
});
const update_single_osce = catchAsync(async (req, res) => {
  const result = await osce_service.update_single_osce_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Osce update successfully!",
    data: result,
  });
});
const delete_single_osce = catchAsync(async (req, res) => {
  const result = await osce_service.delete_single_osce_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Osce delete successfully!",
    data: result,
  });
});

export const osce_controller = {
  create_new_osce,
  get_all_osce,
  get_single_osce,
  update_single_osce,
  delete_single_osce
};
