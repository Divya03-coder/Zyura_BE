import axios from "axios";
import { Request } from "express";
import { Types } from "mongoose";
import { AppError } from "../../utils/app_error";
import { Account_Model } from "../auth/auth.schema";
import { pricing_plan_model } from "../pricing_plan/pricing_plan.schema";
import {
  checkoutConfig,
  getApiEndpoint,
  getAuthHeader,
} from "./payment.config";
import { T_Payment } from "./payment.interface";
import { payment_model } from "./payment.schema";

export interface OrderPayload {
  id: string;
  amount: string;
  currency: string;
  description: string;
}

// Create checkout session
const createCheckoutSession = async (req: Request) => {
  const accountId = req?.user?.accountId;
  const planId = req?.body?.planId;
  const orderId = `ORDER-${Date.now()}`;
  const endpoint = getApiEndpoint("/session");

  // find plan
  const isPlanExist = await pricing_plan_model.findById(planId).lean();
  if (!isPlanExist) {
    throw new AppError("Plan not found", 404);
  }
  const paymentPayload: OrderPayload = {
    id: orderId,
    amount: String(isPlanExist?.price),
    currency: "USD",
    description: isPlanExist?.planName,
  };

  const body = {
    apiOperation: "INITIATE_CHECKOUT",
    checkoutMode: "WEBSITE",
    interaction: {
      operation: "PURCHASE",
      returnUrl: checkoutConfig.returnUrl+`?paymentId=${orderId}`,
      merchant: {
        name: checkoutConfig.merchantName,
        url: checkoutConfig.merchantUrl,
      },
    },
    order: paymentPayload,
  };

  const response = await axios.post(endpoint, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
  });
  const transactionPayload: Partial<T_Payment> = {
    accountId: new Types.ObjectId(accountId),
    planId,
    paymentId: orderId,
    sessionId: response?.data?.session?.id,
    successIndicator: response?.data?.successIndicator,
    amount: isPlanExist?.price,
    currency: "USD",
    status: "PENDING",
    checkoutMode: response?.data?.checkoutMode,
  };
  await payment_model.create(transactionPayload);
  return {
    paymentId: orderId,
    sessionId: response?.data?.session?.id,
    successIndicator: response?.data?.successIndicator,
  };
};

// Retrieve order details (FINAL truth)
const retrieveOrder = async (orderId: string) => {
  const isOrderExist = (await payment_model
    .findOne({ paymentId: orderId })
    .populate("planId")
    .lean()) as any;

  if (!isOrderExist) {
    throw new AppError("Order not found", 404);
  }
  const endpoint = getApiEndpoint(`/order/${orderId}`);

  const response = await axios.get(endpoint, {
    headers: {
      Authorization: getAuthHeader(),
    },
  });
  if (response?.data?.status === "CAPTURED") {
    await payment_model.updateOne(
      { paymentId: orderId },
      {
        $set: {
          status: "SUCCESS",
          transactionId: response?.data?.authentication?.["3ds"]?.transactionId,
        },
      }
    );
    await Account_Model.findOneAndUpdate(
      { _id: isOrderExist.accountId },
      {
        isSubscriptionActive: true,
        planId: isOrderExist.planId,
        aiCredit: isOrderExist?.planId?.aiCredit || 10,
      }
    );
  } else {
    await payment_model.updateOne(
      { paymentId: orderId },
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

const get_transaction_overview_for_admin_from_db = async () => {
  const [totalRevenue, activeSubscribers, thisMonthSubscribers] =
    await Promise.all([
      payment_model.aggregate([
        {
          $match: {
            status: "SUCCESS",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
          },
        },
      ]),
      Account_Model.countDocuments({ isSubscriptionActive: true }),
      Account_Model.countDocuments({
        isSubscriptionActive: true,
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      }),
    ]);

  return {
    totalRevenue: totalRevenue[0]?.totalRevenue || 0,
    activeSubscribers,
    thisMonthSubscribers,
  };
};

const get_all_subscribers_for_admin_from_db = async (req: Request) => {
  const { page = "1", limit = "10" } = req.query as Record<string, string>;
  const skip = (Number(page) - 1) * Number(limit);

  const subscribers = await payment_model
    .find()
    .populate([
      {
        path: "accountId",
        select: "email profile_id profile_type", // include profile_type!
        populate: {
          path: "profile_id",
          select: "firstName lastName phoneNumber", // fields from profile collection
        },
      },
      {
        path: "planId",
        select: "planName price",
      },
    ])
    .skip(skip)
    .limit(Number(limit))
    .lean()
    .sort({ createdAt: -1 });
  const total = await payment_model.countDocuments();

  return {
    data: subscribers,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const delete_payment_history_from_db = async (paymentId: string) => {
  const isPaymentExist = (await payment_model
    .findById(paymentId)
    .populate("accountId")
    .lean()) as any;
  if (!isPaymentExist) {
    throw new AppError("Payment not found!!", 404);
  }
  if (isPaymentExist?.accountId?.isSubscriptionActive) {
    throw new AppError("Subscription is active, you cannot delete!!", 400);
  }
  if (isPaymentExist.status === "SUCCESS") {
    throw new AppError("Payment already processed , you cannot delete!!", 400);
  }
  await Account_Model.findOneAndUpdate(
    { _id: isPaymentExist.accountId },
    {
      isSubscriptionActive: false,
      planId: null,
      aiCredit: 0,
    }
  );
  const result = await payment_model.findByIdAndDelete(paymentId);
  return result;
};

export const payment_services = {
  createCheckoutSession,
  retrieveOrder,
  get_transaction_overview_for_admin_from_db,
  get_all_subscribers_for_admin_from_db,
  delete_payment_history_from_db,
};
