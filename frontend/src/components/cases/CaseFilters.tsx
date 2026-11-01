import { CalendarDaysIcon, CheckCircleIcon, FireIcon, HeartIcon } from "@heroicons/react/16/solid";
import type { FilterCategory } from "../../api/caseApi";

type CaseFiltersProps = {
    categories: FilterCategory[];
    selectedFilters: number[];
    onFilterChange: (filterId: number) => void;
    onClear: () => void;
};

const CaseFilters = ({
    categories,
    selectedFilters,
    onFilterChange,
    onClear
}: CaseFiltersProps) => {
    const availableCategories = categories.filter(
        category => category.filters.length > 0
    );

    if (availableCategories.length === 0) {
        return (
            <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay categorías de filtros disponibles.
            </p>
        );
    }

    return (
        <section className="w-full rounded-xl p-5 border border-gray-200 bg-white shadow ">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="font-bold text-2xl text-gray-700 dark:text-white">
                    Filtrar casos
                </h2>

                <button
                    type="button"
                    onClick={onClear}
                    className="text-sm cursor-pointer font-semibold bg-blue-500 px-3 py-2 text-white rounded-lg hover:bg-blue-600"
                >
                    Limpiar filtros
                </button>
            </div>

            <div className="flex items-start flex-wrap justify-between p-5">
                {availableCategories.map(category => (
                    <fieldset key={category.id} className="min-w-0">
                        <legend className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-200 flex justify-between items-center gap-x-2">
                            {category.name === "Completados" && (
                                <>
                                    <CheckCircleIcon className="h-6 aspect-square text-green-500"/>
                                    {category.name}
                                </>
                            )}

                            {category.name === "Dificultad" && (
                                <>
                                    <FireIcon className="h-6 aspect-square text-red-500"/>
                                    {category.name}
                                </>
                            )}

                            {category.name === "Extremidad" && (
                                <>
                                    <HeartIcon className="h-6 aspect-square text-pink-400"/>
                                    {category.name}
                                </>
                            )}

                            {category.name === "Paciente" && (
                                <>
                                    <CalendarDaysIcon className="h-6 aspect-square text-blue-500"/>
                                    {category.name}
                                </>
                            )}
                        </legend>

                        <div className="flex flex-col gap-2">
                            {category.filters.map(filter => (
                                <label
                                    key={filter.id}
                                    className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.includes(filter.id)}
                                        onChange={() => onFilterChange(filter.id)}
                                        className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
                                    />

                                    <span>{filter.name}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>
                ))}
            </div>
        </section>
    );
};

export default CaseFilters;
