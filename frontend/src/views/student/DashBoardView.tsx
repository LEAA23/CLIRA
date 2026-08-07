import "react-circular-progressbar/dist/styles.css";
import CorrectvsIncorrectChart from "../../components/dashboard/charts/CorrectvsIncorrectChart";
import DiagnosticAccuracyChart from "../../components/dashboard/charts/DiagnosticAccuracyChart";
import ErrorReductionChart from "../../components/dashboard/charts/ErrorReductionChart";
import ResourceEfficiencyChart from "../../components/dashboard/charts/ResourceEfficiencyChart";

import { CheckCircleIcon, ClockIcon, TrophyIcon } from "@heroicons/react/16/solid";
import PerformanceChart from "../../components/dashboard/charts/PerformanceChart";

const DashBoardView = () => {

  return (
    <>
      <h1 className="text-center font-bold text-5xl my-10 text-blue-500">Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-5 mb-5">
        <div className="bg-white p-5 max-w-full rounded-2xl shadow mt-5">
          <h3 className="flex items-center font-bold text-gray-500"><CheckCircleIcon className="h-6 mr-3"/>Casos completados</h3>
          <p className="text-7xl font-bold text-center bg-linear-to-r from-blue-500 to-blue-50 bg-clip-text text-transparent">{"3"}</p>
        </div>

        <div className="bg-white p-5 max-w-full rounded-2xl shadow mt-5">
          <h3 className="flex items-center font-bold text-gray-500"><ClockIcon className="h-6 mr-3"/>Casos pendientes</h3>
          <p className="text-7xl font-bold text-center bg-linear-to-r from-blue-500 to-blue-50 bg-clip-text text-transparent">{"1"}</p>
        </div>

        <div className="bg-white p-5 max-w-full rounded-2xl shadow mt-5">
          <h3 className="flex items-center font-bold text-gray-500"><TrophyIcon className="h-6 mr-3"/>Ranking</h3>
          <p className="text-7xl font-bold text-center bg-linear-to-r from-blue-500 to-blue-50 bg-clip-text text-transparent">{"4"}</p>
        </div>
        <div className="bg-white p-5 max-w-full rounded-2xl shadow mt-5">
          <h3 className="text-2xl font-bold text-gray-500">Casos completadas</h3>
          <p className="text-7xl font-bold text-center bg-linear-to-r from-blue-500 to-blue-50 bg-clip-text text-transparent">{"3"}</p>
        </div>
      </div>

      <div className="bg-white p-5 max-w-full mx-auto rounded-2xl shadow w-full">
        <h3 className="text-2xl font-bold mb-5 text-gray-500">Rendimiento Diagnostico</h3>

        <div className="grid space-y-10 md:grid-cols-2 lg:grid-cols-3 lg:space-y-0 items-center justify-center text-center">

          <DiagnosticAccuracyChart/>

          <div className="flex flex-col">
            <ClockIcon className="h-15 text-gray-500"/>
            <h3 className="text-5xl font-bold text-gray-600"><span className="text-7xl bg-linear-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent">{"12"}</span> minutos</h3>
            <p>por simulaci&oacute;n clinica.</p>
          </div>

          <CorrectvsIncorrectChart/>

        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-x-5">
        <div className="bg-white p-5 max-w-full rounded-2xl shadow mt-5">
          <h3 className="text-2xl font-bold mb-5 text-gray-500">Reducci&oacute;n de errores</h3>
          <ErrorReductionChart/>
        </div>

        <div className="bg-white p-5 max-w-full rounded-2xl shadow mt-5 ">
          <h3 className="text-2xl font-bold mb-5 text-gray-500">Uso eficiente de recursos</h3>
          <ResourceEfficiencyChart/>
        </div>

      </div>

      <div className="bg-white p-5 max-w-full rounded-2xl shadow mt-5">
        <h3 className="text-2xl font-bold mb-5 text-gray-500">Mejora en rendimiento</h3>
        <PerformanceChart/>
      </div>

    </>
  )
}

export default DashBoardView