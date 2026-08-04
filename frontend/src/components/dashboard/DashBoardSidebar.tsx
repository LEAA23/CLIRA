import { PresentationChartLineIcon, Cog6ToothIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, HeartIcon, RocketLaunchIcon, RectangleGroupIcon, TrophyIcon } from "@heroicons/react/16/solid";
import SideBarLink from "./SideBarLink";
import { useState } from "react";

const DashBoardSidebar = () => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <aside className=
      {`hidden md:block bg-blue-700 transform transition-all duration-500 ease-in-out relative 
        ${isHidden? "w-0 p-0" : "w-55 p-7"}`
      }
    >
        <nav className="flex flex-col space-y-8 mt-5 mb-35">

          <button
            type="button"
            onClick={() => setIsHidden( prevValue => !prevValue )}
            className={`bg-blue-800 hover:bg-blue-900 cursor-pointer h-9 w-9 p-1 rounded-4xl absolute top-2 -right-4 transform transition-all duration-500 ease-in-out
                ${isHidden? "translate-x-11 bg-gray-300 hover:bg-gray-400" : ""}
              `} 
          >
            {isHidden? (
              <ChevronDoubleRightIcon className="text-white"/>
            ) : (
              
              <ChevronDoubleLeftIcon className="text-white" />
            )}
          </button>
            
          <SideBarLink
            url="/"
            text="DashBoard"
            icon={PresentationChartLineIcon}
          />
            
          <SideBarLink
            url="/clinical-cases"
            text="Casos Clinicos"
            icon={HeartIcon}
          />
          <SideBarLink
            url="/progress"
            text="Mi Progreso"
            icon={RocketLaunchIcon}
          />
          <SideBarLink
            url="/group"
            text="Grupo"
            icon={RectangleGroupIcon}
          />
          <SideBarLink
            url="/ranking"
            text="Ranking"
            icon={TrophyIcon}
          />
          <SideBarLink
            url="/settings"
            text="Configuración"
            icon={Cog6ToothIcon}
          />

        </nav>
    </aside>
  )
}

export default DashBoardSidebar