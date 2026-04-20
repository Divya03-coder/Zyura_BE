import { Request } from "express";
import { AppError } from "../../utils/app_error";
import { professional_profile_type_const_model, student_profile_type_const_model } from "./profile_type_const.schema";

const create_new_profile_type_const_into_db = async (req: Request) => {
  const payload = req?.body;
  const isTypeNameExist = await student_profile_type_const_model.findOne({ typeName: payload?.typeName }).lean();
  if (isTypeNameExist) throw new AppError("This type name is already exist", 403);
  const result = await student_profile_type_const_model.create(payload);
  return result;
};

const get_all_profile_type_const_from_db = async (req: Request) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const total = await student_profile_type_const_model.countDocuments().lean();
  const result = await student_profile_type_const_model.find().skip(skip).limit(Number(limit)).lean();

  return {
    data: result,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}


const update_profile_type_const_into_db = async (req: Request) => {
  const typeId = req?.params?.typeId;
  const payload = req?.body;
  const isTypeNameExist = await student_profile_type_const_model.findOne({ typeName: payload?.typeName }).lean();
  if (isTypeNameExist) throw new AppError("This type name is already exist", 403);
  const result = await student_profile_type_const_model.findOneAndUpdate({ _id: typeId }, payload, { new: true });
  return result
}

const delete_profile_type_const_from_db = async (typeId: string) => {
  const result = await student_profile_type_const_model.findOneAndDelete({ _id: typeId });
  return result;
};


// for professional

const create_new_professional_profile_type_const_into_db = async (req: Request) => {
  const payload = req?.body;
  const isTypeNameExist = await professional_profile_type_const_model.findOne({ typeName: payload?.typeName }).lean();
  if (isTypeNameExist) throw new AppError("This type name is already exist", 403);
  const result = await professional_profile_type_const_model.create(payload);
  return result;
};

const get_all_professional_profile_type_const_from_db = async (req: Request) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const total = await professional_profile_type_const_model.countDocuments().lean();
  const result = await professional_profile_type_const_model.find().skip(skip).limit(Number(limit)).lean();

  return {
    data: result,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}

const update_professional_profile_type_const_into_db = async (req: Request) => {
  const typeId = req?.params?.typeId;
  const payload = req?.body;
  const isTypeNameExist = await professional_profile_type_const_model.findOne({ typeName: payload?.typeName }).lean();
  if (isTypeNameExist) throw new AppError("This type name is already exist", 403);
  const result = await professional_profile_type_const_model.findOneAndUpdate({ _id: typeId }, payload, { new: true });
  return result
}

const delete_professional_profile_type_const_from_db = async (typeId: string) => {
  const result = await professional_profile_type_const_model.findOneAndDelete({ _id: typeId });
  return result;
};


export const profile_type_const_service = {
  create_new_profile_type_const_into_db,
  get_all_profile_type_const_from_db,
  update_profile_type_const_into_db,
  delete_profile_type_const_from_db,

  create_new_professional_profile_type_const_into_db,
  get_all_professional_profile_type_const_from_db,
  update_professional_profile_type_const_into_db,
  delete_professional_profile_type_const_from_db
};
