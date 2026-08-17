import { isAxiosError } from "axios"
import api from "../lib/axios";
import { GroupsSchema } from "../schemas";

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