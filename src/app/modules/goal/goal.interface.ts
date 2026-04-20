import { Types } from "mongoose";

export type T_Goal = {
  goalName: string;
  studyHoursPerDay: number;
  startDate: string;
  endDate: string;
  selectedSubjects: {
    subjectName: string;
    systemNames: string[];
  }[];
  studentId: string;
  goalStatus: "EXPIRED" | "IN_PROGRESS" | "COMPLETED";

  //accuracy and completed data
  // accuracy?: number;
  totalMcqs: number;
  totalCompletedMcqs: number;

  totalClinicalCases: number;
  totalCompletedClinicalCases: number;

  totalOsces: number;
  totalCompletedOsces: number;

  totalNotes: number;
  totalCompletedNotes: number;

  totalFlashcards: number;
  totalCompletedFlashcards: number;

  // overview data
  totalCompletedStudyHours?: number;
  todayStudyHours?: number; // total hours for "today" (Dhaka date)
  todayStudyDate?: string; // "YYYY-MM-DD" in Asia/Dhaka

  totalMcqStudyHours?: number;
  totalClinicalCaseStudyHours?: number;
  totalOsceStudyHours?: number;

  streak?: number; // ✅ (আপনার "steak" টাইপো ছিল)
  lastStreakDate?: string;

  // oldAttempted?: number;
  // oldCorrect?: number;
  // oldIncorrect?: number;
};

export type TAccuracy = {
  accountId: Types.ObjectId;
  mcq: {
    totalAttempted: number;
    totalCorrect: number;
    totalIncorrect: number;
  };
  clinicalCase: {
    totalAttempted: number;
    totalCorrect: number;
    totalIncorrect: number;
  };
  osce: {
    totalAttempted: number;
    totalCorrect: number;
    totalIncorrect: number;
  };
};
