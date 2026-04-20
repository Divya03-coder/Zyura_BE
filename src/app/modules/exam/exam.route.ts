import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import uploader from "../../middlewares/uploader";
import { exam_controller } from "./exam.controller";
import { exam_validations } from "./exam.validation";

const exam_router = Router();
// for student

exam_router.post(
  "/student/upload-exam-with-bulk-mcq",
  auth("ADMIN"),
  uploader.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next();
  },
  RequestValidator(exam_validations.upload_for_student),
  exam_controller.upload_new_student_exam_with_bulk_mcq
);
exam_router.post(
  "/student/upload-exam-with-manual-mcq",
  auth("ADMIN"),
  RequestValidator(exam_validations.upload_for_student),
  exam_controller.upload_new_student_exam_with_manual_mcq
);
exam_router.get(
  "/student/get-all-exam",
  auth("ADMIN", "STUDENT", "PROFESSIONAL"),
  exam_controller.get_all_student_exam
);
exam_router.get(
  "/student/get-single-exam/:id",
  auth("ADMIN", "STUDENT", "PROFESSIONAL"),
  exam_controller.get_single_student_exam
);
exam_router.put(
  "/student/update-exam/:id",
  auth("ADMIN"),
  exam_controller.update_student_exam
);
exam_router.put(
  "/student/update-mcq/:examId/:mcqId",
  auth("ADMIN"),
  exam_controller.update_student_exam_specific_mcq
);
exam_router.delete(
  "/student/delete-exam/:id",
  auth("ADMIN"),
  exam_controller.delete_student_exam
);
exam_router.put(
  "/student/add-more-mcq/:id",
  auth("ADMIN"),
  RequestValidator(exam_validations.add_more),
  exam_controller.add_more_mcq_into_student_exam
);
exam_router.delete(
  "/student/delete-specific-mcq/:examId/:mcqId",
  auth("ADMIN"),
  exam_controller.delete_specific_mcq_from_student
);


// for professional
exam_router.post(
  "/professional/upload-exam-with-bulk-mcq",
  auth("ADMIN"),
  uploader.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next();
  },
  RequestValidator(exam_validations.upload_for_professional),
  exam_controller.upload_new_professional_exam_with_bulk_mcq
);
exam_router.post(
  "/professional/upload-exam-with-manual-mcq",
  auth("ADMIN"),
  RequestValidator(exam_validations.upload_for_professional),
  exam_controller.upload_new_professional_exam_with_manual_mcq
);
exam_router.get(
  "/professional/get-all-exam",
  auth("ADMIN", "STUDENT", "PROFESSIONAL"),
  exam_controller.get_all_professional_exam
);
exam_router.get(
  "/professional/get-single-exam/:id",
  auth("ADMIN", "STUDENT", "PROFESSIONAL"),
  exam_controller.get_single_professional_exam
);
exam_router.put(
  "/professional/update-exam/:id",
  auth("ADMIN"),
  exam_controller.update_professional_exam
);
exam_router.put(
  "/professional/update-mcq/:examId/:mcqId",
  auth("ADMIN"),
  exam_controller.update_professional_exam_specific_mcq
);
exam_router.delete(
  "/professional/delete-exam/:id",
  auth("ADMIN"),
  exam_controller.delete_professional_exam
);

exam_router.put(
  "/professional/add-more-mcq/:id",
  auth("ADMIN"),
  RequestValidator(exam_validations.add_more),
  exam_controller.add_more_mcq_into_professional_exam
);
exam_router.delete(
  "/professional/delete-specific-mcq/:examId/:mcqId",
  auth("ADMIN"),
  exam_controller.delete_specific_mcq_from_professional_exam
);

exam_router.post(
  "/check-duplicate",
  auth("ADMIN"),
  exam_controller.checkDuplicateQuestionInExam
);

export default exam_router;
