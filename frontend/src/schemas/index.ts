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
    id: z.number()
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
 * POST'S SQUEMAS
 */
export const PostSchema = z.object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
    images: z.array(
        z.object({
            id: z.number(),
            path: z.string()
        })
    ),
    user: z.object({
        name: z.string(),
        lastName: z.string()
    }),
    likesCount: z.number(),
    likedByMe: z.boolean(),
    group_id: z.number(),
    user_id: z.number()
});

export const PostsSchema = z.array(
    PostSchema
);

export const PostImageSchema = z.object({
    id: z.number(),
    path: z.string()
})

export const PostImagesSchema = z.array(
    PostImageSchema
);

export const likePostSquema = z.object({
    id: z.number(),
    likesCount: z.number(),
    likedByMe: z.boolean()
});

export const CommentSquema = z.object({
    id: z.number(),
    content: z.string(),
    post_id: z.number(),
    user: z.object({
        id: z.number(),
        name: z.string(),
        lastName: z.string()
    }),
    createdAt: z.string(),
    updatedAt: z.string()
});

export const CommentsSchema = z.array(
    CommentSquema
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