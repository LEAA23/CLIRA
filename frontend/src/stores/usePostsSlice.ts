import type { StateCreator } from "zustand"
import type { Group, Posts } from "../types";
import { createPost, getPosts } from "../api/groupsApi";

export type PostsSliceType = {
    posts: Posts;
    createPost: ({ groupId, formData }: { groupId: number; formData: FormData; }) => Promise<string>;
    fetchPosts: (groupId: number) => Promise<void>;
}

export const createPostsSlice : StateCreator<PostsSliceType> = ( set ) =>({
    posts: [],
    createPost: async( { groupId, formData } : { groupId: Group["id"] ; formData : FormData } ) => {
        const message = await createPost( { groupId, formData } );
        return message;
    },
    fetchPosts: async( groupId : Group["id"] ) => {
        const posts = await getPosts( groupId );
        set(() => ({
            posts
        }));
    }

});