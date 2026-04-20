import { Router } from "express";
import auth from '../../middlewares/auth';
import RequestValidator from "../../middlewares/request_validator";
import { study_mode_tree_controller } from "./study_mode_tree.controller";
import { content_management_admin_validations } from "./study_mode_tree.validation";

const study_mode_tree_router = Router();

study_mode_tree_router.post(
  "/create", auth("ADMIN"), RequestValidator(content_management_admin_validations.create), study_mode_tree_controller.create_new_content_management_admin
);
study_mode_tree_router.get("/all", auth("ADMIN", "STUDENT", "MENTOR", "PROFESSIONAL"), study_mode_tree_controller.get_all_content_management_admin);
study_mode_tree_router.get("/all-content", study_mode_tree_controller.get_all_content_from_tree)
study_mode_tree_router.patch("/update/:treeId", auth("ADMIN"), RequestValidator(content_management_admin_validations.update), study_mode_tree_controller.update_content_management_admin);
study_mode_tree_router.delete("/delete/:treeId", auth("ADMIN"), study_mode_tree_controller.delete_content_management_admin);


export default study_mode_tree_router;
