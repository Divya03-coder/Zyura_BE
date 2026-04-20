export type T_Osce = {
    name: string;
    description: string;
    scenario: string;
    timeLimit: string;
    candidateInstruction: string;
    patientInstruction: string;

    tasks: {
        taskName: string;
        checklistItem: string[];
    }[];

    tutorial: string[];

    learningResource: {
        resourceTitle: string;
        resourceUrl: string;
    }


    subject: string;
    system: string;
    topic: string;
    subtopic?: string;
    contentFor: "student" | "professional";
    profileType: string;
    viewCount: number;
}
