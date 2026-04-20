type TOption = {
    optionName: 'A' | 'B' | 'C' | 'D';
    optionValue: string;
    supportingEvidence: string[];
    refutingEvidence: string[];
}

export interface TClinicalCase {
    caseTitle: string;
    patientPresentation: string;
    historyOfPresentIllness: string;
    physicalExamination: string;
    laboratoryResults: {
        name: string;
        value: string;
    }[];
    imaging: string;
    diagnosisQuestion: {
        question: string;
        diagnosisOptions: TOption[];
    }
    correctOption: {
        optionName: 'A' | 'B' | 'C' | 'D';
        explanation: string;
    }
    difficultyLevel: 'Basic' | 'Intermediate' | 'Advance';
    mcqs: {
        question: string;
        options: {
            option: "A" | "B" | "C" | "D" | "E" | "F";
            optionText: string;
            explanation?: string;
        }[];
        correctOption: "A" | "B" | "C" | "D" | "E" | "F";
    }[]
    subject: string,
    system: string,
    topic: string,
    subtopic?: string,
    contentFor: "student" | "professional",
    profileType: string,
    viewCount?: number
}

