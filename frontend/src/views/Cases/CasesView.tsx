import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/16/solid";

import CaseCard from "../../components/cases/CaseCard";
import PreviewCaseModal from "../../components/cases/PreviewCaseModal";
import CreateCaseModal from "../../components/cases/CreateCaseModal";
import EditCaseModal from "../../components/cases/EditCaseModal";
import DeleteCaseModal from "../../components/cases/DeleteCaseModal";
import CaseFilters from "../../components/cases/CaseFilters";
import SearchBar from "../../components/SearchBar";

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

    const getCases = useAppStore((state) => state.getCases);
    const cases = useAppStore((state) => state.cases);
    const fetchUserAuth = useAppStore((state) => state.fetchUserAuth);
    const user = useAppStore((state) => state.user);

    const [search, setSearch] = useState("");
    const [searchBarKey, setSearchBarKey] = useState(0);

    const [categories, setCategories] = useState<FilterCategory[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
    const [filterError, setFilterError] = useState("");

    // Cargar casos, usuario y categorías.
    useEffect(() => {
        void fetchUserAuth();
        void getCases();

        let active = true;

        getFilterCategories()
            .then((data) => {
                if (active) {
                    setCategories(data);
                    setFilterError("");
                }
            })
            .catch((error) => {
                console.error("Error al cargar los filtros:", error);

                if (active) {
                    setFilterError(
                        "No se pudieron cargar las categorías de filtros."
                    );
                }
            });

        return () => {
            active = false;
        };
    }, [fetchUserAuth, getCases]);

    // Seleccionar o quitar filtros.
    const handleFilterChange = (filterId: number) => {
        setSelectedFilters((current) =>
            current.includes(filterId)
                ? current.filter((id) => id !== filterId)
                : [...current, filterId]
        );
    };

    // Limpiar búsqueda y filtros.
    const clearFilters = () => {
        setSearch("");
        setSelectedFilters([]);

        // Reinicia el formulario interno del SearchBar.
        setSearchBarKey((current) => current + 1);
    };

    // Recibir la búsqueda desde SearchBar.
    const handleSearch = (formData: Record<string, string>) => {
        setSearch(formData.search || "");
    };

    // Filtrar casos.
    const filteredCases = useMemo(() => {
        const searchTerms = normalizeText(search)
            .split(/[,\s]+/)
            .filter(Boolean);

        // Agrupar filtros seleccionados por categoría.
        const filtersByCategory = new Map<number, number[]>();

        for (const filterId of selectedFilters) {
            const selectedFilter = categories
                .flatMap((category) => category.filters)
                .find((filter) => filter.id === filterId);

            if (!selectedFilter) continue;

            const categoryFilters =
                filtersByCategory.get(selectedFilter.category_id) ?? [];

            categoryFilters.push(filterId);

            filtersByCategory.set(
                selectedFilter.category_id,
                categoryFilters
            );
        }

        return cases.filter((clinicalCase) => {
            // Dentro de cada categoría basta con coincidir
            // con uno de los filtros seleccionados.
            // Entre categorías deben cumplirse todas.
            for (const [categoryId, selectedIds] of filtersByCategory) {
                const matchesCategory = clinicalCase.filters.some(
                    (filter) =>
                        filter.category_id === categoryId &&
                        selectedIds.includes(filter.id)
                );

                if (!matchesCategory) {
                    return false;
                }
            }

            // Si no hay búsqueda, se aplican solamente los filtros.
            if (searchTerms.length === 0) {
                return true;
            }

            const categoryNames = categories
                .filter((category) =>
                    clinicalCase.filters.some(
                        (filter) => filter.category_id === category.id
                    )
                )
                .map((category) => category.name);

            const searchableText = normalizeText(
                [
                    clinicalCase.title,
                    clinicalCase.description,
                    clinicalCase.creator?.name ?? "",
                    clinicalCase.creator?.lastName ?? "",
                    clinicalCase.creator?.email ?? "",
                    ...clinicalCase.filters.map((filter) => filter.name),
                    ...categoryNames,
                ].join(" ")
            );

            // Todos los términos deben aparecer en el caso.
            return searchTerms.every((term) =>
                searchableText.includes(term)
            );
        });
    }, [cases, search, selectedFilters, categories]);

    return (
        <>
            <h1 className="my-10 text-center text-5xl font-bold text-blue-500">
                Casos Clínicos
            </h1>

            {/* Buscador y botón para profesores */}
            <div className="mb-6 flex flex-col items-center gap-4 md:flex-row ">
                <div className="min-w-0 flex-1">
                    <SearchBar
                        key={searchBarKey}
                        pendingCases={false}
                        filters={true}
                        inputType="text"
                        inputName="search"
                        placeholder="Buscar casos clínicos..."
                        fn={handleSearch}
                        filtersContent={
                            <CaseFilters
                                categories={categories}
                                selectedFilters={selectedFilters}
                                onFilterChange={handleFilterChange}
                                onClear={clearFilters}
                            />
                        }
                    />
                </div>

                {user.rol === "teacher" && (
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `${location.pathname}?CreateCase=true`
                            )
                        }
                        className="flex shrink-0 cursor-pointer items-center justify-center gap-x-2 whitespace-nowrap rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition hover:bg-blue-600"
                    >
                        <PlusIcon className="h-6 w-6" />
                        Crear caso clínico
                    </button>
                )}
            </div>

            {/* Error al cargar categorías */}
            {filterError && (
                <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                    {filterError}
                </p>
            )}

            {/* Contador de resultados */}
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                {filteredCases.length}{" "}
                {filteredCases.length === 1
                    ? "caso encontrado"
                    : "casos encontrados"}
            </p>

            {/* Resultados */}
            {filteredCases.length > 0 ? (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {filteredCases.map((clinicalCase) => (
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
                            creator={clinicalCase.creator}
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
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Limpiar búsqueda y filtros
                    </button>
                </div>
            )}

            {/* Modales */}
            <PreviewCaseModal started={false} />

            {user.rol === "teacher" && <CreateCaseModal />}

            <EditCaseModal />
            <DeleteCaseModal />
        </>
    );
};

export default CasesView;