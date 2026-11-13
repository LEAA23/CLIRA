import { isAxiosError } from "axios"
import api from "../lib/axios";
import { DashboardMetricsSquema } from "../schemas";

export const getMetrics = async() => {
    try {
        const { data } = await api(`/dashboard`);
        console.log(data)
        const response = DashboardMetricsSquema.safeParse( data );
        console.log(response)
        if(response.data) {
            return response.data
        }
    } catch (error) {
        if( isAxiosError(error) && error.response ) {
            throw new Error(error.response.data.error);
        }
    }
}