import type { StateCreator } from "zustand"
import type { Comment, CommentForm, Comments, Group, LikedPosts, Post, Posts } from "../types";
import { createComment, createPost, getComments, getPosts, likePost } from "../api/groupsApi";

export type PostsSliceType = {
    posts: Posts;
    post: Post;
    likedPosts: LikedPosts;
    currentPostComments: Comments;
    comment: Comment;
    createPost: ({ groupId, formData }: { groupId: number; formData: FormData; }) => Promise<string>;
    fetchPost: (postId: number) => void;
    fetchPosts: (groupId: number) => Promise<void>;
    likePost: ({ groupId, postId }: { groupId: number; postId: number; }) => Promise<{ liked: boolean; likes: unknown; } | undefined>;
    createComment: ({ groupId, postId, content }: { groupId: number; postId: number; content: string; }) => Promise<string | undefined>;
    fecthComment: (commentId: number) => void;
    fecthComments: ({ groupId, postId }: { groupId: number; postId: number; }) => Promise<void>;
    cleanComment: () => void;
}

export const createPostsSlice : StateCreator<PostsSliceType> = ( set, get ) =>({
    posts: [],
    post: {
        id: 0,
        title: "",
        content: "",
        images: [],
        user: {
            name: "",
            lastName: ""
        },
        likesCount: 0,
        likedByMe: false,
        group_id: 0,
        user_id: 0
    },
    likedPosts: [],
    comment: {
        id: 0,
        content: "",
        post_id: 0,
        user: {
            id: 0,
            name: "",
            lastName: "",
        },
        createdAt: "",
        updatedAt: ""
    },
    currentPostComments: [],
    createPost: async( { groupId, formData } : { groupId: Group["id"] ; formData : FormData } ) => {
        const message = await createPost( { groupId, formData } );
        await get().fetchPosts( groupId );
        return message;
    },
    fetchPost: ( postId: Post["id"] ) => {
        set(() => ({
            post : get().posts.find( post => post.id === postId )
        }));
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
    fecthComment: ( commentId : Comment["id"] ) => {
        set(() => ({
            comment: get().currentPostComments.find( comment => comment.id === commentId )
        }));
    },
    cleanComment: ( ) => {
        set(() => ({
            comment: {
                id: 0,
                content: "",
                post_id: 0,
                user: {
                    id: 0,
                    name: "",
                    lastName: "",
                },
                createdAt: "",
                updatedAt: ""
            }
        }));
    },
    fecthComments: async( { groupId, postId } : { groupId: Group["id"] ; postId: Post["id"] } ) => {
        const comments = await getComments( { groupId, postId } );
        set(() => ({
            currentPostComments: comments
        }));
    }

});