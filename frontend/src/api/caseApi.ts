import { isAxiosError } from "axios"
import api from "../lib/axios";
import { CaseSchema, CasesSquema } from "../schemas";
import type { Case } from "../types";

export const createCase = async( formData: FormData ) => {
    try {
        const {data} = await api.post<string>("/cases", formData);
        return data;
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const getCases = async() => {
    try {
        const { data } = await api("/cases");
        const response = CasesSquema.safeParse( data.cases );
        if( response.data ) {
            return response.data;
        }
    } catch (error) {
        if( isAxiosError( error ) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const updateCase = async( { caseId, formData } : { caseId: Case["id"] ; formData: FormData } ) => {
    try {
        const { data } = await api.patch<string>(`/cases/${caseId}`, formData );
        return data;
    } catch (error) {
        if( isAxiosError( error ) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const deleteCaseImage = async( caseId : Case["id"] ) => {
    try {
        const { data } = await api.patch<string>(`/cases/${caseId}/deleteCaseImage`);
        return data;
    } catch (error) {
        if( isAxiosError( error ) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const deleteCaseModel = async( caseId : Case["id"] ) => {
    try {
        const { data } = await api.patch<string>(`/cases/${caseId}/deleteCaseModel`);
        return data;
    } catch (error) {
        if( isAxiosError( error ) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const deleteCase = async( caseId : Case["id"] ) => {
    try {
        const { data } = await api.delete<string>(`/cases/${caseId}`);
        return data;
    } catch (error) {
        if( isAxiosError( error ) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const getSimulation = async( caseId: Case["id"] ) => {
    try {
        const { data: { clinicalCase } } = await api.get(`/cases/${caseId}`);
        const response = CaseSchema.safeParse( clinicalCase );
        if( response.data ) {
            return response.data;
        }
    } catch (error) {
        if( isAxiosError( error ) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const completeCase = async (caseId: number) => {
    try {
        const { data } = await api.post<{ completedCount: number }>(
            `/cases/${caseId}/complete`
        );

        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(
                error.response.data.error || "No se pudo completar el caso"
            );
        }

        throw error;
    }
};

export const getCompletedCases = async (): Promise<number> => {
    try {
        const { data } = await api.get<{ completedCount: number }>(
            "/cases/progress/completed"
        );

        return data.completedCount;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(
                error.response.data.error ||
                "No se pudieron consultar los casos completados"
            );
        }

        throw error;
    }
};