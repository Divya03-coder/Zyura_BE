import { z } from "zod";

const optionEnum = z.enum(["A", "B", "C", "D"]);
const mcqOptionEnum = z.enum(["A", "B", "C", "D", "E", "F"]);

const OptionZod = z.object({
    optionName: optionEnum,
    optionValue: z.string(),
    supportingEvidence: z.array(z.string()).optional().default([]),
    refutingEvidence: z.array(z.string()).optional().default([]),
});

const LaboratoryResultZod = z.object({
    name: z.string(),
    value: z.string(),
});

const DiagnosisQuestionZod = z.object({
    question: z.string().optional().default(""),
    diagnosisOptions: z.array(OptionZod).optional().default([]),
});

const CorrectOptionZod = z.object({
    optionName: optionEnum,
    explanation: z.string(),
}).optional();

const MCQOptionZod = z.object({
    option: mcqOptionEnum,
    optionText: z.string(),
    explanation: z.string().optional(),
});

const MCQZod = z.object({
    question: z.string(),
    options: z.array(MCQOptionZod).min(2),
    correctOption: mcqOptionEnum,
});

const create = z.object({
    caseTitle: z.string(),
    patientPresentation: z.string(),
    historyOfPresentIllness: z.string(),
    physicalExamination: z.string(),
    laboratoryResults: z.array(LaboratoryResultZod).optional(),
    imaging: z.string(),
    diagnosisQuestion: DiagnosisQuestionZod,
    correctOption: CorrectOptionZod,
    difficultyLevel: z.enum(["Basic", "Intermediate", "Advance"]),
    mcqs: z.array(MCQZod).optional(),
    subject: z.string(),
    system: z.string(),
    topic: z.string(),
    subtopic: z.string().optional(),
    contentFor: z.enum(["student", "professional"]),
    profileType: z.string()
});
const update = z.object({
    caseTitle: z.string().optional(),
    patientPresentation: z.string().optional(),
    historyOfPresentIllness: z.string().optional(),
    physicalExamination: z.string().optional(),
    laboratoryResults: z.array(LaboratoryResultZod).optional(),
    imaging: z.string().optional(),
    diagnosisQuestion: DiagnosisQuestionZod,
    correctOption: CorrectOptionZod,
    difficultyLevel: z.enum(["Basic", "Intermediate", "Advance"]),
    mcqs: z.array(MCQZod).optional(),
    subject: z.string().optional(),
    system: z.string().optional(),
    topic: z.string().optional(),
    subtopic: z.string().optional(),
    contentFor: z.enum(["student", "professional"]),
    profileType: z.string()
});

export const clinical_case_validations = {
    create,
    update
};