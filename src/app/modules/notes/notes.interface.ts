export type T_Notes = {
    title: string,
    subject: string,
    description?: string,
    system: string,
    topic: string,
    subtopic: string,
    contentFor: "student" | "professional",
    profileType: string,
    uploadedBy: string,
    notes: {
        fileId: string;
        fileType: string;
        fileName: string;
        fileUrl: string;
    }[]
    downloadCount?: number
}
