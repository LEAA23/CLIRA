import { isAxiosError } from "axios"
import type { Case, Symptom } from "../types";
import api from "../lib/axios";
import { askQuestionResponse } from "../schemas";


export const askPatientSymptomsAndHistory = async( { caseId, question } : { caseId: Case["id"] ; question: Symptom } ) => {
    try {
        const { data } = await api.post(`/cases/${caseId}/askQuestion`, { caseId, question } );
        console.log(data)
        const response = askQuestionResponse.safeParse( data );
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