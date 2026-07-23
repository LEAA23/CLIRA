import z from "zod";

/**
 * AUTH SCHEMAS
 */
export const AuthSchema = z.object({
    name: z.string(),
    lastName: z.string(),
    rol: z.string(),
    phoneNumber: z.string(),
    email: z.string(),
    password: z.string(),
    repeatPassword: z.string(),
    token: z.string()
});