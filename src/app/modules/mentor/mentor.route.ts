import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import uploader from "../../middlewares/uploader";
import { mentor_controller } from "./mentor.controller";
import { mentor_validations } from "./mentor.validation";

const mentor_router = Router();

mentor_router.put(
  "/upload-document",
  auth("MENTOR", "STUDENT", "ADMIN"),
  uploader.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "degree", maxCount: 1 },
    { name: "identity_card", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  mentor_controller.upload_document_into_db
);

mentor_router.put(
  "/verify-profession",
  auth("MENTOR", "STUDENT", "ADMIN"),
  RequestValidator(mentor_validations.verify_profession),
  mentor_controller.update_other_information
);
mentor_router.put(
  "/update-payment-information",
  auth("MENTOR", "STUDENT", "ADMIN"),
  RequestValidator(mentor_validations.update_payment_information),
  mentor_controller.update_payment_information
);

// mentor dashboard
mentor_router.get(
  "/dashboard/overview",
  auth("MENTOR"),
  mentor_controller.get_all_mentor_dashboard_overview
);
mentor_router.get(
  "/dashboard/earnings",
  auth("MENTOR"),
  mentor_controller.get_mentor_earnings
);
mentor_router.get(
  "/dashboard/transaction",
  auth("MENTOR"),
  mentor_controller.get_mentor_all_transaction
);

export default mentor_router;
