import { z } from "zod";


export const SelectedSubjectZod = z.object({
    subjectName: z.string(),
    systemNames: z.array(z.string()),
});

const create = z.object({
    goalName: z.string(),
    studyHoursPerDay: z
        .number()
        .min(0),
    startDate: z.string(),
    endDate: z.string(),
    selectedSubjects: z
        .array(SelectedSubjectZod)
});

const update = z.object({
    goalName: z.string().optional(),
    studyHoursPerDay: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    selectedSubjects: z.array(SelectedSubjectZod).optional()
});


export const goal_validations = { create, update };
