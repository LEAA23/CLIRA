import type { StateCreator } from "zustand"
import type { CommentForm, Comments, Group, LikedPosts, Post, Posts } from "../types";
import { createComment, createPost, getComments, getPosts, likePost } from "../api/groupsApi";

export type PostsSliceType = {
    posts: Posts;
    post: Post;
    likedPosts: LikedPosts;
    currentPostComments: Comments;
    createPost: ({ groupId, formData }: { groupId: number; formData: FormData; }) => Promise<string>;
    fetchPosts: (groupId: number) => Promise<void>;
    likePost: ({ groupId, postId }: { groupId: number; postId: number; }) => Promise<{ liked: boolean; likes: unknown; } | undefined>;
    createComment: ({ groupId, postId, content }: { groupId: number; postId: number; content: string; }) => Promise<string | undefined>;
    fecthComments: ({ groupId, postId }: { groupId: number; postId: number; }) => Promise<void>
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
    currentPostComments: [],
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
    },
    createComment: async( { groupId, postId, content } : { groupId : Group["id"] ; postId: Post["id"]; content: CommentForm["content"] } ) => {
        const data = await createComment( { groupId, postId, content } );
        await get().fecthComments( { groupId, postId } );
        return data;
    },
    fecthComments: async( { groupId, postId } : { groupId: Group["id"] ; postId: Post["id"] } ) => {
        const comments = await getComments( { groupId, postId } );
        set(() => ({
            currentPostComments: comments
        }));
    }

});