import { isAxiosError } from "axios"
import api from "../lib/axios";

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