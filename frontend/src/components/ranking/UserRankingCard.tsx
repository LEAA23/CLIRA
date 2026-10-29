import { SparklesIcon, TrophyIcon } from "@heroicons/react/16/solid";
import ChartContainer from "./ChartContainer";
import type { RankingEntry } from "../../api/rankingApi";

type UserRankingCardProps = {
    entry: RankingEntry | null;
};

const UserRankingCard = ({ entry }: UserRankingCardProps) => {
    if (!entry) {
        return null;
    }

    const initials =
        `${entry.name.charAt(0)}${entry.lastName.charAt(0)}`.toUpperCase();

    return (
        <div className="flex flex-col items-center w-full mt-5">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold ring-4 ring-blue-100">
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

            <h3 className="text-xl md:text-2xl font-bold text-center mt-3 break-words">
                {entry.name} {entry.lastName}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
                {entry.email}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-5 w-full max-w-sm">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                        <TrophyIcon className="text-blue-500 h-6 w-6" />
                        <span className="text-2xl font-bold">
                            #{entry.position}
                        </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                        Posición
                    </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                        <SparklesIcon className="text-blue-500 h-6 w-6" />
                        <span className="text-2xl font-bold">
                            {entry.points.toLocaleString("es-MX")}
                        </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                        Puntos
                    </p>
                </div>
            </div>

            <p className="text-gray-500 text-sm mt-3">
                Casos completados: {entry.completedCount}
            </p>

            {/* Se conservan las gráficas originales. */}
            <div className="w-full mt-4">
                <ChartContainer />
            </div>
        </div>
    );
};

export default UserRankingCard;