import type { StateCreator } from "zustand";
import { createCase, getCases, updateCase } from "../api/caseApi";
import type { Case } from "../types";

export type CaseSliceType = {
    cases: Case[];
    case: Case;
    createCase: (formData: FormData) => Promise<string | undefined>;
    getCases: () => Promise<void>;
    fetchCase: (caseId: number) => Promise<void>;
    updateCase: ({ caseId, formData }: { caseId: number; formData: FormData; }) => Promise<string | undefined>;
}

export const createCaseSlice : StateCreator<CaseSliceType> = ((set, get) => ({
    cases: [],
    case: {
        id: 0,
        title: "",
        description: "",
        previewImage: "",
        simulationModel: "",
        teacher_id: 0,
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
    },
    updateCase: async( { caseId, formData } : { caseId: Case["id"] ; formData: FormData } ) => {
        const message = await updateCase( { caseId, formData } );
        set(() => ({
            cases: get().cases.map( clinicalCase => {
                if( clinicalCase.id === caseId ) {
                    const newModel = formData.get("simulationModel");
                    const newImage = formData.get("previewImage");

                    return {
                        ...clinicalCase,
                        title: formData.get("title") as string,
                        description: formData.get("description") as string,

                        // Si no hay archivo nuevo, conserva el anterior
                        previewImage: newImage instanceof File? URL.createObjectURL(newImage) : clinicalCase.previewImage,
                        simulationModel: newModel instanceof File? URL.createObjectURL(newModel) : clinicalCase.simulationModel,
                    }
                }
                return clinicalCase;
            } )
        }))
        return message;
    }
}));