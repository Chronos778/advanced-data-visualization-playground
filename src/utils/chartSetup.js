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
import { SankeyController, Flow } from 'chartjs-chart-sankey';
import { BoxPlotController, BoxAndWiskers, ViolinController, Violin } from '@sgratzl/chartjs-chart-boxplot';

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
  TreemapElement,
  SankeyController,
  Flow,
  BoxPlotController,
  BoxAndWiskers,
  ViolinController,
  Violin
);

// Set default Chart.js colors to black/white theme
ChartJS.defaults.color = '#000000';
ChartJS.defaults.backgroundColor = '#ffffff';
ChartJS.defaults.borderColor = '#000000';
ChartJS.defaults.plugins.legend.labels.color = '#000000';
ChartJS.defaults.plugins.tooltip.backgroundColor = '#ffffff';
ChartJS.defaults.plugins.tooltip.titleColor = '#000000';
ChartJS.defaults.plugins.tooltip.bodyColor = '#000000';
ChartJS.defaults.plugins.tooltip.borderColor = '#000000';
ChartJS.defaults.plugins.tooltip.borderWidth = 1;

export default ChartJS;