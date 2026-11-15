import { Transition, Dialog } from "@headlessui/react";
import { Fragment, useEffect, useRef } from "react";
import { useShowModal } from "../../hooks/useShowModal";
import { useNavigate } from "react-router-dom";
import useSideConfetti from "../../hooks/useSideConfetti";
import { useAppStore } from "../../stores/useAppStore";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";
import SimulationDiagnosticAccuracyChart from "./charts/SimulationDiagnosticAccuracyChart";
import SimulationPredictions from "./charts/SimulationPredictions";

const CaseCompletedModal = () => {
    const showModal = useShowModal("caseCompleted");
    const diseases = [
        { code: "9_78650", name: "Dolor torácico" },
        { code: "9_41401", name: "Enfermedad de las arterias coronarias" },
        { code: "10_A419", name: "Sepsis, organismo no especificado" },
        { code: "9_30500", name: "Abuso de alcohol, sin complicaciones" },
        { code: "9_78659", name: "Otros tipos de dolor torácico" },
        { code: "9_486", name: "Neumonía, organismo no especificado" },
        { code: "10_F329", name: "Trastorno depresivo mayor, episodio único, no especificado" },
        { code: "9_311", name: "Trastorno depresivo" },
        { code: "10_Z5111", name: "Consulta para quimioterapia antineoplásica" },
        { code: "10_I214", name: "Infarto agudo de miocardio sin elevación del segmento ST (IAMSEST)" }
    ];

    const diagnosisResults = useAppStore( state => state.diagnosisResults );

    const fireSideConfetti = useSideConfetti({
        duration: 5000,
        colors: ["#22c55e", "#ffffff", "#3b82f6"]
    });

    const hasFired = useRef(false);

    useEffect(() => {
        if (showModal && !hasFired.current && diagnosisResults.simulationResult.is_correct) {
            fireSideConfetti();
            hasFired.current = true;
        }

        if (!showModal) {
            hasFired.current = false;
        }
    }, [showModal]);

    const navigate = useNavigate();
  return (
        <>
        <Transition appear show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {
                navigate(location.pathname, { replace: true });
            }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-5/6 max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-3 lg:p-10">
                                <Dialog.Title
                                    as="h3"
                                    className="font-black text-4xl my-2 text-center"
                                >
                                    Simulaci&oacute;n Terminada
                                </Dialog.Title>

                                <div className="max-w-full p-5">
                                    <div className="grid grid-cols-2 gap-2 border-b-2 border-dashed border-gray-400 py-5">
                                        <div className="space-y-2">
                                            <div className="mb-5">
                                                <p className="text-gray-500 font-bold">Resultado del diagn&oacute;stico</p>
                                                <h3 className={`flex justify-start items-center gap-x-2 text-5xl font-bold ${diagnosisResults.simulationResult.is_correct? "text-green-500" : "text-red-500"}`}>
                                                    { diagnosisResults.simulationResult.is_correct? "Correcto" : "Incorrecto" }
                                                    {diagnosisResults.simulationResult.is_correct? (
                                                        <CheckCircleIcon className="h-6 aspect-square"/>
                                                    ) : (
                                                        <XCircleIcon className="h-6 aspect-square"/>
                                                    )}
                                                </h3>

                                            </div>
                                            <div className="mb-5">
                                                <p className="text-gray-700 font-bold">Diagn&oacute;stico real</p>
                                                <p className="text-gray-500 font-semibold">{ diagnosisResults.mejorCoincidencia !== null? 
                                                diagnosisResults.mejorCoincidencia?.name : diseases.find(
                                                    disease => disease.code === diagnosisResults.predicciones[0]?.diagnostico
                                                )?.name ?? diagnosisResults.predicciones[0]?.diagnostico }</p>
                                            </div>
                                            <div className="mb-5">
                                                <p className="text-gray-700 font-bold">Diagn&oacute;stico del estudiante</p>
                                                <p className="text-gray-500 font-semibold">{ diagnosisResults.simulationResult.diagnosis }</p>
                                            </div>

                                        </div>
                                        <div>
                                            <p className="text-gray-500 font-bold flex justify-end">Exactitud del diagn&oacute;stico</p>
                                            <div className="mt-2 flex justify-end">
                                                {diagnosisResults.mejorCoincidencia !== null? (
                                                    <SimulationDiagnosticAccuracyChart
                                                        accuracy={ +( diagnosisResults.mejorCoincidencia?.similarity! * 100).toFixed(2) }
                                                    />

                                                ): (
                                                    <SimulationDiagnosticAccuracyChart
                                                        accuracy={ 0 }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-b-2 border-dashed border-gray-400 py-5">
                                        <h2 className="text-gray-700 font-bold text-2xl mb-5">Predicci&oacute;nes de CLIRA AI</h2>
                                        <div className="w-full">
                                            <SimulationPredictions
                                            firstPrediction={ diagnosisResults.predicciones?.[0] }
                                            secondPrediction={ diagnosisResults.predicciones?.[1]}
                                            thirdthPrediction={ diagnosisResults.predicciones?.[2] }
                                            />
                                        </div>

                                    </div>

                                    <div className="border-b-2 border-dashed border-gray-400 py-5">
                                        <h2 className="text-gray-700 font-bold text-2xl mb-5">Anamnesis cl&iacute;nica</h2>
                                        <div className="grid grid-cols-3 items-center gap-5">
                                            <div className="space-y-2">
                                                <div className="mb-5">
                                                    <p className="text-gray-600 font-bold text-xl">Sintomas</p>

                                                    <p className=" font-semibold text-gray-700 mt-3">Calificaci&oacute;n: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.symptoms.score }%</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Precisi&oacute;n: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.symptoms.precision }%</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Exhaustividad: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.symptoms.recall }%</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Sintomas reconocidos: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.symptoms.recognizedSymptoms.join(", ") }</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Sintomas faltantes: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.symptoms.missedSymptoms.join(", ") }</span>
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="space-y-2">
                                                <div className="mb-5">
                                                    <p className="text-gray-600 font-bold text-xl">Antecedentes</p>

                                                    <p className=" font-semibold text-gray-700 mt-3">Calificaci&oacute;n: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.history.score }%</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Precisi&oacute;n: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.history.precision }%</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Exhaustividad: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.history.recall }%</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Metricas reconocidos: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.history.recognizedRecords.join(", ") }</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Metricas faltantes: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.history.missedRecords.join(", ") }</span>
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="space-y-2">
                                                <div className="mb-5">
                                                    <p className="text-gray-600 font-bold text-xl">Edad</p>

                                                    <p className=" font-semibold text-gray-700 mt-3">Calificaci&oacute;n: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.age.score }%</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Precisi&oacute;n: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.age.precision }%</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Exhaustividad: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.age.recall }%</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Registro faltante: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.anamnesisEvaluation.age.missedRecords.join(", ") }</span>
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-b-2 border-dashed border-gray-400 py-5">
                                        <h2 className="text-gray-700 font-bold text-2xl mb-5">Metricas corporales</h2>
                                        <div className="grid grid-cols-3 items-center gap-5">
                                            <div className="space-y-2">
                                                <div className="mb-5">
                                                    <p className="text-gray-600 font-bold text-xl">Altura</p>

                                                    <p className=" font-semibold text-gray-700 mt-3">Calificaci&oacute;n: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.bodyEvaluation.height.score }%</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Valor identificado: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.bodyEvaluation.height.identified? diagnosisResults.bodyEvaluation.height.identified: 0  }</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Valor real: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.bodyEvaluation.height.expected } cm.</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Diferencia: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.bodyEvaluation.height.identified? diagnosisResults.bodyEvaluation.height.difference: diagnosisResults.bodyEvaluation.height.expected   } cm.</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="mb-5">
                                                    <p className="text-gray-600 font-bold text-xl">Peso</p>

                                                    <p className=" font-semibold text-gray-700 mt-3">Calificaci&oacute;n: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.bodyEvaluation.weight.score }%</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Valor identificado: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.bodyEvaluation.weight.identified? diagnosisResults.bodyEvaluation.weight.identified: 0  }</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Valor real: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.bodyEvaluation.weight.expected } cm.</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Diferencia: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.bodyEvaluation.weight.identified? diagnosisResults.bodyEvaluation.weight.difference: diagnosisResults.bodyEvaluation.height.expected   } cm.</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="mb-5">
                                                    <p className="text-gray-600 font-bold text-xl">Presion Sangu&iacute;nea</p>

                                                    <p className=" font-semibold text-gray-700 mt-3">Calificaci&oacute;n: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.bodyEvaluation.bloodPressure.score }%</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Sistolica esperada: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.bodyEvaluation.bloodPressure.systolic.expected }</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Diastolica esperada: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.bodyEvaluation.bloodPressure.diastolic.expected }</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-5">
                                        <h2 className="text-gray-700 font-bold text-2xl mb-5">Estudios de laboratorio</h2>
                                        <div className="grid grid-cols-2 items-center gap-5">
                                            <div className="space-y-2">
                                                <div className="mb-5">
                                                    <p className="text-gray-600 font-bold text-xl">Ponderaci&oacute;n</p>

                                                    <p className=" font-semibold text-gray-700 mt-3">Evaluados: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.laboratoryEvaluation.interpretation.totalEvaluated }</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Precisi&oacute;n: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.laboratoryEvaluation.recognition.precision }</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Exhaustividad: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.laboratoryEvaluation.recognition.recall }</span>
                                                    </p>
                                                </div>
                                            </div>        

                                            <div className="space-y-2">
                                                <div className="mb-5">
                                                    <p className="text-gray-600 font-bold text-xl">Totales</p>

                                                    <p className=" font-semibold text-gray-700 mt-3">Total esperados: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.laboratoryEvaluation.recognition.totalExpected }</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Total seleccionados: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.laboratoryEvaluation.recognition.totalSelected }</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Correctos: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.laboratoryEvaluation.recognition.correct }</span>
                                                    </p>
                                                    <p className=" font-semibold text-gray-700 mt-3">Incorrectos: {""}
                                                        <span className="font-semibold text-gray-500">{ diagnosisResults.laboratoryEvaluation.recognition.incorrect }</span>
                                                    </p>
                                                </div>
                                            </div>        
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    </>
  )
}

export default CaseCompletedModal;