import { Request } from "express";
import mongoose from "mongoose";
import { AppError } from "../../utils/app_error";
import { ClinicalCaseModel } from '../clinical_case/clinical_case.schema';
import { FlashcardModel } from "../flash_card/flash_card.schema";
import { McqBankModel } from "../mcq_bank/mcq_bank.schema";
import { notes_model } from "../notes/notes.schema";
import { osce_model } from "../osce/osce.schema";
import { ProfessionalModel } from "../professional/professional.schema";
import { Student_Model } from "../student/student.schema";
import { content_management_admin_model } from './study_mode_tree.schema';

const create_new_content_management_admin_into_db = async (req: Request) => {
  const isSubjectExist = await content_management_admin_model.findOne({ subject: req?.body?.subjectName });
  if (isSubjectExist) {
    throw new Error(`${req?.body?.subjectName} - Subject already exist`);
  }
  const result = await content_management_admin_model.create(req?.body);
  return result;;
};

const get_all_content_management_admin_from_db = async (req: Request) => {
  const { contentFor, profileType } = req?.query;

  const filters: any = {};
  // 🧠 Determine studentType (only for student users)
  if (req?.user?.role === "STUDENT") {
    const student = await Student_Model.findOne({ accountId: req?.user?.accountId });
    filters.contentFor = "student";
    filters.profileType = student?.studentType || undefined;
  }
  if (req?.user?.role === "PROFESSIONAL") {
    const professional = await ProfessionalModel.findOne({ accountId: req?.user?.accountId });
    filters.contentFor = "professional";
    filters.profileType = professional?.professionName || undefined;
  }


  if (contentFor) {
    filters.contentFor = contentFor;
  }
  if (profileType) {
    filters.profileType = profileType;
  }

  const result = await content_management_admin_model.find(filters).lean();

  return result;
};

const get_all_content_from_tree_from_db = async (req: Request) => {
  let {
    subject,
    system,
    topic,
    subtopic,
    key = "MCQ",
    contentFor,
    profileType,
    searchTerm = "",
    page = "1",
    limit = "10"
  } = req.query;


  const filters: any = {};
  // 🧠 Determine studentType (only for student users)
  if (req?.user?.role === "STUDENT") {
    const student = await Student_Model.findOne({ accountId: req?.user?.accountId });
    filters.contentFor = "student";
    filters.profileType = student?.studentType || undefined;
  }
  if (req?.user?.role === "PROFESSIONAL") {
    const professional = await ProfessionalModel.findOne({ accountId: req?.user?.accountId });
    filters.contentFor = "professional";
    filters.profileType = professional?.professionName || undefined;
  }

  // other filter
  if (subject) {
    filters.subject = subject;
  }
  if (system) {
    filters.system = system;
  }
  if (topic) {
    filters.topic = topic;
  }
  if (subtopic) {
    filters.subtopic = subtopic;
  }
  if (contentFor) {
    filters.contentFor = contentFor;
  }
  if (profileType) {
    filters.profileType = profileType;
  }
  // Search based on key
  if (searchTerm) {
    if (key === "MCQ" || key === "Flashcard") {
      filters.title = { $regex: searchTerm as string, $options: "i" };
    }
    if (key === "ClinicalCase") {
      filters.caseTitle = { $regex: searchTerm as string, $options: "i" };
    }
    if (key === "OSCE") {
      filters.name = { $regex: searchTerm as string, $options: "i" };
    }
    if (key === "Notes") {
      filters.title = { $regex: searchTerm as string, $options: "i" };
    }
  }

  // Key → Model mapping
  const map: Record<string, { model: any; projection?: string }> = {
    MCQ: { model: McqBankModel, projection: "-mcqs" },
    Flashcard: { model: FlashcardModel, projection: "-flashCards" },
    Notes: { model: notes_model },
    ClinicalCase: { model: ClinicalCaseModel },
    OSCE: { model: osce_model }
  };

  const entry = map[key as string];

  // Convert page/limit
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  // Get total count
  const total = await entry.model.countDocuments(filters);

  // Fetch paginated data
  const data = await entry.model
    .find(filters)
    .select(entry.projection || "")
    .skip(skip)
    .limit(limitNum);

  const totalPages = Math.ceil(total / limitNum);

  return {
    data,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    }
  };
};

const update_content_management_admin_into_db = async (req: Request) => {
  const { treeId } = req?.params;
  const payload = req?.body;
  const result = await content_management_admin_model.findByIdAndUpdate(treeId, payload, { new: true });
  return result;
}

const delete_content_management_admin_from_db = async (req: Request) => {
  const { treeId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const tree = await content_management_admin_model
      .findById(treeId)
      .session(session) as any;

    if (!tree) {
      throw new AppError("Content tree not found", 404);
    }

    const filter = {
      subject: tree.subjectName,
      studentType: tree?.studentType,
    };

    await Promise.all([
      McqBankModel.deleteMany(filter).session(session),
      FlashcardModel.deleteMany(filter).session(session),
      notes_model.deleteMany(filter).session(session),
      ClinicalCaseModel.deleteMany(filter).session(session),
      osce_model.deleteMany(filter).session(session),
    ]);

    await content_management_admin_model
      .findByIdAndDelete(treeId)
      .session(session);

    await session.commitTransaction();
    session.endSession();

    return tree;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const study_mode_tree_service = {
  create_new_content_management_admin_into_db,
  get_all_content_management_admin_from_db,
  update_content_management_admin_into_db,
  delete_content_management_admin_from_db,
  get_all_content_from_tree_from_db
};
