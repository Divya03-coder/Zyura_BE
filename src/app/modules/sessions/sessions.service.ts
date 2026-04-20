import axios from "axios";
import { Request } from "express";
import { AppError } from "../../utils/app_error";
import {
  checkoutConfig,
  getApiEndpoint,
  getAuthHeader,
} from "../payment/payment.config";
import { T_Sessions } from "./sessions.interface";
import { sessions_model } from "./sessions.schema";

const book_a_session_with_mentor_into_db = async (req: Request) => {
  const endpoint = getApiEndpoint("/session");
  const accountId = req?.user?.accountId as any;
  const payload: T_Sessions = req?.body;

  const orderId = `INVOICE-${Date.now()}`;
  const paymentPayload = {
    id: orderId,
    amount: String(payload?.sessionValue),
    currency: "USD",
    description: "Session Booking",
  };
  const afsBody = {
    apiOperation: "INITIATE_CHECKOUT",
    checkoutMode: "WEBSITE",
    interaction: {
      operation: "PURCHASE",
      returnUrl: checkoutConfig.returnUrl + `?paymentId=${orderId}`,
      merchant: {
        name: checkoutConfig.merchantName,
        url: checkoutConfig.merchantUrl,
      },
    },
    order: paymentPayload,
  };

  const response = await axios.post(endpoint, afsBody, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
  });

  payload.studentAccountId = accountId;
  payload.paymentId = orderId;
  payload.sessionId = response?.data?.session?.id;
  payload.successIndicator = response?.data?.successIndicator;
  payload.studentSidePaymentStatus = "PENDING";
  payload.adminToMentorPaymentStatus = "PENDING";
  await sessions_model.create(payload);

  return {
    paymentId: orderId,
    sessionId: response?.data?.session?.id,
    successIndicator: response?.data?.successIndicator,
  };
};

// make a booking verification function
const verify_booking_session_from_db = async (req: Request) => {
  const paymentId = req?.body?.paymentId;
  const isSessionExist = await sessions_model.findOne({ paymentId });

  if (!isSessionExist) {
    throw new AppError("Session not found", 404);
  }
  const endpoint = getApiEndpoint(`/order/${paymentId}`);

  const response = await axios.get(endpoint, {
    headers: {
      Authorization: getAuthHeader(),
    },
  });
  if (response?.data?.status === "CAPTURED") {
    await sessions_model.updateOne(
      { paymentId },
      {
        $set: {
          studentSidePaymentStatus: "SUCCESS",
          transactionId: response?.data?.authentication?.["3ds"]?.transactionId,
        },
      }
    );
  } else {
    await sessions_model.updateOne(
      { paymentId },
      {
        $set: {
          status: "FAILED",
        },
      }
    );
  }
  return {
    transactionId: response?.data?.authentication?.["3ds"]?.transactionId,
  };
};

const get_my_upcoming_sessions_from_db = async (req: Request) => {
  const accountId = req?.user?.accountId as any;
  const result = await sessions_model
    .find({ studentAccountId: accountId, sessionStatus: "UPCOMING" })
    .lean();
  return result;
};

export const sessions_service = {
  book_a_session_with_mentor_into_db,
  verify_booking_session_from_db,
  get_my_upcoming_sessions_from_db,
};
