import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { payment_controller } from "./payment.controller";
import { payment_validations } from "./payment.validation";
const payment_router = Router();

payment_router.post(
  "/initiate",
  auth("PROFESSIONAL", "STUDENT"),
  RequestValidator(payment_validations.create),
  payment_controller.initiatePayment
);
payment_router.post("/verify", payment_controller.verifyPayment);
payment_router.get(
  "/overview",
  auth("ADMIN"),
  payment_controller.get_transaction_overview_for_admin
);
payment_router.get(
  "/subscribers",
  auth("ADMIN"),
  payment_controller.get_all_subscribers_for_admin
);
payment_router.delete(
  "/subscriber/delete/:paymentId",
  auth("ADMIN"),
  payment_controller.delete_payment_history
);

export default payment_router;
