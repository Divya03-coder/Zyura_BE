import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { faq_service } from "./faq.service";

const create_new_faq = catchAsync(async (req, res) => {
  const result = await faq_service.create_new_faq_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New faq created successfully!",
    data: result,
  });
});
const get_all_faqs = catchAsync(async (req, res) => {
  const result = await faq_service.get_all_faqs_from_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faqs fetched successfully!",
    data: result,
  });
});
const get_single_faq = catchAsync(async (req, res) => {
  const result = await faq_service.get_single_faq_from_db(req?.params.id as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faq fetched successfully!",
    data: result,
  });
});

const update_faq = catchAsync(async (req, res) => {
  const result = await faq_service.update_faq_into_db(req?.params.id as string, req.body);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faq update successfully!",
    data: result,
  });
});

const delete_faq = catchAsync(async (req, res) => {
  const result = await faq_service.delete_faq_from_db(req?.params.id as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Faq delete successfully!",
    data: result,
  });
});

export const faq_controller = {
  create_new_faq,
  get_all_faqs,
  get_single_faq,
  update_faq,
  delete_faq
};
