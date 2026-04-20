import { TClinicalCase } from "../clinical_case/clinical_case.interface";
import { TFlashCard } from "../flash_card/flash_card.interface";
import { TMcqBank } from "../mcq_bank/mcq_bank.interface";

export type T_MyContent_flashcard = TFlashCard & {
    studentId: string;
};
export type T_MyContent_mcq = TMcqBank & {
    studentId: string;
    tracking: {
        totalMcqCount: number,
        totalAttemptCount: number,
        correctMcqCount: number,
        wrongMcqCount: number,
        timeTaken: string,
        progress: number,
        correctPercentage: number,
        wrongPercentage: number,
        unattemptedPercentage: number,
        recommendedContent: {
            contentType: "MCQ" | "Flashcard" | "ClinicalCase" | "OSCE" | "Notes",
            title: string,
            contentId: string
        }[],
    },
    isCompleted: boolean
};
export type T_MyContent_clinicalCase = TClinicalCase & {
    studentId: string;
    tracking: {
        totalClinicalCaseCount: number,
        totalAttemptCount: number,
        correctClinicalCaseCount: number,
        wrongClinicalCaseCount: number,
        timeTaken: string,
        progress: number,
        correctPercentage: number,
        wrongPercentage: number,
        unattemptedPercentage: number,
        recommendedContent: {
            contentType: "MCQ" | "Flashcard" | "ClinicalCase" | "OSCE" | "Notes",
            title: string,
            contentId: string
        }[],
    },
    isCompleted: boolean
};

export type T_MyContent_notes = {
    title: string;
    subject: string;
    system: string;
    topic: string;
    subtopic: string;
    note: string;
    studentId: string;
};