import z from "zod"
import type { AuthSchema } from "../schemas"

/**
 * AUTH TYPES
 */
export type AuthSchema = z.infer<typeof AuthSchema>;
export type UserRegistrationForm = Pick<AuthSchema, "name" | "lastName" | "rol" | "phoneNumber" | "email" | "password" | "repeatPassword">;
export type ConfirmToken = Pick<AuthSchema, "token">;
export type UserLoginForm = Pick<AuthSchema,  "email" | "password">;
export type UserForgotPasswordForm = Pick<AuthSchema, "email">;
export type UserNewPasswordForm = Pick<AuthSchema, "password" | "repeatPassword">;
export type UserUpdatePassword = Pick<AuthSchema, "password" | "repeatPassword" | "token">;
export type UserValidateToken = Pick<AuthSchema, "token">;