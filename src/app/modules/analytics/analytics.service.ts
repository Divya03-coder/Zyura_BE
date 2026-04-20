import { Request } from "express";
import { ClinicalCaseModel } from "../clinical_case/clinical_case.schema";
import { FlashcardModel } from "../flash_card/flash_card.schema";
import { McqBankModel } from "../mcq_bank/mcq_bank.schema";
import { osce_model } from "../osce/osce.schema";

const update_view_count_all_content_into_db = async (req: Request) => {
  const { contentId, key } = req?.body;

  if (key == "mcq") {
    await McqBankModel.findOneAndUpdate(
      { _id: contentId },
      { $inc: { viewCount: 1 } }
    );
  }
  if (key == "flashcard") {
    await FlashcardModel.findOneAndUpdate(
      { _id: contentId },
      { $inc: { viewCount: 1 } }
    );
  }
  if (key == "clinicalcase") {
    await ClinicalCaseModel.findOneAndUpdate(
      { _id: contentId },
      { $inc: { viewCount: 1 } }
    );
  }
  if (key == "osce") {
    await osce_model.findOneAndUpdate(
      { _id: contentId },
      { $inc: { viewCount: 1 } }
    );
  }
};

export const analytics_service = {
  update_view_count_all_content_into_db,
};
