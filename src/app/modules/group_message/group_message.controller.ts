import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { group_message_service } from "./group_message.service";

const create_new_group_message = catchAsync(async (req, res) => {
  const result = await group_message_service.create_new_group_message_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Message sent successfully!",
    data: result,
  });
});
const get_all_group_messages_from_db = catchAsync(async (req, res) => {
  const result = await group_message_service.get_all_group_messages_from_db(req.params.groupId as string);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages fetched successfully!",
    data: result?.data,
    meta: result?.meta,
  });
});
const update_reaction_on_message_into_db = catchAsync(async (req, res) => {
  const result = await group_message_service.update_reaction_on_message_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reaction updated successfully!",
    data: result,
  });
});
export const group_message_controller = {
  create_new_group_message,
  get_all_group_messages_from_db,
  update_reaction_on_message_into_db
};
