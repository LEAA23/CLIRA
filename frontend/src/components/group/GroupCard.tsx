import {
    AcademicCapIcon,
    ArrowUpRightIcon,
    UsersIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import GroupCardOptions from "./GroupCardOptions";
import { useAppStore } from "../../stores/useAppStore";

type GroupCardProps = {
    id: number;
    name: string;
    teacher: string;
    bgImage: string;
    memberCount: number;
};

const GroupCard = ({
    id,
    name,
    teacher,
    bgImage,
    memberCount
}: GroupCardProps) => {

    const user = useAppStore(state => state.user);

    return (
        <article className="group relative mb-6 overflow-hidden rounded-lg border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">

            {/* PORTADA */}
            <Link
                to={`/groups/${id}`}
                className="relative block h-56 overflow-hidden bg-linear-to-br from-indigo-700 via-purple-700 to-blue-600"
            >
                {bgImage && (
                    <img
                        src={bgImage}
                        alt={`Portada del grupo ${name}`}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                )}

                {/* Degradado para mejorar la lectura */}
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-black/10" />

                {/* Elementos decorativos */}
                <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/20" />
                <div className="absolute -right-5 -top-9 h-32 w-32 rounded-full border border-white/20" />
                <div className="absolute bottom-5 left-5 right-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                        CLIRA · Comunidad
                    </p>

                    <h3 className="line-clamp-2 text-2xl font-extrabold leading-tight text-white drop-shadow-md">
                        {name}
                    </h3>
                </div>

                <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-indigo-700">
                    <ArrowUpRightIcon className="h-5 w-5" />
                </div>
            </Link>

            {/* INFORMACIÓN */}
            <div className="p-5">

                {user.rol !== "teacher" && (
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                            <AcademicCapIcon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-400">
                                Profesor responsable
                            </p>
                            <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
                                {teacher}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">

                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300">
                            <UsersIcon className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-lg font-bold leading-none text-gray-800 dark:text-white">
                                {memberCount}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                Integrantes
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to={`/groups/${id}`}
                            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700"
                        >
                            Entrar
                        </Link>

                        <GroupCardOptions id={id} />
                    </div>
                </div>
            </div>
        </article>
    );
};

export default GroupCard;
