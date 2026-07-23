import { type StateCreator } from "zustand";
import { confirmAccount, createAccount, forgotPasswordAccount, loginAccount, updatePassword, validateToken } from "../api/authApi";
import type { ConfirmToken, UserForgotPasswordForm, UserLoginForm, UserRegistrationForm, UserUpdatePassword, UserValidateToken } from "../types";

export type AuthSliceType = {
    createAccount: ( formData : UserRegistrationForm ) => Promise<string>;
    confirmAccount: ( token : ConfirmToken["token"] ) => Promise<string>;
    login: ( formData : UserLoginForm ) => Promise<string>;
    forgotPassword: ( formData : UserForgotPasswordForm ) => Promise<string>;
    updatePasswordAccount: ( data : UserUpdatePassword ) => Promise<string>;
    validateTokenAccount: ( token: UserValidateToken["token"] ) => Promise<string>;
}

//StateCreator nos ayuda a tipar de mejor forma nuestros slides ademas de tipar a set y get
export const createAuthSlice : StateCreator<AuthSliceType> = () => ({

    createAccount: async( formData : UserRegistrationForm ) => {
        const message = await createAccount(formData);
        return message;
    },
    confirmAccount: async( token : ConfirmToken["token"] ) => {
        const message = await confirmAccount({token});
        return message;
    },
    login: async( formData : UserLoginForm ) => {
        const message = await loginAccount( formData );
        return message;
    },
    forgotPassword: async( formData : UserForgotPasswordForm ) => {
        const message = await forgotPasswordAccount( formData );
        return message;
    },
    updatePasswordAccount: async( data: UserUpdatePassword ) => {
        const message = await updatePassword( data );
        return message;
    },
    validateTokenAccount: async( token : UserValidateToken["token"] ) => {
        const message = await validateToken( {token} );
        return message;
    }
});