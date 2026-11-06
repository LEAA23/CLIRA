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
import { useForm } from "react-hook-form";
import ErrorMessage from "../../components/ErrorMessage";
import type { DiagnosisForm } from "../../types";

const SimulationView = () => {
    // Referencia al canvas de la simulación
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Navegación entre vistas
    const navigate = useNavigate();

    // Estados del diagnóstico
    const [diagnosis, setDiagnosis] = useState("");
    const [savingDiagnosis, setSavingDiagnosis] = useState(false);
    const [diagnosisMessage, setDiagnosisMessage] = useState("");

    const { register, formState: { errors }, handleSubmit } = useForm<DiagnosisForm>( { defaultValues: { diagnosis: "" } } );

    // Obtenemos el ID del caso desde la URL
    const params = useParams();
    const caseId = Number(params.id);

    // Obtenemos los datos y la función para cargar el caso
    const fetchSimulation = useAppStore(
        (state) => state.fetchSimulation
    );
    const getLaboratorystudies = useAppStore( state => state.getLaboratorystudies );
    const diagnose = useAppStore( state => state.diagnose );
    interface LaboratoryStudy {
        id: number;
        name: string;
    }
    const [laboratoryStudies, setLaboratoryStudies] = useState<LaboratoryStudy[]>([]);

    useEffect(() => {
        const fetchStudies = async () => {
            const studies = await getLaboratorystudies();
            if(studies)
            setLaboratoryStudies(studies);
        };

        fetchStudies();
    }, [getLaboratorystudies]);

    const clinicalCase = useAppStore(
        (state) => state.case
    );

    // Inicializamos la simulación cuando el caso esté cargado
    useEffect(() => {
        const canvas = canvasRef.current;

        // Esperamos a que exista un caso clínico válido
        if (!canvas || !clinicalCase.id) return;

        const patientExperience = new Experience(canvas);

        return () => {
            void patientExperience;
        };

    }, [clinicalCase.id, clinicalCase.simulationModel]);


    // Cargamos la información del caso
    useEffect(() => {
        const fetchData = async () => {
            if (!Number.isInteger(caseId) || caseId <= 0) {
                return;
            }

            await fetchSimulation(caseId);
            await getLaboratorystudies();
        };

        fetchData();
    }, [caseId, fetchSimulation]);

    // Abandonamos la simulación y regresamos al menú de casos clínicos
    // No se registra el caso como completado.
    const handleAbandonSimulation = () => {
        navigate("/clinical-cases");
    };

    // Enviamos el diagnóstico y registramos el caso como completado
    const handleDiagnosisSubmit = async( formData: DiagnosisForm ) => {
        const features = Object.fromEntries(
            clinicalCase.laboratoryStudyResults.map(result => {
                const study = laboratoryStudies.find(
                    study => study.id === result.id
                );

                return [study!.name, result.value];
            })
        );

        //Costruimos la respuesta de bodyMetrics con todos los valores seleccionados por el usuario
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
            laboratoryStudies: clinicalCase.laboratoryStudyResults,
            features
        }
        try {
            await completeCase(caseId);
            await diagnose( { caseId, diagnoseData: diagnosisData } );
        } catch (error) {
            setDiagnosisMessage(
                error instanceof Error
                    ? error.message
                    : "No se pudo registrar el caso."
            );
        } finally {
            setSavingDiagnosis(false);
        }
    };

    return (
        <>
            {/* Encabezado y botón para abandonar */}
            <div className="relative flex items-center justify-center mt-10 mb-5">
                <button
                    type="button"
                    onClick={handleAbandonSimulation}
                    className="absolute left-0 bg-red-400 dark:bg-purple-600 py-2 px-4 text-white font-bold rounded-lg 
                    hover:bg-red-500 dark:hover:bg-purple-700 transition-colors duration-200 ease-in-out flex items-center gap-x-2 cursor-pointer"
                >
                    <ArrowLeftIcon className="h-6 aspect-square"/>
                    Abandonar simulación
                </button>

            </div>

            <h1 className="text-5xl text-center font-bold text-blue-500 my-5">
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
                        {clinicalCase.filters.map(filter => (
                            <p key={filter.id} className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:border-white 
                            hover:text-white px-2 py-1 rounded-lg">
                                { filter.name }
                            </p>
                        ))}

                    </div>

                    <form
                        onSubmit={ handleSubmit( handleDiagnosisSubmit ) }
                        className="flex flex-col gap-3 mt-5"
                    >
                                                
                        <label 
                            htmlFor="diagnosis"
                            className="text-gray-600 font-bold text-xl"
                        >Diagnostico final</label>
                        <input
                            type="text"
                            id="diagnosis"
                            className="border border-gray-400 p-2 w-full rounded-lg"
                            placeholder="Coloca tu diagnóstico final aquí"
                            disabled={savingDiagnosis}
                            {...register("diagnosis", {
                                required: "El diagnostico es obligatorio"
                            })}
                        />
                        {errors.diagnosis && (
                            <ErrorMessage>{ String(errors.diagnosis.message) }</ErrorMessage>
                        )}

                        <input
                            type="submit"
                            value={ savingDiagnosis? "Guardando..." : "Diagnosticar" }
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

                {clinicalCase.images.length > 0? (
                    <div className="mt-5">
                        <ClinicalStudiesCarousel images={clinicalCase.images} />
                    </div>

                ) : (
                    <p className="text-gray-500 font-semibold">No hay recursos extra disponibles para este caso</p>
                )}
            </div>
        </>
    );
};

export default SimulationView;