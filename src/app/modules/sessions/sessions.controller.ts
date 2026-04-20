import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { sessions_service } from "./sessions.service";

const book_a_session_with_mentor = catchAsync(async (req, res) => {
  const result = await sessions_service.book_a_session_with_mentor_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New sessions created successfully!",
    data: result,
  });
});
const verify_booking_session = catchAsync(async (req, res) => {
  const result = await sessions_service.verify_booking_session_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Session verified successfully!",
    data: result,
  });
});
const get_my_upcoming_sessions = catchAsync(async (req, res) => {
  const result = await sessions_service.get_my_upcoming_sessions_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Session fetched successfully!",
    data: result,
  });
});

export const sessions_controller = {
  book_a_session_with_mentor,
  verify_booking_session,
  get_my_upcoming_sessions
};
