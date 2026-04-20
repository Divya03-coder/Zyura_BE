
export type TFlashCard = {
  title: string,
  subject: string,
  system: string,
  topic: string,
  subtopic: string,
  contentFor: "student" | "professional",
  profileType: string,
  uploadedBy: string,
  flashCards: {
    image?: string,
    flashCardId: string,
    frontText: string,
    backText: string,
    explanation: string,
    difficulty: "Basic" | "Intermediate" | "Advance"
  }[],
  viewCount: number
};