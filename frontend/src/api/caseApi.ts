import { isAxiosError } from "axios"
import api from "../lib/axios";
import { CaseSchema, CasesSquema, PublicCasesSchema, laboratoryStudiesSchema, laboratoryStudyResultsSchema, MetricsSquema } from "../schemas";
import type { Case, Filter, PublicCase } from "../types";

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

export const getPublicCases = async (): Promise<PublicCase[]> => {
    try {
        const { data } = await api.get("/cases/public");

        const response = PublicCasesSchema.safeParse(data.cases);

        if (!response.success) {
            console.error(
                "Error al validar los casos públicos:",
                response.error
            );

            throw new Error(
                "Los datos de los casos no tienen un formato válido"
            );
        }

        return response.data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(
                error.response.data.error ||
                "No se pudieron cargar los casos clínicos"
            );
        }

        throw error;
    }
};

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

export const getLaboratorystudies = async() => {
    try {
        const { data: { laboratoryStudies } } = await api.get("/cases/laboratoryStudies");
        console.log(laboratoryStudies)
        const response = laboratoryStudiesSchema.safeParse( laboratoryStudies );
        console.log(response)
        if( response.data ) {
            return response.data;
        }
    } catch (error) {
        if( isAxiosError( error ) && error.response ) {
            throw new Error( error.response.data.error );
        }
    }
}

export const getPatientLaboratorystudies = async ({ caseId, patientlaboratoryStudies }: { caseId: Case["id"]; patientlaboratoryStudies: number[]; }) => {
    try {
        const { data: { laboratoryResults } } = await api.post(`/cases/${caseId}/laboratoryStudies`, { laboratoryStudies: patientlaboratoryStudies });

        const response = laboratoryStudyResultsSchema.safeParse(laboratoryResults);

        if (!response.success) {
            console.error(response.error);
            throw new Error("Formato de resultados de laboratorio inválido");
        }

        return response.data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }

        throw error;
    }
};

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

export const getCorporalMetrics = async( { caseId, metricsSelected } : { caseId: Case["id"] ; metricsSelected: string[] } ) => {
    try {
        const { data: { metrics } } = await api.post(`/cases/${caseId}/corporalMetrics`, { caseId, metricsSelected } );
        console.log(metrics)
        const response = MetricsSquema.safeParse( metrics );
        console.log(response)
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
}

export type FilterCategory = {
    id: number;
    name: string;
    filters: Filter[];
};

export const getFilterCategories = async (): Promise<FilterCategory[]> => {
    try {
        const { data } = await api.get<{ categories: FilterCategory[] }>(
            "/cases/filters/categories"
        );

        return data.categories;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(
                error.response.data.error ||
                "No se pudieron obtener las categorías"
            );
        }

        throw error;
    }
};