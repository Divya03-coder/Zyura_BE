import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { goal_service } from "./goal.service";

const create_new_goal = catchAsync(async (req, res) => {
  const result = await goal_service.create_new_goal_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New goal created successfully!",
    data: result,
  });
});
const get_goals_by_student_id = catchAsync(async (req, res) => {
  const result = await goal_service.get_goals_by_student_id_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Goals fetched successfully!",
    data: result,
  });
});
const update_goal = catchAsync(async (req, res) => {
  const result = await goal_service.update_goal_into_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Goals update successfully!",
    data: result,
  });
});
const delete_goal = catchAsync(async (req, res) => {
  const result = await goal_service.delete_goal_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Goals delete successfully!",
    data: result,
  });
});
const update_goal_accuracy_and_progress_for_mcq_and_flashcard = catchAsync(async (req, res) => {
  const result = await goal_service.update_goal_accuracy_and_progress_for_mcq_and_flashcard_clinicalCase_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Goals update successfully!",
    data: result,
  });
});
const update_goal_accuracy_and_progress_for_osce = catchAsync(async (req, res) => {
  const result = await goal_service.update_goal_accuracy_and_progress_for_osce_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Goals update successfully!",
    data: result,
  });
});
const get_overview_for_student_and_professional = catchAsync(async (req, res) => {
  const result = await goal_service.get_overview_for_student_and_professional_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Goals overview fetched successfully!",
    data: result,
  });
});

export const goal_controller = {
  create_new_goal,
  get_goals_by_student_id,
  update_goal,
  delete_goal,
  update_goal_accuracy_and_progress_for_mcq_and_flashcard,
  update_goal_accuracy_and_progress_for_osce,
  get_overview_for_student_and_professional
};
