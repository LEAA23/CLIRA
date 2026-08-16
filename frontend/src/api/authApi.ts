import { isAxiosError } from "axios"
import api from "../lib/axios";
import type { ConfirmToken, UserForgotPasswordForm, UserLoginForm, UserRegistrationForm, UserUpdatePassword, UserValidateToken } from "../types";
import { UserSchema } from "../schemas";


export const createAccount = async( formData : UserRegistrationForm ) => {
    try {
        const { data } = await api.post<string>("/auth/create-account", formData);
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error(error.response.data.error);
        }

        throw error;
    }
}

export const confirmAccount = async( token: ConfirmToken) => {
    try {
        const { data } = await api.post<string>("/auth/confirm-account", token);
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error(error.response.data.error);
        }

        throw error;
    }
}

export const loginAccount = async( formData : UserLoginForm ) => {
    try {
        const { data } = await api.post<string>("/auth/login", formData);
        //Guardamos en LocalStorage el token para arrancar la sesion
        localStorage.setItem("AUTH_TOKEN", data);
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error(error.response.data.error);
        }

        throw error;
    }
}

export const forgotPasswordAccount = async( formData : UserForgotPasswordForm ) => {
    try {
        const { data } = await api.post<string>("/auth/forgot-password", formData);
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error(error.response.data.error);
        }

        throw error;
    }
}

export const validateToken = async( token: UserValidateToken ) => {
    try {
        const { data } = await api.post<string>(`/auth/validate-token/${token.token}`);
        return data;
    } catch (error) {
        if ( isAxiosError(error) && error.response ) {
            throw new Error(error.response.data.error);
        }

        throw error;
    }
}

export const updatePassword = async( {token, password, repeatPassword} : UserUpdatePassword ) => {
    try {
        const { data } = await api.post<string>(`/auth/update-password/${token}`, {password, repeatPassword});
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error(error.response.data.error);
        }

        throw error;
    }
}

export const getUserAuth = async() => {
    try {
        //Extraemos los datos del usuario del objeto de Axios
        const {data: { user }} = await api.get("/auth/user");
        //Validamos que los datos tengan la misma estructura que el Schema
        const response = UserSchema.safeParse(user);
        if(response.data) {
            return response.data;
        }
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}