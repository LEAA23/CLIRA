import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@headlessui/react";
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
    SparklesIcon,
} from "@heroicons/react/16/solid";

import RankingCard from "../../components/ranking/RankingCard";
import UserRankingCard from "../../components/ranking/UserRankingCard";
import useConfetti, {
    type confettiType,
} from "../../hooks/useConfetti";

import { getRanking } from "../../api/rankingApi";
import type { RankingEntry } from "../../api/rankingApi";

const RankingView = () => {
    const navigate = useNavigate();

    const [ranking, setRanking] = useState<RankingEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [submittedSearch, setSubmittedSearch] = useState("");
    const [selectedUser, setSelectedUser] =
        useState<RankingEntry | null>(null);

    const [searchOpen, setSearchOpen] = useState(false);
    const [confettiEnabled, setConfettiEnabled] = useState(true);

    // Obtener el ranking real del backend.
    useEffect(() => {
        let active = true;

        const loadRanking = async () => {
            try {
                setError("");

                const data = await getRanking();

                if (active) {
                    setRanking(data);
                }
            } catch (error) {
                console.error("Error al cargar el ranking:", error);

                if (active) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "No se pudo cargar el ranking."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadRanking();

        return () => {
            active = false;
        };
    }, []);

    // Conservar el efecto de confeti existente.
    useEffect(() => {
        if (!confettiEnabled) return;

        const interval = setInterval(() => {
            const settings: confettiType = {
                particleRatio: 1,
                opts: {
                    spread: 100,
                    startVelocity: 55,
                },
                count: Math.floor(Math.random() * 300),
                defaults: {
                    origin: {
                        y: 0.9,
                    },
                },
            };

            useConfetti(settings);
        }, 4000);

        return () => clearInterval(interval);
    }, [confettiEnabled]);

    // Buscar estudiantes por correo.
    const matchingUsers = submittedSearch
        ? ranking.filter((user) =>
              user.email
                  .toLowerCase()
                  .includes(submittedSearch)
          )
        : [];

    // Mantener la disposición: tercero, primero y segundo.
    // Si hay menos de tres estudiantes, las tarjetas restantes
    // se centran igualmente.
    const podium = [
        {
            entry: ranking[2],
            medal: "/bronzeMedal.png",
            height: "min-h-[190px] sm:min-h-[220px]",
            isWinner: false,
        },
        {
            entry: ranking[0],
            medal: "/goldMedal.png",
            height: "min-h-[230px] sm:min-h-[270px]",
            isWinner: true,
        },
        {
            entry: ranking[1],
            medal: "/silverMedal.png",
            height: "min-h-[190px] sm:min-h-[220px]",
            isWinner: false,
        },
    ].filter(
        (
            item
        ): item is {
            entry: RankingEntry;
            medal: string;
            height: string;
            isWinner: boolean;
        } => Boolean(item.entry)
    );

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmittedSearch(searchTerm.trim().toLowerCase());
        setSelectedUser(null);
    };

    const getInitials = (entry: RankingEntry) =>
        `${entry.name.charAt(0)}${entry.lastName.charAt(0)}`.toUpperCase();

    return (
        <>
            <h1 className="my-8 text-center text-4xl font-bold text-blue-500 sm:text-5xl">
                Ranking
            </h1>

            {/* Control del confeti */}
            <div className="mb-5 flex items-center justify-end gap-2">
                <SparklesIcon
                    className={`h-7 ${
                        confettiEnabled
                            ? "text-blue-500"
                            : "text-gray-400"
                    }`}
                />

                <span className="text-sm text-gray-500">
                    Confeti
                </span>

                <Switch
                    checked={confettiEnabled}
                    onChange={setConfettiEnabled}
                    aria-label="Activar o desactivar confeti"
                    className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
                >
                    <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
                </Switch>
            </div>

            {loading && (
                <p className="py-8 text-center text-gray-500">
                    Cargando ranking...
                </p>
            )}

            {error && (
                <div
                    role="alert"
                    className="my-5 rounded-xl bg-red-50 p-4 text-red-700"
                >
                    {error}
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="ml-3 font-semibold underline"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {!loading && !error && ranking.length === 0 && (
                <p className="py-8 text-center text-gray-500">
                    Todavía no hay estudiantes para mostrar.
                </p>
            )}

            {!loading && !error && ranking.length > 0 && (
                <>
                    {/* Podio centrado con fotografías reales */}
                    <section className="mx-auto w-full max-w-5xl">
                        <div className="flex w-full flex-wrap items-end justify-center gap-3 sm:gap-6">
                            {podium.map((item) => {
                                const entry = item.entry;

                                return (
                                    <div
                                        key={entry.id}
                                        className={`flex w-[calc(33.333%-0.5rem)] max-w-[220px] min-w-0 flex-col items-center justify-end rounded-t-2xl bg-linear-to-t from-gray-50 via-blue-500 to-blue-500 px-1 py-4 text-white sm:rounded-t-3xl sm:p-5 ${item.height}`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/user-profile/${entry.id}`
                                                )
                                            }
                                            className="flex w-full min-w-0 flex-col items-center"
                                            title={`Ver perfil de ${entry.name} ${entry.lastName}`}
                                        >
                                            {/* Fotografía */}
                                            <div className="relative mb-3 h-12 w-12 shrink-0 sm:h-20 sm:w-20">
                                                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white text-lg font-bold text-blue-600 ring-2 ring-white sm:text-2xl">
                                                    {entry.profileImage ? (
                                                        <img
                                                            src={entry.profileImage}
                                                            alt={`Foto de ${entry.name} ${entry.lastName}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        getInitials(entry)
                                                    )}
                                                </div>

                                                {/* Medalla */}
                                                <img
                                                    src={item.medal}
                                                    alt=""
                                                    className={`absolute -bottom-2 -right-2 h-6 w-6 object-contain sm:h-9 sm:w-9 ${
                                                        item.isWinner
                                                            ? "h-8 w-8 sm:h-11 sm:w-11"
                                                            : ""
                                                    }`}
                                                />
                                            </div>

                                            <span className="mt-1 text-lg font-bold sm:text-2xl">
                                                #{entry.position}
                                            </span>

                                            <span className="mt-1 w-full break-words text-center text-xs font-semibold sm:text-base">
                                                {entry.name}
                                            </span>

                                            <span className="w-full break-words text-center text-xs sm:text-sm">
                                                {entry.lastName}
                                            </span>

                                            <span className="mt-2 text-center text-xs font-bold sm:text-sm">
                                                {entry.points.toLocaleString("es-MX")} pts.
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Clasificación y búsqueda de estudiantes */}
                    <div className="mt-7 grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
                        {/* Lista de puestos restantes */}
                        <section className="min-w-0">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <h2 className="text-xl font-bold">
                                    Clasificación general
                                </h2>

                                <span className="whitespace-nowrap text-sm text-gray-500">
                                    {ranking.length} estudiantes
                                </span>
                            </div>

                            {ranking.length > 3 ? (
                                ranking.slice(3).map((entry) => (
                                    <RankingCard
                                        key={entry.id}
                                        entry={entry}
                                    />
                                ))
                            ) : (
                                <div className="rounded-xl border border-gray-100 bg-white p-5 text-center text-sm text-gray-500">
                                    Los puestos restantes aparecerán aquí
                                    cuando haya más estudiantes.
                                </div>
                            )}
                        </section>

                        {/* Buscador desplegable en la misma pantalla */}
                        <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                            <button
                                type="button"
                                onClick={() =>
                                    setSearchOpen((open) => !open)
                                }
                                aria-expanded={searchOpen}
                                aria-controls="ranking-search-panel"
                                className="flex w-full items-center justify-between gap-3 text-left"
                            >
                                <span className="flex min-w-0 items-center gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-blue-600" />
                                    </span>

                                    <span className="min-w-0">
                                        <span className="block font-bold text-gray-800">
                                            Buscar estudiante
                                        </span>

                                        <span className="block text-sm text-gray-500">
                                            Consultar posición y puntos
                                        </span>
                                    </span>
                                </span>

                                <ChevronDownIcon
                                    className={`h-6 w-6 shrink-0 text-gray-500 transition-transform duration-300 ${
                                        searchOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            <div
                                id="ranking-search-panel"
                                aria-hidden={!searchOpen}
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    searchOpen
                                        ? "mt-5 max-h-[5000px] opacity-100"
                                        : "pointer-events-none max-h-0 opacity-0"
                                }`}
                            >
                                <form
                                    onSubmit={handleSearch}
                                    className="flex flex-col gap-2 sm:flex-row"
                                >
                                    <input
                                        type="search"
                                        value={searchTerm}
                                        onChange={(event) =>
                                            setSearchTerm(event.target.value)
                                        }
                                        placeholder="Correo del estudiante"
                                        aria-label="Correo del estudiante"
                                        className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />

                                    <button
                                        type="submit"
                                        className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        Buscar
                                    </button>
                                </form>

                                {submittedSearch && (
                                    <div className="mt-4">
                                        <p className="mb-2 text-sm text-gray-500">
                                            Resultados: {matchingUsers.length}
                                        </p>

                                        {matchingUsers.length > 0 ? (
                                            <div className="space-y-2">
                                                {matchingUsers.map((entry) => (
                                                    <button
                                                        key={entry.id}
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedUser(entry)
                                                        }
                                                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                                                            selectedUser?.id === entry.id
                                                                ? "border-blue-500 bg-blue-50"
                                                                : "border-gray-200 hover:border-blue-300"
                                                        }`}
                                                    >
                                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-700">
                                                            {entry.profileImage ? (
                                                                <img
                                                                    src={entry.profileImage}
                                                                    alt={`Foto de ${entry.name} ${entry.lastName}`}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                getInitials(entry)
                                                            )}
                                                        </span>

                                                        <span className="min-w-0 flex-1">
                                                            <span className="block break-words font-semibold text-gray-800">
                                                                {entry.name} {entry.lastName}
                                                            </span>

                                                            <span className="block break-all text-sm text-gray-500">
                                                                {entry.email}
                                                            </span>

                                                            <span className="mt-1 block text-xs text-blue-600">
                                                                Puesto #{entry.position}
                                                                {" · "}
                                                                {entry.points.toLocaleString("es-MX")} puntos
                                                            </span>
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="py-3 text-sm text-gray-500">
                                                No se encontraron estudiantes
                                                con ese correo.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* El perfil y las gráficas se mantienen
                                    dentro del panel desplegable. */}
                                {selectedUser && (
                                    <div className="mt-5 border-t border-gray-100 pt-4">
                                        <UserRankingCard entry={selectedUser} />
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </>
            )}
        </>
    );
};

export default RankingView;