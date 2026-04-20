import { Router } from "express";
import auth from "../../middlewares/auth";
import { tracking_controller } from "./tracking.controller";

const tracking_router = Router();

tracking_router.get(
  "/get-leaderboard",
  auth("STUDENT", "PROFESSIONAL"),
  tracking_controller.get_student_and_professional_leaderboard
);
tracking_router.get(
  "/get-performance",
  auth("STUDENT", "PROFESSIONAL"),
  tracking_controller.get_my_performance
);
tracking_router.get(
  "/get-highlights-content-of-this-week",
  auth("STUDENT", "PROFESSIONAL"),
  tracking_controller.get_all_highlights_content_of_this_week
);
tracking_router.get(
  "/daily-challenge",
  auth("STUDENT", "PROFESSIONAL"),
  tracking_controller.get_my_daily_challenge_content
);
tracking_router.put(
  "/daily-challenge/status",
  auth("STUDENT", "PROFESSIONAL"),
  tracking_controller.update_daily_challenge_content_status
);

export default tracking_router;
