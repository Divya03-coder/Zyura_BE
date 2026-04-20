import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import uploader from "../../middlewares/uploader";
import { group_controller } from "./group.controller";
import { group_validations } from "./group.validation";

const group_router = Router();

group_router.post(
  "/create-new-group",
  auth("ADMIN", "MENTOR", "PROFESSIONAL", "STUDENT"),
  RequestValidator(group_validations.create),
  group_controller.create_new_group
);
group_router.get(
  "/get-all-my-groups",
  auth("ADMIN", "MENTOR", "PROFESSIONAL", "STUDENT"),
  group_controller.get_all_my_joined_groups
);
group_router.put(
  "/update-my-group/:groupId",
  auth("ADMIN", "MENTOR", "PROFESSIONAL", "STUDENT"),
  uploader.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next();
  },
  RequestValidator(group_validations.update),
  group_controller.update_my_group
);
group_router.delete(
  "/delete-my-group/:groupId",
  auth("ADMIN", "MENTOR", "PROFESSIONAL", "STUDENT"),
  group_controller.delete_my_group
);
group_router.put(
  "/add-members-into-group/:groupId",
  auth("ADMIN", "MENTOR", "PROFESSIONAL", "STUDENT"),
  RequestValidator(group_validations.addMember),
  group_controller.add_members_into_group
);
group_router.put(
  "/remove-member-from-group/:groupId",
  auth("ADMIN", "MENTOR", "PROFESSIONAL", "STUDENT"),
  RequestValidator(group_validations.removeMember),
  group_controller.remove_member_from_group
);
group_router.get(
  "/get-all-community-member",
  group_controller.get_all_community_member
);

export default group_router;
