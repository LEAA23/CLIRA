import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createAuthSlice, type AuthSliceType } from "./useAuthSlice";
import { createGroupsSlice, type GroupsSliceType } from "./useGroupsSlice";
import { createPostsSlice, type PostsSliceType } from "./usePostsSlice";
import { createUserSlice, type UserSliceType } from "./useUserSlice";
import { createCaseSlice, type CaseSliceType } from "./useCaseSlice";

//Store principal para manejar el estado de la aplicacion via zustand y slide stores
export const useAppStore = create<AuthSliceType & GroupsSliceType & PostsSliceType & UserSliceType & CaseSliceType>()(
    devtools(((...a) => ({
        ...createAuthSlice(...a),
        ...createGroupsSlice(...a),
        ...createPostsSlice(...a),
        ...createUserSlice(...a),
        ...createCaseSlice(...a)
    })))
);