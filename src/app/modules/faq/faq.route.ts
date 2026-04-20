import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { faq_controller } from "./faq.controller";
import { faq_validations } from "./faq.validation";

const faq_router = Router();

faq_router.post(
  "/",
  auth("ADMIN"),
  RequestValidator(faq_validations.create),
  faq_controller.create_new_faq
);
faq_router.get(
  "/",
  faq_controller.get_all_faqs
);
faq_router.get(
  "/:id",
  faq_controller.get_single_faq
);
faq_router.put(
  "/:id",
  auth("ADMIN"),
  RequestValidator(faq_validations.update),
  faq_controller.update_faq
);
faq_router.delete(
  "/:id",
  auth("ADMIN"),
  faq_controller.delete_faq
);

export default faq_router;
