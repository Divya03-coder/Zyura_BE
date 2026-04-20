import { z } from "zod";

const create = z.object({
  topic: z.string().optional(),
  content: z.string().optional(),
});
const update = z.object({
  topic: z.string({ message: "topic is required" }).optional(),
  content: z.string({ message: "content is required" }).optional(),
});

const create_question = z.object({
  question: z.string({ message: "question is required" }),
  mentorAccountId: z.string({ message: "mentorAccountId is required" }),
});
const update_anser = z.object({
  answer: z.string({ message: "Answer is required is required" }),
});
const forum_comment = z.object({
  comment: z.string({ message: "Comment is required is required" }),
});

// for forum
const CommentSchemaZ = z.object({
  name: z.string(),
  photo: z.string().url().optional(),
  studentType: z.string().optional(),
  comment: z.string(),
});

export const forum_post = z.object({
  title: z.string(),
  category: z.string(),
  content: z.string(),
  tags: z.array(z.string()).optional(),
});

export const social_post_validation = {
  create,
  update,
  create_question,
  update_anser,
  forum_post,
};
