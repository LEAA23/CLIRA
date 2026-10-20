import type { StateCreator } from "zustand";
import { createCase, getCases } from "../api/caseApi";
import type { Case } from "../types";

export type CaseSliceType = {
    cases: Case[];
    createCase: (formData: FormData) => Promise<string | undefined>;
    getCases: () => Promise<void>;
}

export const createCaseSlice : StateCreator<CaseSliceType> = ((set) => ({
    cases: [],
    createCase: async( formData: FormData ) => {
        const message = await createCase( formData );
        return message;
    },
    getCases: async() => {
        const cases = await getCases();
        set(() => ({
            cases
        }));
    }
}));