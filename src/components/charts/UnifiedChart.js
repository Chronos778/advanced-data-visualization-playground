import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import '../../utils/chartSetup'; // Initialize Chart.js
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Scatter,
  PolarArea,
  Radar
} from 'react-chartjs-2';
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
  Grid,
  Chip,
  Divider,
  Slider
} from '@mui/material';
import {
  Settings,
  Download,
  MoreVert,
  BarChart,
  ShowChart,
  PieChart,
  ScatterPlot,
  Insights,
  Radar as RadarIcon
} from '@mui/icons-material';

const UnifiedChart = React.memo(({
  data,
  chartType = 'bar',
  xAxis = '',
  yAxis = '',
  title = '',
  config = {},
  colorBy = '',
  sizeBy = '',
  onError = () => { },
  onDataExport = () => { }
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [chartConfig, setChartConfig] = useState({
    animated: true,
    showLegend: true,
    maintainAspectRatio: false,
    borderWidth: 2,
    pointRadius: 4,
    backgroundColor: '#1E222D',
    borderColor: '#2962FF',
    ...config
  });

  // Chart component map
  const chartComponents = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
    scatter: Scatter,
    polarArea: PolarArea,
    radar: Radar,
    histogram: Bar,
    boxplot: Bar, // Will use custom data format
    violin: Bar, // Will use custom data format  
    heatmap: Scatter, // Will use matrix controller when available
    treemap: Bar, // Will use treemap controller when available
    waterfall: Bar,
    funnel: Pie,
    gauge: Doughnut,
    candlestick: Bar, // Will need custom implementation
    area: Line,
    bubble: Scatter
  };

  // Vibrant gradient color palette
  const gradientColors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe',
    '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140',
    '#30cfd0', '#330867', '#a8edea', '#fed6e3', '#ff9a9e'
  ];

  // Transform data for Chart.js format
  const getChartData = useCallback(() => {
    if (!data || !data.data || data.data.length === 0) return { labels: [], datasets: [] };

    try {
      const plotData = data.data;

      switch (chartType) {
        case 'bar':
        case 'line':
          const labels = plotData.map(row => row[xAxis] || '');
          const values = plotData.map(row => parseFloat(row[yAxis]) || 0);

          return {
            labels,
            datasets: [{
              label: yAxis || 'Data',
              data: values,
              backgroundColor: chartType === 'bar' ? 'rgba(41, 98, 255, 0.8)' : 'transparent',
              borderColor: '#2962FF',
              borderWidth: chartConfig.borderWidth,
              fill: chartType === 'line' ? false : true,
              tension: chartType === 'line' ? 0.1 : 0,
              pointRadius: chartType === 'line' ? chartConfig.pointRadius : 0,
              pointBackgroundColor: '#2962FF',
              pointBorderColor: '#D1D4DC'
            }]
          };

        case 'pie':
        case 'doughnut':
          // Aggregate data by category
          const categoryCount = {};
          plotData.forEach(row => {
            const category = row[xAxis] || 'Unknown';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
          });

          const pieLabels = Object.keys(categoryCount);
          const pieValues = Object.values(categoryCount);

          return {
            labels: pieLabels,
            datasets: [{
              data: pieValues,
              backgroundColor: gradientColors.slice(0, pieValues.length),
              borderColor: 'rgba(209, 212, 220, 0.2)',
              borderWidth: 2,
              hoverBorderWidth: 3
            }]
          };

        case 'scatter':
          return {
            datasets: [{
              label: 'Data Points',
              data: plotData.map(row => ({
                x: parseFloat(row[xAxis]) || 0,
                y: parseFloat(row[yAxis]) || 0
              })),
              backgroundColor: 'rgba(41, 98, 255, 0.8)',
              borderColor: '#2962FF',
              pointRadius: chartConfig.pointRadius,
              pointBorderColor: '#D1D4DC',
              pointBorderWidth: 1
            }]
          };

        case 'polarArea':
          const polarData = plotData.slice(0, 8); // Limit for readability
          return {
            labels: polarData.map(row => row[xAxis] || ''),
            datasets: [{
              data: polarData.map(row => parseFloat(row[yAxis]) || 0),
              backgroundColor: gradientColors.slice(0, polarData.length).map(c => c + '40'),
              borderColor: gradientColors.slice(0, polarData.length),
              borderWidth: 2
            }]
          };

        case 'radar':
          const radarCategories = plotData.slice(0, 6); // Limit for readability
          return {
            labels: radarCategories.map(row => row[xAxis] || ''),
            datasets: [{
              label: yAxis || 'Data',
              data: radarCategories.map(row => parseFloat(row[yAxis]) || 0),
              backgroundColor: 'rgba(41, 98, 255, 0.2)',
              borderColor: '#2962FF',
              borderWidth: 2,
              pointRadius: chartConfig.pointRadius,
              pointBackgroundColor: '#2962FF',
              pointBorderColor: '#D1D4DC'
            }]
          };

        case 'histogram':
          // Create histogram bins
          const histValues = plotData.map(row => parseFloat(row[yAxis]) || 0).filter(v => !isNaN(v));
          const bins = 10;
          const min = Math.min(...histValues);
          const max = Math.max(...histValues);
          const binWidth = (max - min) / bins;
          const binCounts = new Array(bins).fill(0);
          const binLabels = [];

          for (let i = 0; i < bins; i++) {
            const binStart = min + i * binWidth;
            const binEnd = binStart + binWidth;
            binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
          }

          histValues.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
            binCounts[binIndex]++;
          });

          return {
            labels: binLabels,
            datasets: [{
              label: 'Frequency',
              data: binCounts,
              backgroundColor: 'rgba(41, 98, 255, 0.7)',
              borderColor: '#2962FF',
              borderWidth: 1
            }]
          };

        case 'boxplot':
          // Simplified boxplot data - requires statistical calculations
          const boxValues = plotData.map(row => parseFloat(row[yAxis]) || 0).filter(v => !isNaN(v)).sort((a, b) => a - b);
          const q1 = boxValues[Math.floor(boxValues.length * 0.25)];
          const median = boxValues[Math.floor(boxValues.length * 0.5)];
          const q3 = boxValues[Math.floor(boxValues.length * 0.75)];
          const minVal = Math.min(...boxValues);
          const maxVal = Math.max(...boxValues);

          return {
            labels: [yAxis || 'Data'],
            datasets: [{
              label: yAxis || 'Data',
              data: [{
                min: minVal,
                q1: q1,
                median: median,
                q3: q3,
                max: maxVal
              }],
              backgroundColor: 'rgba(41, 98, 255, 0.5)',
              borderColor: '#2962FF',
              borderWidth: 1
            }]
          };

        case 'violin':
          // Simplified violin plot
          return {
            labels: [yAxis || 'Data'],
            datasets: [{
              label: yAxis || 'Data',
              data: plotData.map(row => parseFloat(row[yAxis]) || 0).filter(v => !isNaN(v)),
              backgroundColor: 'rgba(41, 98, 255, 0.3)',
              borderColor: '#2962FF',
              borderWidth: 1
            }]
          };

        case 'heatmap':
          // Create matrix data for heatmap
          const uniqueX = [...new Set(plotData.map(row => row[xAxis]))];
          const uniqueY = [...new Set(plotData.map(row => row[yAxis]))];
          const matrixData = [];

          uniqueY.forEach((y, yIndex) => {
            uniqueX.forEach((x, xIndex) => {
              const dataPoint = plotData.find(row => row[xAxis] === x && row[yAxis] === y);
              const value = dataPoint ? parseFloat(Object.values(dataPoint)[2]) || 0 : 0;
              matrixData.push({
                x: xIndex,
                y: yIndex,
                v: value
              });
            });
          });

          return {
            datasets: [{
              label: 'Heatmap',
              data: matrixData,
              backgroundColor: function (context) {
                const value = context.parsed.v;
                const max = Math.max(...matrixData.map(d => d.v));
                const intensity = value / max;
                return `rgba(0, 0, 0, ${intensity})`;
              },
              borderColor: '#D1D4DC',
              borderWidth: 1,
              width: ({ chart }) => (chart.chartArea || {}).width / uniqueX.length,
              height: ({ chart }) => (chart.chartArea || {}).height / uniqueY.length,
            }]
          };

        case 'treemap':
          // Convert data for treemap
          const treemapData = plotData.slice(0, 10).map(row => ({
            v: parseFloat(row[yAxis]) || 0,
            label: row[xAxis] || ''
          }));

          return {
            datasets: [{
              tree: treemapData,
              key: 'v',
              groups: ['label'],
              backgroundColor: function (context) {
                const index = context.dataIndex % gradientColors.length;
                return gradientColors[index];
              },
              borderColor: 'rgba(209, 212, 220, 0.2)',
              borderWidth: 2
            }]
          };

        case 'waterfall':
          // Waterfall chart - cumulative changes
          const waterfallValues = plotData.map(row => parseFloat(row[yAxis]) || 0);
          let cumulative = 0;
          const waterfallData = waterfallValues.map((value, index) => {
            const result = cumulative + value;
            cumulative = result;
            return result;
          });

          return {
            labels: plotData.map(row => row[xAxis] || ''),
            datasets: [{
              label: 'Cumulative',
              data: waterfallData,
              backgroundColor: waterfallValues.map(v => v >= 0 ? 'rgba(41, 98, 255, 0.7)' : 'rgba(128, 128, 128, 0.7)'),
              borderColor: '#2962FF',
              borderWidth: 1
            }]
          };

        case 'funnel':
          // Funnel chart - decreasing values
          const funnelData = plotData
            .map(row => ({ label: row[xAxis], value: parseFloat(row[yAxis]) || 0 }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);

          return {
            labels: funnelData.map(d => d.label),
            datasets: [{
              data: funnelData.map(d => d.value),
              backgroundColor: gradientColors.slice(0, funnelData.length),
              borderColor: 'rgba(209, 212, 220, 0.2)',
              borderWidth: 2
            }]
          };

        case 'gauge':
          // Gauge chart - single value with max
          const gaugeValue = parseFloat(plotData[0]?.[yAxis]) || 0;
          const maxGaugeValue = Math.max(...plotData.map(row => parseFloat(row[yAxis]) || 0));

          return {
            datasets: [{
              data: [gaugeValue, maxGaugeValue - gaugeValue],
              backgroundColor: ['#2962FF', 'rgba(41, 98, 255, 0.3)'],
              borderColor: '#2962FF',
              borderWidth: 2,
              circumference: 180,
              rotation: 270
            }]
          };

        case 'candlestick':
          // Candlestick chart for financial data
          // Assumes data has open, high, low, close columns
          const candlestickData = plotData.slice(0, 20).map(row => ({
            x: row[xAxis],
            o: parseFloat(row['open']) || parseFloat(row[yAxis]) || 0,
            h: parseFloat(row['high']) || parseFloat(row[yAxis]) || 0,
            l: parseFloat(row['low']) || parseFloat(row[yAxis]) || 0,
            c: parseFloat(row['close']) || parseFloat(row[yAxis]) || 0
          }));

          return {
            datasets: [{
              label: 'Price',
              data: candlestickData,
              borderColor: '#2962FF',
              backgroundColor: 'rgba(41, 98, 255, 0.1)'
            }]
          };

        case 'area':
          // Area chart (filled line chart)
          const areaLabels = plotData.map(row => row[xAxis] || '');
          const areaValues = plotData.map(row => parseFloat(row[yAxis]) || 0);

          return {
            labels: areaLabels,
            datasets: [{
              label: yAxis || 'Data',
              data: areaValues,
              backgroundColor: 'rgba(41, 98, 255, 0.3)',
              borderColor: '#2962FF',
              borderWidth: 2,
              fill: true,
              tension: 0.3,
              pointRadius: 3,
              pointBackgroundColor: '#2962FF',
              pointBorderColor: '#D1D4DC'
            }]
          };

        case 'bubble':
          // Bubble chart with size dimension
          const bubbleData = plotData.slice(0, 50).map(row => ({
            x: parseFloat(row[xAxis]) || 0,
            y: parseFloat(row[yAxis]) || 0,
            r: Math.abs(parseFloat(Object.values(row)[2]) || 5) // Third column for bubble size
          }));

          return {
            datasets: [{
              label: 'Bubble Data',
              data: bubbleData,
              backgroundColor: 'rgba(41, 98, 255, 0.6)',
              borderColor: '#2962FF',
              borderWidth: 1
            }]
          };

        default:
          return { labels: [], datasets: [] };
      }
    } catch (error) {
      onError(`Chart data processing error: ${error.message}`);
      return { labels: [], datasets: [] };
    }
  }, [data, chartType, xAxis, yAxis, chartConfig, onError, gradientColors]);

  // Chart options
  const getChartOptions = useCallback(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: chartConfig.maintainAspectRatio,
      plugins: {
        title: {
          display: !!title,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          },
          color: '#000000'
        },
        legend: {
          display: chartConfig.showLegend,
          labels: {
            color: '#000000',
            boxWidth: 12,
            padding: 20,
            font: { family: '"IBM Plex Mono", monospace', weight: 'bold' }
          }
        },
        tooltip: {
          backgroundColor: '#000000',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#000000',
          borderWidth: 2,
          cornerRadius: 0,
          titleFont: { family: '"IBM Plex Mono", monospace', weight: 'bold' },
          bodyFont: { family: '"IBM Plex Mono", monospace', weight: 'bold' }
        }
      },
      animation: {
        duration: chartConfig.animated ? 1000 : 0
      }
    };

    // Add axis configuration for applicable chart types
    if (['bar', 'line', 'scatter'].includes(chartType)) {
      baseOptions.scales = {
        x: {
          display: true,
          title: {
            display: !!xAxis,
            text: xAxis,
            color: '#000000',
            font: { family: '"IBM Plex Mono", monospace', weight: 'bold' }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            borderColor: '#000000',
            borderWidth: 2
          },
          ticks: {
            color: '#000000',
            font: { family: '"IBM Plex Mono", monospace', weight: 'bold' }
          }
        },
        y: {
          display: true,
          title: {
            display: !!yAxis,
            text: yAxis,
            color: '#000000',
            font: { family: '"IBM Plex Mono", monospace', weight: 'bold' }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            borderColor: '#000000',
            borderWidth: 2
          },
          ticks: {
            color: '#000000',
            font: { family: '"IBM Plex Mono", monospace', weight: 'bold' }
          }
        }
      };
    }

    // Special handling for radar charts
    if (chartType === 'radar') {
      baseOptions.scales = {
        r: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          angleLines: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          pointLabels: {
            color: '#000000',
            font: { family: '"IBM Plex Mono", monospace', weight: 'bold' }
          },
          ticks: {
            color: '#000000',
            font: { family: '"IBM Plex Mono", monospace', weight: 'bold' }
          }
        }
      };
    }

    return baseOptions;
  }, [title, chartType, xAxis, yAxis, chartConfig]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = () => {
    if (onDataExport) {
      onDataExport(getChartData());
    }
    handleMenuClose();
  };

  const ChartComponent = chartComponents[chartType];
  const chartData = getChartData();
  const chartOptions = getChartOptions();

  if (!ChartComponent) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', height: '100%', backgroundColor: 'white', border: '2px solid black' }}>
        <Typography variant="h6" sx={{ color: 'red', fontWeight: 800, textTransform: 'uppercase' }}>
          UNSUPPORTED_CHART_TYPE: {chartType}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100%', backgroundColor: 'white', border: '2px solid black' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 2, borderBottom: '2px solid black' }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title || `${chartType} CHART`}
        </Typography>
        <Box>
          <IconButton
            onClick={() => setShowSettings(!showSettings)}
            sx={{
              borderRadius: 0,
              border: '2px solid black',
              backgroundColor: showSettings ? 'black' : 'white',
              color: showSettings ? 'white' : 'black',
              '&:hover': { backgroundColor: showSettings ? 'black' : '#F7F7F5' },
              mr: 1
            }}
          >
            <Settings />
          </IconButton>
          <IconButton onClick={handleMenuOpen} sx={{ borderRadius: 0, border: '2px solid black' }}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {showSettings && (
        <Box sx={{ mb: 3, p: 3, backgroundColor: '#F7F7F5', border: '2px solid black' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, textTransform: 'uppercase' }}>CHART_SETTINGS</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.animated}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, animated: e.target.checked }))}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#ffffff',
                        backgroundcolor: '#D1D4DC',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundcolor: '#D1D4DC',
                      },
                    }}
                  />
                }
                label="Animation"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={chartConfig.showLegend}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, showLegend: e.target.checked }))}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#ffffff',
                        backgroundcolor: '#D1D4DC',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundcolor: '#D1D4DC',
                      },
                    }}
                  />
                }
                label="Legend"
              />
            </Grid>
            {['line', 'scatter', 'radar'].includes(chartType) && (
              <Grid item xs={12}>
                <Typography gutterBottom>Point Size</Typography>
                <Slider
                  value={chartConfig.pointRadius}
                  onChange={(e, value) => setChartConfig(prev => ({ ...prev, pointRadius: value }))}
                  min={1}
                  max={10}
                  step={1}
                  sx={{
                    color: '#D1D4DC',
                    '& .MuiSlider-thumb': {
                      backgroundcolor: '#D1D4DC',
                    },
                    '& .MuiSlider-track': {
                      backgroundcolor: '#D1D4DC',
                    },
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      <Box sx={{ height: 'calc(100% - 80px)', minHeight: 300 }}>
        <ChartComponent data={chartData} options={chartOptions} />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: 0, border: '2px solid black', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }
        }}
      >
        <MenuItem onClick={handleExport} sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          <Download sx={{ mr: 1 }} />
          EXPORT_DATA
        </MenuItem>
      </Menu>
    </Box>
  );
});

UnifiedChart.displayName = 'UnifiedChart';

UnifiedChart.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.arrayOf(PropTypes.string)
  }),
  chartType: PropTypes.oneOf([
    'bar', 'line', 'pie', 'doughnut', 'scatter', 'polarArea', 'radar',
    'histogram', 'boxplot', 'violin', 'heatmap', 'treemap', 'waterfall',
    'funnel', 'gauge', 'candlestick', 'area', 'bubble'
  ]),
  xAxis: PropTypes.string,
  yAxis: PropTypes.string,
  title: PropTypes.string,
  config: PropTypes.object,
  colorBy: PropTypes.string,
  sizeBy: PropTypes.string,
  onError: PropTypes.func,
  onDataExport: PropTypes.func
};

UnifiedChart.defaultProps = {
  chartType: 'bar',
  xAxis: '',
  yAxis: '',
  title: '',
  config: {},
  colorBy: '',
  sizeBy: '',
  onError: () => { },
  onDataExport: () => { }
};

export default UnifiedChart;