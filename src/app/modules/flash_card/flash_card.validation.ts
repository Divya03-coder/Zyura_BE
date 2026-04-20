import { z } from "zod";

// ---------- Flash Card Validation for FormData ----------

// For create request
const create = z.object({
  title: z.string().nonempty(),
  subject: z.string().nonempty(),
  system: z.string().nonempty(),
  topic: z.string().nonempty(),
  subtopic: z.string().optional(),
  contentFor: z.string().nonempty(),
  profileType: z.string().nonempty(),
  uploadedBy: z.string().optional(),
  flashCards: z.array(
    z.object({
      frontText: z.string().nonempty(),
      image: z.string().optional(),
      backText: z.string().nonempty(),
      explanation: z.string().nonempty(),
      difficulty: z.enum(["Basic", "Intermediate", "Advance"])
    })
  )
});
const update = z.object({
  frontText: z.string().optional(),
  image: z.string().optional(),
  backText: z.string().optional(),
  explanation: z.string().optional(),
  difficulty: z.enum(["Basic", "Intermediate", "Advance"]).optional()
})


// ---------- Export ----------
export const flash_card_validation = {
  create,
  update
};
