import type { StateCreator } from "zustand";
import type { DashboardMetrics } from "../types";
import { getMetrics } from "../api/dashboardAPI";

export type  DashboardSliceType = {
    userMetrics: DashboardMetrics;
    getMetrics: () => Promise<void>;
}

export const createDashboardSlice : StateCreator< DashboardSliceType > = ((set) => ({
    userMetrics: {
        diagnosis_accuracy: 0,
        last_simulations: [],
        error_reduction: {
            current: 0,
            history: []
        },
        resources_eficienty: [],
        performance: []
    },

    getMetrics: async() => {
        const userMetrics = await getMetrics();
        set(() => ({
            userMetrics
        }));
    }
}))