import catchAsync from "../../utils/catch_async";
import { exam_service } from "./exam.service";

// for student
const upload_new_student_exam_with_bulk_mcq = catchAsync(async (req, res, next) => {
  const result = await exam_service.upload_new_student_exam_with_bulk_mcq_into_db(req);
  res.status(201).json({
    success: true,
    message: "Exam created successfully",
    data: result
  });
})
const upload_new_student_exam_with_manual_mcq = catchAsync(async (req, res, next) => {
  const result = await exam_service.upload_new_student_exam_with_manual_mcq_into_db(req);
  res.status(201).json({
    success: true,
    message: "Exam created successfully",
    data: result
  });
})
const get_all_student_exam = catchAsync(async (req, res, next) => {
  const result = await exam_service.get_all_student_exam_from_db(req);
  res.status(200).json({
    success: true,
    message: "Exam fetched successfully",
    data: result
  });
})
const get_single_student_exam = catchAsync(async (req, res, next) => {
  const result = await exam_service.get_single_student_exam_from_db(req);
  res.status(200).json({
    success: true,
    message: "Exam fetched successfully",
    data: result
  });
})
const update_student_exam = catchAsync(async (req, res, next) => {
  const result = await exam_service.update_student_exam_into_db(req);
  res.status(200).json({
    success: true,
    message: "Exam updated successfully",
    data: result
  });
})
const update_student_exam_specific_mcq = catchAsync(async (req, res, next) => {
  const result = await exam_service.update_student_exam_specific_mcq_into_db(req);
  res.status(200).json({
    success: true,
    message: "Exam updated successfully",
    data: result
  });
})
const delete_student_exam = catchAsync(async (req, res, next) => {
  const result = await exam_service.delete_student_exam_from_db(req);
  res.status(200).json({
    success: true,
    message: "Exam deleted successfully",
    data: result
  });
})
const add_more_mcq_into_student_exam = catchAsync(async (req, res, next) => {
  const result = await exam_service.add_more_mcq_into_student_exam_into_db(req);
  res.status(200).json({
    success: true,
    message: "Exam updated successfully",
    data: result
  });
})
const delete_specific_mcq_from_student = catchAsync(async (req, res, next) => {
  const result = await exam_service.delete_specific_mcq_from_student_exam_from_db(req);
  res.status(200).json({
    success: true,
    message: "Exam updated successfully",
    data: result
  });
})


// for professional
const upload_new_professional_exam_with_bulk_mcq = catchAsync(async (req, res, next) => {
  const result = await exam_service.upload_new_professional_exam_with_bulk_mcq_into_db(req);
  res.status(201).json({
    success: true,
    message: "Exam created successfully",
    data: result
  });
})
const upload_new_professional_exam_with_manual_mcq = catchAsync(async (req, res, next) => {
  const result = await exam_service.upload_new_professional_exam_with_manual_mcq_into_db(req);
  res.status(201).json({
    success: true,
    message: "Exam created successfully",
    data: result
  });
})
const get_all_professional_exam = catchAsync(async (req, res, next) => {
  const result = await exam_service.get_all_professional_exam_from_db(req);
  res.status(200).json({
    success: true,
    message: "Exam fetched successfully",
    data: result
  });
})
const get_single_professional_exam = catchAsync(async (req, res, next) => {
  const result = await exam_service.get_single_professional_exam_from_db(req);
  res.status(200).json({
    success: true,
    message: "Exam fetched successfully",
    data: result
  });
})
const update_professional_exam = catchAsync(async (req, res, next) => {
  const result = await exam_service.update_professional_exam_into_db(req);
  res.status(200).json({
    success: true,
    message: "Exam updated successfully",
    data: result
  });
})
const update_professional_exam_specific_mcq = catchAsync(async (req, res, next) => {
  const result = await exam_service.update_professional_exam_specific_mcq_into_db(req);
  res.status(200).json({
    success: true,
    message: "Exam updated successfully",
    data: result
  });
})
const delete_professional_exam = catchAsync(async (req, res, next) => {
  const result = await exam_service.delete_professional_exam_from_db(req);
  res.status(200).json({
    success: true,
    message: "Exam deleted successfully",
    data: result
  });
})
const add_more_mcq_into_professional_exam = catchAsync(async (req, res, next) => {
  const result = await exam_service.add_more_mcq_into_professional_exam_into_db(req);
  res.status(200).json({
    success: true,
    message: "Exam updated successfully",
    data: result
  });
})
const delete_specific_mcq_from_professional_exam = catchAsync(async (req, res, next) => {
  const result = await exam_service.delete_specific_mcq_from_professional_exam_from_db(req);
  res.status(200).json({
    success: true,
    message: "Exam updated successfully",
    data: result
  });
})


export const exam_controller = {
  // for student
  upload_new_student_exam_with_bulk_mcq,
  upload_new_student_exam_with_manual_mcq,
  get_all_student_exam,
  get_single_student_exam,
  update_student_exam,
  update_student_exam_specific_mcq,
  delete_student_exam,
  add_more_mcq_into_student_exam,
  delete_specific_mcq_from_student,


  // for professional
  upload_new_professional_exam_with_bulk_mcq,
  upload_new_professional_exam_with_manual_mcq,
  get_all_professional_exam,
  get_single_professional_exam,
  update_professional_exam,
  update_professional_exam_specific_mcq,
  delete_professional_exam,
  add_more_mcq_into_professional_exam,
  delete_specific_mcq_from_professional_exam,
};
