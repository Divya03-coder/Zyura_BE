import { z } from "zod";
import { mcqZodSchema } from "../mcq_bank/mcq_bank.validation";

const upload_for_student = z.object({
  profileType: z.string({ message: "profileType is required" }),
  examName: z.string({ message: "examName is required" }),
  subject: z.string({ message: "subject is required" }),
  totalTime: z.number({ message: "totalTime is required" }),
  mcqs: z.array(mcqZodSchema).optional()
})
const upload_for_professional = z.object({
  professionName: z.string({ message: "professionName is required" }),
  examName: z.string({ message: "examName is required" }),
  totalTime: z.number({ message: "totalTime is required" }),
  mcqs: z.array(mcqZodSchema).optional()
})

const add_more = z.object({
  mcqs: z.array(mcqZodSchema)
})

export const exam_validations = {
  upload_for_student,
  upload_for_professional,
  add_more
};
