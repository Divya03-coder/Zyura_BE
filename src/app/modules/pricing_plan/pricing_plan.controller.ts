import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { pricing_plan_service } from "./pricing_plan.service";

const create_new_pricing_plan = catchAsync(async (req, res) => {
  const result = await pricing_plan_service.create_new_pricing_plan_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New pricing_plan created successfully!",
    data: result,
  });
});
const get_all_pricing_plan = catchAsync(async (req, res) => {
  const result = await pricing_plan_service.get_all_pricing_plan_from_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pricing plan fetched successfully!",
    data: result,
  });
});
const get_single_pricing_plan = catchAsync(async (req, res) => {
  const result = await pricing_plan_service.get_single_pricing_plan_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pricing plan fetched successfully",
    data: result,
  });
});
const update_specific_pricing_plan = catchAsync(async (req, res) => {
  const result = await pricing_plan_service.update_specific_pricing_plan_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pricing plan update successfully",
    data: result,
  });
});
const delete_specific_pricing_plan = catchAsync(async (req, res) => {
  const result = await pricing_plan_service.delete_specific_pricing_plan_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pricing plan delete successfully",
    data: result,
  });
});




export const pricing_plan_controller = {
  create_new_pricing_plan,
  get_all_pricing_plan,
  get_single_pricing_plan,
  update_specific_pricing_plan,
  delete_specific_pricing_plan
};
