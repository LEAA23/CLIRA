import type { StateCreator } from "zustand";
import { createCase, deleteCase, deleteCaseImage, deleteCaseModel, getCases, getSimulation, updateCase } from "../api/caseApi";
import type { Case } from "../types";

export type CaseSliceType = {
    cases: Case[];
    case: Case;
    createCase: (formData: FormData) => Promise<string | undefined>;
    getCases: () => Promise<void>;
    fetchCase: (caseId: number) => Promise<void>;
    updateCase: ({ caseId, formData }: { caseId: number; formData: FormData; }) => Promise<string | undefined>;
    deleteCaseImage: (caseId: number) => Promise<string | undefined>;
    deleteCaseModel: (caseId: number) => Promise<string | undefined>;
    deleteCase: (caseId: number) => Promise<string | undefined>;
    cleanCase: () => void;
    fetchSimulation: (caseId: number) => Promise<void>;
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
        await get().getCases();
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
    fetchSimulation: async( caseId: Case["id"] ) => {
        const clinicalCase = await getSimulation( caseId );
        set(() => ({
            case: clinicalCase
        }));
    },
    updateCase: async( { caseId, formData } : { caseId: Case["id"] ; formData: FormData } ) => {
        const message = await updateCase( { caseId, formData } );
        await get().getCases();
        return message;
    },
    deleteCaseImage: async( caseId : Case["id"] ) => {
        const message = await deleteCaseImage( caseId );
        set(() => ({
            cases: get().cases.map( clinicalCase => {
                if( clinicalCase.id === caseId ) {
                    console.log(true)
                    return {
                        ...clinicalCase,
                        previewImage: ""
                    }
                }
                return clinicalCase;
            } ),
            case: {
                ...get().case,
                previewImage: ""
            }
        }));
        return message;
    },
    deleteCaseModel: async( caseId : Case["id"] ) => {
        const message = await deleteCaseModel( caseId );
        set(() => ({
            cases: get().cases.map( clinicalCase => {
                if( clinicalCase.id === caseId ) {
                    return {
                        ...clinicalCase,
                        simulationModel: ""
                    }
                }
                return clinicalCase;
            } ),
            case: {
                ...get().case,
                simulationModel: ""
            }
        }))
        return message;
    },
    cleanCase: () => {
        set(() => ({
            case: {
                id: 0,
                title: "",
                description: "",
                previewImage: "",
                simulationModel: "",
                teacher_id: 0,
                filters: []
            }
        }))
    },
    deleteCase: async( caseId: Case["id"] ) => {
        const message = await deleteCase( caseId );
        set(() => ({
            cases: get().cases.filter( clinicalCase => clinicalCase.id !== caseId )
        }));
        get().cleanCase();
        return message;
    }
}));