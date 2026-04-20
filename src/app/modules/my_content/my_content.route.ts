import { Router } from "express";
import auth from "../../middlewares/auth";
import { my_content_controller } from "./my_content.controller";

const my_content_router = Router();

my_content_router.get(
  "/mcqs",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  my_content_controller.get_all_my_generated_mcq
);
my_content_router.get(
  "/mcqs/:id",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  my_content_controller.get_single_my_generated_mcq
);
my_content_router.get(
  "/flashcard",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  my_content_controller.get_all_my_generated_flashcard
);
my_content_router.get(
  "/flashcard/:id",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  my_content_controller.get_single_my_generated_flashcard
);
my_content_router.get(
  "/clinical-case",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  my_content_controller.get_all_my_generated_clinicalCase
);
my_content_router.get(
  "/clinical-case/:id",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  my_content_controller.get_single_my_generated_clinicalCase
);

my_content_router.put(
  "/update-tracking/:id",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  my_content_controller.update_tracking
);
my_content_router.get(
  "/notes",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  my_content_controller.get_all_my_generated_notes
);
my_content_router.get(
  "/notes/:id",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  my_content_controller.get_single_my_generated_notes
);
my_content_router.delete(
  "/delete/:id/:key",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  my_content_controller.delete_my_content
);
export default my_content_router;
