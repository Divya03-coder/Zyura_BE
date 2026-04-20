
export type T_Report = {
  accountId: string;
  name: string;
  profile_photo: string;
  report: {
    questionBankId: string;
    mcqId: string;
    text: string;
  };
  status: "IN_REVIEW" | "RESOLVED" | "REJECTED",
  note:string
}