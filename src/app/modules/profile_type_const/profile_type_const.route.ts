import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { profile_type_const_controller } from "./profile_type_const.controller";
import { profile_type_const_validations } from "./profile_type_const.validation";

const profile_type_const_router = Router();

profile_type_const_router.post(
  "/create",
  auth("ADMIN"),
  RequestValidator(profile_type_const_validations.create),
  profile_type_const_controller.create_new_profile_type_const
);
profile_type_const_router.get("/all", profile_type_const_controller.get_all_profile_type_const);
profile_type_const_router.patch("/update/:typeId", auth("ADMIN"), RequestValidator(profile_type_const_validations.create), profile_type_const_controller.update_profile_type_const);
profile_type_const_router.delete("/delete/:typeId", auth("ADMIN"), profile_type_const_controller.delete_profile_type_const);


profile_type_const_router.post(
  "/professional/create",
  auth("ADMIN"),
  RequestValidator(profile_type_const_validations.create),
  profile_type_const_controller.create_new_professional_profile_type_const
);
profile_type_const_router.get("/professional/all", profile_type_const_controller.get_all_professional_profile_type_const);
profile_type_const_router.patch("/professional/update/:typeId", auth("ADMIN"), RequestValidator(profile_type_const_validations.create), profile_type_const_controller.update_professional_profile_type_const);
profile_type_const_router.delete("/professional/delete/:typeId", auth("ADMIN"), profile_type_const_controller.delete_professional_profile_type_const);


export default profile_type_const_router;
