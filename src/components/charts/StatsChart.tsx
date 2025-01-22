"use client";

import { FC } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Enregistre les composants de Chart.js utilisés
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatsChartProps {
  title: string;
  data: {
    labels: string[];
    values: number[];
  };
  color?: string; // Couleur principale du graphique
}

const StatsChart: FC<StatsChartProps> = ({
  title,
  data,
  color = "#3b82f6",
}) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: title,
        data: data.values,
        backgroundColor: color,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-lg hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StatsChart;
