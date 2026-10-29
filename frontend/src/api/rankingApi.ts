import { isAxiosError } from "axios";
import api from "../lib/axios";

export type RankingEntry = {
    id: number;
    name: string;
    lastName: string;
    email: string;
    profileImage: string | null;
    completedCount: number;
    points: number;
    position: number;
};

export const getRanking = async (): Promise<RankingEntry[]> => {
    try {
        const { data } = await api.get<{
            ranking: RankingEntry[];
        }>("/users/ranking");

        return data.ranking;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(
                error.response.data.error ||
                "No se pudo obtener el ranking"
            );
        }

        throw error;
    }
};