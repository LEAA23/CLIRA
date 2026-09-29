import { isAxiosError } from "axios"
import api from "../lib/axios";
import type { UserSearched } from "../types";
import { UserProfileSchema } from "../schemas";


export const getUserById = async( id: UserSearched["id"] ) => {
    try {
        const { data: {user} } = await api(`/users/${ id }`);
        const response = UserProfileSchema.safeParse( user );
        if( response.data ) {
            return response.data;
        }
    } catch (error) {
        if( isAxiosError( error ) && error.response ) {
            throw new Error( error.response.data.error );
        }

        throw error;
    }
}