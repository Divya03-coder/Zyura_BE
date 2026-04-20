import { Request } from "express";
import { report_model } from "./report.schema";

const get_all_report_from_db_for_admin = async (req: Request): Promise<any> => {
  const { page = "1", limit = "10", searchTerm = "", status = "" } = req.query;

  const pageNumber = parseInt(page as string);
  const pageSize = parseInt(limit as string);
  const skip = (pageNumber - 1) * pageSize;

  const filter: any = {};

  // Search
  if (searchTerm) {
    const regex = new RegExp(searchTerm as string, "i");

    filter.$or = [
      { name: { $regex: regex } },
      { "report.questionBankId": { $regex: regex } },
      { "report.mcqId": { $regex: regex } },
      { "report.text": { $regex: regex } }
    ];
  }

  // Status filter
  if (status) {
    filter.status = status;
  }

  const result = await report_model
    .find(filter)
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .lean();

  const total = await report_model.countDocuments(filter);

  const meta = {
    page: pageNumber,
    limit: pageSize,
    skip,
    total,
    totalPages: Math.ceil(total / pageSize),
  };

  return {
    data: result,
    meta,
  };
};

const get_all_report_for_reporter_from_db = async (req: Request): Promise<any> => {
  const accountId = req?.user?.accountId;
  const result = await report_model.find({ accountId }).lean();
  return result;
};

const update_report_status_on_db = async (req: Request): Promise<any> => {
  const { reportId } = req?.params;
  const { status, note = "" } = req?.body;
  const result = await report_model.findByIdAndUpdate(reportId, { status, note }, { new: true });
  return result;
};

const delete_report_from_db = async (reportId: string): Promise<any> => {
  const result = await report_model.findByIdAndDelete({ _id: reportId });
  return result;
};

export const report_service = {
  get_all_report_from_db_for_admin,
  get_all_report_for_reporter_from_db,
  update_report_status_on_db,
  delete_report_from_db
};
