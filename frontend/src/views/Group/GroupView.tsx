import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    AcademicCapIcon,
    ArrowLeftIcon,
    BookOpenIcon,
    MegaphoneIcon,
    PlusIcon,
    UsersIcon,
    XMarkIcon,
    PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

import PostModal from "../../components/posts/PostModal";
import PostCard from "../../components/posts/PostCard";
import ViewPostModal from "../../components/posts/ViewPostModal";
import EditPostModal from "../../components/posts/EditPostModal";
import DeletePostModal from "../../components/posts/DeletePostModal";

import { useAppStore } from "../../stores/useAppStore";

import { getPublicCases } from "../../api/caseApi";
import type { PublicCase } from "../../types";

type GroupTab = "tablon" | "personas";

const GroupView = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const groupId = Number(id);

    const [activeTab, setActiveTab] = useState<GroupTab>("tablon");
    const [showCaseForm, setShowCaseForm] = useState(false);
    const [availableCases, setAvailableCases] = useState<PublicCase[]>([]);
    const [selectedCase, setSelectedCase] = useState("");
    const [announcement, setAnnouncement] = useState("");
    const [loadingCases, setLoadingCases] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const fetchGroup = useAppStore(state => state.fetchGroup);
    const group = useAppStore(state => state.group);

    const fetchPosts = useAppStore(state => state.fetchPosts);
    const posts = useAppStore(state => state.posts);

    const fetchUserAuth = useAppStore(state => state.fetchUserAuth);
    const user = useAppStore(state => state.user);

    const createPost = useAppStore(state => state.createPost);

    // Cargar información del grupo y sus publicaciones.
    useEffect(() => {
        if (!groupId) return;

        const loadGroup = async () => {
            try {
                await fetchUserAuth();
                await Promise.all([
                    fetchGroup(groupId),
                    fetchPosts(groupId)
                ]);
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "No se pudo cargar el grupo"
                );
            }
        };

        void loadGroup();
    }, [groupId, fetchGroup, fetchPosts, fetchUserAuth]);

    // Obtener casos existentes para el profesor.
    useEffect(() => {
        if (user.rol !== "teacher") return;

        const loadCases = async () => {
            try {
                setLoadingCases(true);
                const cases = await getPublicCases();
                setAvailableCases(cases);
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "No se pudieron cargar los casos"
                );
            } finally {
                setLoadingCases(false);
            }
        };

        void loadCases();
    }, [user.rol]);

    const publishCaseAnnouncement = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const clinicalCase = availableCases.find(
            item => item.id === Number(selectedCase)
        );

        if (!clinicalCase) {
            toast.error("Selecciona un caso clínico");
            return;
        }

        try {
            setPublishing(true);

            const formData = new FormData();

            formData.append(
                "title",
                `Caso clínico: ${clinicalCase.title}`
            );

            // El identificador se guarda en el contenido existente.
            // No se agrega ninguna columna ni tabla.
            const marker = `[[CLIRA_CASE:${clinicalCase.id}]]`;

            const content = [
                announcement.trim(),
                clinicalCase.description,
                `\n${marker}`
            ].filter(Boolean).join("\n\n");

            formData.append("content", content);

            await createPost({
                groupId,
                formData
            });

            toast.success("Caso anunciado correctamente");

            setSelectedCase("");
            setAnnouncement("");
            setShowCaseForm(false);
            setActiveTab("tablon");

        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "No se pudo publicar el anuncio"
            );
        } finally {
            setPublishing(false);
        }
    };

    if (!group?.id) {
        return (
            <div className="flex min-h-96 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                    <p className="mt-4 text-gray-500">
                        Cargando grupo...
                    </p>
                </div>
            </div>
        );
    }

    const students = group.users ?? [];
    const totalMembers = students.length + 1;
    const isTeacher = user.rol === "teacher";

    return (
        <div className="clira-page clira-page--groups mx-auto min-h-full w-full max-w-7xl px-4 pb-12">

            {/* REGRESAR */}
            <div className="mb-6">
                <Link
                    to="/groups"
                    className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-800"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Mis grupos
                </Link>
            </div>

            
            {/* PORTADA */}
            <section className="relative mb-8 min-h-[300px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-800 shadow-2xl md:min-h-[360px]">

                {group.bgImage && (
                    <img
                        src={group.bgImage}
                        alt={`Portada de ${group.name}`}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                )}

                {/* Degradado para mejorar la lectura */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/10" />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Decoración */}
                <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border border-white/10" />
                <div className="absolute -right-5 -top-10 h-52 w-52 rounded-full border border-white/10" />

                <div className="relative z-10 flex min-h-[300px] flex-col justify-end p-7 text-white md:min-h-[360px] md:p-10">

                    <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md">
                        <AcademicCapIcon className="h-5 w-5 text-cyan-300" />
                        Aula virtual CLIRA
                    </div>

                    <h1 className="max-w-3xl text-3xl font-black tracking-tight drop-shadow-lg md:text-5xl">
                        {group.name}
                    </h1>

                    <div className="mt-6 flex flex-wrap items-center gap-3">

                        <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/20">
                                <AcademicCapIcon className="h-6 w-6 text-cyan-200" />
                            </div>

                            <div>
                                <p className="text-xs text-blue-100">Profesor</p>
                                <p className="font-bold">
                                    {group.teacherUser.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-400/20">
                                <UsersIcon className="h-6 w-6 text-purple-200" />
                            </div>

                            <div>
                                <p className="text-xs text-blue-100">Comunidad</p>
                                <p className="font-bold">
                                    {totalMembers} integrantes
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* PESTAÑAS */}
            <div className="mb-8 flex gap-2 border-b border-gray-200 dark:border-purple-900">

                <button
                    type="button"
                    onClick={() => setActiveTab("tablon")}
                    className={`flex items-center gap-2 border-b-2 px-6 py-4 font-bold transition ${
                        activeTab === "tablon"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-blue-500"
                    }`}
                >
                    <MegaphoneIcon className="h-5 w-5" />
                    Tablón
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("personas")}
                    className={`flex items-center gap-2 border-b-2 px-6 py-4 font-bold transition ${
                        activeTab === "personas"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-blue-500"
                    }`}
                >
                    <UsersIcon className="h-5 w-5" />
                    Personas
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                        {totalMembers}
                    </span>
                </button>

            </div>

            {/* TABLÓN */}
            {activeTab === "tablon" && (
                <section>

                    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-purple-100">
                                Tablón del grupo
                            </h2>
                            <p className="mt-1 text-gray-500 dark:text-purple-300">
                                Comunicados y actividades de tu clase.
                            </p>
                        </div>

                        {isTeacher && (
                            <div className="flex flex-col gap-3 sm:flex-row">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(location.pathname + "?makePost=true")
                                    }
                                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow transition hover:bg-blue-700"
                                >
                                    <PlusIcon className="h-5 w-5" />
                                    Comunicado
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowCaseForm(true)}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-bold text-white shadow transition hover:bg-purple-700"
                                >
                                    <BookOpenIcon className="h-5 w-5" />
                                    Anunciar caso clínico
                                </button>

                            </div>
                        )}
                    </div>

                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                            {posts.map(item => (
                                <PostCard
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    content={item.content}
                                    firstImage={item.images?.[0]?.path ?? ""}
                                    userName={item.user.name}
                                    userLastName={item.user.lastName}
                                    profileImage={item.user.profileImage}
                                />
                            ))}

                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center shadow-sm dark:border-purple-800 dark:bg-purple-950">
                            <MegaphoneIcon className="mx-auto h-14 w-14 text-blue-400" />
                            <h3 className="mt-5 text-xl font-bold text-gray-800 dark:text-purple-100">
                                Todavía no hay publicaciones
                            </h3>
                            <p className="mt-2 text-gray-500 dark:text-purple-300">
                                Aquí aparecerán los comunicados y anuncios de tu grupo.
                            </p>
                        </div>
                    )}

                </section>
            )}

            {/* PERSONAS */}
            {activeTab === "personas" && (
                <section className="space-y-8">

                    {/* PROFESOR */}
                    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm dark:border-purple-800 dark:bg-purple-950">

                        <h2 className="mb-5 flex items-center gap-3 text-2xl font-extrabold text-gray-800 dark:text-purple-100">
                            <AcademicCapIcon className="h-7 w-7 text-blue-600" />
                            Profesor
                        </h2>

                        <div className="flex items-center gap-4 border-t border-gray-100 pt-5 dark:border-purple-800">

                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                                {group.teacherUser.name.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <p className="font-bold text-gray-800 dark:text-purple-100">
                                    {group.teacherUser.name}
                                </p>
                                <span className="text-sm font-medium text-blue-600">
                                    Profesor del grupo
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* ALUMNOS */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-purple-800 dark:bg-purple-950">

                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

                            <h2 className="flex items-center gap-3 text-2xl font-extrabold text-gray-800 dark:text-purple-100">
                                <UsersIcon className="h-7 w-7 text-blue-600" />
                                Compañeros de clase
                            </h2>

                            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 dark:bg-purple-900 dark:text-purple-100">
                                {students.length} alumnos
                            </span>

                        </div>

                        {students.length > 0 ? (
                            <div className="grid gap-3 md:grid-cols-2">
   
                            {students.map(student => (
                                <div
                                    key={student.id}
                                    className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-purple-800 dark:bg-purple-950 dark:hover:border-purple-600"
                                >
                                    {/* FOTO DE PERFIL */}
                                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-blue-100 bg-gradient-to-br from-blue-100 to-purple-100 dark:border-purple-700 dark:from-purple-800 dark:to-indigo-900">

                                        {/* Iniciales como respaldo */}
                                        <div className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-blue-700 dark:text-purple-100">
                                            {student.name?.charAt(0).toUpperCase() ?? "A"}
                                        </div>

                                        {student.profileImage && (
                                            <img
                                                src={student.profileImage}
                                                alt={`Foto de ${student.name}`}
                                                className="absolute inset-0 h-full w-full object-cover"
                                                onError={(event) => {
                                                    event.currentTarget.style.display = "none";
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* INFORMACIÓN */}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-bold text-gray-800 dark:text-purple-100">
                                            {student.name} {student.lastName}
                                        </p>

                                        <span className="text-xs font-medium text-gray-500 dark:text-purple-300">
                                            Alumno del grupo
                                        </span>
                                    </div>

                                    <div className="rounded-full bg-blue-50 p-2 text-blue-600 transition group-hover:bg-blue-100 dark:bg-purple-900 dark:text-purple-300">
                                        <UsersIcon className="h-5 w-5" />
                                    </div>
                                </div>
                            ))}

                            </div>
                        ) : (
                            <p className="py-8 text-center text-gray-500 dark:text-purple-300">
                                Todavía no hay alumnos inscritos.
                            </p>
                        )}

                    </div>

                </section>
            )}

            {/* MODAL PARA ANUNCIAR CASOS */}
            {showCaseForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">

                    <div className="my-8 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-purple-950 md:p-8">

                        <div className="mb-6 flex items-center justify-between gap-4">

                            <div>
                                <span className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">
                                    Actividad del grupo
                                </span>
                                <h2 className="mt-1 text-2xl font-extrabold text-gray-800 dark:text-purple-100">
                                    Anunciar caso clínico
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCaseForm(false)}
                                className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-purple-900"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>

                        </div>

                        <form onSubmit={publishCaseAnnouncement} className="space-y-5">

                            <div>
                                <label className="mb-2 block font-bold text-gray-700 dark:text-purple-100">
                                    Selecciona un caso clínico
                                </label>

                                <select
                                    value={selectedCase}
                                    onChange={event => setSelectedCase(event.target.value)}
                                    required
                                    disabled={loadingCases}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-purple-800 dark:bg-purple-900 dark:text-purple-100"
                                >
                                    <option value="">
                                        {loadingCases
                                            ? "Cargando casos..."
                                            : "Selecciona un caso"}
                                    </option>

                                    {availableCases.map(item => (
                                        <option key={item.id} value={item.id}>
                                            {item.title}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            {selectedCase && (
                                <div className="rounded-xl border border-purple-100 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900">

                                    <p className="font-bold text-purple-800 dark:text-purple-100">
                                        {availableCases.find(
                                            item => item.id === Number(selectedCase)
                                        )?.title}
                                    </p>

                                    <p className="mt-2 text-sm text-purple-700 dark:text-purple-200">
                                        {availableCases.find(
                                            item => item.id === Number(selectedCase)
                                        )?.description}
                                    </p>

                                </div>
                            )}

                            <div>
                                <label className="mb-2 block font-bold text-gray-700 dark:text-purple-100">
                                    Instrucciones para tus alumnos
                                </label>

                                <textarea
                                    rows={4}
                                    value={announcement}
                                    onChange={event => setAnnouncement(event.target.value)}
                                    placeholder="Ej. Resuelvan este caso y analicen los síntomas antes de seleccionar un diagnóstico."
                                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-purple-800 dark:bg-purple-900 dark:text-purple-100"
                                />
                            </div>

                            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">

                                <button
                                    type="button"
                                    onClick={() => setShowCaseForm(false)}
                                    className="rounded-xl border border-gray-200 px-6 py-3 font-bold text-gray-600 transition hover:bg-gray-100 dark:border-purple-800 dark:text-purple-100 dark:hover:bg-purple-900"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={publishing || loadingCases || !selectedCase}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <PaperAirplaneIcon className="h-5 w-5" />
                                    {publishing ? "Publicando..." : "Publicar anuncio"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* MODALES EXISTENTES */}
            <ViewPostModal />
            <PostModal />
            <EditPostModal />
            <DeletePostModal />

        </div>
    );
};

export default GroupView;