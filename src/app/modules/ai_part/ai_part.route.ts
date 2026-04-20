import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import uploader from "../../middlewares/uploader";
import { ai_part_controller } from "./ai_part.controller";
import { ai_part_validations } from "./ai_part.validation";

const ai_part_router = Router();

ai_part_router.post(
  "/ai-tutor",
  auth("STUDENT", "MENTOR", "PROFESSIONAL", "ADMIN"),
  RequestValidator(ai_part_validations.ai_tutor),
  ai_part_controller.chat_with_ai_tutor
);
ai_part_router.get(
  "/ai-tutor/history",
  auth("STUDENT", "MENTOR", "PROFESSIONAL", "ADMIN"),
  ai_part_controller.get_all_chat_history
);
ai_part_router.get(
  "/ai-tutor/thread-title",
  auth("STUDENT", "MENTOR", "PROFESSIONAL", "ADMIN"),
  ai_part_controller.get_all_chat_thread_title
);
ai_part_router.post(
  "/create-study-plan",
  auth("STUDENT", "MENTOR", "PROFESSIONAL", "ADMIN"),
  RequestValidator(ai_part_validations.study_planner),
  ai_part_controller.generate_new_study_plan
);
ai_part_router.post(
  "/generate-flashcard",
  auth("STUDENT", "MENTOR", "PROFESSIONAL", "ADMIN"),
  uploader.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next()
  },
  RequestValidator(ai_part_validations.generate_mcq),
  ai_part_controller.generate_flashcard
);
ai_part_router.post(
  "/generate-mcq",
  auth("STUDENT", "MENTOR", "PROFESSIONAL", "ADMIN"),
  RequestValidator(ai_part_validations.generate_mcq),
  ai_part_controller.generate_mcq
);

ai_part_router.post(
  "/create_clinical_case",
  auth("STUDENT", "MENTOR", "PROFESSIONAL", "ADMIN"),
  uploader.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next()
  },
  RequestValidator(ai_part_validations.create_clinical_case),
  ai_part_controller.generate_clinical_case
);
ai_part_router.get(
  "/content-suggestion",
  ai_part_controller.get_all_content_title_suggestion
);
ai_part_router.post(
  "/mcq_generator_with_file",
  auth("STUDENT", "MENTOR", "PROFESSIONAL", "ADMIN"),
  uploader.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next()
  },
  ai_part_controller.mcq_generator
);
ai_part_router.post(
  "/generate-note",
  auth("STUDENT", "MENTOR", "PROFESSIONAL", "ADMIN"),
  uploader.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next()
  },
  ai_part_controller.generate_note
);
ai_part_router.post(
  "/generate-recommendation/:contentId",
  auth("STUDENT", "PROFESSIONAL",),
  ai_part_controller.generate_recommendation
);

export default ai_part_router;
