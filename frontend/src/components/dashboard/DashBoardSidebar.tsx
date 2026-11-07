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
import { useState } from "react";
import SideBarLink from "./SideBarLink";

const DashBoardSidebar = () => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <>
      {/* Menú lateral */}
      <aside
        className={`hidden md:block bg-blue-700 transform transition-all duration-500 ease-in-out relative
          ${isHidden? "w-0 p-0" : "w-55 p-7"}`
        }
      >
        {!isHidden && (
          <nav className="relative z-10 mt-5 flex flex-col gap-5">
            <div className="mb-2 border-b border-sky-200/80 pb-5 dark:border-cyan-900">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white dark:text-cyan-400">
                Área académica
              </p>
              <h2 className="mt-2 text-xl font-bold text-white dark:text-slate-100">
                Mi espacio
              </h2>
            </div>

            <SideBarLink
              url="/"
              text="Dashboard"
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
        )}
      </aside>

      {/* Botón independiente: siempre visible */}
      <button
        type="button"
        onClick={() => setIsHidden((previous) => !previous)}
        aria-label={isHidden ? "Mostrar menú" : "Ocultar menú"}
        title={isHidden ? "Mostrar menú" : "Ocultar menú"}
        className="fixed bottom-6 left-4 z-50 hidden h-11 w-11 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-700 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-sky-50 dark:border-cyan-800 dark:bg-slate-800 dark:text-cyan-300 dark:hover:bg-slate-700 md:flex"
      >
        {isHidden ? (
          <ChevronDoubleRightIcon className="h-5 w-5" />
        ) : (
          <ChevronDoubleLeftIcon className="h-5 w-5" />
        )}
      </button>
    </>
  );
};

export default DashBoardSidebar;
