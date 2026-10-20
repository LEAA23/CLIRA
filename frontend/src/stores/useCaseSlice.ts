import type { StateCreator } from "zustand";
import { createCase, getCases } from "../api/caseApi";
import type { Case } from "../types";

export type CaseSliceType = {
    cases: Case[];
    case: Case;
    createCase: (formData: FormData) => Promise<string | undefined>;
    getCases: () => Promise<void>;
    fetchCase: (caseId: number) => Promise<void>
}

export const createCaseSlice : StateCreator<CaseSliceType> = ((set, get) => ({
    cases: [],
    case: {
        id: 0,
        title: "",
        description: "",
        previewImage: "",
        simulationModel: "",
        filters: []
    },
    createCase: async( formData: FormData ) => {
        const message = await createCase( formData );
        return message;
    },
    getCases: async() => {
        const cases = await getCases();
        set(() => ({
            cases
        }));
    },
    fetchCase: async( caseId: Case["id"] ) => {
        set(() => ({
            case: get().cases.find( clinicalCase => clinicalCase.id === caseId )
        }));
    }
}));