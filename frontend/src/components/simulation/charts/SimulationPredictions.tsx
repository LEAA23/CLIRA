
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

interface SimulationPredictionsProps  {
    firstPrediction: {
        posicion: number;
        diagnostico: string,
        puntuacion: number
    } | null,
    secondPrediction: {
        posicion: number;
        diagnostico: string,
        puntuacion: number
    } | null,
    thirdthPrediction: {
        posicion: number;
        diagnostico: string,
        puntuacion: number
    } | null
}

const SimulationPredictions = ( {  firstPrediction, secondPrediction, thirdthPrediction} : SimulationPredictionsProps ) => {
  //Datos de prueba

  const diseases = [
    { code: "9_78650", name: "Dolor torácico" },
    { code: "9_41401", name: "Enfermedad de las arterias coronarias" },
    { code: "10_A419", name: "Sepsis, organismo no especificado" },
    { code: "9_30500", name: "Abuso de alcohol, sin complicaciones" },
    { code: "9_78659", name: "Otros tipos de dolor torácico" },
    { code: "9_486", name: "Neumonía, organismo no especificado" },
    { code: "10_F329", name: "Trastorno depresivo mayor, episodio único, no especificado" },
    { code: "9_311", name: "Trastorno depresivo" },
    { code: "10_Z5111", name: "Consulta para quimioterapia antineoplásica" },
    { code: "10_I214", name: "Infarto agudo de miocardio sin elevación del segmento ST (IAMSEST)" }
 ];

 const getDiseaseName = (code: string) => {
    return diseases.find(disease => disease.code === code)?.name ?? code;
};

  const data = [
  {
    name: 'Predicciones mas probables hechas por CLIRA AI',
    aciertos: firstPrediction?.puntuacion,
    errores: secondPrediction?.puntuacion,
    caca: thirdthPrediction?.puntuacion,
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
                    name={ getDiseaseName( firstPrediction?.diagnostico? firstPrediction?.diagnostico : "") }
                    fill="#8884d8"
                    radius={[10, 10, 0, 0]}
                />

                <Bar
                    dataKey="errores"
                    name={ getDiseaseName( secondPrediction?.diagnostico? secondPrediction?.diagnostico : "")}
                    fill="#82ca9d"
                    radius={[10, 10, 0, 0]}
                />

                <Bar
                    dataKey="caca"
                    name={ getDiseaseName( thirdthPrediction?.diagnostico? thirdthPrediction?.diagnostico : "")}
                    fill="#ffb700"
                    radius={[10, 10, 0, 0]}
                />
                <RechartsDevtools/>
            </BarChart>
        </div>        
  )
}

export default  SimulationPredictions