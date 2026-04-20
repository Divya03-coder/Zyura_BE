import { Router } from "express";
import auth from "../../middlewares/auth";
import { study_planner_controller } from "./study_planner.controller";

const study_planner_router = Router();

study_planner_router.get(
  "/all",
  auth("STUDENT", "PROFESSIONAL"),
  study_planner_controller.get_all_study_plan
);
study_planner_router.put(
  "/save-progress",
  auth("STUDENT", "PROFESSIONAL"),
  study_planner_controller.save_study_plan_progress
);
study_planner_router.put(
  "/cancel/:planId",
  auth("STUDENT", "PROFESSIONAL"),
  study_planner_controller.cancel_study_plan
);
study_planner_router.delete(
  "/delete/:planId",
  auth("STUDENT", "PROFESSIONAL"),
  study_planner_controller.delete_study_plan
);

export default study_planner_router;
