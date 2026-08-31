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
    lastName: true,
    email: true,
    rol: true
}).extend({
    id: z.number().or( z.null() )
})

export const UserSearchSchema = UserSchema.pick({
    id: true,
    name: true,
    lastName: true,
    email: true
});

/**
 * Groups SCHEMAS'
 */
export const GroupShcema = z.object({
    id: z.number(),
    name: z.string(),
    bgImage: z.array( z.file() ),
    teacher: z.number(),
    teacherUser: z.object({
        name: z.string()
    })
});

export const GroupResponse = GroupShcema.pick({
    id: true,
    name: true,
    teacher: true,
    teacherUser: true
}).extend({
    bgImage: z.string(),
    users: z.array(
        AuthSchema.pick({
            name: true,
            lastName: true,
            email: true
        }).extend({
            id: z.number()
        })
    )
});

export const GroupsSchema = z.array(
    GroupShcema.omit({
        bgImage: true,
        teacher: true
    })
);

/**
 *  CHART CONTAINER SCHEMA
 */
export const ChartOptionSchema = z.object({
    id: z.string(),
    label: z.string()
});

/**
 * MEMBERS CONTAINER SCHEMA
 */
export const MembersOptionSchema = z.object({
    id: z.string(),
    label: z.string()
});