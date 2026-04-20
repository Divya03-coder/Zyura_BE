import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import uploader from "../../middlewares/uploader";
import { group_message_controller } from "./group_message.controller";
import { group_message_validations } from "./group_message.validation";

const group_message_router = Router();

group_message_router.post(
  "/send-message",
  auth("ADMIN", "MENTOR", "PROFESSIONAL", "STUDENT"),
  uploader.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next();
  },
  RequestValidator(group_message_validations.create),
  group_message_controller.create_new_group_message
);
group_message_router.get(
  "/get-message/:groupId",
  auth("ADMIN", "MENTOR", "PROFESSIONAL", "STUDENT"),
  group_message_controller.get_all_group_messages_from_db
);
group_message_router.get(
  "/update-reaction/:messageId",
  auth("ADMIN", "MENTOR", "PROFESSIONAL", "STUDENT"),
  group_message_controller.update_reaction_on_message_into_db
);

export default group_message_router;
