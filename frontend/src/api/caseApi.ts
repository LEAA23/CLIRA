import { isAxiosError } from "axios"
import api from "../lib/axios";
import { CasesSquema } from "../schemas";

export const createCase = async( formData: FormData ) => {
    try {
        const {data} = await api.post<string>("/cases", formData);
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const getCases = async() => {
    try {
        const { data } = await api("/cases");
        const response = CasesSquema.safeParse( data );
        if( response.data ) {
            return response.data;
        }
    } catch (error) {
        if( isAxiosError( error ) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}