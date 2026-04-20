import { z } from "zod";

const create_career = z.object({
    resourceName: z.string(),
    category: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    mediaLink: z.string().optional(),
});
const update_career = z.object({
    resourceName: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    mediaLink: z.string().optional(),
});

const upload_book = z.object({
    title: z.string().min(1),
    author: z.string().min(1),
    language: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string()).default([])
});
const update_book = z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    language: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    fileLink: z.string().optional(),
});

export const resource_validations = {
    create_career,
    update_career,
    upload_book,
    update_book
};
