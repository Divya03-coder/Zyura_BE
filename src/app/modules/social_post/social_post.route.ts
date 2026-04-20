import { Router } from "express";
import auth from "../../middlewares/auth";
import RequestValidator from "../../middlewares/request_validator";
import uploader from "../../middlewares/uploader";
import { social_post_controllers } from "./social_post.controller";
import { social_post_validation } from "./social_post.validation";

const social_post_router = Router();
social_post_router.post(
  "/",
  auth("ADMIN", "MENTOR", "STUDENT"),
  uploader.single("image"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next();
  },
  RequestValidator(social_post_validation.create),
  social_post_controllers.create_new_social_post
);

social_post_router.get(
  "/",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  social_post_controllers.get_all_social_post
);
social_post_router.get(
  "/:postId",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  social_post_controllers.get_single_post_by_id_with_share_count
);
social_post_router.patch(
  "/:postId",
  auth("ADMIN", "MENTOR", "STUDENT"),
  uploader.single("image"),
  (req, res, next) => {
    req.body = JSON.parse(req?.body?.data);
    next();
  },
  RequestValidator(social_post_validation.update),
  social_post_controllers.update_social_post
);
social_post_router.delete(
  "/:postId",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  social_post_controllers.delete_social_post
);
social_post_router.put(
  "/:postId",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  social_post_controllers.save_react_social_post
);
social_post_router.put(
  "/comment/:postId",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  social_post_controllers.save_comment_social_post
);

// question post

social_post_router.post(
  "/question/post",
  auth("STUDENT", "PROFESSIONAL"),
  RequestValidator(social_post_validation.create_question),
  social_post_controllers.save_new_question_post
);
social_post_router.get(
  "/question/get-all-mentors-question-with-answers/:mentorId",
  auth("STUDENT", "PROFESSIONAL","MENTOR"),
  social_post_controllers.get_all_question_social
);
social_post_router.patch(
  "/question/post-answer/:postId",
  auth("MENTOR"),
  RequestValidator(social_post_validation.update_anser),
  social_post_controllers.give_answer_to_question
);

// forum post
social_post_router.post(
  "/forum/post",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  RequestValidator(social_post_validation.forum_post),
  social_post_controllers.save_new_forum
);
social_post_router.get(
  "/forum/get-all",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  social_post_controllers.get_all_forum_post
);
social_post_router.get(
  "/forum/get-single/:postId",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  social_post_controllers.get_single_forum_post
);
social_post_router.patch(
  "/forum/comment/:postId",
  auth("ADMIN", "MENTOR", "STUDENT", "PROFESSIONAL"),
  social_post_controllers.write_a_comment_on_forum_post
);

export default social_post_router;
