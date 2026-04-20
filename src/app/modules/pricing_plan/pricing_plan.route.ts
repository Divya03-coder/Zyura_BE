import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { pricing_plan_controller } from "./pricing_plan.controller";
import { pricing_plan_validations } from "./pricing_plan.validation";

const pricing_plan_router = Router();

pricing_plan_router.post(
  "/",
  auth("ADMIN"),
  RequestValidator(pricing_plan_validations.create),
  pricing_plan_controller.create_new_pricing_plan
);
pricing_plan_router.get(
  "/",
  pricing_plan_controller.get_all_pricing_plan
);

pricing_plan_router.get(
  "/:id",
  pricing_plan_controller.get_single_pricing_plan
);
pricing_plan_router.patch(
  "/:id",
  pricing_plan_controller.update_specific_pricing_plan
);

pricing_plan_router.delete(
  "/:id",
  pricing_plan_controller.delete_specific_pricing_plan
);


export default pricing_plan_router;
