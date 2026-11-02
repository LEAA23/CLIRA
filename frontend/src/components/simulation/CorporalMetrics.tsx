
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChartPieIcon } from "@heroicons/react/16/solid";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { toast } from "react-toastify";
import { useAppStore } from "../../stores/useAppStore";
import { useParams } from "react-router-dom";

const metricsOptions = [
    { value: "height", label: "Altura" },
    { value: "weight", label: "Peso" },
    { value: "bloodPreassure", label: "Presión sanguínea" },
];

type MetricsForm = {
    metrics: string[];
};

const CorporalMetrics = () => {

    const params = useParams();
    const caseId = +params.id!;

    const fetchCorporalMetrics = useAppStore( state => state.fetchCorporalMetrics );
    const clinicalCase = useAppStore(state => state.case);

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<MetricsForm>({
        defaultValues: {
            metrics: []
        }
    });

    const handlefetchCorporalMetrics = async (data: MetricsForm) => {
        try {
            await fetchCorporalMetrics( { caseId, metricsSelected: data.metrics } );
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
                <ChartPieIcon className="text-green-400 h-8" />
                Obtener métricas corporales del paciente
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
                            Tomar metricas corporales
                        </p>

                        <div className="flex flex-col gap-3 mb-4">

                            {metricsOptions.map(metric => (
                                <label
                                    key={metric.value}
                                    className="flex items-center gap-3 cursor-pointer
                                    text-gray-700 hover:text-blue-500"
                                >
                                    <input
                                        type="checkbox"
                                        value={metric.value}
                                        {...register("metrics", {
                                            validate: value =>
                                                value.length > 0 ||
                                                "Selecciona al menos una métrica"
                                        })}
                                        className="h-4 w-4 accent-blue-500"
                                    />

                                    {metric.label}
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
                            Consultar métricas
                        </button>

                    </form>

                    {(clinicalCase.height !== 0 || clinicalCase.weight !== 0 || clinicalCase.bloodPreassure !== "") && (
                        <div className="mt-5">
                            <p className="font-bold text-gray-800">Resultados de las metricas:</p>
                            <ul className="list-disc p-2">
                                {clinicalCase.height !== 0 && (
                                    <li className="text-gray-700 font-semibold">
                                        Altura: <span className="font-normal">{clinicalCase.height} cm</span>
                                    </li>
                                )}

                                {clinicalCase.weight !== 0 && (
                                    <li className="text-gray-700 font-semibold">
                                        Peso: <span className="font-normal">{clinicalCase.weight} kg</span>
                                    </li>
                                )}

                                {clinicalCase.bloodPreassure !== "" && (
                                    <li className="text-gray-700 font-semibold">
                                        Presion Sanguinea: <span className="font-normal">{clinicalCase.bloodPreassure} mm Hg</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                </div>
            </PopoverPanel>
        </Popover>
    );
};

export default CorporalMetrics;
