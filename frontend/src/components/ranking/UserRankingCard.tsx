import { SparklesIcon, TrophyIcon } from "@heroicons/react/16/solid"
import ProfileImage from "../ProfileImage"
import ChartContainer from "./ChartContainer"

const UserRankingCard = () => {
  return (
    <div className="flex flex-col justify-center items-center">
        <ProfileImage
            height="40"
        />

        <div className="grid grid-cols-2  mt-5 py-5">
            <p className="text-3xl font-semibold text-center col-span-2">Luis Ernesto Alejandre Ayon</p>
            <div className="mx-auto mt-5">
                <p className="text-2xl font-bold text-center flex justify-between items-center">
                    <TrophyIcon className="text-gray-400 h-8"/>
                    24
                </p>
                <p className="text-gray-400 font-bold text-center">Ranking</p>
            </div>
            <div className="mx-auto mt-5">
                <p className="text-2xl font-bold text-center flex justify-between items-center">
                    <SparklesIcon className="text-gray-400 h-8"/>
                    650
                </p>
                <p className="text-gray-400 font-bold text-center">Puntos</p>
            </div>
        </div>
        <ChartContainer/>
    </div>
  )
}

export default UserRankingCard