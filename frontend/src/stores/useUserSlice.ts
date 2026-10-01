import type { StateCreator } from "zustand";
import type { UserProfile, UserSearched } from "../types";
import { getUserById, updateProfileImage } from "../api/userApi";

export type UserSliceType = {
    userProfileSearched: UserProfile;
    fetchUserProfile: (id: number) => Promise<void>;
    updateProfileImage: ({ id, formData }: { id: number; formData: FormData; }) => Promise<string>
}

export const createUserSlice : StateCreator<UserSliceType> = ( set, get ) => ({
    userProfileSearched: {
        name: "",
        lastName: "",
        email: "",
        id: 0,
        profileImage: null,
        rol: ""      
    },
    fetchUserProfile: async( id: UserProfile["id"] ) => {
        const userProfileSearched = await getUserById( id );
        set(() => ({
            userProfileSearched
        }))
    },
    updateProfileImage: async( { id, formData }: { id: UserSearched["id"]; formData: FormData } ) => {
        const message = await updateProfileImage( { id, formData } );
        await get().fetchUserProfile(id)
        set(state => ({
            userProfileSearched: {
                ...state.userProfileSearched
            }
        }))
        return message;
    }
});