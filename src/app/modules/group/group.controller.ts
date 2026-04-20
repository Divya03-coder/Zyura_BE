import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { group_service } from "./group.service";

const create_new_group = catchAsync(async (req, res) => {
  const result = await group_service.create_new_group_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Group created successfully!",
    data: result,
  });
});
const get_all_my_joined_groups = catchAsync(async (req, res) => {
  const result = await group_service.get_all_my_joined_groups_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Groups fetched successfully!",
    data: result,
  });
});
const update_my_group = catchAsync(async (req, res) => {
  const result = await group_service.update_my_group_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Groups updated successfully!",
    data: result,
  });
});
const delete_my_group = catchAsync(async (req, res) => {
  const result = await group_service.delete_my_group_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Groups deleted successfully!",
    data: result,
  });
});
const add_members_into_group = catchAsync(async (req, res) => {
  const result = await group_service.add_members_into_group_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Members added successfully!",
    data: result,
  });
});
const remove_member_from_group = catchAsync(async (req, res) => {
  const result = await group_service.remove_member_from_group_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Member removed successfully!",
    data: result,
  });
});
const get_all_community_member = catchAsync(async (req, res) => {
  const result = await group_service.get_all_community_member_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Members fetched successfully!",
    data: result?.data,
    meta: result?.meta,
  });
});

export const group_controller = {
  create_new_group,
  get_all_my_joined_groups,
  update_my_group,
  delete_my_group,
  add_members_into_group,
  remove_member_from_group,
  get_all_community_member
};
