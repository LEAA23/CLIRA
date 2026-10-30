import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/16/solid";

import CaseCard from "../../components/cases/CaseCard";
import PreviewCaseModal from "../../components/cases/PreviewCaseModal";
import CreateCaseModal from "../../components/cases/CreateCaseModal";
import EditCaseModal from "../../components/cases/EditCaseModal";
import DeleteCaseModal from "../../components/cases/DeleteCaseModal";
import CaseFilters from "../../components/cases/CaseFilters";

import { useAppStore } from "../../stores/useAppStore";
import { getFilterCategories } from "../../api/caseApi";
import type { FilterCategory } from "../../api/caseApi";

const normalizeText = (text: string): string =>
    text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase()
        .trim();

const CasesView = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getCases = useAppStore(state => state.getCases);
    const cases = useAppStore(state => state.cases);
    const fetchUserAuth = useAppStore(state => state.fetchUserAuth);

    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState<FilterCategory[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filterError, setFilterError] = useState("");

    useEffect(() => {
        fetchUserAuth();
        void getCases();

        getFilterCategories()
            .then(data => {
                setCategories(data);
                setFilterError("");
            })
            .catch(error => {
                console.error("Error al cargar los filtros:", error);
                setFilterError(
                    "No se pudieron cargar las categorías de filtros."
                );
            });
    }, [fetchUserAuth, getCases]);

    const handleFilterChange = (filterId: number) => {
        setSelectedFilters(current =>
            current.includes(filterId)
                ? current.filter(id => id !== filterId)
                : [...current, filterId]
        );
    };

    const clearFilters = () => {
        setSearch("");
        setSelectedFilters([]);
    };

    const filteredCases = useMemo(() => {
        // Permite búsquedas como:
        // "cabeza, facil, menor"
        // "pulmones medio"
        // "fácil, adulto"
        const searchTerms = normalizeText(search)
            .split(/[,\s]+/)
            .filter(Boolean);

        // Agrupar los filtros seleccionados por categoría.
        const filtersByCategory = new Map<number, number[]>();

        for (const filterId of selectedFilters) {
            const selectedFilter = categories
                .flatMap(category => category.filters)
                .find(filter => filter.id === filterId);

            if (!selectedFilter) continue;

            const categoryFilters =
                filtersByCategory.get(selectedFilter.category_id) ?? [];

            categoryFilters.push(filterId);
            filtersByCategory.set(
                selectedFilter.category_id,
                categoryFilters
            );
        }

        return cases.filter(clinicalCase => {
            // Dentro de una categoría basta con coincidir
            // con una de las opciones seleccionadas.
            // Entre categorías deben cumplirse todas.
            for (const [categoryId, selectedIds] of filtersByCategory) {
                const matchesCategory = clinicalCase.filters.some(
                    filter =>
                        filter.category_id === categoryId &&
                        selectedIds.includes(filter.id)
                );

                if (!matchesCategory) {
                    return false;
                }
            }

            // Si no hay texto de búsqueda, se aplican
            // únicamente los filtros seleccionados.
            if (searchTerms.length === 0) {
                return true;
            }

            const categoryNames = categories
                .filter(category =>
                    clinicalCase.filters.some(
                        filter => filter.category_id === category.id
                    )
                )
                .map(category => category.name);

            const searchableText = normalizeText(
                [
                    clinicalCase.title,
                    clinicalCase.description,
                    ...clinicalCase.filters.map(filter => filter.name),
                    ...categoryNames
                ].join(" ")
            );

            // Todos los términos deben aparecer en el caso.
            return searchTerms.every(term =>
                searchableText.includes(term)
            );
        });
    }, [cases, search, selectedFilters, categories]);

    return (
        <>
            <h1 className="my-10 text-center text-5xl font-bold text-blue-500">
                Casos Clínicos
            </h1>

            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 flex-1 gap-2">
                    <button
                        type="button"
                        onClick={() => setShowFilters(value => !value)}
                        aria-expanded={showFilters}
                        className="shrink-0 rounded-lg border cursor-pointer border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    >
                        {showFilters ? "Ocultar filtros" : "Filtros"}
                        {selectedFilters.length > 0 &&
                            ` (${selectedFilters.length})`}
                    </button>

                    <input
                        type="search"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        placeholder="Ej. cabeza, facil, menor"
                        aria-label="Buscar casos clínicos"
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-blue-500 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `${location.pathname}?CreateCase=true`
                        )
                    }
                    className="flex items-center justify-center gap-x-2 whitespace-nowrap rounded-lg bg-purple-600 px-6 py-3 font-bold text-white hover:bg-purple-700"
                >
                    <PlusIcon className="h-6" />
                    Crear caso clínico
                </button>
            </div>

            {showFilters && (
                <div className="mb-6">
                    <CaseFilters
                        categories={categories}
                        selectedFilters={selectedFilters}
                        onFilterChange={handleFilterChange}
                        onClear={clearFilters}
                    />
                </div>
            )}

            {filterError && (
                <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                    {filterError}
                </p>
            )}

            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                {filteredCases.length}{" "}
                {filteredCases.length === 1
                    ? "caso encontrado"
                    : "casos encontrados"}
            </p>

            {filteredCases.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {filteredCases.map(clinicalCase => (
                        <CaseCard
                            key={clinicalCase.id}
                            id={clinicalCase.id}
                            title={clinicalCase.title}
                            description={clinicalCase.description}
                            previewImage={
                                clinicalCase.previewImage?.toString() || ""
                            }
                            teacher_id={clinicalCase.teacher_id}
                            filters={clinicalCase.filters}
                            started={false}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-gray-200 p-8 text-center dark:border-gray-700">
                    <p className="font-semibold text-gray-700 dark:text-gray-200">
                        No se encontraron casos clínicos.
                    </p>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Prueba con otras palabras o elimina algunos filtros.
                    </p>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        Limpiar búsqueda y filtros
                    </button>
                </div>
            )}

            <PreviewCaseModal started={false} />
            <CreateCaseModal />
            <EditCaseModal />
            <DeleteCaseModal />
        </>
    );
};

export default CasesView;