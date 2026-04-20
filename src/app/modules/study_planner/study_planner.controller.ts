import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { study_planner_service } from "./study_planner.service";

const get_all_study_plan = catchAsync(async (req, res) => {
  const result = await study_planner_service.get_all_study_plan_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Study plan fetched successful",
    data: result,
  });
});
const save_study_plan_progress = catchAsync(async (req, res) => {
  const result = await study_planner_service.save_study_plan_progress_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Study plan fetched successful",
    data: result,
  });
});
const cancel_study_plan = catchAsync(async (req, res) => {
  const result = await study_planner_service.cancel_study_plan_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Study plan cancelled successful",
    data: result,
  });
});
const delete_study_plan = catchAsync(async (req, res) => {
  const result = await study_planner_service.delete_study_plan_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Study plan deleted successful",
    data: result,
  });
});

export const study_planner_controller = {
  get_all_study_plan,
  save_study_plan_progress,
  cancel_study_plan,
  delete_study_plan
};
