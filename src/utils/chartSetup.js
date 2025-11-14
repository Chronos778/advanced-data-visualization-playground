// Chart.js setup and registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  TimeScale,
  LogarithmicScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Advanced chart plugins
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
  TimeScale,
  LogarithmicScale,
  // Advanced controllers
  MatrixController,
  MatrixElement,
  TreemapController,
  TreemapElement
);

// Set default Chart.js colors to TradingView dark theme
ChartJS.defaults.color = '#D1D4DC';
ChartJS.defaults.backgroundColor = '#1E222D';
ChartJS.defaults.borderColor = '#2A2E39';
ChartJS.defaults.plugins.legend.labels.color = '#D1D4DC';
ChartJS.defaults.plugins.tooltip.backgroundColor = '#1E222D';
ChartJS.defaults.plugins.tooltip.titleColor = '#D1D4DC';
ChartJS.defaults.plugins.tooltip.bodyColor = '#D1D4DC';
ChartJS.defaults.plugins.tooltip.borderColor = '#2A2E39';
ChartJS.defaults.plugins.tooltip.borderWidth = 1;

export default ChartJS;