
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import Experience from "../../SimulationExperiences/PatientExperience/Experience";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../stores/useAppStore";
import { useNavigate, useParams } from "react-router-dom";
import { completeCase } from "../../api/caseApi";

import SymptomsAndHistory from "../../components/simulation/SymptomsAndHistory";
import CorporalMetrics from "../../components/simulation/CorporalMetrics";
import LaboratoryStudiesComponent from "../../components/simulation/LaboratoyStudies";
import ClinicalStudiesCarousel from "../../components/simulation/ClinicalStudiesCarousel";
import CaseCompletedModal from "../../components/simulation/CaseCompletedModal";

import { useForm } from "react-hook-form";
import ErrorMessage from "../../components/ErrorMessage";
import type { DiagnosisForm } from "../../types";
import { toast } from "react-toastify";

const SimulationView = () => {
    // Referencia al canvas de la simulación
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Navegación entre vistas
    const navigate = useNavigate();
    const params = useParams();
    const caseId = Number(params.id);

    // Estados del diagnóstico
    const [savingDiagnosis, setSavingDiagnosis] = useState(false);
    const [diagnosisMessage, setDiagnosisMessage] = useState("");

    // Contador de tiempo de la simulación
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    const startTimeRef = useRef<number | null>(null);
    const timerStoppedRef = useRef(false);
    const stoppedDurationRef = useRef<number | null>(null);

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<DiagnosisForm>({
        defaultValues: {
            diagnosis: ""
        }
    });

    // Funciones del store
    const fetchSimulation = useAppStore(
        (state) => state.fetchSimulation
    );

    const getLaboratorystudies = useAppStore(
        (state) => state.getLaboratorystudies
    );

    const diagnose = useAppStore(
        (state) => state.diagnose
    );

    // Tipo para los estudios de laboratorio
    interface LaboratoryStudy {
        id: number;
        name: string;
    }

    const [laboratoryStudies, setLaboratoryStudies] = useState<LaboratoryStudy[]>([]);

    // Iniciar el contador al entrar a una simulación
    useEffect(() => {
        if (!Number.isInteger(caseId) || caseId <= 0) return;

        startTimeRef.current = performance.now();
        timerStoppedRef.current = false;
        stoppedDurationRef.current = null;

        setElapsedSeconds(0);

        const interval = window.setInterval(() => {
            if (
                startTimeRef.current === null ||
                timerStoppedRef.current
            ) {
                return;
            }

            const elapsed = Math.floor(
                (performance.now() - startTimeRef.current) / 1000
            );

            setElapsedSeconds(elapsed);
        }, 1000);

        return () => {
            window.clearInterval(interval);
        };
    }, [caseId]);

    // Cargar la información del caso clínico
    useEffect(() => {
        if (!Number.isInteger(caseId) || caseId <= 0) return;

        fetchSimulation(caseId);
    }, [caseId, fetchSimulation]);

    // Obtener los estudios de laboratorio disponibles
    useEffect(() => {
        const fetchStudies = async () => {
            const studies = await getLaboratorystudies();

            if (studies) {
                setLaboratoryStudies(studies);
            }
        };

        fetchStudies();
    }, [getLaboratorystudies]);

    // Caso clínico actual
    const clinicalCase = useAppStore(
        (state) => state.case
    );

    // Inicializamos la simulación únicamente cuando el caso ya está cargado
    useEffect(() => {
        // Evitamos iniciar la escena antes de recibir los datos del caso.
        if (!clinicalCase || clinicalCase.id !== caseId) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        console.log("Caso cargado:", clinicalCase);
        console.log("Modelo 3D recibido:", clinicalCase.simulationModel);

        const patientExperience = new Experience(canvas);

        // Limpiamos la experiencia al salir de la simulación.
        return () => {
            patientExperience.destroy();
        };
    }, [clinicalCase?.id, clinicalCase?.simulationModel, caseId]);

    // Abandonar la simulación y regresar al catálogo
    const handleAbandonSimulation = () => {
        window.close();
        navigate("/clinical-cases", { replace: true });
    };

    // Enviar el diagnóstico y registrar el caso como completado
    const handleDiagnosisSubmit = async (formData: DiagnosisForm) => {
        if (savingDiagnosis) return;

        if (!clinicalCase?.id) {
            setDiagnosisMessage("El caso clínico todavía no está disponible.");
            return;
        }

        // Detener el contador al enviar el diagnóstico.
        // Si se reintenta el envío, se conserva el tiempo del primer intento.
        if (stoppedDurationRef.current === null) {
            const startTime = startTimeRef.current ?? performance.now();

            stoppedDurationRef.current = Math.max(
                0,
                Math.floor((performance.now() - startTime) / 1000)
            );
        }

        const durationSeconds = stoppedDurationRef.current;

        timerStoppedRef.current = true;
        setElapsedSeconds(durationSeconds);

        setSavingDiagnosis(true);
        setDiagnosisMessage("");

        // Construir las características de los estudios de laboratorio
        const features: Record<string, number | null> = {};

        (clinicalCase.laboratoryStudyResults ?? []).forEach((result) => {
            const study = laboratoryStudies.find(
                (study) => study.id === result.id
            );

            if (!study) {
                return;
            }

            const value = result.value;

            features[study.name] =
                value === null || value === undefined
                    ? null
                    : Number(value);
        });

        // Construir la respuesta de bodyMetrics con los valores del caso
        type BodyMetric = {
            type: string;
            content: string | number | null | undefined;
        };

        const metrics: BodyMetric[] = [
            {
                type: "height",
                content: clinicalCase.height
            },
            {
                type: "weight",
                content: clinicalCase.weight
            },
            {
                type: "bloodPreassure",
                content: clinicalCase.bloodPreassure
            }
        ];

        const bodyMetrics = metrics.filter(
            (metric): metric is BodyMetric & { content: string | number } =>
                metric.content !== null &&
                metric.content !== undefined &&
                metric.content !== 0 &&
                metric.content !== ""
        );

        const diagnosisData = {
            diagnosis: formData.diagnosis,
            symptomsAndHistory: clinicalCase.symptomsAndHistory,
            bodyMetrics,
            laboratoryStudies: clinicalCase.laboratoryStudyResults ?? [],
            features
        };

        try {
            // Primero evaluar el diagnóstico y enviar la duración
            const message = await diagnose({
                caseId,
                diagnoseData: diagnosisData,
                durationSeconds
            });

            // Mostrar el mensaje de evaluación
            if (message) {
                toast.info(message);
            }

            // Registrar el caso como completado
            await completeCase(caseId);

            // Mostrar la ventana de retroalimentación
            navigate(`${window.location.pathname}?caseCompleted=true`);
        } catch (error) {
            setDiagnosisMessage(
                error instanceof Error
                    ? error.message
                    : "No se pudo registrar el diagnóstico."
            );
        } finally {
            setSavingDiagnosis(false);
        }
    };

    // Formatear el contador como MM:SS
    const formatElapsedTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    };

    return (
        <>
            <div className="clira-page clira-page--simulation min-h-full px-4 pb-10">

                {/* Encabezado: botón y contador */}
                <div className="flex items-center justify-between gap-4 mt-10 mb-3">

                    {/* Botón para abandonar */}
                    <button
                        type="button"
                        onClick={handleAbandonSimulation}
                        className="bg-red-400 dark:bg-purple-600 py-2 px-4 text-white font-bold rounded-lg hover:bg-red-500 dark:hover:bg-purple-700 transition-colors duration-200 ease-in-out flex items-center gap-x-2 cursor-pointer"
                    >
                        <ArrowLeftIcon className="h-6 aspect-square" />
                        Abandonar simulación
                    </button>

                    {/* Contador a la derecha */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl px-5 py-3 text-center">
                        <p className="text-gray-500 dark:text-gray-300 font-semibold text-sm">
                            Tiempo de simulación
                        </p>

                        <p className="text-3xl font-bold text-blue-500 tabular-nums">
                            {formatElapsedTime(elapsedSeconds)}
                        </p>

                        {timerStoppedRef.current && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                Tiempo finalizado
                            </p>
                        )}
                    </div>
                </div>

                {/* Título del caso debajo */}
                <h1 className="text-5xl text-center font-bold text-blue-500 mt-4 mb-5">
                    {clinicalCase?.title ?? "Cargando caso..."}
                </h1>

                <div className="grid grid-cols-1 mb-5">

                    {/* Simulación del paciente */}
                    <div className="relative w-full min-w-0 min-h-110 overflow-hidden rounded-xl mb-5">
                        <canvas
                            ref={canvasRef}
                            id="caseSimulation-webgl"
                            className="w-full h-full"
                        />
                    </div>

                    {/* Información del caso y formulario */}
                    <div className="bg-white shadow rounded-xl p-5 max-w-full h-fit max-h-full">

                        <p className="text-gray-500 font-bold">
                            Descripción:
                        </p>

                        <p>
                            {clinicalCase?.description ?? "Cargando descripción..."}
                        </p>

                        <div className="flex flex-wrap justify-start gap-2 mt-5">
                            {clinicalCase?.filters?.map((filter) => (
                                <p
                                    key={filter.id}
                                    className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:border-white hover:text-white px-2 py-1 rounded-lg"
                                >
                                    {filter.name}
                                </p>
                            ))}
                        </div>

                        <form
                            onSubmit={handleSubmit(handleDiagnosisSubmit)}
                            className="flex flex-col gap-3 mt-5"
                        >
                            <label
                                htmlFor="diagnosis"
                                className="text-gray-600 font-bold text-xl"
                            >
                                Diagnóstico final
                            </label>

                            <input
                                type="text"
                                id="diagnosis"
                                className="border border-gray-400 p-2 w-full rounded-lg"
                                placeholder="Coloca tu diagnóstico final aquí"
                                disabled={savingDiagnosis}
                                {...register("diagnosis", {
                                    required: "El diagnóstico es obligatorio"
                                })}
                            />

                            {errors.diagnosis && (
                                <ErrorMessage>
                                    {String(errors.diagnosis.message)}
                                </ErrorMessage>
                            )}

                            {diagnosisMessage && (
                                <ErrorMessage>
                                    {diagnosisMessage}
                                </ErrorMessage>
                            )}

                            <input
                                type="submit"
                                value={savingDiagnosis ? "Guardando..." : "Diagnosticar"}
                                disabled={savingDiagnosis}
                                className="bg-blue-500 py-2 px-6 text-white font-bold rounded-lg hover:cursor-pointer hover:transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </form>
                    </div>
                </div>

                {/* Opciones de historial médico */}
                <div className="flex justify-between gap-5">
                    <SymptomsAndHistory />
                    <CorporalMetrics />
                    <LaboratoryStudiesComponent />
                </div>

                {/* Recursos disponibles */}
                <div className="bg-white shadow rounded-2xl p-5 max-w-full mt-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">

                    <p className="text-gray-500 font-bold">
                        Recursos disponibles:
                    </p>

                    {clinicalCase?.images?.length > 0 ? (
                        <div className="mt-5">
                            <ClinicalStudiesCarousel images={clinicalCase.images} />
                        </div>
                    ) : (
                        <p className="text-gray-500 font-semibold">
                            No hay recursos extra disponibles para este caso
                        </p>
                    )}
                </div>
            </div>

            {/* Ventana de retroalimentación al terminar el caso */}
            <CaseCompletedModal />
        </>
    );
};

export default SimulationView;
