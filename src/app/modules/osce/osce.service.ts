import { Request } from "express";
import { AppError } from "../../utils/app_error";
import { buildGoalContentFilter } from "../../utils/findContentQueryBuilder";
import { Account_Model } from "../auth/auth.schema";
import { goal_model } from "../goal/goal.schema";
import { ProfessionalModel } from "../professional/professional.schema";
import { professional_profile_type_const_model, student_profile_type_const_model } from "../profile_type_const/profile_type_const.schema";
import { Student_Model } from "../student/student.schema";
import { osce_model } from "./osce.schema";

const create_new_osce_into_db = async (req: Request) => {
  const payload = req?.body;
  const result = await osce_model.create(payload);
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

const get_all_osce_from_db = async (req: Request) => {
  const user = await Account_Model.findById(req?.user?.accountId).lean();
  const query = req?.query as any;

  let {
    page = 1,
    limit = 10,
    searchTerm = "",
    contentFor,
    subject,
    system,
    topic,
    subtopic,
    studentType,
  } = query;

  const filter: any = {};
  const trimOrEmpty = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const searchTermTrim = trimOrEmpty(searchTerm);
  const contentForTrim = trimOrEmpty(contentFor);
  const subjectTrim = trimOrEmpty(subject);
  const systemTrim = trimOrEmpty(system);
  const topicTrim = trimOrEmpty(topic);
  const subtopicTrim = trimOrEmpty(subtopic);
  const studentTypeTrim = trimOrEmpty(studentType);


  if (req?.user?.role === "STUDENT") {
    const student = await Student_Model.findOne({
      accountId: req?.user?.accountId,
    });
    filter.contentFor = "student";
    filter.profileType = student?.studentType;
  }

  if (req?.user?.role === "PROFESSIONAL") {
    const professional = await ProfessionalModel.findOne({
      accountId: req?.user?.accountId,
    });
    filter.contentFor = "professional";
    filter.profileType = professional?.professionName;
  }

 
  if (searchTermTrim) {
    filter.$or = [{ name: { $regex: searchTermTrim, $options: "i" } }];
  }

  
  if (contentForTrim) filter.contentFor = contentForTrim;
  if (subjectTrim) filter.subject = { $regex: subjectTrim, $options: "i" };
  if (systemTrim) filter.system = { $regex: systemTrim, $options: "i" };
  if (topicTrim) filter.topic = { $regex: topicTrim, $options: "i" };
  if (subtopicTrim) filter.subtopic = { $regex: subtopicTrim, $options: "i" };
  if (studentTypeTrim)
    filter.studentType = { $regex: studentTypeTrim, $options: "i" };


  const goal = await goal_model.findOne({
    studentId: req?.user?.accountId,
    goalStatus: "IN_PROGRESS",
  });

  const finalFilter = buildGoalContentFilter(goal, filter);

 
  const skip = (Number(page) - 1) * Number(limit);

  const [result, total] = await Promise.all([
    osce_model
      .find(finalFilter)
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    osce_model.countDocuments(finalFilter),
  ]);
  const finalResult = result.map((item: any) => {
    const isComplete =
      user?.finishedOsceIds?.some(
        (id: any) => id.toString() === item._id.toString(),
      ) || false;

    return {
      ...item,
      isComplete,
    };
  });
  return {
    data: finalResult,
    meta: {
      page: Number(page),
      limit: Number(limit),
      skip,
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};
const get_single_osce_from_db = async (req: Request) => {
  const osceId = req?.params?.osceId;
  const result = await osce_model.findById(osceId);
  if (!result) {
    throw new AppError("Osce not found!!", 404);
  }
  return result;
};
const update_single_osce_into_db = async (req: Request) => {
  const osceId = req?.params?.osceId;
  const result = await osce_model.findByIdAndUpdate(osceId, req?.body, {
    new: true,
  });
  return result;
};
const delete_single_osce_from_db = async (req: Request) => {
  const osceId = req?.params?.osceId;
  const result = await osce_model.findByIdAndDelete(osceId);
  if (!result) {
    throw new AppError("Osce not found!!", 404);
  }
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

export const osce_service = {
  create_new_osce_into_db,
  get_all_osce_from_db,
  get_single_osce_from_db,
  update_single_osce_into_db,
  delete_single_osce_from_db,
};
