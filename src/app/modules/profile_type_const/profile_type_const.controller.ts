import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { profile_type_const_service } from "./profile_type_const.service";

const create_new_profile_type_const = catchAsync(async (req, res) => {
  const result = await profile_type_const_service.create_new_profile_type_const_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New Profile type created successfully!",
    data: result,
  });
});
const get_all_profile_type_const = catchAsync(async (req, res) => {
  const result = await profile_type_const_service.get_all_profile_type_const_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile type fetched successfully!",
    data: result?.data,
    meta: result?.meta
  });
});
const update_profile_type_const = catchAsync(async (req, res) => {
  const result = await profile_type_const_service.update_profile_type_const_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile type update successfully!",
    data: result,
  });
});
const delete_profile_type_const = catchAsync(async (req, res) => {
  const result = await profile_type_const_service.delete_profile_type_const_from_db(req?.params?.typeId as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile type delete successfully!",
    data: result,
  });
});

// for professional

const create_new_professional_profile_type_const = catchAsync(async (req, res) => {
  const result = await profile_type_const_service.create_new_professional_profile_type_const_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New Profile type created successfully!",
    data: result,
  });
});
const get_all_professional_profile_type_const = catchAsync(async (req, res) => {
  const result = await profile_type_const_service.get_all_professional_profile_type_const_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile type fetched successfully!",
    data: result?.data,
    meta: result?.meta
  });
});
const update_professional_profile_type_const = catchAsync(async (req, res) => {
  const result = await profile_type_const_service.update_professional_profile_type_const_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile type update successfully!",
    data: result,
  });
});
const delete_professional_profile_type_const = catchAsync(async (req, res) => {
  const result = await profile_type_const_service.delete_professional_profile_type_const_from_db(req?.params?.typeId as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile type delete successfully!",
    data: result,
  });
});

export const profile_type_const_controller = {
  create_new_profile_type_const,
  get_all_profile_type_const,
  update_profile_type_const,
  delete_profile_type_const,

  create_new_professional_profile_type_const,
  get_all_professional_profile_type_const,
  update_professional_profile_type_const,
  delete_professional_profile_type_const
};
