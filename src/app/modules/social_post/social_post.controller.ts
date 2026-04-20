import catchAsync from "../../utils/catch_async";
import manageResponse from "../../utils/manage_response";
import { social_post_services } from "./social_post.service";

const create_new_social_post = catchAsync(async (req, res) => {
  const result = await social_post_services.create_new_social_post_in_db(req);
  manageResponse(res, {
    statusCode: 201,
    message: "Social post created!",
    success: true,
    data: result,
  });
});
const get_all_social_post = catchAsync(async (req, res) => {
  const result = await social_post_services.get_all_social_post_from_db(
    req?.query
  );
  manageResponse(res, {
    statusCode: 200,
    message: "Social post fetched!",
    success: true,
    data: result?.data,
    meta: result?.meta,
  });
});
const get_single_post_by_id_with_share_count = catchAsync(async (req, res) => {
  const result =
    await social_post_services.get_single_post_by_id_with_share_count_from_db(
      req
    );
  manageResponse(res, {
    statusCode: 200,
    message: "Social post fetched!",
    success: true,
    data: result,
  });
});
const update_social_post = catchAsync(async (req, res) => {
  const result = await social_post_services.update_social_post_in_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Social post updated!",
    success: true,
    data: result,
  });
});
const delete_social_post = catchAsync(async (req, res) => {
  await social_post_services.delete_social_post_from_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Social post deleted!",
    success: true,
  });
});
const save_react_social_post = catchAsync(async (req, res) => {
  const result = await social_post_services.save_react_social_post_in_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Social post react saved!",
    success: true,
    data: result,
  });
});
const save_comment_social_post = catchAsync(async (req, res) => {
  const result = await social_post_services.save_comment_social_post_in_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Social post comment saved!",
    success: true,
    data: result,
  });
});

// question post

const save_new_question_post = catchAsync(async (req, res) => {
  const result = await social_post_services.save_new_question_post_into_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Question post successful.",
    success: true,
    data: result,
  });
});
const get_all_question_social = catchAsync(async (req, res) => {
  const result =
    await social_post_services.get_all_question_social_post_from_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Question  fetched successful.",
    success: true,
    data: result,
  });
});
const give_answer_to_question = catchAsync(async (req, res) => {
  const result = await social_post_services.give_answer_to_question_into_db(
    req
  );
  manageResponse(res, {
    statusCode: 200,
    message: "Anser update successful.",
    success: true,
    data: result,
  });
});
const save_new_forum = catchAsync(async (req, res) => {
  const result = await social_post_services.save_new_forum_into_db(req);
  manageResponse(res, {
    statusCode: 201,
    message: "Forum post successful.",
    success: true,
    data: result,
  });
});
const get_all_forum_post = catchAsync(async (req, res) => {
  const result = await social_post_services.get_all_forum_post_from_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Forum fetched successful.",
    success: true,
    data: result?.data,
    meta: result?.pagination,
  });
});
const get_single_forum_post = catchAsync(async (req, res) => {
  const result = await social_post_services.get_single_forum_post_from_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Forum fetched successful.",
    success: true,
    data: result,
  });
});
const write_a_comment_on_forum_post = catchAsync(async (req, res) => {
  const result =
    await social_post_services.write_a_comment_on_forum_post_into_db(req);
  manageResponse(res, {
    statusCode: 200,
    message: "Forum comment successful.",
    success: true,
    data: result,
  });
});

export const social_post_controllers = {
  create_new_social_post,
  get_all_social_post,
  get_single_post_by_id_with_share_count,
  update_social_post,
  delete_social_post,
  save_react_social_post,
  save_comment_social_post,
  save_new_question_post,
  get_all_question_social,
  give_answer_to_question,
  save_new_forum,
  get_all_forum_post,
  get_single_forum_post,
  write_a_comment_on_forum_post,
};
