import type { StateCreator } from "zustand";
import { createCase } from "../api/caseApi";

export type CaseSliceType = {
    createCase: (formData: FormData) => Promise<string | undefined>
}

export const createCaseSlice : StateCreator<CaseSliceType> = (() => ({

    createCase: async( formData: FormData ) => {
        const message = await createCase( formData );
        return message;
    }
}));