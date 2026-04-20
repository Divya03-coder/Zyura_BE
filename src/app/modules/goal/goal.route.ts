import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { goal_controller } from "./goal.controller";
import { goal_validations } from "./goal.validation";

const goal_router = Router();

goal_router.post(
  "/",
  auth("STUDENT", "PROFESSIONAL"),
  RequestValidator(goal_validations.create),
  goal_controller.create_new_goal
);
goal_router.get(
  "/",
  auth("STUDENT", "PROFESSIONAL"),
  goal_controller.get_goals_by_student_id
);
goal_router.put(
  "/",
  auth("STUDENT", "PROFESSIONAL"),
  RequestValidator(goal_validations.update),
  goal_controller.update_goal
);
goal_router.delete(
  "/",
  auth("STUDENT", "ADMIN", "PROFESSIONAL"),
  goal_controller.delete_goal
);
goal_router.put(
  "/update-progress-mcq-flashcard-clinicalcase",
  auth("STUDENT", "PROFESSIONAL"),
  goal_controller.update_goal_accuracy_and_progress_for_mcq_and_flashcard
);
goal_router.put(
  "/update-progress-osce",
  auth("STUDENT", "PROFESSIONAL"),
  goal_controller.update_goal_accuracy_and_progress_for_osce
);
goal_router.get(
  "/overview",
  auth("STUDENT", "PROFESSIONAL"),
  goal_controller.get_overview_for_student_and_professional
);

export default goal_router;
