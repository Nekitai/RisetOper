import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

function LPGraph({ constraints = [], objectiveLine = [], solutionPoint = null, xMax = 20, yMax = 20 }) {
  if (!Array.isArray(constraints) || !Array.isArray(objectiveLine) || !solutionPoint) {
    return <p className="text-gray-400">Data grafik tidak tersedia atau tidak valid.</p>;
  }

  const constraintLines = constraints.map((line, index) => ({
    label: `Kendala ${index + 1}`,
    data: line,
    borderColor: "red",
    borderWidth: 1,
    showLine: true,
    fill: false,
    pointRadius: 0,
    pointHoverRadius: 5,
  }));


  const solution = {
    label: "Optimal Solution",
    data: [solutionPoint],
    backgroundColor: "green",
    pointRadius: 6,
  };

  const data = {
    datasets: [...constraintLines,  solution],
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        min: 0,
        max: xMax,
        ticks: {
          color: "white", // warna label di sumbu x
        },
        grid: {
          color: "rgba(255,255,255,0.1)", // warna garis grid x
        },
      },
      y: {
        type: "linear",
        min: 0,
        max: yMax,
        ticks: {
          color: "white", // warna label di sumbu y
        },
        grid: {
          color: "rgba(255,255,255,0.1)", // warna garis grid y
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white", // warna teks legend
        },
      },
    },
  };

  return <div style={{ height: "400px" }}><Scatter data={data} options={options} /></div>;
}

export default LPGraph;
