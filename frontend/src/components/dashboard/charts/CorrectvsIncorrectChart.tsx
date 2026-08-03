
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

const CorrectvsIncorrectChart = () => {
  //Datos de prueba
  const data = [
  {
    name: 'Sim A',
    aciertos: 4000,
    errores: 2400,
    amt: 2400,
  },
  {
    name: 'Sim B',
    aciertos: 3000,
    errores: 1398,
    amt: 2210,
  },
  {
    name: 'Sim C',
    aciertos: 2000,
    errores: 9800,
    amt: 2290,
  },
  {
    name: 'Sim D',
    aciertos: 2780,
    errores: 3908,
    amt: 2000,
  },
  {
    name: 'Sim E',
    aciertos: 1890,
    errores: 4800,
    amt: 2181,
  },
  {
    name: 'Sim F',
    aciertos: 2390,
    errores: 3800,
    amt: 2500,
  },
  {
    name: 'Sim G',
    aciertos: 3490,
    errores: 4300,
    amt: 2100,
  },
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
                <Bar dataKey="aciertos" fill="#8884d8" activeBar={ { fill: "gold", stroke: "blue" } }  radius={[10, 10, 0, 0]}/>
                <Bar dataKey="errores" fill="#82ca9d" activeBar={ { fill: "pink", stroke: "purple" } }  radius={[10, 10, 0, 0]}/>
                <RechartsDevtools/>
            </BarChart>
        </div>        
  )
}

export default CorrectvsIncorrectChart