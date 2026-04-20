import { Request } from "express";
import mongoose from "mongoose";
import { AppError } from "../../utils/app_error";
import { excelConverter } from "../../utils/excel_converter";
import { buildGoalContentFilter } from "../../utils/findContentQueryBuilder";
import { isAccountExist } from "../../utils/isAccountExist";
import { Account_Model } from "../auth/auth.schema";
import { goal_model } from "../goal/goal.schema";
import { ProfessionalModel } from "../professional/professional.schema";
import { professional_profile_type_const_model, student_profile_type_const_model } from "../profile_type_const/profile_type_const.schema";
import { Student_Model } from "../student/student.schema";
import { TFlashCard } from "./flash_card.interface";
import { FlashcardModel } from "./flash_card.schema";

const create_new_flash_card_in_db = async (req: Request) => {
  const user = req?.user;
  const body = req?.body;
  const isUserExist = (await isAccountExist(
    user?.email as string,
    "profile_id",
  )) as any;
  const excelData: any = req.file
    ? excelConverter.parseFile(req.file.path) || []
    : [];

  const modifiedData = excelData?.map((item: any, idx: number) => ({
    ...item,
    flashCardId: `FLC-${String(idx + 1).padStart(6, "0")}`,
  }));

  const payload: TFlashCard = {
    uploadedBy:
      isUserExist?.profile_id?.firstName +
      " " +
      isUserExist?.profile_id?.lastName,
    ...body,
    flashCards: modifiedData,
  };
  const result = await FlashcardModel.create(payload);
  // update content count
  if (payload?.contentFor == "student") {
    await student_profile_type_const_model.findOneAndUpdate(
      { typeName: payload?.profileType },
      { $inc: { totalContent: 1 } },
    );
  }
  if (payload?.contentFor == "professional") {
    await professional_profile_type_const_model.findOneAndUpdate(
      { typeName: payload?.profileType },
      { $inc: { totalContent: 1 } },
    );
  }

  return result;
};

const create_new_manual_flash_card_in_db = async (req: Request) => {
  const user = req?.user;
  const body = req?.body;
  const isUserExist = (await isAccountExist(
    user?.email as string,
    "profile_id",
  )) as any;
  const payload: TFlashCard = {
    uploadedBy:
      isUserExist?.profile_id?.firstName +
      " " +
      isUserExist?.profile_id?.lastName,
    ...body,
    flashCards: req?.body?.flashCards.map((item: any, idx: number) => ({
      ...item,
      flashCardId: `FLC-${String(idx + 1).padStart(6, "0")}`,
    })),
  };
  const result = await FlashcardModel.create(payload);
  // update content count
  if (payload?.contentFor == "student") {
    await student_profile_type_const_model.findOneAndUpdate(
      { typeName: payload?.profileType },
      { $inc: { totalContent: 1 } },
    );
  }
  if (payload?.contentFor == "professional") {
    await professional_profile_type_const_model.findOneAndUpdate(
      { typeName: payload?.profileType },
      { $inc: { totalContent: 1 } },
    );
  }

  return result;
};

const get_all_flash_cards_from_db = async (req: Request) => {
  const user = await Account_Model.findById(req?.user?.accountId).lean();
  const {
    page = "1",
    limit = "10",
    searchTerm = "",
    contentFor = "",
    subject = "",
    system = "",
    topic = "",
    subtopic = "",
  } = req.query as any;

  const filters: any = {};
  const trimOrEmpty = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const searchTermTrim = trimOrEmpty(searchTerm);
  const contentForTrim = trimOrEmpty(contentFor);
  const subjectTrim = trimOrEmpty(subject);
  const systemTrim = trimOrEmpty(system);
  const topicTrim = trimOrEmpty(topic);
  const subtopicTrim = trimOrEmpty(subtopic);


  if (req?.user?.role === "STUDENT") {
    const student = await Student_Model.findOne({
      accountId: req?.user?.accountId,
    });
    filters.contentFor = "student";
    filters.profileType = student?.studentType;
  }

  if (req?.user?.role === "PROFESSIONAL") {
    const professional = await ProfessionalModel.findOne({
      accountId: req?.user?.accountId,
    });
    filters.contentFor = "professional";
    filters.profileType = professional?.professionName;
  }

  if (contentForTrim) filters.contentFor = contentForTrim;
  if (subjectTrim) filters.subject = subjectTrim;
  if (systemTrim) filters.system = systemTrim;
  if (topicTrim) filters.topic = topicTrim;
  if (subtopicTrim) filters.subtopic = subtopicTrim;


  if (searchTermTrim) {
    filters.$or = [
      { title: { $regex: searchTermTrim, $options: "i" } },
      { description: { $regex: searchTermTrim, $options: "i" } },
    ];
  }

  const goal = await goal_model.findOne({
    studentId: req?.user?.accountId,
    goalStatus: "IN_PROGRESS",
  });

  const finalFilters = buildGoalContentFilter(goal, filters);

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const result = await FlashcardModel.find(finalFilters)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    .lean();

  const total = await FlashcardModel.countDocuments(finalFilters);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
    data: result.map((item: any) => ({
      _id: item._id,
      title: item.title,
      subject: item.subject,
      system: item.system,
      topic: item.topic,
      subtopic: item.subtopic,
      type: item.type,
      contentFor: item.contentFor,
      profileType: item.profileType,
      uploadedBy: item.uploadedBy,
      totalFlashCards: item.flashCards?.length || 0,
      createdAt: item.createdAt,
      isComplete:
        user?.finishedFlashcardIds?.some(
          (id: any) => id.toString() === item._id.toString(),
        ) || false,
    })),
  };
};

