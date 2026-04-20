import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { mentor_service } from "./mentor.service";

const upload_document_into_db = catchAsync(async (req, res) => {
  const result = await mentor_service.upload_document_into_db_for_mentor(req);
  manageResponse(res, {
    success: true,
    statusCode: 200,
    message: "Document uploaded successfully",
    data: result,
  });
});

const update_other_information = catchAsync(async (req, res) => {
  const result = await mentor_service.update_other_information_into_db(req);
  manageResponse(res, {
    success: true,
    statusCode: 200,
    message: "Other information updated successfully",
    data: result,
  });
});

const update_payment_information = catchAsync(async (req, res) => {
  const result = await mentor_service.update_payment_information_mentor_into_db(
    req
  );
  manageResponse(res, {
    success: true,
    statusCode: 200,
    message: "Payment information updated successfully",
    data: result,
  });
});
const get_all_mentor_dashboard_overview = catchAsync(async (req, res) => {
  const result = await mentor_service.get_all_mentor_dashboard_overview_from_db(
    req
  );
  manageResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard overview fetched",
    data: result,
  });
});
const get_mentor_earnings = catchAsync(async (req, res) => {
  const result = await mentor_service.get_mentor_earnings_from_db(req);
  manageResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard earning fetched",
    data: result,
  });
});
const get_mentor_all_transaction = catchAsync(async (req, res) => {
  const result = await mentor_service.get_mentor_all_transaction_from_db(req);
  manageResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard transaction fetched",
    data: result?.data,
    meta: result?.meta,
  });
});

export const mentor_controller = {
  upload_document_into_db,
  update_other_information,
  update_payment_information,
  get_all_mentor_dashboard_overview,
  get_mentor_earnings,
  get_mentor_all_transaction
};
