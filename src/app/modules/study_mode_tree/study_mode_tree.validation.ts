import { z } from "zod";


export const TopicSchema = z.object({
  topicName: z.string().trim().min(1, "Topic name is required"),
  subTopics: z.array(z.string()).default([]),
});

export const SystemSchema = z.object({
  name: z.string().trim().min(1, "System name is required"),
  topics: z.array(TopicSchema).default([]),
});


const create = z.object({
  subjectName: z.string().trim().min(1, "Subject name is required"),
  systems: z.array(SystemSchema).default([]),
  contentFor: z.enum(["student", "professional"]),
  profileType: z.string().trim(),
});
const update = z.object({
  subjectName: z.string().optional(),
  systems: z.array(SystemSchema).default([]).optional(),
});

export const content_management_admin_validations = {
  create,
  update
};
