import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { report_service } from "./report.service";

const get_all_report_for_admin = catchAsync(async (req, res) => {
  const result = await report_service.get_all_report_from_db_for_admin(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Report fetched successfully!",
    data: result?.data,
    meta: result?.meta,
  });
});
const get_all_report_for_reporter = catchAsync(async (req, res) => {
  const result = await report_service.get_all_report_for_reporter_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Report fetched successfully!",
    data: result
  });
});
const update_report_status = catchAsync(async (req, res) => {
  const result = await report_service.update_report_status_on_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Report status update successfully!",
    data: result
  });
});

const delete_report = catchAsync(async (req, res) => {
  const { reportId } = req.params;
  const result = await report_service.delete_report_from_db(reportId as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Report deleted successfully!",
    data: result,
  });
});
export const report_controller = {
  get_all_report_for_admin,
  get_all_report_for_reporter,
  update_report_status,
  delete_report
};
