import type { StateCreator } from "zustand"
import type { Group, LikedPosts, Post, Posts } from "../types";
import { createPost, getPosts, likePost } from "../api/groupsApi";

export type PostsSliceType = {
    posts: Posts;
    post: Post;
    likedPosts: LikedPosts;
    createPost: ({ groupId, formData }: { groupId: number; formData: FormData; }) => Promise<string>;
    fetchPosts: (groupId: number) => Promise<void>;
    likePost: ({ groupId, postId }: { groupId: number; postId: number; }) => Promise<{ liked: boolean; likes: unknown; } | undefined>
}

export const createPostsSlice : StateCreator<PostsSliceType> = ( set, get ) =>({
    posts: [],
    post: {
        id: 0,
        title: "",
        content: "",
        media: [],
        group_id: 0,
        user_id: 0
    },
    likedPosts: [],
    createPost: async( { groupId, formData } : { groupId: Group["id"] ; formData : FormData } ) => {
        const message = await createPost( { groupId, formData } );
        await get().fetchPosts( groupId );
        return message;
    },
    fetchPosts: async( groupId : Group["id"] ) => {
        const posts = await getPosts( groupId );
        set(() => ({
            posts
        }));
    },
    likePost: async( { groupId, postId } : { groupId: Group["id"] ; postId: Post["id"] } ) => {
        const likePostData = await likePost( { groupId, postId } );
        set(() => ({
            posts: get().posts.map( post => {
                if( likePostData && post.id === likePostData.id ) {
                    return {
                        ...post,
                        likedByMe: likePostData.likedByMe,
                        likesCount: likePostData.likesCount
                    }
                }
                return post;
            } )
        }))
    }

});