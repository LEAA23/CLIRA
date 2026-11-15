
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { RechartsDevtools } from '@recharts/devtools';

interface Simulation {
  case_id: number;
  resources_eficienty: number;
}

interface ResourceEfficiencyChartProps {
  simulations: Simulation[];
}

const ResourceEfficiencyChart = ({
  simulations,
}: ResourceEfficiencyChartProps) => {

  const data = simulations.map((simulation, index) => ({
    name: `Simulación ${index + 1}`,
    case_id: simulation.case_id,
    efficiency: simulation.resources_eficienty,
  }));

  return (
    <LineChart
      style={{
        width: '100%',
        maxWidth: '700px',
        maxHeight: '425px',
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 20,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis
        dataKey="name"
        stroke="#666"
      />

      <YAxis
        domain={[0, 100]}
        unit="%"
        stroke="#666"
      />

      <Tooltip
        formatter={(value) => [`${value}%`, 'Eficiencia de recursos']}
        labelFormatter={(label) => label}
      />

      <Legend />

      <Line
        type="monotone"
        dataKey="efficiency"
        name="Eficiencia de recursos"
        stroke="#3b82f6"
        strokeWidth={2}
        dot={{ fill: '#3b82f6' }}
        activeDot={{ r: 8 }}
      />

      <RechartsDevtools />
    </LineChart>
  );
};

export default ResourceEfficiencyChart;
