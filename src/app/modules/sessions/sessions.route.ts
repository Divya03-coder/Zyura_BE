import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { sessions_controller } from "./sessions.controller";
import { sessions_validations } from "./sessions.validation";

const sessions_router = Router();

sessions_router.post(
  "/book-session",
  auth("STUDENT", "PROFESSIONAL"),
  RequestValidator(sessions_validations.create),
  sessions_controller.book_a_session_with_mentor
);
sessions_router.post(
  "/verify-session",
  auth("STUDENT", "PROFESSIONAL"),
  RequestValidator(sessions_validations.verify),
  sessions_controller.verify_booking_session
);
sessions_router.get(
  "/my-upcoming-session",
  auth("STUDENT", "PROFESSIONAL"),
  sessions_controller.get_my_upcoming_sessions
);

export default sessions_router;
