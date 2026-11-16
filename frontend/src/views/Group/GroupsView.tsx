import { useEffect } from "react";
import GroupCard from "../../components/group/GroupCard";
import { useAppStore } from "../../stores/useAppStore";
import { toast } from "react-toastify";
import {
    PlusIcon,
    AcademicCapIcon,
    UserGroupIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "../../components/group/CreateGroupModal";
import EditGroupModal from "../../components/group/EditGroupModal";
import DeleteGroupModal from "../../components/group/DeleteGroupModal";
import MembersModal from "../../components/group/MembersModal";

const GroupsView = () => {
    const navigate = useNavigate();

    const fetchUserAuth = useAppStore(state => state.fetchUserAuth);
    const fetchGroups = useAppStore(state => state.fetchGroups);
    const user = useAppStore(state => state.user);
    const groups = useAppStore(state => state.groups);

    useEffect(() => {
        const getData = async () => {
            try {
                await Promise.all([
                    fetchUserAuth(),
                    fetchGroups()
                ]);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        };

        getData();
    }, [fetchUserAuth, fetchGroups]);

    const totalMembers = groups.reduce(
        (total, group) => total + group.memberCount,
        0
    );

    return (
        <div className="clira-page clira-page--groups mx-auto min-h-full w-full max-w-7xl px-4 pb-12">

            {/* TÍTULO */}
            <h1 className="my-10 text-center text-5xl font-bold text-blue-500">
                Mis Grupos
            </h1>

            {/* ENCABEZADO */}
            <section className="relative mb-10 overflow-hidden rounded-lg bg-linear-to-br from-slate-950 via-indigo-950 to-purple-900 px-7 py-10 shadow-xl md:px-10 md:py-12">

                <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full border border-white/10" />
                <div className="absolute -right-5 -top-12 h-60 w-60 rounded-full border border-white/10" />
                <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

                <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">

                    <div className="max-w-2xl">
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-indigo-100/80 md:text-lg">
                            {user.rol === "teacher"
                                ? "Organiza tus espacios académicos, comparte casos clínicos y acompaña el progreso de tus estudiantes."
                                : "Encuentra tus espacios de aprendizaje, participa con tus compañeros y continúa desarrollando tus habilidades clínicas."
                            }
                        </p>
                    </div>

                    {user.rol === "teacher" && (
                        <button
                            type="button"
                            onClick={() => navigate(location.pathname + "?createGroup=true")}
                            className="inline-flex shrink-0 items-center cursor-pointer justify-center gap-2 rounded-lg bg-blue-500 px-6 py-4 font-bold text-white shadow-lg shadow-indigo-950/30 transition-all hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Crear grupo
                        </button>
                    )}
                </div>

                {/* ESTADÍSTICAS */}
                <div className="relative z-10 mt-9 grid grid-cols-1 gap-3 border-t border-white/15 pt-6 sm:grid-cols-2">

                    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">
                            <AcademicCapIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-white">
                                {groups.length}
                            </p>
                            <p className="text-sm text-indigo-100/70">
                                {user.rol === "teacher"
                                    ? "Grupos creados"
                                    : "Grupos disponibles"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">
                            <UserGroupIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-white">
                                {totalMembers}
                            </p>
                            <p className="text-sm text-indigo-100/70">
                                Integrantes en tus grupos
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TÍTULO DE SECCIÓN */}
            <h2 className="text-2xl font-bold text-blue-500 text-center">
                {groups.length > 0
                    ? "Tus comunidades"
                    : "Comienza tu comunidad"}
            </h2>

            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                {groups.length > 0 && (
                    <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                        {groups.length} {groups.length === 1 ? "grupo" : "grupos"}
                    </span>
                )}
            </div>

            {/* GRUPOS */}
            {groups.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {groups.map(group => (
                        <GroupCard
                            key={group.id}
                            id={group.id}
                            name={group.name}
                            teacher={group.teacherUser.name}
                            bgImage={group.bgImage}
                            memberCount={group.memberCount}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-800">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                        <UserGroupIcon className="h-10 w-10" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {user.rol === "teacher"
                            ? "Todavía no tienes grupos"
                            : "Aún no formas parte de un grupo"
                        }
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                        {user.rol === "teacher"
                            ? "Crea tu primer espacio académico para reunir estudiantes, compartir casos clínicos y organizar actividades."
                            : "Cuando un profesor te agregue a un grupo, aparecerá aquí para que puedas acceder a sus publicaciones y actividades."
                        }
                    </p>

                    {user.rol === "teacher" && (
                        <button
                            type="button"
                            onClick={() => navigate(location.pathname + "?createGroup=true")}
                            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-500"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Crear mi primer grupo
                        </button>
                    )}
                </div>
            )}

            {/* MODALES */}
            <CreateGroupModal />
            <EditGroupModal />
            <DeleteGroupModal />
            <MembersModal />

        </div>
    );
};

export default GroupsView;
