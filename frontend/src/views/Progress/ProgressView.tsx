import { useEffect, useMemo, useState } from "react";
import {
    AcademicCapIcon,
    ArrowTrendingUpIcon,
    BookOpenIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    TrophyIcon,
    LockClosedIcon,
    ArrowRightIcon,
    ChartBarIcon,
    FireIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { getCases, getCompletedCases } from "../../api/caseApi";
import type { Case } from "../../types";

type Achievement = {
    id: string;
    title: string;
    description: string;
    requirement: number;
    icon: typeof TrophyIcon;
};

const ACHIEVEMENTS: Achievement[] = [
    {
        id: "first-case",
        title: "Primer paso",
        description: "Completa tu primer caso clínico.",
        requirement: 1,
        icon: AcademicCapIcon,
    },
    {
        id: "explorer",
        title: "Explorador clínico",
        description: "Completa 5 casos clínicos.",
        requirement: 5,
        icon: BookOpenIcon,
    },
    {
        id: "dedication",
        title: "Dedicación",
        description: "Completa 10 casos clínicos.",
        requirement: 10,
        icon: FireIcon,
    },
    {
        id: "expert",
        title: "En camino a la excelencia",
        description: "Completa 25 casos clínicos.",
        requirement: 25,
        icon: TrophyIcon,
    },
];

const ProgressView = () => {
    const [cases, setCases] = useState<Case[]>([]);
    const [completedCount, setCompletedCount] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadProgress = async () => {
            try {
                setLoading(true);
                setError("");

                const [casesResult, completedResult] = await Promise.all([
                    getCases(),
                    getCompletedCases(),
                ]);

                if (!active) return;

                setCases(casesResult ?? []);
                setCompletedCount(
                    Number.isFinite(completedResult)
                        ? Math.max(0, completedResult)
                        : 0
                );
            } catch (err) {
                if (!active) return;

                console.error("Error al cargar el progreso:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "No se pudo cargar tu progreso."
                );
            } finally {
                if (active) setLoading(false);
            }
        };

        void loadProgress();

        return () => {
            active = false;
        };
    }, []);

    const pendingCount = Math.max(0, cases.length - completedCount);

    const progressPercentage =
        cases.length > 0
            ? Math.min(
                  100,
                  Math.round((completedCount / cases.length) * 100)
              )
            : 0;

    const unlockedAchievements = ACHIEVEMENTS.filter(
        achievement => completedCount >= achievement.requirement
    );

    const filteredCases = useMemo(() => {
        const term = search
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

        if (!term) return cases;

        return cases.filter(clinicalCase => {
            const content = [
                clinicalCase.title,
                clinicalCase.description,
                ...clinicalCase.filters.map(filter => filter.name),
            ]
                .join(" ")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

            return content.includes(term);
        });
    }, [cases, search]);

    return (
        <div className="min-h-full space-y-8 pb-10 text-slate-800 dark:text-purple-100">
            {/* ENCABEZADO */}
            <header className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 p-7 text-white shadow-xl dark:from-[#302044] dark:via-[#382452] dark:to-[#493064] md:p-10">
                <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-cyan-300/10 blur-2xl" />
                <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-300/10 blur-2xl" />

                <div className="relative">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                        <ArrowTrendingUpIcon className="h-8 w-8 text-cyan-200 dark:text-purple-200" />
                    </div>

                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200 dark:text-purple-200">
                        Tu espacio personal
                    </p>

                    <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
                        Tu evolución clínica
                    </h1>

                    <p className="mt-4 max-w-2xl leading-relaxed text-blue-100 dark:text-purple-100/80">
                        Cada caso es una oportunidad para aprender.
                        Consulta tus avances, celebra tus logros y continúa
                        desarrollando tus habilidades clínicas.
                    </p>

                    <Link
                        to="/clinical-cases"
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 font-bold text-blue-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 dark:bg-purple-200 dark:text-[#302044] dark:hover:bg-purple-100"
                    >
                        Explorar casos
                        <ArrowRightIcon className="h-5 w-5" />
                    </Link>
                </div>
            </header>

            {/* ERRORES */}
            {error && (
                <div
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-400/20 dark:bg-[#38213d] dark:text-red-200"
                >
                    <p className="font-bold">
                        No pudimos cargar todas tus estadísticas.
                    </p>
                    <p className="mt-1 text-sm">{error}</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                    >
                        Intentar nuevamente
                    </button>
                </div>
            )}

            {/* TARJETAS DE MÉTRICAS */}
            <section>
                <div className="mb-5">
                    <h2 className="text-2xl font-extrabold">
                        Resumen de tu progreso
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-purple-300/70">
                        Una vista general de tu actividad clínica.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        title="Casos completados"
                        value={completedCount}
                        description="Finalizaciones registradas"
                        icon={CheckCircleIcon}
                        color="green"
                        loading={loading}
                    />

                    <MetricCard
                        title="Casos pendientes"
                        value={pendingCount}
                        description="Del catálogo disponible"
                        icon={BookOpenIcon}
                        color="blue"
                        loading={loading}
                    />

                    <MetricCard
                        title="Avance general"
                        value={`${progressPercentage}%`}
                        description="Proporción de casos completados"
                        icon={ChartBarIcon}
                        color="purple"
                        loading={loading}
                    />

                    <MetricCard
                        title="Logros desbloqueados"
                        value={unlockedAchievements.length}
                        description={`De ${ACHIEVEMENTS.length} objetivos`}
                        icon={TrophyIcon}
                        color="amber"
                        loading={loading}
                    />
                </div>
            </section>

            {/* AVANCE */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-purple-400/20 dark:bg-[#2b2045] md:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider text-cyan-700 dark:text-purple-300">
                            Objetivo de aprendizaje
                        </p>
                        <h2 className="mt-2 text-2xl font-extrabold">
                            Sigue avanzando
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-purple-300/70">
                            Completa casos clínicos para aumentar tu progreso
                            y desbloquear nuevos reconocimientos.
                        </p>
                    </div>

                    <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-4 border-cyan-100 bg-cyan-50 dark:border-purple-400/20 dark:bg-[#392951]">
                        <span className="text-2xl font-extrabold text-cyan-800 dark:text-purple-200">
                            {loading ? "—" : `${progressPercentage}%`}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-purple-300">
                            completado
                        </span>
                    </div>
                </div>

                <div
                    className="mt-7 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-[#211936]"
                    role="progressbar"
                    aria-label="Progreso de casos completados"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={loading ? 0 : progressPercentage}
                >
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700 dark:from-purple-500 dark:to-fuchsia-300"
                        style={{
                            width: loading ? "0%" : `${progressPercentage}%`,
                        }}
                    />
                </div>

                <div className="mt-3 flex justify-between gap-4 text-sm text-slate-500 dark:text-purple-300/70">
                    <span>{loading ? "Calculando..." : `${completedCount} completados`}</span>
                    <span>{loading ? " " : `${cases.length} casos en total`}</span>
                </div>
            </section>

            {/* LOGROS */}
            <section>
                <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="text-2xl font-extrabold">
                            Tus logros
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-purple-300/70">
                            Reconocimientos por cada etapa de tu aprendizaje.
                        </p>
                    </div>

                    <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                        {loading
                            ? "Cargando..."
                            : `${unlockedAchievements.length} de ${ACHIEVEMENTS.length} desbloqueados`}
                    </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {ACHIEVEMENTS.map(achievement => {
                        const unlocked =
                            !loading &&
                            completedCount >= achievement.requirement;
                        const AchievementIcon = achievement.icon;

                        return (
                            <article
                                key={achievement.id}
                                className={`relative overflow-hidden rounded-2xl border p-5 transition ${
                                    unlocked
                                        ? "border-purple-200 bg-gradient-to-br from-white to-purple-50 shadow-sm dark:border-purple-400/30 dark:from-[#302044] dark:to-[#392951]"
                                        : "border-slate-200 bg-white dark:border-purple-400/15 dark:bg-[#2b2045]"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                            unlocked
                                                ? "bg-purple-100 text-purple-700 dark:bg-purple-400/20 dark:text-purple-200"
                                                : "bg-slate-100 text-slate-400 dark:bg-[#392951] dark:text-purple-300/50"
                                        }`}
                                    >
                                        <AchievementIcon className="h-7 w-7" />
                                    </div>

                                    {unlocked ? (
                                        <CheckCircleIcon
                                            className="h-6 w-6 text-green-600 dark:text-green-400"
                                            aria-label="Logro desbloqueado"
                                        />
                                    ) : (
                                        <LockClosedIcon
                                            className="h-5 w-5 text-slate-400 dark:text-purple-300/50"
                                            aria-label="Logro bloqueado"
                                        />
                                    )}
                                </div>

                                <h3 className="mt-5 font-extrabold">
                                    {achievement.title}
                                </h3>

                                <p className="mt-2 min-h-10 text-sm leading-relaxed text-slate-500 dark:text-purple-300/70">
                                    {achievement.description}
                                </p>

                                <div className="mt-4">
                                    <div className="mb-2 flex justify-between text-xs">
                                        <span className="text-slate-500 dark:text-purple-300/70">
                                            Progreso
                                        </span>
                                        <span className="font-bold">
                                            {loading
                                                ? "—"
                                                : `${Math.min(
                                                      completedCount,
                                                      achievement.requirement
                                                  )}/${achievement.requirement}`}
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#211936]">
                                        <div
                                            className="h-full rounded-full bg-purple-500 transition-all duration-500 dark:bg-purple-300"
                                            style={{
                                                width: loading
                                                    ? "0%"
                                                    : `${Math.min(
                                                          100,
                                                          (completedCount /
                                                              achievement.requirement) *
                                                              100
                                                      )}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {unlocked && (
                                    <p className="mt-4 text-xs font-bold text-green-700 dark:text-green-300">
                                        ¡Logro desbloqueado!
                                    </p>
                                )}
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* CATÁLOGO E HISTORIAL DISPONIBLE */}
            <section>
                <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="text-2xl font-extrabold">
                            Explora tus casos
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-purple-300/70">
                            Busca un caso para consultar o continuar practicando.
                        </p>
                    </div>

                    <Link
                        to="/clinical-cases"
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-cyan-700 dark:text-purple-300 dark:hover:text-purple-100"
                    >
                        Ir a casos clínicos
                        <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                </div>

                <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 dark:border-purple-400/20 dark:bg-[#2b2045]">
                    <MagnifyingGlassIcon className="h-5 w-5 shrink-0 text-slate-400 dark:text-purple-300/70" />

                    <input
                        type="search"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        placeholder="Buscar por nombre, descripción o tema..."
                        className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-purple-300/50"
                        aria-label="Buscar casos clínicos"
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-purple-300 dark:hover:bg-[#392951]"
                            aria-label="Limpiar búsqueda"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-purple-400/20 dark:bg-[#2b2045]">
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-purple-500 dark:border-purple-400/20 dark:border-t-purple-300" />
                        <p className="mt-4 text-sm text-slate-500 dark:text-purple-300">
                            Cargando tus casos...
                        </p>
                    </div>
                ) : filteredCases.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredCases.map(clinicalCase => (
                            <article
                                key={clinicalCase.id}
                                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md dark:border-purple-400/20 dark:bg-[#2b2045] dark:hover:border-purple-300/40"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-[#493064] dark:text-purple-200">
                                        <BookOpenIcon className="h-6 w-6" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-extrabold">
                                            {clinicalCase.title}
                                        </h3>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-purple-300/70">
                                            Caso clínico
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500 dark:text-purple-300/70">
                                    {clinicalCase.description}
                                </p>

                                {clinicalCase.filters.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {clinicalCase.filters
                                            .slice(0, 3)
                                            .map(filter => (
                                                <span
                                                    key={filter.id}
                                                    className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-[#493064] dark:text-purple-200"
                                                >
                                                    {filter.name}
                                                </span>
                                            ))}
                                    </div>
                                )}

                                <Link
                                    to={`/simulation/${clinicalCase.id}`}
                                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 dark:bg-purple-500 dark:hover:bg-purple-400"
                                >
                                    Practicar caso
                                    <ArrowRightIcon className="h-4 w-4" />
                                </Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-purple-400/20 dark:bg-[#2b2045]">
                        <BookOpenIcon className="mx-auto h-12 w-12 text-slate-300 dark:text-purple-300/50" />
                        <h3 className="mt-4 font-bold">
                            No encontramos casos
                        </h3>
                        <p className="mt-2 text-sm text-slate-500 dark:text-purple-300/70">
                            Prueba con otra búsqueda o explora el catálogo completo.
                        </p>

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="mt-4 rounded-xl bg-purple-100 px-4 py-2 font-bold text-purple-800 dark:bg-purple-400/20 dark:text-purple-200"
                            >
                                Limpiar búsqueda
                            </button>
                        )}
                    </div>
                )}
            </section>

            {/* PIE */}
            <footer className="flex flex-col gap-2 border-t border-slate-200 py-5 text-sm text-slate-500 dark:border-purple-400/15 dark:text-purple-300/60 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4" />
                    Cada caso cuenta en tu formación.
                </p>
                <p>CLIRA · Tu progreso clínico</p>
            </footer>
        </div>
    );
};

type MetricCardProps = {
    title: string;
    value: number | string;
    description: string;
    icon: typeof TrophyIcon;
    color: "green" | "blue" | "purple" | "amber";
    loading: boolean;
};

const MetricCard = ({
    title,
    value,
    description,
    icon: Icon,
    color,
    loading,
}: MetricCardProps) => {
    const colorStyles = {
        green: "bg-green-50 text-green-700 dark:bg-green-400/10 dark:text-green-300",
        blue: "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
        purple: "bg-purple-50 text-purple-700 dark:bg-purple-400/10 dark:text-purple-300",
        amber: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
    };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-purple-400/20 dark:bg-[#2b2045]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-purple-300/70">
                        {title}
                    </p>
                    <p className="mt-3 text-3xl font-extrabold tracking-tight">
                        {loading ? "—" : value}
                    </p>
                </div>

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorStyles[color]}`}
                >
                    <Icon className="h-6 w-6" />
                </div>
            </div>

            <p className="mt-4 text-xs text-slate-400 dark:text-purple-300/60">
                {description}
            </p>
        </article>
    );
};

export default ProgressView;