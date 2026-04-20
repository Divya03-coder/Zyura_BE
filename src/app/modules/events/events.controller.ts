import httpStatus from "http-status";
import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { events_service } from "./events.service";

// ---------------------
// CREATE
// ---------------------
const create_new_events = catchAsync(async (req, res) => {
  const result = await events_service.create_new_events_into_db(req);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New event created successfully!",
    data: result,
  });
});

// ---------------------
// GET ALL (pagination + search)
// ---------------------
const get_all_events = catchAsync(async (req, res) => {
  const result = await events_service.get_all_events_from_db(req);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Events fetched successfully!",
    meta: result.meta,
    data: result.result,
  });
});

// ---------------------
// GET SINGLE
// ---------------------
const get_single_event = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await events_service.get_single_event_from_db(id as string);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single event fetched successfully!",
    data: result,
  });
});

// ---------------------
// UPDATE
// ---------------------
const update_event = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await events_service.update_event_into_db(id as string, payload);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event updated successfully!",
    data: result,
  });
});

// ---------------------
// DELETE
// ---------------------
const delete_event = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await events_service.delete_event_from_db(id as string);

  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event deleted successfully!",
    data: result,
  });
});
const enroll_event = catchAsync(async (req, res) => {
  const result = await events_service.enroll_event_into_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event enrolled successfully!",
    data: result,
  });
});
const get_my_enrolled_events = catchAsync(async (req, res) => {
  const result = await events_service.get_my_enrolled_events_from_db(req);
  manageResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event fetched successfully!",
    data: result,
  });
});

export const events_controller = {
  create_new_events,
  get_all_events,
  get_single_event,
  update_event,
  delete_event,
  enroll_event,
  get_my_enrolled_events
};
