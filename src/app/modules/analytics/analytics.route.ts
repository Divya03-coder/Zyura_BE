import { Router } from "express";
import RequestValidator from "../../middlewares/request_validator";
import { analytics_controller } from "./analytics.controller";
import { analytics_validations } from "./analytics.validation";

const analytics_router = Router();

analytics_router.put(
  "/update-view-count",
  RequestValidator(analytics_validations.updateViewCount),
  analytics_controller.update_view_count_all_content
);

export default analytics_router;
