import { Request } from "express";
import { AppError } from "../../utils/app_error";
import uploadCloud from "../../utils/cloudinary";
import { isAccountExist } from "../../utils/isAccountExist";
import { TForumPost, TSocialPost } from "./social_post.interface";
import {
  ForumPostModel,
  QuestionSocialModel,
  SocialPostModel,
} from "./social_post.schema";

const create_new_social_post_in_db = async (req: Request) => {
  const user = req?.user;
  const isUserExist = await isAccountExist(user?.email as string);
  const payload: TSocialPost = req?.body;
  payload.postedBy = isUserExist.profile_id;
  payload.profileType = isUserExist.profile_type;
  payload.role = isUserExist?.role;
  if (req?.file) {
    const cloudRes = await uploadCloud(req?.file);
    payload.postImage = cloudRes?.secure_url;
  }
  const result = await SocialPostModel.create(payload);
  return result;
};
const get_all_social_post_from_db = async (query: any) => {
  const page = query.page && query.page > 0 ? query.page : 1;
  const limit = query.limit && query.limit > 0 ? query.limit : 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};
  if (query?.searchTerm) {
    filter.$or = [
      { topic: { $regex: query.searchTerm, $options: "i" } },
      { content: { $regex: query.searchTerm, $options: "i" } },
    ];
  }
  filter.isDeleted = false;

  const [total, posts] = await Promise.all([
    SocialPostModel.countDocuments(filter),
    SocialPostModel.find(filter)
      .populate("postedBy", "firstName lastName profile_photo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    data: posts,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      skip,
    },
  };
};

const get_single_post_by_id_with_share_count_from_db = async (req: Request) => {
  const { postId } = req?.params;
  const { isShared } = req?.query;
  if (isShared == "true") {
    await SocialPostModel.findByIdAndUpdate(postId, { $inc: { share: 1 } });
  }
  const result = await SocialPostModel.findOne({
    _id: postId,
    isDeleted: false,
  })
    .lean()
    .populate("postedBy", "firstName lastName profile_photo");
  return result;
};

const update_social_post_in_db = async (req: Request) => {
  const user = req?.user;
  const { postId } = req?.params;
  const payload = req?.body;
  const isUserExist = await isAccountExist(user?.email as string);
  const matchPost = await SocialPostModel.findOne({
    _id: postId,
    postedBy: isUserExist?.profile_id,
  }).lean();
  if (!matchPost) {
    throw new AppError("You are not authorized to update this post", 403);
  }
  const result = await SocialPostModel.findOneAndUpdate(
    { _id: postId, postedBy: isUserExist?.profile_id },
    payload,
    { new: true }
  );
  return result;
};
const delete_social_post_from_db = async (req: Request) => {
  const user = req?.user;
  const { postId } = req?.params;
  const isUserExist = await isAccountExist(user?.email as string);
  const matchPost = await SocialPostModel.findOne({
    _id: postId,
    postedBy: isUserExist?.profile_id,
  }).lean();
  if (!matchPost) {
    throw new AppError("You are not authorized to delete this post", 403);
  }
  await SocialPostModel.findOneAndUpdate(
    { _id: postId, postedBy: isUserExist?.profile_id },
    { isDeleted: true }
  );
};
const save_react_social_post_in_db = async (req: Request) => {
  const user = req?.user;
  const { postId } = req?.params;
  const isUserExist = await isAccountExist(user?.email as string);
  const profileId = isUserExist.profile_id;

  // Fetch the post
  const post = await SocialPostModel.findById(postId);
  if (!post) throw new Error("Post not found");
  let result;
  if (post?.reaction?.includes(String(profileId))) {
    // User already reacted → remove
    result = await SocialPostModel.findByIdAndUpdate(
      postId,
      { $pull: { reaction: profileId } },
      { new: true }
    );
  } else {
    // User has not reacted → add
    result = await SocialPostModel.findByIdAndUpdate(
      postId,
      { $addToSet: { reaction: profileId } },
      { new: true }
    );
  }

  return result;
};
const save_comment_social_post_in_db = async (req: Request) => {
  const user = req?.user;
  const { postId } = req?.params;
  const isUserExist = (await isAccountExist(
    user?.email as string,
    "profile_id"
  )) as any;
  const commentPayload = {
    commentedBy: {
      name:
        isUserExist?.profile_id?.firstName +
        " " +
        isUserExist?.profile_id?.lastName,
      profileImage: isUserExist?.profile_id?.profile_photo,
      email: isUserExist?.email,
    },
    comment: req?.body?.comment,
  };
  // Fetch the post
  const post = await SocialPostModel.findById(postId);
  if (!post) throw new Error("Post not found");

  // User has not reacted → add
  const result = await SocialPostModel.findByIdAndUpdate(
    postId,
    { $addToSet: { comments: commentPayload } },
    { new: true }
  );
  return result;
};

