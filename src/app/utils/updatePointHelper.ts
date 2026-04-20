import { Types } from "mongoose";
import { ProfessionalModel } from "../modules/professional/professional.schema";
import { Student_Model } from "../modules/student/student.schema";

export const updatePointHelper = async (role: string, accountId: string, point: number = 1) => {
  const objectId = new Types.ObjectId(accountId);
  if (role === "STUDENT") {
    await Student_Model.findOneAndUpdate(
      { accountId: objectId },
      { $inc: { point: point } },
      { new: true, upsert: true }
    );
  }

  if (role === "PROFESSIONAL") {
    await ProfessionalModel.findOneAndUpdate(
      { accountId: objectId },
      { $inc: { point: point } },
      { new: true, upsert: true }
    );
  }
};
