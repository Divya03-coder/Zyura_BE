import z from "zod";

const create_new_admin_validation = z.object({
    email: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
});

export const Admin_Validation = {
    create_new_admin_validation
}