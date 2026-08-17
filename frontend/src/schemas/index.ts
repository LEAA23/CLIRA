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

/**
 * USER SCHEMA
 */
export const UserSchema = AuthSchema.pick({
    name: true,
    email: true,
    rol: true
}).extend({
    id: z.number().or( z.null() )
})

/**
 * Groups SCHEMAS'
 */
export const GroupShcema = z.object({
    id: z.number(),
    name: z.string(),
    bgImage: z.string(),
    teacher: z.number(),
    teacherUser: z.object({
        name: z.string()
    })
});

export const GroupsSchema = z.array(
    GroupShcema
);

/**
 *  CHART CONTAINER SCHEMA
 */
export const ChartOptionSchema = z.object({
    id: z.string(),
    label: z.string()
});