import { useState } from "react";
import type { ChartOption } from "../../types";
import DiagnosticAccuracyChart from "../dashboard/charts/DiagnosticAccuracyChart";
import CorrectvsIncorrectChart from "../dashboard/charts/CorrectvsIncorrectChart";
import ErrorReductionChart from "../dashboard/charts/ErrorReductionChart";
import PerformanceChart from "../dashboard/charts/PerformanceChart";


const ChartContainer = () => {
    const [selected, setSelected] = useState<string>("DiagnosticAccuracyChart");

    const options : ChartOption[] = [
        {id: "DiagnosticAccuracyChart", label: "Precision"},
        {id: "CorrectvsIncorrect", label: "Aciertos y Errores"},
        {id: "ErrorReduction", label: "Reduccion de Errores"},
        {id: "Performance", label: "Rendimiento"},
        {id: "Decorations", label: "Insignias"}
    ]
  return (
    <div className=" w-full mt-5">
        <div 
            className="flex justify-between md:overflow-x-scroll md:[scrollbar-color:#155dfc_#fff] md:pb-5
            lg:mb-0 lg:overflow-x-hidden gap-x-5"
        >
            {
                options.map(option => (
                    <button
                        key={option.id}
                        onClick={() => setSelected(option.id)}
                        className={`
                            pb-1 text-sm cursor-pointer transition-all ease-in-out duration-200
                            ${
                                selected === option.id?
                                "text-blue-500 font-semibold border-b-4 border-blue-500":
                                "text-gray-400"
                            }    
                        `}
                    >
                        {option.label}
                    </button>
                ))
            }
        </div>

        <div className="mt-5 h-1/2">
            {selected === "DiagnosticAccuracyChart" && (<DiagnosticAccuracyChart/>)}
            {selected === "CorrectvsIncorrect" && (<CorrectvsIncorrectChart/>)}
            {selected === "ErrorReduction" && (<ErrorReductionChart/>)}
            {selected === "Performance" && (<PerformanceChart/>)}
            {selected === "Decorations" && (<p>Insignias aqui</p>)}
        </div>
    </div>
  )
}

export default ChartContainer