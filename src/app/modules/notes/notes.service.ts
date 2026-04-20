import { Request } from "express";
import { AppError } from "../../utils/app_error";
import uploadCloud from "../../utils/cloudinary";
import { buildGoalContentFilter } from "../../utils/findContentQueryBuilder";
import { isAccountExist } from "../../utils/isAccountExist";
import { goal_model } from "../goal/goal.schema";
import { ProfessionalModel } from "../professional/professional.schema";
import { professional_profile_type_const_model, student_profile_type_const_model } from "../profile_type_const/profile_type_const.schema";
import { Student_Model } from "../student/student.schema";
import { notes_model } from "./notes.schema";

const create_new_notes_into_db = async (req: Request) => {
  try {
    const user = req.user;
    const body = req.body as any;
    const isUserExist: any = await isAccountExist(
      user?.email as string,
      "profile_id",
    );

    const uploadedBy = [
      isUserExist?.profile_id?.firstName,
      isUserExist?.profile_id?.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    const payload = {
      uploadedBy,
      notes: [],
      ...body,
      // Normalize optional string fields to avoid schema validation issues
      subtopic: (body?.subtopic ?? "").toString(),
      profileType: (body?.profileType ?? "").toString().trim(),
      subject: (body?.subject ?? "").toString().trim(),
      system: (body?.system ?? "").toString().trim(),
      topic: (body?.topic ?? "").toString().trim(),
    };

    // Handle file uploads
    if (req?.files && Array.isArray(req.files)) {
      const uploadResults = await Promise.all(
        (req.files as Express.Multer.File[]).map(async (file) => {
          const cloudRes = await uploadCloud(file);

          return {
            fileType: file.mimetype,
            fileName: file.originalname,
            fileUrl: cloudRes?.secure_url,
            fileId: cloudRes?.public_id,
          };
        }),
      );

      payload.notes.push(...uploadResults);
    }

    const result = await notes_model.create(payload);
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
  } catch (err) {
    // Never swallow errors; otherwise controllers return success with null data.
    throw err instanceof AppError ? err : new AppError((err as any)?.message || "Failed to create notes", 400);
  }
};

const get_all_notes_from_db = async (req: Request) => {
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

  // 🧠 Role-based filters
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

  // 🧩 Manual filters
  if (contentForTrim) filters.contentFor = contentForTrim;
  if (subjectTrim) filters.subject = subjectTrim;
  if (systemTrim) filters.system = systemTrim;
  if (topicTrim) filters.topic = topicTrim;
  if (subtopicTrim) filters.subtopic = subtopicTrim;

  // 🔍 Search filter
  if (searchTermTrim) {
    filters.$or = [
      { title: { $regex: searchTermTrim, $options: "i" } },
      { description: { $regex: searchTermTrim, $options: "i" } },
    ];
  }

  // 🎯 Apply goal-based filter
  const goal = await goal_model.findOne({
    studentId: req?.user?.accountId,
    goalStatus: "IN_PROGRESS",
  });

  const finalFilters = buildGoalContentFilter(goal, filters);

  // 🔢 Pagination
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  // 🧾 Query DB
  const data = await notes_model
    .find(finalFilters)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    .lean();

  const total = await notes_model.countDocuments(finalFilters);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
    data,
  };
};

const get_single_notes_from_db = async (id: string) => {
  const result = await notes_model.findById(id).lean();
  return result;
};

const delete_single_notes_from_db = async (id: string) => {
  const result = await notes_model.findByIdAndDelete(id);
  if (!result) throw new AppError("Notes not found", 404);
  await student_profile_type_const_model.findOneAndUpdate(
    { typeName: result?.profileType },
    { $inc: { totalContent: -1 } },
  );
  await professional_profile_type_const_model.findOneAndUpdate(
    { typeName: result?.profileType },
    { $inc: { totalContent: -1 } },
  );
  return result;
};

const update_download_count_into_db = async (noteId: string) => {
  const result = await notes_model.findOneAndUpdate(
    { _id: noteId },
    { $inc: { downloadCount: 1 } },
    { new: true },
  );
  return result;
};
const update_note_into_db = async (req: Request) => {
  const noteId = req?.params?.noteId;
  const body = req?.body;
  // Handle file uploads
  if (req?.files && Array.isArray(req.files)) {
    const uploadResults = await Promise.all(
      (req.files as Express.Multer.File[]).map(async (file) => {
        const cloudRes = await uploadCloud(file);

        return {
          fileType: file.mimetype,
          fileName: file.originalname,
          fileUrl: cloudRes?.secure_url,
          fileId: cloudRes?.public_id,
        };
      }),
    );

    body.notes = uploadResults;
  }
  const result = await notes_model.findOneAndUpdate(
    { _id: noteId },
    body,
    { new: true },
  );
  return result;
};

export const notes_service = {
  create_new_notes_into_db,
  get_all_notes_from_db,
  get_single_notes_from_db,
  delete_single_notes_from_db,
  update_download_count_into_db,
  update_note_into_db
};
