import { isAxiosError } from "axios"
import api from "../lib/axios";
import { GroupShcema, GroupsSchema } from "../schemas";
import type { Group } from "../types";

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
        const response = GroupShcema.safeParse(group);
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