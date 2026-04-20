type T_Exam_MCQ = {
  mcqId: string,
  question: string;
  imageDescription?: string;
  options: {
    option: "A" | "B" | "C" | "D" | "E" | "F";
    optionText: string | number;
    explanation?: string | number;
  }[];
  correctOption: "A" | "B" | "C" | "D" | "E" | "F";
}

export type T_Exam_Student = {
  profileType: string,
  examName: string,
  subject: string,
  mcqs: T_Exam_MCQ[],
  totalQuestions: number,
  totalTime: number,
}

export type T_Exam_Professional = {
  professionName: string,
  examName: string,
  mcqs: T_Exam_MCQ[],
  totalQuestions: number,
  totalTime: number,
}


export type TRawMcqRow = {
  difficulty: "Basic" | "Intermediate" | "Advance";
  question: string;
  imageDescription?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  optionF: string;
  explanationA?: string;
  explanationB?: string;
  explanationC?: string;
  explanationD?: string;
  explanationE?: string;
  explanationF?: string;
  correctOption: "A" | "B" | "C" | "D" | "E" | "F";
};