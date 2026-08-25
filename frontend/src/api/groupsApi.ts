import { isAxiosError } from "axios"
import api from "../lib/axios";
import { GroupResponse, GroupsSchema } from "../schemas";
import type { AddMemberForm, Group } from "../types";

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