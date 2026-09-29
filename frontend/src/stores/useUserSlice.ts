import type { StateCreator } from "zustand";
import type { UserProfile } from "../types";
import { getUserById } from "../api/userApi";

export type UserSliceType = {
    userProfileSearched: UserProfile;
    fetchUserProfile: (id: number) => Promise<void>;
}

export const createUserSlice : StateCreator<UserSliceType> = ( set ) => ({
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
    }
});