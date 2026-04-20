import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { osce_controller } from "./osce.controller";
import { osce_validations } from "./osce.validation";

const osce_router = Router();

osce_router.post(
  "/create",
  auth("ADMIN"),
  RequestValidator(osce_validations.create),
  osce_controller.create_new_osce
);

osce_router.get("/", auth("ADMIN", "STUDENT"), osce_controller.get_all_osce);
osce_router.get("/:osceId", auth("ADMIN", "STUDENT"), osce_controller.get_single_osce);
osce_router.patch("/:osceId", auth("ADMIN"), RequestValidator(osce_validations.update), osce_controller.update_single_osce);
osce_router.delete("/:osceId", auth("ADMIN"), osce_controller.delete_single_osce);

export default osce_router;
