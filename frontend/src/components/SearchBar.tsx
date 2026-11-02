import {
    AdjustmentsHorizontalIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import FilterOptions from "./FilterOptions";
import ErrorMessage from "./ErrorMessage";

type SearchBarProps = {
    pendingCases: boolean;
    filters: boolean;
    inputType: string;
    inputName: string;
    placeholder: string;
    fn: (formData: Record<string, string>) => void;
    filtersContent?: ReactNode;
};

const SearchBar = ({
    pendingCases,
    filters,
    inputType,
    inputName,
    placeholder,
    fn,
    filtersContent,
}: SearchBarProps) => {
    const [isFiltersActive, setIsFiltersActive] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<Record<string, string>>();

    const validationRules =
        inputType === "email"
            ? {
                  required: "El email es obligatorio",
                  pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "E-mail no válido",
                  },
              }
            : {};

    return (
        <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-col justify-between items-center  gap-3 sm:flex-row">
                {filters && (
                    <button
                        type="button"
                        onClick={() =>
                            setIsFiltersActive((value) => !value)
                        }
                        aria-expanded={isFiltersActive}
                        aria-label={
                            isFiltersActive
                                ? "Ocultar filtros"
                                : "Mostrar filtros"
                        }
                        className="flex h-12 w-12 cursor-pointer shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                        <AdjustmentsHorizontalIcon className="h-7 w-7 text-gray-500" />
                    </button>
                )}

                <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <form
                        className="flex w-full items-center"
                        noValidate
                        onSubmit={handleSubmit(fn)}
                    >
                        <input
                            type={inputType}
                            placeholder={placeholder}
                            aria-label={placeholder}
                            className="w-full min-w-0 rounded-xl bg-transparent p-4 text-gray-800 outline-none placeholder:text-gray-400 dark:text-white"
                            {...register(inputName, validationRules)}
                        />

                        <button
                            type="submit"
                            aria-label="Buscar"
                            className="mx-4 shrink-0 text-gray-400 transition hover:text-blue-500"
                        >
                            <MagnifyingGlassIcon className="h-7 w-7" />
                        </button>
                    </form>

                    {errors[inputName] && (
                        <div className="px-4 pb-3">
                            <ErrorMessage>
                                {errors[inputName].message?.toString()}
                            </ErrorMessage>
                        </div>
                    )}
                </div>
            </div>

            {isFiltersActive && filters && (
                <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    {filtersContent ?? (
                        <FilterOptions
                            startedFilters={pendingCases}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;