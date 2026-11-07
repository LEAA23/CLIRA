
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

interface SimulationPredictionsProps  {
    firstPrediction: {
        posicion: number;
        diagnostico: string,
        puntuacion: number
    },
    secondPrediction: {
        posicion: number;
        diagnostico: string,
        puntuacion: number
    }
    thirdthPrediction: {
        posicion: number;
        diagnostico: string,
        puntuacion: number
    }
}

const SimulationPredictions = ( {  firstPrediction, secondPrediction, thirdthPrediction} : SimulationPredictionsProps ) => {
  //Datos de prueba
  const data = [
  {
    name: 'Predicciones mas probables hechas por CLIRA AI',
    aciertos: firstPrediction.puntuacion,
    errores: secondPrediction.puntuacion,
    caca: thirdthPrediction.puntuacion,
    amt: 2400,
  }
];


  return (
        <div className="flex justify-center items-center md:col-span-2 lg:col-span-1">
            <BarChart
            style={ { width: "100%", maxWidth: "700px", maxHeight: "70vh", aspectRatio: 1.618 } }
            responsive
            data={data}
            margin={ { top: 5, right: 0, left: 0, bottom: 5 } }
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name"/>
                <YAxis width="auto"/>
                <Tooltip/>
                <Legend/>
                <Bar
                    dataKey="aciertos"
                    name={firstPrediction.diagnostico}
                    fill="#8884d8"
                    radius={[10, 10, 0, 0]}
                />

                <Bar
                    dataKey="errores"
                    name={secondPrediction.diagnostico}
                    fill="#82ca9d"
                    radius={[10, 10, 0, 0]}
                />

                <Bar
                    dataKey="caca"
                    name={thirdthPrediction.diagnostico}
                    fill="#ffb700"
                    radius={[10, 10, 0, 0]}
                />
                <RechartsDevtools/>
            </BarChart>
        </div>        
  )
}

export default  SimulationPredictions