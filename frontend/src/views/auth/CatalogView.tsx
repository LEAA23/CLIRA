import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    AcademicCapIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    BookOpenIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";

import { getPublicCases } from "../../api/caseApi";
import type { Case } from "../../types";

const CatalogView = () => {
    const navigate = useNavigate();

    const [cases, setCases] = useState<Case[]>([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCases = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getPublicCases();
                setCases(data);
            } catch (err) {
                console.error("Error al cargar el catálogo:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "No se pudieron cargar los casos clínicos."
                );
            } finally {
                setLoading(false);
            }
        };

        void loadCases();
    }, []);

    const categories = useMemo(() => {
        const names = cases.flatMap(clinicalCase =>
            clinicalCase.filters.map(filter => filter.name)
        );

        return ["Todos", ...Array.from(new Set(names)).sort()];
    }, [cases]);

    const filteredCases = useMemo(() => {
        const normalizedSearch = search
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

        return cases.filter(clinicalCase => {
            const searchableText = [
                clinicalCase.title,
                clinicalCase.description,
                ...clinicalCase.filters.map(filter => filter.name)
            ]
                .join(" ")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

            const matchesSearch = searchableText.includes(normalizedSearch);

            const matchesCategory =
                selectedCategory === "Todos" ||
                clinicalCase.filters.some(
                    filter => filter.name === selectedCategory
                );

            return matchesSearch && matchesCategory;
        });
    }, [cases, search, selectedCategory]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#211936] dark:text-purple-100">

            {/* HEADER */}
            <header className="sticky top-0 z-30 border-b border-white/10 bg-[#102b55] text-white shadow-lg dark:border-purple-400/10 dark:bg-[#251b3d]">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
                    <Link to="/auth/login" className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                            <AcademicCapIcon className="h-7 w-7 text-cyan-300" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-extrabold tracking-wider">
                                CLIRA<span className="text-cyan-300">.</span>
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-blue-200">
                                Simulación clínica
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/auth/login"
                        className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-900 transition hover:-translate-y-0.5 hover:bg-cyan-100 dark:bg-purple-200 dark:text-[#302044] dark:hover:bg-purple-100"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            </header>

            {/* HERO */}
            <section className="relative overflow-hidden bg-linear-to-br from-[#102b55] via-blue-800 to-cyan-700 text-white dark:from-[#302044] dark:via-[#382452] dark:to-[#493064]">
                <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-cyan-300/10 blur-2xl" />
                <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-blue-300/10 blur-2xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-20 md:py-28 lg:px-8">
                    <Link
                        to="/auth/login"
                        className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-blue-100 transition hover:text-white"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Volver al inicio de sesión
                    </Link>

                    <div className="max-w-3xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
                            <SparklesIcon className="h-4 w-4" />
                            Explora. Aprende. Descubre.
                        </span>

                        <h2 className="mt-7 text-4xl font-extrabold leading-tight md:text-6xl">
                            Cursos y
                            <span className="block text-cyan-300">
                                Catálogo clínico.
                            </span>
                        </h2>

                        <p className="mt-7 max-w-2xl text-base leading-relaxed text-blue-100 md:text-lg">
                            Descubre los casos clínicos disponibles en CLIRA.
                            Explora diferentes escenarios médicos y conoce
                            las oportunidades de aprendizaje que te esperan.
                        </p>

                        <div className="mt-10 flex flex-wrap gap-4">
                            <a
                                href="#catalogo"
                                className="inline-flex items-center gap-3 rounded-xl bg-cyan-400 px-7 py-4 font-bold text-[#102b55] shadow-lg shadow-cyan-950/20 transition hover:-translate-y-1 hover:bg-cyan-300 dark:bg-purple-200 dark:text-[#302044] dark:hover:bg-purple-100"
                            >
                                Explorar catálogo
                                <ArrowRightIcon className="h-5 w-5" />
                            </a>

                            <Link
                                to="/auth/login"
                                className="inline-flex items-center gap-3 rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20"
                            >
                                Conoce CLIRA
                            </Link>
                        </div>
                    </div>

                    {/* INDICADORES */}
                    <div className="mt-16 grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                            <BookOpenIcon className="h-7 w-7 text-cyan-300" />
                            <p className="mt-3 text-3xl font-extrabold">
                                {cases.length}
                            </p>
                            <p className="mt-1 text-sm text-blue-100">
                                Casos disponibles
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                            <AcademicCapIcon className="h-7 w-7 text-cyan-300" />
                            <p className="mt-3 text-3xl font-extrabold">
                                {categories.length > 0
                                    ? categories.length - 1
                                    : 0}
                            </p>
                            <p className="mt-1 text-sm text-blue-100">
                                Etiquetas disponibles
                            </p>
                        </div>

                        <div className="col-span-2 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur md:col-span-1">
                            <SparklesIcon className="h-7 w-7 text-cyan-300" />
                            <p className="mt-3 text-lg font-extrabold">
                                Aprende a tu ritmo
                            </p>
                            <p className="mt-1 text-sm text-blue-100">
                                Explora antes de registrarte
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATÁLOGO */}
            <main id="catalogo" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
                <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-purple-300">
                            Biblioteca de aprendizaje
                        </span>

                        <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-purple-100 md:text-4xl">
                            Explora los casos clínicos
                        </h2>

                        <p className="mt-3 max-w-2xl leading-relaxed text-slate-500 dark:text-purple-300/70">
                            Encuentra escenarios médicos, consulta sus
                            descripciones y descubre los temas que puedes
                            practicar en la plataforma.
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm dark:border-purple-400/20 dark:bg-[#2b2045] dark:text-purple-200">
                        {filteredCases.length}{" "}
                        {filteredCases.length === 1
                            ? "resultado"
                            : "resultados"}
                    </div>
                </div>

                {/* BÚSQUEDA */}
                <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-purple-400/20 dark:bg-[#2b2045] md:flex-row">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-purple-300" />

                        <input
                            type="search"
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            placeholder="Buscar por nombre, descripción o tema..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 dark:border-purple-400/20 dark:bg-[#211936] dark:text-purple-100 dark:placeholder:text-purple-300/50 dark:focus:border-purple-400 dark:focus:ring-purple-500/20"
                        />
                    </div>

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-purple-300 dark:hover:bg-[#392951] dark:hover:text-purple-100"
                        >
                            <XMarkIcon className="h-5 w-5" />
                            Limpiar
                        </button>
                    )}
                </div>

                {/* CATEGORÍAS */}
                <div className="mb-10 flex flex-wrap gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                                selectedCategory === category
                                    ? "border-blue-800 bg-blue-900 text-white shadow-md dark:border-purple-300 dark:bg-purple-500 dark:text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-cyan-400 hover:text-cyan-700 dark:border-purple-400/20 dark:bg-[#2b2045] dark:text-purple-200 dark:hover:border-purple-300 dark:hover:text-purple-100"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* ESTADOS */}
                {loading ? (
                    <div className="flex min-h-64 flex-col items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600 dark:border-purple-400/20 dark:border-t-purple-400" />
                        <p className="mt-5 font-medium text-slate-500 dark:text-purple-300">
                            Preparando el catálogo clínico...
                        </p>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-400/20 dark:bg-[#38213d]">
                        <p className="font-bold text-red-700 dark:text-red-300">
                            No fue posible cargar el catálogo
                        </p>
                        <p className="mt-2 text-sm text-red-600 dark:text-red-200">
                            {error}
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-5 rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
                        >
                            Intentar nuevamente
                        </button>
                    </div>
                ) : filteredCases.length > 0 ? (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredCases.map(clinicalCase => {
                            const image =
                                typeof clinicalCase.previewImage === "string"
                                    ? clinicalCase.previewImage
                                    : "";

                            return (
                                <article
                                    key={clinicalCase.id}
                                    className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-cyan-200 hover:shadow-xl dark:border-purple-400/20 dark:bg-[#2b2045] dark:hover:border-purple-300/50 dark:hover:shadow-purple-950/30"
                                >
                                    <div className="relative h-52 overflow-hidden bg-linear-to-br from-blue-100 to-cyan-100 dark:from-[#493064] dark:to-[#302044]">
                                        {image ? (
                                            <img
                                                src={image}
                                                alt={clinicalCase.title}
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <AcademicCapIcon className="h-20 w-20 text-blue-300 dark:text-purple-300/60" />
                                            </div>
                                        )}

                                        <div className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/90 px-4 py-1.5 text-xs font-bold text-blue-900 shadow-sm backdrop-blur dark:border-purple-300/30 dark:bg-[#302044]/90 dark:text-purple-100">
                                            Caso clínico
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col p-6">
                                        <h3 className="text-xl font-extrabold leading-snug text-slate-900 transition group-hover:text-blue-800 dark:text-purple-100 dark:group-hover:text-purple-300">
                                            {clinicalCase.title}
                                        </h3>

                                        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500 dark:text-purple-300/70">
                                            {clinicalCase.description}
                                        </p>

                                        <div className="mt-5">
                                            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-purple-300/60">
                                                Temas relacionados
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {clinicalCase.filters.length > 0 ? (
                                                    clinicalCase.filters
                                                        .slice(0, 4)
                                                        .map(filter => (
                                                            <span
                                                                key={filter.id}
                                                                className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:bg-[#493064] dark:text-purple-200"
                                                            >
                                                                {filter.name}
                                                            </span>
                                                        ))
                                                ) : (
                                                    <span className="text-xs text-slate-400 dark:text-purple-300/50">
                                                        Sin etiquetas
                                                    </span>
                                                )}

                                                {clinicalCase.filters.length > 4 && (
                                                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:bg-[#392951] dark:text-purple-200">
                                                        +{clinicalCase.filters.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => navigate("/auth/login")}
                                            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#153968] px-5 py-3.5 font-bold text-white transition hover:bg-cyan-700 dark:bg-purple-500 dark:hover:bg-purple-400"
                                        >
                                            Iniciar sesión para practicar
                                            <ArrowRightIcon className="h-5 w-5 transition group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-purple-400/20 dark:bg-[#2b2045]">
                        <BookOpenIcon className="mx-auto h-14 w-14 text-slate-300 dark:text-purple-300/50" />
                        <h3 className="mt-5 text-xl font-bold text-slate-800 dark:text-purple-100">
                            No encontramos casos
                        </h3>
                        <p className="mt-2 text-slate-500 dark:text-purple-300/70">
                            Prueba con otro término o selecciona otra categoría.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setSelectedCategory("Todos");
                            }}
                            className="mt-6 rounded-xl bg-blue-900 px-6 py-3 font-bold text-white transition hover:bg-blue-800 dark:bg-purple-500 dark:hover:bg-purple-400"
                        >
                            Mostrar todos los casos
                        </button>
                    </div>
                )}
            </main>

            {/* LLAMADO A LA ACCIÓN */}
            <section className="bg-[#102b55] px-5 py-16 text-center text-white dark:bg-[#302044]">
                <div className="mx-auto max-w-3xl">
                    <SparklesIcon className="mx-auto h-10 w-10 text-cyan-300 dark:text-purple-300" />

                    <h2 className="mt-5 text-3xl font-extrabold md:text-4xl">
                        Tu próxima experiencia clínica comienza aquí.
                    </h2>

                    <p className="mt-5 leading-relaxed text-blue-100 dark:text-purple-200/80">
                        Inicia sesión en CLIRA para acceder a las simulaciones,
                        practicar tus habilidades clínicas y llevar tu
                        aprendizaje al siguiente nivel.
                    </p>

                    <Link
                        to="/auth/login"
                        className="mt-8 inline-flex items-center gap-3 rounded-xl bg-cyan-400 px-8 py-4 font-extrabold text-[#102b55] transition hover:-translate-y-1 hover:bg-cyan-300 dark:bg-purple-200 dark:text-[#302044] dark:hover:bg-purple-100"
                    >
                        Entrar a CLIRA
                        <ArrowRightIcon className="h-5 w-5" />
                    </Link>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#0b1f3d] px-5 py-7 text-center text-sm text-blue-200 dark:bg-[#1b142b] dark:text-purple-200">
                <p className="font-bold tracking-widest text-white">
                    CLIRA<span className="text-cyan-300 dark:text-purple-300">.</span>
                </p>
                <p className="mt-2">
                    Aprender, practicar y mejorar.
                </p>
                <p className="mt-4 text-xs text-blue-300/60 dark:text-purple-300/50">
                    © {new Date().getFullYear()} CLIRA. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
};

export default CatalogView;