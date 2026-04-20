import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import { events_controller } from "./events.controller";
import { events_validations } from "./events.validation";

const events_router = Router();

events_router.post(
  "/enroll",
  auth("STUDENT", "PROFESSIONAL"),
  RequestValidator(events_validations.eventEnrolledZodSchema),
  events_controller.enroll_event
);
events_router.get(
  "/my-events",
  auth("STUDENT", "PROFESSIONAL"),
  events_controller.get_my_enrolled_events
);

// CREATE new event
events_router.post(
  "/",
  auth("ADMIN", "MENTOR"),
  RequestValidator(events_validations.create),
  events_controller.create_new_events
);

// GET ALL events (pagination + search)
events_router.get(
  "/",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  events_controller.get_all_events
);

// GET SINGLE event by ID
events_router.get(
  "/:id",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  events_controller.get_single_event
);

// UPDATE event
events_router.patch(
  "/:id",
  auth("ADMIN", "MENTOR"),
  RequestValidator(events_validations.update),
  events_controller.update_event
);

// DELETE event
events_router.delete("/:id", auth("ADMIN"), events_controller.delete_event);

export default events_router;
