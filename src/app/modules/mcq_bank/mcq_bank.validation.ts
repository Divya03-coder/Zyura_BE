import { z } from "zod";

export const optionZodSchema = z.object({
    option: z.enum(["A", "B", "C", "D", "E", "F"]),
    optionText: z.any().optional(),
    explanation: z.any().optional(),

});

export const mcqZodSchema = z.object({
    difficulty: z.enum(["Basic", "Intermediate", "Advance"]).optional(),
    question: z.string().min(1, "Question is required"),
    imageDescription: z.string().optional(),
    options: z
        .array(optionZodSchema)
        .min(2, "Each MCQ must have at least two options"),
    correctOption: z.enum(["A", "B", "C", "D", "E", "F"]),
    mcqId: z.string().optional(),
});

export const create = z.object({
    title: z.string().min(1, "Title is required"),
    subject: z.string().min(1, "Subject is required"),
    system: z.string().min(1, "System is required"),
    contentFor: z.enum(["student", "professional"]),
    profileType: z.string(),
    topic: z.string().min(1, "Topic is required"),
    subtopic: z.string().optional(),
    uploadedBy: z.string().optional(),
    mcqs: z.array(mcqZodSchema).nonempty("At least one MCQ is required"),
});


export const mcq_validation = {
    create
}
