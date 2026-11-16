import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";

import CorrectvsIncorrectChart from "../../components/dashboard/charts/CorrectvsIncorrectChart";
import DiagnosticAccuracyChart from "../../components/dashboard/charts/DiagnosticAccuracyChart";
import ErrorReductionChart from "../../components/dashboard/charts/ErrorReductionChart";
import ResourceEfficiencyChart from "../../components/dashboard/charts/ResourceEfficiencyChart";
import PerformanceChart from "../../components/dashboard/charts/PerformanceChart";

import { getRanking } from "../../api/rankingApi";

import {
    CheckCircleIcon,
    ClockIcon,
    TrophyIcon,
} from "@heroicons/react/16/solid";

import { getCases, getCompletedCases } from "../../api/caseApi";
import { useAppStore } from "../../stores/useAppStore";

// Convierte los segundos a un formato legible.
const formatDuration = (
    totalSeconds: number | null | undefined
): string => {
    if (
        totalSeconds === null ||
        totalSeconds === undefined ||
        !Number.isFinite(totalSeconds) ||
        totalSeconds <= 0
    ) {
        return "Sin datos";
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (minutes === 0) {
        return `${seconds} s`;
    }

    if (seconds === 0) {
        return `${minutes} min`;
    }

    return `${minutes} min ${seconds} s`;
};

const DashBoardView = () => {
    const getMetrics = useAppStore(state => state.getMetrics);
    const userMetrics = useAppStore(state => state.userMetrics);
    const userId = useAppStore(state => state.user.id);

    const [completedCount, setCompletedCount] = useState<number | null>(null);
    const [pendingCount, setPendingCount] = useState<number | null>(null);
    const [rankPosition, setRankPosition] = useState<number | null>(null);

    // Carga los casos y las métricas del dashboard.
    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [cases, completed] = await Promise.all([
                    getCases(),
                    getCompletedCases(),
                    getMetrics()
                ]);

                if (!cases) {
                    throw new Error(
                        "No se pudieron consultar los casos disponibles"
                    );
                }

                const totalCases = cases.length;

                setCompletedCount(completed);
                setPendingCount(Math.max(0, totalCases - completed));
            } catch (error) {
                console.error("Error al cargar el dashboard:", error);

                setCompletedCount(null);
                setPendingCount(null);
            }
        };

        void loadDashboard();
    }, [getMetrics]);

    // Obtiene la posición real del usuario en el ranking.
    useEffect(() => {
        let active = true;

        const loadUserRanking = async () => {
            if (userId == null) {
                setRankPosition(null);
                return;
            }

            try {
                const ranking = await getRanking();

                const currentUser = ranking.find(
                    entry => Number(entry.id) === Number(userId)
                );

                if (active) {
                    setRankPosition(currentUser?.position ?? null);
                }
            } catch (error) {
                console.error(
                    "Error al obtener la posición del usuario:",
                    error
                );

                if (active) {
                    setRankPosition(null);
                }
            }
        };

        void loadUserRanking();

        return () => {
            active = false;
        };
    }, [userId]);

    return (
        <>
            <h1 className="text-center font-bold text-5xl my-10 text-blue-500">
                Dashboard
            </h1>

            {/* Métricas principales */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-5 mb-5">

                {/* Casos completados */}
                <div className="bg-white p-5 max-w-full rounded-2xl shadow mt-5">
                    <h3 className="flex items-center font-bold text-gray-500">
                        <CheckCircleIcon className="h-6 mr-3" />
                        Casos completados
                    </h3>

                    <p className="text-7xl font-bold text-center bg-linear-to-r from-blue-500 to-blue-50 bg-clip-text text-transparent">
                        {completedCount ?? "—"}
                    </p>
                </div>

                {/* Casos pendientes */}
                <div className="bg-white p-5 max-w-full rounded-2xl shadow mt-5">
                    <h3 className="flex items-center font-bold text-gray-500">
                        <ClockIcon className="h-6 mr-3" />
                        Casos pendientes
                    </h3>

                    <p className="text-7xl font-bold text-center bg-linear-to-r from-blue-500 to-blue-50 bg-clip-text text-transparent">
                        {pendingCount ?? "—"}
                    </p>
                </div>

                {/* Ranking real */}
                <div className="bg-white p-5 max-w-full rounded-2xl shadow mt-5">
                    <h3 className="flex items-center font-bold text-gray-500">
                        <TrophyIcon className="h-6 mr-3" />
                        Ranking
                    </h3>

                    <p className="text-7xl font-bold text-center bg-linear-to-r from-blue-500 to-blue-50 bg-clip-text text-transparent">
                        {rankPosition !== null
                            ? `#${rankPosition}`
                            : "—"}
                    </p>
                </div>
            </div>

            {/* Rendimiento diagnóstico */}
            <div className="bg-white p-5 max-w-full mx-auto rounded-2xl shadow w-full">
                <h3 className="text-2xl font-bold mb-5 text-gray-500">
                    Rendimiento Diagnóstico
                </h3>

                <div className="grid space-y-10 md:grid-cols-2 lg:grid-cols-3 lg:space-y-0 items-center justify-center text-center">
                    <DiagnosticAccuracyChart
                        value={userMetrics.diagnosis_accuracy}
                    />

                    {/* Tiempo promedio por simulación */}
                    <div className="flex flex-col items-center">
                        <ClockIcon className="h-15 text-gray-500" />

                        <p className="text-gray-500 font-bold mt-3">
                            Tiempo por simulación
                        </p>

                        <h3 className="text-4xl font-bold text-blue-500 mt-2">
                            {formatDuration(
                                userMetrics.average_duration_seconds
                            )}
                        </h3>
                    </div>

                    <CorrectvsIncorrectChart
                        last_simulations={userMetrics.last_simulations}
                    />
                </div>
            </div>

            {/* Métricas de desempeño */}
            <div className="grid md:grid-cols-2 gap-x-5">
                <div className="bg-white p-5 max-w-full rounded-2xl shadow mt-5">
                    <h3 className="text-2xl font-bold mb-5 text-gray-500">
                        Reducción de errores
                    </h3>

                    <ErrorReductionChart
                        simulations={userMetrics.error_reduction.history}
                    />
                </div>

                <div className="bg-white p-5 max-w-full rounded-2xl shadow mt-5">
                    <h3 className="text-2xl font-bold mb-5 text-gray-500">
                        Uso eficiente de recursos
                    </h3>

                    <ResourceEfficiencyChart
                        simulations={userMetrics.resources_eficienty}
                    />
                </div>
            </div>

            {/* Rendimiento */}
            <div className="bg-white p-5 max-w-full rounded-2xl shadow mt-5">
                <h3 className="text-2xl font-bold mb-5 text-gray-500">
                    Mejora en rendimiento
                </h3>

                <PerformanceChart
                    simulations={userMetrics.performance}
                />
            </div>
        </>
    );
};

export default DashBoardView;
