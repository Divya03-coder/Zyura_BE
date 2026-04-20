import { Request } from "express";
import uploadCloud from "../../utils/cloudinary";
import { McqBankModel } from "../mcq_bank/mcq_bank.schema";
import { Student_Model } from "../student/student.schema";
import { T_Mentor } from "./mentor.interface";
import { mentor_model } from "./mentor.schema";

const earningsChart = [
  { year: "2025", month: "Jan", amount: 1200 },
  { year: "2025", month: "Feb", amount: 1800 },
  { year: "2025", month: "Mar", amount: 2400 },
  { year: "2025", month: "Apr", amount: 2100 },
  { year: "2025", month: "May", amount: 3200 },
  { year: "2025", month: "Jun", amount: 2900 },
  { year: "2025", month: "Jul", amount: 3500 },
  { year: "2025", month: "Aug", amount: 3300 },
  { year: "2025", month: "Sep", amount: 4000 },
  { year: "2025", month: "Oct", amount: 4500 },
  { year: "2025", month: "Nov", amount: 4800 },
  { year: "2025", month: "Dec", amount: 5200 },
];

const transactions = [
  {
    _id: "1",
    createdAt: new Date(),
    amount: 100,
    sessionTitle: "Session 2",
    studentName: "John Doe",
    status: "Complete",
  },
  {
    _id: "2",
    createdAt: new Date(),
    amount: 100,
    sessionTitle: "Session 2",
    studentName: "John Doe",
    status: "Pending",
  },
  {
    _id: "3",
    createdAt: new Date(),
    amount: 100,
    sessionTitle: "Session 2",
    studentName: "John Doe",
    status: "Complete",
  },
];

const upload_document_into_db_for_mentor = async (req: Request) => {
  const accountId = req?.user?.accountId;
  const profile_photo = (req.files as any)?.profile_photo?.[0];
  const degree = (req.files as any)?.degree?.[0];
  const identity_card = (req.files as any)?.identity_card?.[0];
  const certificate = (req.files as any)?.certificate?.[0];
  const payload: Partial<T_Mentor> = {};
  if (profile_photo) {
    const pRes = await uploadCloud(profile_photo);
    payload.profile_photo = pRes?.secure_url;
  }
  if (degree) {
    const dRes = await uploadCloud(degree);
    payload.degree = dRes?.secure_url;
  }
  if (identity_card) {
    const iRes = await uploadCloud(identity_card);
    payload.identity_card = iRes?.secure_url;
  }
  if (certificate) {
    const cRes = await uploadCloud(certificate);
    payload.certificate = cRes?.secure_url;
  }

  const result = await mentor_model.findOneAndUpdate({ accountId }, payload, {
    new: true,
  });
  return result;
};

const update_other_information_into_db = async (req: Request) => {
  const accountId = req?.user?.accountId;
  const payload: Partial<T_Mentor> = req?.body;
  const result = await mentor_model.findOneAndUpdate({ accountId }, payload, {
    new: true,
  });
  return result;
};

const update_payment_information_mentor_into_db = async (req: Request) => {
  const accountId = req?.user?.accountId;
  const payload: Partial<T_Mentor> = req?.body;
  const result = await mentor_model.findOneAndUpdate({ accountId }, payload, {
    new: true,
  });
  return result;
};

// dashboard content
const get_all_mentor_dashboard_overview_from_db = async (req: Request) => {
  // find all student and mcqBank
  const [totalStudent, totalQuestionBank] = await Promise.all([
    await Student_Model.countDocuments(),
    await McqBankModel.countDocuments(),
  ]);

  const overview = {
    questionBank: totalQuestionBank,
    totalQuestion: 0,
    totalStudent: totalStudent,
    liveClasses: 0,
  };

  return { overview, earningsChart, toDayClasses: [] };
};

const get_mentor_earnings_from_db = async (req: Request) => {
  const totalEarning = earningsChart.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const pendingPayout = 500;

  return {
    overview: {
      totalEarning,
      pendingPayout,
    },
    earningsChart,
    transactions,
  };
};

const get_mentor_all_transaction_from_db = async (req: Request) => {
  const {
    status,
    page = "1",
    limit = "10",
  } = req?.query as Record<string, any>;
  const pageInt = Number(page);
  const limitInt = Number(limit);

  let result;
  if (status == "Complete") {
    result = transactions.filter(
      (transaction) => transaction.status == "Complete"
    );
  } else if (status == "Pending") {
    result = transactions.filter(
      (transaction) => transaction.status == "Pending"
    );
  } else {
    result = transactions;
  }
  return {
    data: result,
    meta: {
      page: pageInt,
      limit: limitInt,
      totalPage: Math.ceil(result.length / limitInt),
      total: result.length,
    },
  };
};

export const mentor_service = {
  upload_document_into_db_for_mentor,
  update_other_information_into_db,
  update_payment_information_mentor_into_db,
  get_all_mentor_dashboard_overview_from_db,
  get_mentor_earnings_from_db,
  get_mentor_all_transaction_from_db
};
