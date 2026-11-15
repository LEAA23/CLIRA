import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

interface Simulation {
  simulation: number;
  case_id: number;
  errors: number;
  successes: number;
  error_rate: number;
  reduction: number;
}

interface ErrorReductionChartProps {
  simulations: Simulation[]
}

const ErrorReductionChart = ( { simulations } : ErrorReductionChartProps ) => {

    //Datos de ejemplo
    const data = simulations.map((simulation) => ({
      name: `Simulación ${simulation.simulation}`,
      errores: simulation.errors,
      reduccion: +simulation.reduction.toFixed(2),
    }));

  return (
    <div>
      <AreaChart
        style={{
          width: '100%',
          maxWidth: '700px',
          maxHeight: '70vh',
          aspectRatio: 1.618
        }}
        responsive
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="name" />

        <YAxis
          width={50}
          tickFormatter={(value) => `${value}%`}
        />

        <Tooltip
          formatter={(value) => [`${value}%`, 'Reducción de errores']}
        />

        <Area
          type="monotone"
          dataKey="reduccion"
          name="Reducción de errores"
          stroke="#f26a8d"
          fill="#f26a8d"
          fillOpacity={0.3}
        />
        <Legend />

        <RechartsDevtools />
      </AreaChart>
    </div>
  )
}

export default ErrorReductionChart