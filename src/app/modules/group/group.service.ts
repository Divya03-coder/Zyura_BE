import { Request } from "express";
import { Types } from "mongoose";
import { AppError } from "../../utils/app_error";
import uploadCloud from "../../utils/cloudinary";
import { Student_Model } from "../student/student.schema";
import { group_model } from "./group.schema";

const create_new_group_into_db = async (req: Request) => {
  const accountId = req?.user?.accountId;
  const body = req?.body;
  // check group name already exist
  const isGroupNameExist = await group_model.findOne({
    groupName: body?.groupName,
  });
  if (isGroupNameExist) {
    throw new AppError("Group name already exist!!, try another name", 400);
  }

  const result = await group_model.create({
    ...body,
    groupAdmin: accountId,
    groupMembers: [accountId],
  });
  return result;
};

const get_all_my_joined_groups_from_db = async (req: Request) => {
  const { searchTerm } = req.query as { searchTerm?: string };
  const accountId = req?.user?.accountId;

  const query: Record<string, any> = {
    groupMembers: accountId,
  };

  if (searchTerm) {
    query.groupName = { $regex: searchTerm, $options: "i" };
  }

  const result = await group_model
    .find(query)
    .populate({
      path: "groupMembers",
      select: "profile_id role profile_type", // keep account light
      populate: {
        path: "profile_id",
        select: "firstName profile_photo",
      },
    })
    .lean();

  return result;
};

const update_my_group_into_db = async (req: Request) => {
  const accountId = req?.user?.accountId;
  const groupId = req?.params?.groupId;
  // check group exist or not;
  const isGroupExist = await group_model.findOne({
    _id: groupId,
    groupAdmin: accountId,
  });
  if (!isGroupExist) {
    throw new AppError("Group not found", 404);
  }
  const body = req?.body;
  if (req?.file) {
    const cloudRes = await uploadCloud(req?.file);
    body.groupLogo = cloudRes?.secure_url;
  }
  const result = await group_model.findOneAndUpdate(
    { _id: groupId, groupAdmin: accountId },
    body,
    { new: true }
  );
  return result;
};

const delete_my_group_into_db = async (req: Request) => {
  const accountId = req?.user?.accountId;
  const groupId = req?.params?.groupId;
  // check group exist or not;
  const isGroupExist = await group_model.findOne({
    _id: groupId,
    groupAdmin: accountId,
  });
  if (!isGroupExist) {
    throw new AppError("Group not found", 404);
  }
  const result = await group_model.findOneAndDelete({
    _id: groupId,
    groupAdmin: accountId,
  });
  return result;
};

const add_members_into_group_into_db = async (req: Request) => {
  const accountId = req?.user?.accountId;
  const groupId = req?.params?.groupId;
  const { members } = req?.body;

  // check group exists and requester is admin
  const isGroupExist = await group_model.findOne({
    _id: groupId,
    groupAdmin: accountId,
  });

  if (!isGroupExist) {
    throw new AppError("Group not found or unauthorized", 404);
  }

  // check members already exist or not;
  members.forEach((member: Types.ObjectId) => {
    if (isGroupExist?.groupMembers?.includes(member)) {
      throw new AppError("Member already added", 400);
    }
  });

  const result = await group_model.findOneAndUpdate(
    { _id: groupId, groupAdmin: accountId },
    {
      $addToSet: {
        groupMembers: { $each: members },
      },
    },
    { new: true }
  );

  return result;
};

const remove_member_from_group_from_db = async (req: Request) => {
  const accountId = req?.user?.accountId; // admin
  const groupId = req?.params?.groupId;
  const { memberId } = req?.body;

  // check group exists & requester is admin
  const group = await group_model.findOne({
    _id: groupId,
    groupAdmin: accountId,
  });

  if (!group) {
    throw new AppError("Group not found or unauthorized", 404);
  }

  // prevent removing admin
  if (group.groupAdmin.toString() === memberId) {
    throw new AppError("Group admin cannot be removed", 400);
  }
  if (!group?.groupMembers?.includes(memberId)) {
    throw new AppError("Member not found", 404);
  }

  const result = await group_model.findOneAndUpdate(
    { _id: groupId, groupAdmin: accountId },
    {
      $pull: {
        groupMembers: memberId,
      },
    },
    { new: true }
  );

  return result;
};

const get_all_community_member_from_db = async (req: Request) => {
  let { searchTerm = "", page = 1, limit = 50 } = req.query as any;

  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const matchStage = searchTerm
    ? {
        firstName: { $regex: searchTerm, $options: "i" },
      }
    : {};

  const pipeline: any = [
    // STUDENTS
    {
      $project: {
        firstName: 1,
        profile_photo: 1,
        accountId: 1,
        role: { $literal: "student" },
      },
    },

    // MENTORS
    {
      $unionWith: {
        coll: "mentor_profiles",
        pipeline: [
          {
            $project: {
              firstName: 1,
              profile_photo: 1,
              accountId: 1,
              role: { $literal: "mentor" },
            },
          },
        ],
      },
    },

    // PROFESSIONALS
    {
      $unionWith: {
        coll: "professional_profiles",
        pipeline: [
          {
            $project: {
              firstName: 1,
              profile_photo: 1,
              accountId: 1,
              role: { $literal: "professional" },
            },
          },
        ],
      },
    },

    // SEARCH
    Object.keys(matchStage).length ? { $match: matchStage } : { $match: {} },

    // SORT (optional)
    { $sort: { firstName: 1 } },

    // PAGINATION + COUNT
    {
      $facet: {
        meta: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },

    // CLEAN META
    {
      $project: {
        data: 1,
        meta: {
          page: { $literal: page },
          limit: { $literal: limit },
          total: { $ifNull: [{ $arrayElemAt: ["$meta.total", 0] }, 0] },
          totalPage: {
            $ceil: {
              $divide: [
                { $ifNull: [{ $arrayElemAt: ["$meta.total", 0] }, 0] },
                limit,
              ],
            },
          },
        },
      },
    },
  ];

  const result = await Student_Model.aggregate(pipeline);

  return result[0];
};

export const group_service = {
  create_new_group_into_db,
  get_all_my_joined_groups_from_db,
  update_my_group_into_db,
  delete_my_group_into_db,
  add_members_into_group_into_db,
  remove_member_from_group_from_db,
  get_all_community_member_from_db,
};
