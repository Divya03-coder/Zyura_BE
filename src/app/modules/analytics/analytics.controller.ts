import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { analytics_service } from "./analytics.service";

const update_view_count_all_content = catchAsync(async (req, res) => {
  const result = await analytics_service.update_view_count_all_content_into_db(
    req
  );
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "View count updated successfully!",
    data: result,
  });
});

export const analytics_controller = {
  update_view_count_all_content,
};
