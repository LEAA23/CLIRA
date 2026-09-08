import type { StateCreator } from "zustand"
import type { Group, Post, Posts } from "../types";
import { createPost, getPosts } from "../api/groupsApi";

export type PostsSliceType = {
    posts: Posts;
    post: Post;
    createPost: ({ groupId, formData }: { groupId: number; formData: FormData; }) => Promise<string>;
    fetchPosts: (groupId: number) => Promise<void>;
}

export const createPostsSlice : StateCreator<PostsSliceType> = ( set, get ) =>({
    posts: [],
    post: {
        id: 0,
        title: "",
        content: "",
        media: [],
        likes: 0,
        group_id: 0,
        user_id: 0
    },
    createPost: async( { groupId, formData } : { groupId: Group["id"] ; formData : FormData } ) => {
        const message = await createPost( { groupId, formData } );
        await get().fetchPosts( groupId );
        return message;
    },
    fetchPosts: async( groupId : Group["id"] ) => {
        const posts = await getPosts( groupId );
        console.log(posts)
        set(() => ({
            posts
        }));
    }

});