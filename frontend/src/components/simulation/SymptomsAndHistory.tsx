import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { useForm } from "react-hook-form";
import type { Symptom } from "../../types";
import ErrorMessage from "../ErrorMessage";
import { toast } from "react-toastify";
import { useAppStore } from "../../stores/useAppStore";
import { useParams } from "react-router-dom";

const SymptomsAndHistory = () => {

    const params = useParams();
    const caseId = +params.id!;

    const clinicalCase = useAppStore( state => state.case );

    const askQuestion = useAppStore( state => state.askQuestion );

    const { register, formState: { errors }, handleSubmit } = useForm<{ question: Symptom }>( { defaultValues: { question: "" } } );

    const handleAskQuestion = async (question: { question: Symptom }) => {
        try {
            await askQuestion({
                caseId,
                question: question.question
            });

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
  return (
    <>
        <Popover>
            <PopoverButton 
            className="text-sm/6 font-bold text-gray-500 bg-white shadow hover:shadow-xl hover:-translate-y-1 transition-all 
            duration-200 p-5 rounded-2xl max-w-full focus:outline-none data-active:text-blue-500 data-focus:outline 
            data-focus:outline-white data-hover:text-blue-500 flex justify-start items-center gap-x-5 cursor-pointer"
            >
                <QuestionMarkCircleIcon className="text-orange-400 h-8"/>
                Hacer preguntas al paciente
            </PopoverButton>

            <PopoverPanel
            transition
            anchor="bottom"
            className="divide-y divide-white/5 rounded-xl bg-white border border-blue-500 mt-5 shadow-2xl text-sm/6 transition duration-200 ease-in-out 
            [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
            >
            <div className="p-3">

                <form
                    onSubmit={ handleSubmit( handleAskQuestion ) }
                >
                    <div className="flex flex-col">
                        <label
                            htmlFor="question"
                            className="text-gray-600 text-xl font-bold"
                        >
                            Pregunta sintomas o antecedentes
                        </label>
                        <input 
                            type="text" 
                            id="question"
                            placeholder="Escribe tu pregunta por sintomas o antecedentes clinicos del paciente"
                            className="border border-gray-400 p-2 my-3 w-full rounded-lg"
                            {...register("question", {
                                required: "La pregunta es obligatoria"
                            })}
                        />
                        {errors.question && (
                            <ErrorMessage>{ String(errors.question.message) }</ErrorMessage>
                        )}

                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 py-2 px-6 w-full text-white font-bold rounded-lg hover:cursor-pointer 
                        hover:transition-colors hover:bg-blue-600 text-center"
                    >
                        Preguntar
                    </button>  
                </form>

                {clinicalCase.symptomsAndHistory.length > 0 && (
                    <div className="mt-5">
                        <p className="font-bold text-gray-800">Respuesta del paciente:</p>
                        <ul className="list-disc p-2">
                            {clinicalCase.symptomsAndHistory.map(feature => (
                                <li key={feature.type} className="text-gray-700">
                                    {feature.content}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            </PopoverPanel>
        </Popover>
    </>
  )
}

export default SymptomsAndHistory;