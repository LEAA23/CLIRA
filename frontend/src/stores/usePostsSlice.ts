import type { StateCreator } from "zustand"
import type { Comment, CommentForm, Comments, Group, Post, PostImage, Posts } from "../types";
import { createComment, createPost, deleteComment, deletePostImage, getComments, getPostImages, getPosts, likePost, updateComment } from "../api/groupsApi";

export type PostsSliceType = {
    posts: Posts;
    post: Post;
    currentPostComments: Comments;
    comment: Comment;
    createPost: ({ groupId, formData }: { groupId: number; formData: FormData; }) => Promise<string>;
    fetchPost: (postId: number) => void;
    fetchPostImages: ({ groupId, postId }: { groupId: number; postId: number; }) => Promise<void>;
    fetchPosts: (groupId: number) => Promise<void>;
    deletePostImage: ({ groupId, postId, imageId }: { groupId: number; postId: number; imageId: number; }) => Promise<string>;
    likePost: ({ groupId, postId }: { groupId: number; postId: number; }) => Promise<{ liked: boolean; likes: number; } | undefined>;
    createComment: ({ groupId, postId, content }: { groupId: number; postId: number; content: string; }) => Promise<string | undefined>;
    fecthComment: (commentId: number) => void;
    fecthComments: ({ groupId, postId }: { groupId: number; postId: number; }) => Promise<void>;
    cleanComment: () => void;
    updateComment: ({ groupId, postId, commentId, content }: { groupId: number; postId: number; commentId: number; content: string; }) => Promise<string>;
    deleteComment: ({ groupId, postId, commentId }: { groupId: number; postId: number; commentId: number; }) => Promise<string>;
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
    fetchPostImages: async( { groupId, postId } : { groupId: Group["id"]; postId: Post["id"] } ) => {
        const images = await getPostImages( { groupId, postId } );
        set( state => ({
            post: {
                ...state.post,
                images
            }
        }))
    },
    fetchPosts: async( groupId : Group["id"] ) => {
        const posts = await getPosts( groupId );
        set(() => ({
            posts
        }));
    },
    deletePostImage: async( { groupId, postId, imageId } : { groupId: Group["id"]; postId: Post["id"]; imageId: PostImage["id"] } ) => {
        const message = await deletePostImage( { groupId, postId, imageId } );
        set( state => ({
            post: {
                ...state.post,
                images: state.post.images.filter( image => image.id !== imageId )
            }
        }));
        return message;
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
            } ),
            
            post:
                likePostData && get().post.id === likePostData.id? {
                    ...get().post,
                    likedByMe: likePostData.likedByMe,
                    likesCount: likePostData.likesCount
                }:
                get().post
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
    },
    updateComment: async( { groupId, postId, commentId, content } : { groupId: Group["id"] ; postId: Post["id"] ; commentId: Comment["id"] ; content: CommentForm["content"] } ) => {
        const message = await updateComment( { groupId, postId, commentId, content } );
        if( message === "El comentario se actualizo correctamente" ) {
            set(() => ({
                currentPostComments: get().currentPostComments.map( comment => {
                    if( comment.id === commentId ) {
                        return {
                            ...comment,
                            content
                        }
                    }

                    return comment;
                } )
            }));
        }
        return message;
    },
    deleteComment: async( { groupId, postId, commentId } : { groupId: Group["id"] ; postId: Post["id"]; commentId: Comment["id"] } ) => {
        const message = await deleteComment( { groupId, postId, commentId } );
        set(() => ({
            currentPostComments: get().currentPostComments.filter( comment => comment.id !== commentId )
        }));
        get().cleanComment();
        return message;
    }

});