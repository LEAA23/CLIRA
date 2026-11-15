
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

interface Simulation {
  id: number,
  case_id: number,
  diagnosis_accuracy: number;
  successes: number;
  errors: number;
  resources_eficienty: number;
  performance: number
}

interface CorrectvsIncorrectChartProps {
  last_simulations: Simulation[]
}

const CorrectvsIncorrectChart = ( { last_simulations } : CorrectvsIncorrectChartProps ) => {

  const data = last_simulations.map( simulation => {
    return {
      name: `Simulación ${simulation.case_id}`,
      aciertos: simulation.successes,
      errores: simulation.errors
    }
    
  } )


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
              <YAxis width={40} tick={{ fill: "#888888", fontSize: 12 }}
                axisLine={true}
                tickLine={true}
              />                
              <Tooltip/>
              <Legend/>
              <Bar dataKey="aciertos" fill="#8884d8" activeBar={ { fill: "gold", stroke: "blue" } }  radius={[10, 10, 0, 0]}/>
              <Bar dataKey="errores" fill="#f26a8d" activeBar={ { fill: "pink", stroke: "purple" } }  radius={[10, 10, 0, 0]}/>
              <RechartsDevtools/>
            </BarChart>
        </div>        
  )
}

export default CorrectvsIncorrectChart