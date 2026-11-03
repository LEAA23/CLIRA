
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { BeakerIcon } from "@heroicons/react/16/solid";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { toast } from "react-toastify";
import { useAppStore } from "../../stores/useAppStore";
import { useEffect, useState } from "react";
import type{ LaboratoryStudies } from "../../types";
import { useParams } from "react-router-dom";

type MetricsForm = {
    metrics: string[];
};

const LaboratoryStudies = () => {

    const params = useParams();
    const caseId = +params.id!;

    const [ laboratorystudiesOptions, setLaboratorystudiesOptions ] = useState<LaboratoryStudies>();

    const getLaboratoryStudies = useAppStore( state => state.getLaboratorystudies );
    const fetchPatientLaboratoryStudies = useAppStore(state => state.fetchPatientLaboratoryStudies);
    const clinicalCase = useAppStore(state => state.case);

    useEffect(() => {
        const fetchLaboratiryStudies = async() => {
            const laboratoryStudies = await getLaboratoryStudies();
            setLaboratorystudiesOptions( laboratoryStudies );
        }
        fetchLaboratiryStudies();
    }, []);

    const { register, formState: { errors }, handleSubmit } = useForm<MetricsForm>({ defaultValues: { metrics: [] } });

    const handlefetchCorporalMetrics = async (data: MetricsForm) => {
        try {
            const laboratoryStudiesSelected = data.metrics.map( laboratoryStudyId => +laboratoryStudyId );
            await fetchPatientLaboratoryStudies( { caseId, laboratoryStudies: laboratoryStudiesSelected } );
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };

    return (
        <Popover>
            <PopoverButton
                className="text-sm/6 font-bold text-gray-500 bg-white shadow
                hover:shadow-xl hover:-translate-y-1 transition-all duration-200
                p-5 rounded-2xl max-w-full focus:outline-none data-active:text-blue-500
                flex justify-start items-center gap-x-5 cursor-pointer"
            >
                <BeakerIcon className="text-purple-400 h-8" />
                Realizar estudios de laboratorio
            </PopoverButton>

            <PopoverPanel
                transition
                anchor="bottom"
                className="divide-y divide-white/5 rounded-xl bg-white
                border border-blue-500 mt-5 shadow-2xl text-sm/6
                transition duration-200 ease-in-out
                data-closed:-translate-y-1 data-closed:opacity-0"
            >
                <div className="p-4">

                    <form onSubmit={handleSubmit(handlefetchCorporalMetrics)}>

                        <p className="text-gray-700 font-bold text-lg mb-3">
                            Realizar estudios de laboratorio
                        </p>

                        <div className="flex flex-col gap-3 mb-4">

                            {laboratorystudiesOptions?.map(metric => (
                                <label
                                    key={metric.id}
                                    className="flex items-center gap-3 cursor-pointer
                                    text-gray-700 hover:text-blue-500"
                                >
                                    <input
                                        type="checkbox"
                                        value={metric.id}
                                        {...register("metrics", {
                                            validate: value =>
                                                value.length > 0 ||
                                                "Selecciona al menos una métrica"
                                        })}
                                        className="h-4 w-4 accent-blue-500"
                                    />

                                    {metric.name}
                                </label>
                            ))}

                        </div>

                        {errors.metrics && (
                            <ErrorMessage>
                                {String(errors.metrics.message)}
                            </ErrorMessage>
                        )}

                        <button
                            type="submit"
                            className="bg-blue-500 py-2 px-6 w-full text-white
                            font-bold rounded-lg hover:cursor-pointer
                            hover:bg-blue-600 transition-colors"
                        >
                            Realizar estudios 
                        </button>

                    </form>

                    {clinicalCase.laboratoryStudyResults.length > 0 && (
                        <div className="mt-1">
                            <p className="font-bold text-gray-800">
                                Resultados de los estudios:
                            </p>

                            <ul className="list-disc p-2">
                                {clinicalCase.laboratoryStudyResults.map(labStudy => (
                                    <li key={labStudy.id} className="text-gray-700 font-semibold">
                                        {laboratorystudiesOptions!.find( study => study.id === labStudy.id)?.name}:
                                        <span className="font-normal">
                                            {labStudy.value !== null
                                                ? ` ${labStudy.value}`
                                                : " Sin resultado"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </PopoverPanel>
        </Popover>
    );
};

export default LaboratoryStudies;
