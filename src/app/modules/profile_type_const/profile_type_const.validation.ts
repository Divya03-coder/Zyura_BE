import { z } from "zod";

const create = z.object({
  typeName: z.string({ message: "typeName is required" }),
});

export const profile_type_const_validations = {
  create
};
