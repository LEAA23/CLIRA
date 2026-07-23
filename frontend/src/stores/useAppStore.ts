import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createAuthSlice, type AuthSliceType } from "./useAuthStore";

//Store principal para manejar el estado de la aplicacion via zustand y slide stores
export const useAppStore = create<AuthSliceType>()(
    devtools(((...a) => ({
        ...createAuthSlice(...a)
    })))
);