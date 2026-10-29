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
        <section className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-bold text-gray-800 dark:text-white">
                    Filtrar casos
                </h2>

                <button
                    type="button"
                    onClick={onClear}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-purple-400 dark:hover:text-purple-300"
                >
                    Limpiar filtros
                </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {availableCategories.map(category => (
                    <fieldset key={category.id} className="min-w-0">
                        <legend className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                            {category.name}
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
                                        className="h-4 w-4 rounded accent-blue-600"
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
