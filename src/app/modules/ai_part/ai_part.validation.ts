import { z } from "zod";

const ai_tutor = z.object({
    question: z.string(),
    thread_id: z.string().optional()
});

const study_planner = z.object({
    exam_name: z.string(),
    exam_date: z.string(),
    exam_type: z.string(),
    daily_study_time: z.number(),
    topics: z.array(
        z.object({
            subject: z.string(),
            system: z.string(),
            topic: z.string(),
            subtopic: z.string(),
        })
    ),
});

const create_mcq_with_drug_card = z.object({
    drug_name: z.string(),
});

const generate_mcq = z.object({
    quiz_name: z.string().optional(),
    subject: z.string().optional(),
    system: z.string().optional(),
    topic: z.string().optional(),
    sub_topic: z.string().optional(),
    question_type: z.string().optional(),
    question_count: z.any().optional(),
    difficulty_level: z.string().optional(),
    user_prompt: z.string().optional(),
    mcq_bank_id: z.string().optional()
});

const osce_mcq = z.object({
    patient_info: z.array(z.string()),
    present_complaint: z.array(z.string()),
    history_of_present_complaint: z.array(z.string()),
});

const create_clinical_case = z.object({
    prompt: z.string().optional()
});

export const ai_part_validations = {
    ai_tutor,
    study_planner,
    create_mcq_with_drug_card,
    generate_mcq,
    osce_mcq,
    create_clinical_case
};
