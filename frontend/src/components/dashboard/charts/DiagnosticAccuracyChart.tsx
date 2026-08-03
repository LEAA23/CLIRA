import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const DiagnosticAccuracyChart = () => {
  return (
    <div className="flex flex-col items-center text-center">
        <div className="w-56 aspect-square">
        <CircularProgressbar
            value={50}
            text={`${50}%`}
            styles={ buildStyles({ 
            pathColor: 50 === 100 ? "#DC2626": "#3B82F6" ,
            trailColor: "#F5F5F5",
            textSize: 20,
            textColor: 50 === 100 ? "#DC2626" : "#3B82F6"
            })
            }

        />
        </div>
        <p className="mt-3">Precisión diagnostica</p>
    </div>
  )
}

export default DiagnosticAccuracyChart;