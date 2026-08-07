import { AcademicCapIcon, BriefcaseIcon } from "@heroicons/react/16/solid";
import GroupCardOptions from "./GroupCardOptions";

const GroupCard = () => {
  return (
    <div className="bg-white shadow rounded-lg mb-5 border-l-4 border-l-amber-200">
        <div className="p-5 space-y-5">
            <div className="flex justify-between items-center text-gray-500">
                <a 
                    href={`/groups/${"23"}`}
                >
                    <h3 className="text-xl font-bold text-left hover:text-blue-500 cursor-pointer">Anatomia</h3>
                </a>   
                <GroupCardOptions/>
            </div>

            <div className="text-gray-400 flex justify-start items-center">
                <BriefcaseIcon className="h-6 aspect-square"/>

                <p className="font-bold">Maestro: {""}
                    <span className="text-black font-normal">Luis Ernesto</span> 
                </p>
            </div>

            <div className="text-gray-400 flex justify-start items-center">
                <AcademicCapIcon className="h-6 aspect-square"/>

                <p className="font-bold">Integrantes: {""}
                    <span className="text-black font-normal">23</span> 
                </p>
            </div>
        </div>
    </div>
  )
}

export default GroupCard