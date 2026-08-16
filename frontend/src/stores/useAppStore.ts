import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createAuthSlice, type AuthSliceType } from "./useAuthSlice";
import { createGroupsSlice, type GroupsSliceType } from "./useGroupsSlice";

//Store principal para manejar el estado de la aplicacion via zustand y slide stores
export const useAppStore = create<AuthSliceType & GroupsSliceType>()(
    devtools(((...a) => ({
        ...createAuthSlice(...a),
        ...createGroupsSlice(...a)
    })))
);