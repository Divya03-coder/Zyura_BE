import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { payment_services } from "./payment.service";

const initiatePayment = catchAsync(async (req, res) => {
  const result = await payment_services.createCheckoutSession(req);
  manageResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment initiated",
    data: result,
  });
});

// STEP 2: final verification
const verifyPayment = catchAsync(async (req, res) => {
  const result = await payment_services.retrieveOrder(req?.body?.paymentId);
  manageResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment verification success",
    data: result,
  });
});

const get_transaction_overview_for_admin = catchAsync(async (req, res) => {
  const result =
    await payment_services.get_transaction_overview_for_admin_from_db();
  manageResponse(res, {
    success: true,
    statusCode: 200,
    message: "Overview fetched success",
    data: result,
  });
});
const get_all_subscribers_for_admin = catchAsync(async (req, res) => {
  const result = await payment_services.get_all_subscribers_for_admin_from_db(
    req
  );
  manageResponse(res, {
    success: true,
    statusCode: 200,
    message: "Subscribers fetched success",
    data: result?.data,
    meta: result?.meta,
  });
});
const delete_payment_history = catchAsync(async (req, res) => {
  const result = await payment_services.delete_payment_history_from_db(
    req?.params?.paymentId as string
  );
  manageResponse(res, {
    success: true,
    statusCode: 200,
    message: "Subscribers delete success",
    data: result,
  });
});

export const payment_controller = {
  initiatePayment,
  verifyPayment,
  get_transaction_overview_for_admin,
  get_all_subscribers_for_admin,
  delete_payment_history,
};