const get_single_flash_card_from_db = async (req: Request) => {
  const { flashCardId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const searchTerm = (req.query.searchTerm as string) || "";
  const difficulty = (req.query.difficulty as string) || "";

  const result = await FlashcardModel.findById(flashCardId)
    .select("-__v")
    .lean();

  if (!result) throw new AppError("Flash Card not found", 404);

  let filtered = result.flashCards;

  if (searchTerm) {
    const regex = new RegExp(searchTerm, "i");

    filtered = filtered.filter(
      (fc) => regex.test(fc.frontText) || regex.test(fc.flashCardId),
    );
  }

  if (difficulty) {
    filtered = filtered.filter((fc) => fc.difficulty === difficulty);
  }

  const total = filtered.length;
  const skip = (page - 1) * limit;

  const paginated = filtered.slice(skip, skip + limit);

  const meta = {
    page,
    limit,
    skip,
    total,
    totalPages: Math.ceil(total / limit),
  };

  return {
    data: {
      ...result,
      flashCards: paginated,
    },
    meta,
  };
};

const get_specific_flashcard_bank_with_index_from_db = async (
  req: Request,
): Promise<any> => {
  const { flashCardBankId, flashCardId } = req.params;
  const result = await FlashcardModel.findOne(
    {
      _id: new mongoose.Types.ObjectId(flashCardBankId as string),
      "flashCards.flashCardId": flashCardId,
    },
    { "flashCards.$": 1 },
  ).lean();
  if (!result) throw new AppError("Flashcard Bank not found", 404);

  return result;
};

const update_specific_flashcard_into_db = async (
  flashCardBankId: string,
  flashCardId: string,
  updatedQuestionData: Partial<any>,
) => {
  // 1️⃣ Build the update object dynamically
  const updateFields: Record<string, any> = {};

  if (updatedQuestionData.frontText)
    updateFields["flashCards.$.frontText"] = updatedQuestionData.frontText;

  if (updatedQuestionData.backText)
    updateFields["mcqs.$.backText"] = updatedQuestionData.backText;

  if (updatedQuestionData.explanation)
    updateFields["mcqs.$.explanation"] = updatedQuestionData.explanation;
  if (updatedQuestionData.difficulty)
    updateFields["mcqs.$.difficulty"] = updatedQuestionData.difficulty;

  // 4️⃣ Execute the update directly in MongoDB
  const result = await FlashcardModel.updateOne(
    { _id: flashCardBankId, "flashCards.flashCardId": flashCardId },
    { $set: updateFields },
  );

  if (result.matchedCount === 0) throw new Error("MCQ not found");
  if (result.modifiedCount === 0)
    return { message: "No changes were made (fields may be identical)" };

  return {
    message: "Flashcard updated successfully",
    modifiedCount: result.modifiedCount,
  };
};

const delete_flashCard_bank_from_db = async (flashCardBankId: string) => {
  const result = await FlashcardModel.findByIdAndDelete(flashCardBankId);
  if (!result) throw new Error("Flashcard Bank not found");
  await student_profile_type_const_model.findOneAndUpdate(
    { typeName: result?.profileType },
    { $inc: { totalContent: -1 } },
  );
  await professional_profile_type_const_model.findOneAndUpdate(
    { typeName: result?.profileType },
    { $inc: { totalContent: -1 } },
  );
  return { message: "Flashcard Bank deleted successfully", deleteCount: 1 };
};

const delete_single_flashcard_from_db = async (req: Request) => {
  const { flashCardBankId, flashCardId } = req?.params;
  const result = await FlashcardModel.updateOne(
    { _id: flashCardBankId },
    { $pull: { flashCards: { flashCardId } } },
  );
  return result?.modifiedCount;
};

const upload_more_flash_card_into_existing_bank_in_db = async (
  req: Request,
) => {
  const flashcardBankId = req?.params?.flashCardBankId;
  const key = req?.query?.key as string;
  const body = req?.body;

  const existingFlashcardBank = await FlashcardModel.findById(flashcardBankId);
  if (!existingFlashcardBank)
    throw new AppError("Flashcard Bank not found", 404);
  const lastFlashCardIndex = existingFlashcardBank.flashCards.length + 1;
  let payload: any = [];
  if (key === "bulk") {
    const excelData: any = req.file
      ? excelConverter.parseFile(req.file.path) || []
      : [];

    const modifiedData = excelData.map((item: any, idx: number) => ({
      ...item,
      flashCardId: `FLC-${String(lastFlashCardIndex + idx).padStart(6, "0")}`,
    }));

    payload = modifiedData;
  }

  if (key === "manual") {
    payload = body.map((item: any, idx: number) => ({
      ...item,
      flashCardId:
        item.flashCardId ||
        `FLC-${String(lastFlashCardIndex + idx).padStart(6, "0")}`,
    }));
  }

  const result = await FlashcardModel.updateOne(
    { _id: flashcardBankId },
    { $push: { flashCards: { $each: payload } } },
  );
  return result;
};

export const flash_card_services = {
  create_new_flash_card_in_db,
  get_all_flash_cards_from_db,
  get_single_flash_card_from_db,
  get_specific_flashcard_bank_with_index_from_db,
  update_specific_flashcard_into_db,
  delete_flashCard_bank_from_db,
  delete_single_flashcard_from_db,
  create_new_manual_flash_card_in_db,
  upload_more_flash_card_into_existing_bank_in_db,
};
