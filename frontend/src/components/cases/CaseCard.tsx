import {
    CalendarDaysIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ClockIcon,
    CursorArrowRaysIcon,
    StarIcon
} from "@heroicons/react/16/solid";

import { useLocation, useNavigate } from "react-router-dom";
import type { Filter } from "../../types";
import { useAppStore } from "../../stores/useAppStore";
import CaseCardOptions from "./CaseCardOptions";

type CaseCreator = {
    id: number;
    name: string;
    lastName: string;
    email: string;
};

type CaseCardProps = {
    id: number;
    title: string;
    description: string;
    previewImage: string;
    teacher_id: number;
    filters: Filter[];
    started: boolean;
    creator?: CaseCreator | null;

    showImage?: boolean;
    showStats?: boolean;
    showOptions?: boolean;
    enablePreview?: boolean;

    actionText?: string;
    maxFilters?: number;
    onAction?: () => void;
};

const CaseCard = ({
    id,
    title,
    description,
    previewImage,
    teacher_id,
    filters,
    started,
    creator,
    showImage = true,
    showStats = true,
    showOptions = true,
    enablePreview = true,
    actionText,
    maxFilters,
    onAction
}: CaseCardProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = useAppStore(state => state.user);

    const visibleFilters =
        maxFilters !== undefined
            ? filters.slice(0, maxFilters)
            : filters;

    const handleClick = () => {
        if (!enablePreview) return;

        navigate(
            `${location.pathname}?previewCase=true&case=${id}`
        );
    };

    const handleAction = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (onAction) {
            onAction();
            return;
        }

        navigate(`/simulation/${id}`);
    };

    return (
        <div
            className={`bg-white p-5 max-w-full rounded-2xl shadow space-y-5
            hover:shadow-xl hover:-translate-y-1 transition-all duration-200
            flex flex-col justify-between
            ${enablePreview ? "cursor-pointer" : ""}`}
            onClick={enablePreview ? handleClick : undefined}
        >
            <div className="relative px-5 flex justify-center items-center">
                <h3 className="text-center text-gray-500 font-bold text-2xl line-clamp-2">
                    {title}
                </h3>

                {showOptions &&
                    user.id === teacher_id &&
                    user.rol === "teacher" && (
                        <div
                            className="absolute right-1"
                            onClick={e => e.stopPropagation()}
                        >
                            <CaseCardOptions case_id={id} />
                        </div>
                    )}
            </div>

            {showImage && (
                <div className="relative w-full overflow-hidden rounded-lg">
                    {previewImage !== "" ? (
                        <div className="h-40">
                            <img
                                src={previewImage}
                                alt={title}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    ) : (
                        <div className="h-40 overflow-hidden rounded-lg w-full bg-gray-100" />
                    )}
                </div>
            )}

            <div>
                <p className="text-gray-500 font-semibold mb-1">
                    Descripción:
                </p>

                <p className="line-clamp-4">
                    {description}
                </p>
            </div>

            {creator && (
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                        {creator.name.charAt(0)}
                        {creator.lastName.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Caso creado por
                        </p>

                        <p className="break-words text-sm font-bold text-gray-800 dark:text-white">
                            {creator.name} {creator.lastName}
                        </p>

                        <p className="break-all text-xs text-gray-500 dark:text-gray-400">
                            {creator.email}
                        </p>
                    </div>
                </div>
            )}

            <div className="py-1">
                <p className="text-gray-500 font-semibold">
                    Filtros:
                </p>

                <div className="flex justify-start flex-wrap gap-2">
                    {visibleFilters.map(filterSelected => (
                        <p
                            key={filterSelected.id}
                            className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:border-white hover:text-white px-2 py-1 rounded-lg"
                        >
                            {filterSelected.name}
                        </p>
                    ))}
                </div>
            </div>

            {showStats && (
                <>
                    <div className="flex flex-col space-y-3">
                        {started && (
                            <>
                                <div className="flex justify-start items-end gap-x-2">
                                    <div className="bg-green-400 rounded-4xl w-8 aspect-square p-1 text-white font-bold">
                                        <CheckCircleIcon />
                                    </div>

                                    <p className="font-semibold">
                                        Caso completado
                                    </p>
                                </div>

                                <div className="flex justify-start items-end gap-x-2">
                                    <div className="bg-violet-400 rounded-4xl w-8 aspect-square p-1 text-white font-bold">
                                        <CalendarDaysIcon />
                                    </div>

                                    <p className="font-semibold">
                                        Último intento hace: 2 días
                                    </p>
                                </div>

                                <div className="flex justify-start items-end gap-x-2">
                                    <div className="bg-blue-400 rounded-4xl w-8 aspect-square p-1 text-white font-bold">
                                        <ClockIcon />
                                    </div>

                                    <p className="font-semibold">
                                        Tiempo empleado: 20 min.
                                    </p>
                                </div>
                            </>
                        )}

                        <div className="flex justify-start items-end gap-x-2">
                            <div className="bg-green-400 rounded-4xl w-8 p-1 aspect-square text-white font-bold">
                                <ChartBarIcon />
                            </div>

                            <p className="font-semibold">
                                Dificultad fácil
                            </p>
                        </div>

                        <div className="flex justify-start items-end gap-x-2">
                            <div className="bg-gray-300 rounded-4xl w-8 p-1 text-white font-bold">
                                <CursorArrowRaysIcon />
                            </div>

                            <p className="font-semibold">
                                5 Intentos
                            </p>
                        </div>

                        <div className="flex justify-start items-end gap-x-2">
                            <div className="bg-yellow-300 rounded-lg w-8 p-1 aspect-square text-white font-bold">
                                <StarIcon />
                            </div>

                            <p className="font-semibold">
                                Calificación 100
                            </p>
                        </div>
                    </div>

                    {started && (
                        <div>
                            <p className="text-gray-500 font-semibold">
                                Diagnóstico final:
                            </p>

                            <p>
                                sdnaksdnkajndkajsdnasd sdbsdbd sd sdf...
                            </p>
                        </div>
                    )}
                </>
            )}

            <button
                type="button"
                className="bg-blue-500 py-2 px-6 w-full block mx-auto text-white font-bold rounded-lg hover:cursor-pointer hover:transition-colors hover:bg-blue-600"
                onClick={handleAction}
            >
                {actionText ?? (started ? "Continuar" : "Comenzar")}
            </button>
        </div>
    );
};

export default CaseCard;
