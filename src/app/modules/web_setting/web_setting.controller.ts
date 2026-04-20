import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { web_setting_service } from "./web_setting.service";

const create_new_web_setting = catchAsync(async (req, res) => {
  const result = await web_setting_service.create_new_web_setting_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New web_setting created successfully!",
    data: result,
  });
});
const get_web_setting = catchAsync(async (req, res) => {
  const result = await web_setting_service.get_web_setting_from_db();
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Web setting fetched successfully!",
    data: result,
  });
});

export const web_setting_controller = {
  create_new_web_setting,
  get_web_setting
};
