import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { study_mode_tree_service } from "./study_mode_tree.service";

const create_new_content_management_admin = catchAsync(async (req, res) => {
  const result = await study_mode_tree_service.create_new_content_management_admin_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New data tree created successfully!",
    data: result,
  });
});
const get_all_content_management_admin = catchAsync(async (req, res) => {
  const result = await study_mode_tree_service.get_all_content_management_admin_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Data tree fetched successfully!",
    data: result,
  });
});
const get_all_content_from_tree = catchAsync(async (req, res) => {
  const result = await study_mode_tree_service.get_all_content_from_tree_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Content tree fetched successfully!",
    data: result?.data,
    meta: result?.meta,
  });
});
const update_content_management_admin = catchAsync(async (req, res) => {
  const result = await study_mode_tree_service.update_content_management_admin_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Data tree update successfully!",
    data: result,
  });
});
const delete_content_management_admin = catchAsync(async (req, res) => {
  const result = await study_mode_tree_service.delete_content_management_admin_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Data tree delete successfully!",
    data: result,
  });
});

export const study_mode_tree_controller = {
  create_new_content_management_admin,
  get_all_content_management_admin,
  update_content_management_admin,
  delete_content_management_admin,
  get_all_content_from_tree
};
