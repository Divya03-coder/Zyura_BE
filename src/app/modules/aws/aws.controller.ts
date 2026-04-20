import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { aws_service } from "./aws.service";

const create_new_aws = catchAsync(async (req, res) => {
  const result = await aws_service.create_new_aws_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Image uploaded successfully!",
    data: result,
  });
});

export const aws_controller = { create_new_aws };
