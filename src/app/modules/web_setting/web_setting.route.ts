import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { web_setting_controller } from "./web_setting.controller";
import { web_setting_validations } from "./web_setting.validation";

const web_setting_router = Router();

web_setting_router.post(
  "/",
  auth("ADMIN"),
  RequestValidator(web_setting_validations.create),
  web_setting_controller.create_new_web_setting
);
web_setting_router.get(
  "/",
  web_setting_controller.get_web_setting
);

export default web_setting_router;
