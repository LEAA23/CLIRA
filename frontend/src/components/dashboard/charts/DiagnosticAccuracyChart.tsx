import {
    CircularProgressbar,
    buildStyles,
} from "react-circular-progressbar";

const DiagnosticAccuracyChart = () => {
    const accuracy: number = 50;
    const isPerfect = accuracy === 100;

    return (
        <div className="flex w-full flex-col items-center text-center">
            <div className="mx-auto aspect-square w-56 shrink-0">
                <CircularProgressbar
                    className="diagnostic-accuracy-progress"
                    value={accuracy}
                    text={`${accuracy}%`}
                    styles={buildStyles({
                        pathColor: isPerfect ? "#DC2626" : "#3B82F6",
                        trailColor: "#F5F5F5",
                        textSize: "20px",
                        textColor: isPerfect ? "#DC2626" : "#3B82F6",
                    })}
                />
            </div>

            <p className="mt-3 w-full text-center">
                Precisión diagnóstica
            </p>
        </div>
    );
};

export default DiagnosticAccuracyChart;
