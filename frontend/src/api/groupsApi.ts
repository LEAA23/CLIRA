import { isAxiosError } from "axios"
import api from "../lib/axios";
import { CommentsSchema, GroupResponse, GroupsSchema, likePostSquema, PostsSchema, UserSearchSchema } from "../schemas";
import type { AddMemberForm, Comment, CommentForm, Group, Post, RemoveMemberForm, UserSearchForm } from "../types";

export const getGroups = async() => {
    try {
        const { data: { groups } } = await api("/groups");
        const response = GroupsSchema.safeParse(groups);
        if(response.data) {
            return response.data;
        }
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const getGroup = async( id: Group["id"] ) => {
    try {
        const { data: { group } } = await api(`/groups/${id}`);
        const response = GroupResponse.safeParse(group);
        if(response.data) {
            return response.data;
        }
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const createGroup = async( formData: FormData ) => {
    try {
        const { data } = await api.post<string>("/groups", formData);
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }
        throw error;
    }
}

export const updateGroup = async( { groupId, formData } : { groupId: number ; formData: FormData } ) => {
    try {
        const { data } = await api.patch<string>(`/groups/${groupId}`, formData );
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }
        throw error;
    }
}

export const deleteGroup = async( id : Group["id"] ) => {
    try {
        const { data } = await api.delete<string>(`/groups/${ id }`);
        console.log(data)
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }
        throw error;
    }
}

/**
 * MEMBERS
 */
export const searchUser = async( email : UserSearchForm["email"] ) => {
    try {
        const { data: { user } } = await api(`/users?email=${email}`);
        const response = UserSearchSchema.safeParse(user);
        if( response.data ) {
            return response.data;
        }

    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }

        throw error;
    }
}

export const addMembertoGroup = async(  { groupId, email } : { groupId : Group["id"] ; email: AddMemberForm["email"] } ) => {
    try {
        const { data } = await api.post<string>(`/groups/${groupId}/members`, {email});
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }
        throw error;
    }
}

export const searchDeleteUser = async( { groupId, email } : { groupId: Group["id"] ; email: RemoveMemberForm["email"] } ) => {
    try {
        const { data: user } = await api(`/groups/${groupId}/members?email=${email}`);
        const response = UserSearchSchema.safeParse( user.user );
        if(response.data) {
            return response.data;
        }

    } catch (error) {
        if( isAxiosError( error ) && error.response ) {
            throw new Error( error.response.data.error );
        }

        throw error;
    }
}

export const removeMemberFromGroup = async( { groupId, email } : { groupId: Group["id"] ; email: RemoveMemberForm["email"] } ) => {
    try {
        const { data } = await api.delete<string>(`/groups/${groupId}/members?email=${email}`);
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }

        throw error;
    }
}

/**
 * POSTS ENDPOINTS
 */
export const createPost = async( { groupId, formData } : { groupId: Group["id"] ; formData: FormData } ) => {
    try {
        const { data } = await api.post<string>(`/groups/${groupId}/posts`, formData);
        return data;
    } catch (error) {
        if( isAxiosError( error ) && error.response ) {
            throw new Error( error.response.data.error );
        }

        throw error;
    }
}

export const getPosts = async(  groupId : Group["id"]  ) => {
    try {
        const { data } = await api(`/groups/${groupId}/posts`);
        const response = PostsSchema.safeParse( data.posts );
        if( response.data ) {
            return response.data;
        }
    } catch (error) {
        if( isAxiosError( error ) && error.response ) {
            throw new Error( error.response.data.error );
        }

        throw error
    }
}

export const likePost = async( { groupId, postId } : { groupId: Group["id"] ; postId: Post["id"] } ) => {
    try {
        const { data } = await api.post(`/groups/${groupId}/posts/${postId}/likePost`);
        const response = likePostSquema.safeParse( data );
        if( response.data ) {
            return response.data;
        }

    } catch (error) {
        console.log(error)
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const createComment = async( { groupId, postId, content } : { groupId : Group["id"] ; postId: Post["id"] ; content: CommentForm["content"] } ) => {
    try {
        const { data } = await api.post<string>(`/groups/${groupId}/posts/${postId}/comments`, {content});
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const getComments = async( { groupId, postId } : { groupId : Group["id"] ; postId: Post["id"] } ) => {
    try {
        const { data: { comments } } = await api(`/groups/${groupId}/posts/${postId}/comments`);
        const response = CommentsSchema.safeParse( comments );
        if( response.data ) {
            return response.data;
        }

    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const updateComment = async( { groupId, postId, commentId, content } : { groupId: Group["id"] ; postId: Post["id"] ; commentId: Comment["id"] ; content: CommentForm["content"] } ) => {
    try {
        const { data } = await api.patch<string>(`/groups/${groupId}/posts/${postId}/comments/${commentId}`, {content} );
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }
        throw error;
    }
}