import {
  PresentationChartLineIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  HeartIcon,
  RocketLaunchIcon,
  RectangleGroupIcon,
  TrophyIcon,
} from "@heroicons/react/16/solid";

import SideBarLink from "./SideBarLink";
import { useState } from "react";

const DashBoardSidebar = () => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <aside
      className={`relative hidden transform transition-all duration-500 ease-in-out md:block
        ${
          isHidden
            ? "w-0 p-0"
            : "w-55 bg-blue-700 p-7 dark:bg-slate-900"
        }`}
    >
      <nav className="mt-5 mb-35 flex flex-col space-y-8">
        <button
          type="button"
          aria-label={isHidden ? "Mostrar menú" : "Ocultar menú"}
          onClick={() => setIsHidden((previous) => !previous)}
          className={`absolute top-2 -right-4 z-10 h-9 w-9 rounded-full bg-blue-800 p-1 transition-all duration-500 hover:bg-blue-900 dark:bg-slate-700 dark:hover:bg-slate-600 ${
            isHidden ? "translate-x-11" : ""
          }`}
        >
          {isHidden ? (
            <ChevronDoubleRightIcon className="text-white" />
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
          text="Casos Clínicos"
          icon={HeartIcon}
        />

        <SideBarLink
          url="/progress"
          text="Mi Progreso"
          icon={RocketLaunchIcon}
        />

        <SideBarLink
          url="/groups"
          text="Mis Grupos"
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
  );
};

export default DashBoardSidebar;
