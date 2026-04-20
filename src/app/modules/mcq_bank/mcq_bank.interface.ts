export type TMcqBank = {
    title: string,
    subject: string,
    system: string,
    topic: string,
    subtopic: string,
    contentFor: "student" | "professional",
    profileType: string,
    uploadedBy: string,
    mcqs: {
        mcqId: string,
        difficulty: "Basic" | "Intermediate" | "Advance";
        question: string;
        imageDescription?: string;
        options: {
            option: "A" | "B" | "C" | "D" | "E" | "F";
            optionText: string | number;
            explanation?: string | number;
        }[];
        correctOption: "A" | "B" | "C" | "D" | "E" | "F";
    }[];
    viewCount?: number
};
