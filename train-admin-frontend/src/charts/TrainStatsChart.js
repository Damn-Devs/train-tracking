import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const options = {
  plugins: {
    legend: {
      position: "bottom",
    },
  },
};

const TrainStatsChart = ({ data }) => {
  return (
    <div style={{ width: 600, height: 300 }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default TrainStatsChart;
