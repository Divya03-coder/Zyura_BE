import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { tracking_service } from "./tracking.service";

const get_student_and_professional_leaderboard = catchAsync(
  async (req, res) => {
    const result =
      await tracking_service.get_student_and_professional_leaderboard_from_db(req);
    manageResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Leaderboard fetched successfully!",
      data: result,
    });
  }
);
const get_my_performance = catchAsync(
  async (req, res) => {
    const result =
      await tracking_service.get_my_performance_from_db(req);
    manageResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Performance fetched successfully!",
      data: result,
    });
  }
);
const get_all_highlights_content_of_this_week = catchAsync(
  async (req, res) => {
    const result =
      await tracking_service.get_all_highlights_content_of_this_week_from_db(req);
    manageResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Highlights fetched successfully!",
      data: result,
    });
  }
);
const get_my_daily_challenge_content = catchAsync(
  async (req, res) => {
    const result =
      await tracking_service.get_my_daily_challenge_content_from_db(req);
    manageResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Challenge fetched successfully!",
      data: result,
    });
  }
);
const update_daily_challenge_content_status = catchAsync(
  async (req, res) => {
    const result =
      await tracking_service.update_daily_challenge_content_status_into_db(req);
    manageResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Challenge status update successfully!",
      data: result,
    });
  }
);

export const tracking_controller = {
  get_student_and_professional_leaderboard,
  get_my_performance,
  get_all_highlights_content_of_this_week,
  get_my_daily_challenge_content,
  update_daily_challenge_content_status
};
