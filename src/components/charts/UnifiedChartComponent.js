import React, { useMemo, useState, useCallback, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Scatter, Pie, Doughnut, PolarArea, Radar } from 'react-chartjs-2';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Settings,
  Download,
  MoreVert,
  TrendingUp,
  BarChart as BarChartIcon,
  ScatterPlot,
  PieChart as PieChartIcon,
  ShowChart,
  Radar as RadarIcon,
  DonutLarge
} from '@mui/icons-material';
import { CHART_TYPES, getOptimalChartConfig } from '../../utils/chartHelpers';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
  '#d084d0', '#87d068', '#ffb347', '#ff6b6b', '#4ecdc4',
  '#45b7d1', '#96ceb4', '#ffeaa7', '#fab1a0', '#fd79a8',
  '#74b9ff', '#a29bfe', '#fd79a8', '#fdcb6e', '#e17055'
];

const UnifiedChartComponent = React.memo(({ 
  data, 
  chartType = 'line',
  title = 'Chart',
  xAxis = '',
  yAxis = '',
  colorBy = '',
  onExport,
  onConfigChange,
  chartConfig = {},
  isLoading = false,
  error = null
}) => {
  const chartRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [config, setConfig] = useState({
    responsive: true,
    maintainAspectRatio: false,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    animated: false,
    tension: 0.4,
    pointRadius: 4,
    borderWidth: 2,
    opacity: 0.8,
    ...chartConfig
  });

  // Process data for Chart.js format
  const processedData = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return null;
    
    const chartData = data.data;
    const optimal = getOptimalChartConfig(chartType, chartData.length);
    
    // Different processing for different chart types
    switch (chartType) {
      case 'pie':
      case 'doughnut':
        const pieData = chartData.slice(0, 12); // Limit slices
        return {
          labels: pieData.map(item => item[xAxis] || 'Unknown'),
          datasets: [{
            data: pieData.map(item => parseFloat(item[yAxis]) || 0),
            backgroundColor: COLORS.slice(0, pieData.length),
            borderColor: COLORS.slice(0, pieData.length).map(color => color + '80'),
            borderWidth: 1,
            hoverOffset: 4
          }]
        };

      case 'polarArea':
        const polarData = chartData.slice(0, 8);
        return {
          labels: polarData.map(item => item[xAxis] || 'Unknown'),
          datasets: [{
            data: polarData.map(item => parseFloat(item[yAxis]) || 0),
            backgroundColor: COLORS.slice(0, polarData.length).map(color => color + '80'),
            borderColor: COLORS.slice(0, polarData.length),
            borderWidth: 2
          }]
        };

      case 'radar':
        // For radar charts, we need multiple metrics
        const radarLabels = Object.keys(chartData[0]).filter(key => 
          !isNaN(parseFloat(chartData[0][key])) && key !== xAxis
        );
        return {
          labels: radarLabels,
          datasets: chartData.slice(0, 5).map((item, index) => ({
            label: item[xAxis] || `Series ${index + 1}`,
            data: radarLabels.map(label => parseFloat(item[label]) || 0),
            backgroundColor: COLORS[index] + '20',
            borderColor: COLORS[index],
            borderWidth: 2,
            pointBackgroundColor: COLORS[index],
            pointBorderColor: '#D1D4DC',
            pointHoverBackgroundColor: '#D1D4DC',
            pointHoverBorderColor: COLORS[index]
          }))
        };

      case 'scatter':
        return {
          datasets: [{
            label: yAxis,
            data: chartData.map(item => ({
              x: parseFloat(item[xAxis]) || 0,
              y: parseFloat(item[yAxis]) || 0
            })),
            backgroundColor: COLORS[0] + '60',
            borderColor: COLORS[0],
            pointRadius: optimal.elements?.point?.radius || config.pointRadius,
            pointHoverRadius: optimal.elements?.point?.hoverRadius || config.pointRadius + 2
          }]
        };

      case 'bubble':
        const sizeColumn = Object.keys(chartData[0]).find(key => 
          key !== xAxis && key !== yAxis && !isNaN(parseFloat(chartData[0][key]))
        );
        return {
          datasets: [{
            label: `${yAxis} vs ${xAxis}`,
            data: chartData.map(item => ({
              x: parseFloat(item[xAxis]) || 0,
              y: parseFloat(item[yAxis]) || 0,
              r: Math.max(5, Math.min(20, (parseFloat(item[sizeColumn]) || 1) / 10))
            })),
            backgroundColor: COLORS[0] + '60',
            borderColor: COLORS[0],
            borderWidth: 2
          }]
        };

      default: // line, bar, area
        return {
          labels: chartData.map(item => item[xAxis] || 'Unknown'),
          datasets: [{
            label: yAxis,
            data: chartData.map(item => parseFloat(item[yAxis]) || 0),
            backgroundColor: chartType === 'line' ? 
              'transparent' : 
              COLORS[0] + Math.floor(config.opacity * 255).toString(16),
            borderColor: COLORS[0],
            borderWidth: config.borderWidth,
            tension: chartType === 'line' ? config.tension : 0,
            fill: chartType === 'area',
            pointRadius: chartType === 'line' ? config.pointRadius : 0,
            pointHoverRadius: chartType === 'line' ? config.pointRadius + 2 : 0
          }]
        };
    }
  }, [data, chartType, xAxis, yAxis, config]);

  // Chart options
  const chartOptions = useMemo(() => {
    const optimal = getOptimalChartConfig(chartType, data?.data?.length || 0);
    
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: config.animated ? {} : false,
      plugins: {
        legend: {
          display: config.showLegend,
          position: 'top'
        },
        tooltip: {
          enabled: config.showTooltip,
          intersect: false,
          mode: 'index'
        },
        title: {
          display: true,
          text: title
        }
      },
      ...optimal
    };

    // Chart-specific options
    switch (chartType) {
      case 'line':
      case 'bar':
      case 'area':
        return {
          ...baseOptions,
          scales: {
            x: {
              display: true,
              title: {
                display: !!xAxis,
                text: xAxis
              },
              grid: {
                display: config.showGrid
              }
            },
            y: {
              display: true,
              title: {
                display: !!yAxis,
                text: yAxis
              },
              grid: {
                display: config.showGrid
              }
            }
          }
        };

      case 'scatter':
      case 'bubble':
        return {
          ...baseOptions,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              title: {
                display: !!xAxis,
                text: xAxis
              },
              grid: {
                display: config.showGrid
              }
            },
            y: {
              title: {
                display: !!yAxis,
                text: yAxis
              },
              grid: {
                display: config.showGrid
              }
            }
          }
        };

      case 'radar':
        return {
          ...baseOptions,
          scales: {
            r: {
              beginAtZero: true,
              grid: {
                display: config.showGrid
              }
            }
          }
        };

      default: // pie, doughnut, polarArea
        return baseOptions;
    }
  }, [chartType, config, title, xAxis, yAxis, data]);

  const availableColumns = useMemo(() => {
    if (!data || !data.columns) return [];
    return data.columns;
  }, [data]);

  const numericColumns = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];
    return availableColumns.filter(col => {
      const sampleValue = data.data[0][col];
      return !isNaN(parseFloat(sampleValue)) && isFinite(sampleValue);
    });
  }, [availableColumns, data]);

  const handleConfigChange = useCallback((key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
  }, [config, onConfigChange]);

  const handleMenuClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleExport = useCallback(() => {
    if (chartRef.current && onExport) {
      const canvas = chartRef.current.canvas;
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chart.png`;
      link.href = url;
      link.click();
    }
    setAnchorEl(null);
  }, [onExport, title]);

  const getChartIcon = useCallback((type) => {
    switch (type) {
      case 'line': return <TrendingUp />;
      case 'bar': return <BarChartIcon />;
      case 'scatter': 
      case 'bubble': return <ScatterPlot />;
      case 'pie': return <PieChartIcon />;
      case 'doughnut': return <DonutLarge />;
      case 'area': return <ShowChart />;
      case 'radar': 
      case 'polarArea': return <RadarIcon />;
      default: return <TrendingUp />;
    }
  }, []);

  const renderChart = () => {
    if (isLoading) {
      return (
        <Box sx={{ 
          height: 400, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      );
    }

    if (!processedData) {
      return (
        <Box sx={{ 
          height: 400, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'text.secondary'
        }}>
          <Typography variant="h6" gutterBottom>
            Chart Configuration Required
          </Typography>
          <Typography variant="body2">
            Please select appropriate axes to display the chart
          </Typography>
          <Box sx={{ mt: 2 }}>
            {!xAxis && <Chip label="X-Axis needed" color="warning" size="small" sx={{ mr: 1 }} />}
            {!yAxis && <Chip label="Y-Axis needed" color="warning" size="small" />}
          </Box>
        </Box>
      );
    }

    const ChartWrapper = ({ children }) => (
      <Box sx={{ height: 400, position: 'relative' }}>
        {children}
      </Box>
    );

    switch (chartType) {
      case 'line':
        return (
          <ChartWrapper>
            <Line ref={chartRef} data={processedData} options={chartOptions} />
          </ChartWrapper>
        );
      
      case 'bar':
        return (
          <ChartWrapper>
            <Bar ref={chartRef} data={processedData} options={chartOptions} />
          </ChartWrapper>
        );
      
      case 'scatter':
        return (
          <ChartWrapper>
            <Scatter ref={chartRef} data={processedData} options={chartOptions} />
          </ChartWrapper>
        );
      
      case 'bubble':
        return (
          <ChartWrapper>
            <Scatter ref={chartRef} data={processedData} options={chartOptions} />
          </ChartWrapper>
        );
      
      case 'pie':
        return (
          <ChartWrapper>
            <Pie ref={chartRef} data={processedData} options={chartOptions} />
          </ChartWrapper>
        );
      
      case 'doughnut':
        return (
          <ChartWrapper>
            <Doughnut ref={chartRef} data={processedData} options={chartOptions} />
          </ChartWrapper>
        );
      
      case 'polarArea':
        return (
          <ChartWrapper>
            <PolarArea ref={chartRef} data={processedData} options={chartOptions} />
          </ChartWrapper>
        );
      
      case 'radar':
        return (
          <ChartWrapper>
            <Radar ref={chartRef} data={processedData} options={chartOptions} />
          </ChartWrapper>
        );
      
      default:
        return (
          <Alert severity="warning">
            Chart type "{chartType}" is not supported yet.
          </Alert>
        );
    }
  };

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 1 }}>
        {getChartIcon(chartType)}
        <Typography variant="h6" sx={{ ml: 1, flex: 1 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={chartType.toUpperCase()} 
            size="small" 
            variant="outlined" 
            color="primary"
          />
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Chart Content */}
      <Box sx={{ flex: 1, p: 2, pt: 0 }}>
        {renderChart()}
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleExport}>
          <Download sx={{ mr: 1 }} />
          Export as PNG
        </MenuItem>
        <MenuItem onClick={() => {
          handleConfigChange('animated', !config.animated);
          handleMenuClose();
        }}>
          <Settings sx={{ mr: 1 }} />
          {config.animated ? 'Disable' : 'Enable'} Animation
        </MenuItem>
      </Menu>
    </Paper>
  );
});

UnifiedChartComponent.displayName = 'UnifiedChartComponent';

export default UnifiedChartComponent;