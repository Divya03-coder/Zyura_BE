import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { resource_service } from "./resource.service";

const create_new_resource = catchAsync(async (req, res) => {
  const result = await resource_service.create_new_resource_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New career resource created successfully!",
    data: result,
  });
});
const get_all_career_resource = catchAsync(async (req, res) => {
  const result = await resource_service.get_all_career_resource_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All career resource fetched successfully!",
    data: result?.data,
    meta: result?.meta,
  });
});
const get_single_career_resource = catchAsync(async (req, res) => {
  const result = await resource_service.get_single_career_resource_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All career resource fetched successfully!",
    data: result
  });
});
const update_career_resource = catchAsync(async (req, res) => {
  const result = await resource_service.update_career_resource_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Career resource update successfully!",
    data: result
  });
});
const delete_single_career_resource = catchAsync(async (req, res) => {
  const result = await resource_service.delete_single_career_resource_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Career resource delete successfully!",
    data: result
  });
});

// book part

const create_new_book = catchAsync(async (req, res) => {
  const result = await resource_service.create_new_book_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book uploaded successfully!",
    data: result,
  });
});
const get_all_book = catchAsync(async (req, res) => {
  const result = await resource_service.get_all_books_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Books fetched successfully!",
    data: result?.data,
    meta: result?.meta,
  });
});
const get_single_book = catchAsync(async (req, res) => {
  const result = await resource_service.get_single_book_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book fetched successfully!",
    data: result
  });
});
const update_book = catchAsync(async (req, res) => {
  const result = await resource_service.update_book_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book update successfully!",
    data: result
  });
});
const delete_book = catchAsync(async (req, res) => {
  const result = await resource_service.delete_book_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book delete successfully!",
    data: result
  });
});

export const resource_controller = {
  create_new_resource,
  get_all_career_resource,
  get_single_career_resource,
  update_career_resource,
  delete_single_career_resource,
  // book part

  create_new_book,
  get_all_book,
  get_single_book,
  update_book,
  delete_book

};
