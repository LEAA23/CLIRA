import { useNavigate } from "react-router-dom";
import type { RankingEntry } from "../../api/rankingApi";

type RankingCardProps = {
    entry: RankingEntry;
};

const RankingCard = ({ entry }: RankingCardProps) => {
    const navigate = useNavigate();

    const initials =
        `${entry.name.charAt(0)}${entry.lastName.charAt(0)}`.toUpperCase();

    return (
        <div className="ranking-surface shadow-sm border border-gray-100 rounded-2xl p-4 mt-3 w-full grid grid-cols-[auto_1fr_auto] items-center gap-3">
            {/* Posición y medalla */}
            <div className="flex flex-col items-center min-w-10">
                <img
                    src="/normalMedal.png"
                    alt="Medalla de participación"
                    className="h-8 w-8 object-contain"
                />

                <span className="font-bold text-gray-600 dark:text-gray-200 text-sm">
                    #{entry.position}
                </span>
            </div>

            {/* Perfil del estudiante */}
            <button
                type="button"
                onClick={() => navigate(`/user-profile/${entry.id}`)}
                className="flex flex-col items-center min-w-0 text-center rounded-xl p-1 hover:bg-blue-50 dark:hover:bg-[#49345f] transition"
                title={`Ver perfil de ${entry.name} ${entry.lastName}`}
            >
                <div className="h-14 w-14 rounded-full overflow-hidden bg-blue-100 dark:bg-[#49345f] flex items-center justify-center text-blue-700 dark:text-purple-100 font-bold text-lg ring-2 ring-blue-100 dark:ring-[#604778]">
                    {entry.profileImage ? (
                        <img
                            src={entry.profileImage}
                            alt={`Foto de ${entry.name} ${entry.lastName}`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        initials
                    )}
                </div>

                <span className="font-semibold text-gray-700 dark:text-gray-100 mt-2 text-sm w-full break-words">
                    {entry.name} {entry.lastName}
                </span>

                <span className="text-xs text-gray-400 dark:text-purple-200 mt-1">
                    Ver perfil
                </span>
            </button>

            {/* Puntos */}
            <div className="text-right min-w-0">
                <p className="font-bold text-blue-600 dark:text-purple-300 whitespace-nowrap">
                    {entry.points.toLocaleString("es-MX")}
                </p>

                <p className="text-xs text-gray-400 dark:text-purple-200">
                    puntos
                </p>
            </div>
        </div>
    );
};

export default RankingCard;