// question post

const save_new_question_post_into_db = async (req: Request) => {
  const accountId = req?.user?.accountId;
  const payload = req?.body;
  payload.senderId = accountId;
  const result = QuestionSocialModel.create(payload);
  return result;
};

const get_all_question_social_post_from_db = async (req: Request) => {
  const mentorId = req?.params?.mentorId;
  const result = await QuestionSocialModel.find({ mentorAccountId: mentorId })
    .sort("-createdAt")
    .lean();
  return result;
};

const give_answer_to_question_into_db = async (req: Request) => {
  const accountId = req?.user?.accountId;
  const questionId = req?.params?.questionId;
  const ans = req?.body?.answer;
  const result = await QuestionSocialModel.findOneAndUpdate(
    {
      _id: questionId,
      mentorAccountId: accountId,
    },
    { answers: ans },
    { new: true }
  );

  return result;
};

// forum post

const save_new_forum_into_db = async (req: Request) => {
  const user = req?.user;
  const isUserExist = await isAccountExist(user?.email as string);
  const payload: Partial<TForumPost> = req?.body;
  payload.postedBy = isUserExist?.profile_id;
  payload.profileType = isUserExist?.profile_type;
  const result = ForumPostModel.create(payload);
  return result;
};
const get_all_forum_post_from_db = async (req: Request) => {
  // Pagination params
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const { searchTerm, category } = req.query;
  const filter: any = {};
  if (searchTerm) {
    filter.title = { $regex: searchTerm, $options: "i" };
  }
  if (category) {
    filter.category = category;
  }

  // Query with filters + pagination
  const result = await ForumPostModel.find(filter)
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .lean()
    .populate("postedBy", "firstName lastName profile_photo")
    .select("-comments");

  const total = await ForumPostModel.countDocuments(filter);

  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const get_single_forum_post_from_db = async (req: Request) => {
  const result = await ForumPostModel.findById(req?.params?.postId)
    .lean()
    .populate("postedBy", "firstName lastName profile_photo");

  if (!result) {
    throw new AppError("Forum post not found", 404);
  }

  return result;
};

const write_a_comment_on_forum_post_into_db = async (req: Request) => {
  const postId = req?.params?.postId;
  const user = req?.user;
  const isUserExist = (await isAccountExist(
    user?.email as string,
    "profile_id"
  )) as any;
  const commentPayload = {
    name:
      isUserExist?.profile_id?.firstName +
      " " +
      isUserExist?.profile_id?.lastName,
    photo: isUserExist?.profile_id?.profile_photo,
    comment: req?.body?.comment,
    studentType: isUserExist?.profile_id?.studentType || " ",
  };

  const result = await ForumPostModel.findByIdAndUpdate(
    postId,
    {
      $addToSet: {
        comments: commentPayload,
      },
    },
    { new: true }
  );
  return result;
};

export const social_post_services = {
  create_new_social_post_in_db,
  get_all_social_post_from_db,
  get_single_post_by_id_with_share_count_from_db,
  update_social_post_in_db,
  delete_social_post_from_db,
  save_react_social_post_in_db,
  save_comment_social_post_in_db,
  save_new_question_post_into_db,
  get_all_question_social_post_from_db,
  give_answer_to_question_into_db,
  save_new_forum_into_db,
  get_all_forum_post_from_db,
  get_single_forum_post_from_db,
  write_a_comment_on_forum_post_into_db,
};
