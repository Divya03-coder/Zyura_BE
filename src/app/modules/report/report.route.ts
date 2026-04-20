import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { report_controller } from "./report.controller";
import { report_validations } from "./report.validation";

const report_router = Router();

report_router.get(
  "/all-admin",
  auth("ADMIN"),
  report_controller.get_all_report_for_admin
);
report_router.get(
  "/all-reporter",
  auth("MENTOR", "STUDENT", "PROFESSIONAL"),
  report_controller.get_all_report_for_reporter
);
report_router.patch(
  "/update-status/:reportId",
  auth("ADMIN"),
  RequestValidator(report_validations.status),
  report_controller.update_report_status
);
report_router.delete(
  "/delete/:reportId",
  auth("ADMIN"),
  report_controller.delete_report
);
export default report_router;
