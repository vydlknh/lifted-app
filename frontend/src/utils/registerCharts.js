import { Chart, 
    LineController, 
    CategoryScale, 
    LinearScale, 
    TimeScale,
    PointElement, 
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

export const registerCharts = () => {
  Chart.register(
    LineController,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
};