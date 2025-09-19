import React, { useMemo, useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
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
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Chip
} from '@mui/material';
import {
  Settings,
  Download,
  MoreVert,
  TrendingUp,
  BarChart as BarChartIcon,
  ScatterPlot,
  PieChart as PieChartIcon,
  ShowChart
} from '@mui/icons-material';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
  '#d084d0', '#87d068', '#ffb347', '#ff6b6b', '#4ecdc4',
  '#45b7d1', '#96ceb4', '#ffeaa7', '#fab1a0', '#fd79a8'
];

const ChartComponent = React.memo(({ 
  data, 
  chartType = 'line',
  title = 'Chart',
  xAxis = '',
  yAxis = '',
  colorBy = '',
  onExport,
  onConfigChange,
  chartConfig = {}
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState({
    width: '100%',
    height: 400,
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    animated: false, // Disabled for better performance
    strokeWidth: 2,
    opacity: 0.8,
    ...chartConfig
  });

  const processedData = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];
    
    return data.data.map((item, index) => ({
      ...item,
      _index: index,
      _color: COLORS[index % COLORS.length]
    }));
  }, [data]);

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
    if (onExport) {
      onExport();
    }
    setAnchorEl(null);
  }, [onExport]);

  const toggleSettings = useCallback(() => {
    setShowSettings(!showSettings);
  }, [showSettings]);

  const getChartIcon = useCallback((type) => {
    switch (type) {
      case 'line': return <TrendingUp />;
      case 'bar': return <BarChartIcon />;
      case 'scatter': return <ScatterPlot />;
      case 'pie': return <PieChartIcon />;
      case 'area': return <ShowChart />;
      default: return <TrendingUp />;
    }
  }, []);

  const renderChart = () => {
    if (!processedData.length || !xAxis || !yAxis) {
      return (
        <Box 
          sx={{ 
            height: config.height, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            color: 'text.secondary'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Chart Configuration Required
          </Typography>
          <Typography variant="body2">
            Please select X and Y axes to display the chart
          </Typography>
          <Box sx={{ mt: 2 }}>
            {!xAxis && <Chip label="X-Axis needed" color="warning" size="small" sx={{ mr: 1 }} />}
            {!yAxis && <Chip label="Y-Axis needed" color="warning" size="small" />}
          </Box>
        </Box>
      );
    }

    const commonProps = {
      data: processedData,
      width: '100%',
      height: config.height
    };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={processedData}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxis} />
              <YAxis />
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey={yAxis}
                stroke={COLORS[0]}
                strokeWidth={config.strokeWidth}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={config.animated}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={processedData}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxis} />
              <YAxis />
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
              <Bar
                dataKey={yAxis}
                fill={COLORS[0]}
                fillOpacity={config.opacity}
                isAnimationActive={config.animated}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart data={processedData}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxis} type="number" />
              <YAxis dataKey={yAxis} type="number" />
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
              <Scatter
                data={processedData}
                fill={COLORS[0]}
                fillOpacity={config.opacity}
                isAnimationActive={config.animated}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = processedData.slice(0, 10); // Limit to 10 slices for readability
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey={yAxis}
                nameKey={xAxis}
                cx="50%"
                cy="50%"
                outerRadius={Math.min(config.height * 0.3, 120)}
                fill="#8884d8"
                isAnimationActive={config.animated}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={processedData}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxis} />
              <YAxis />
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey={yAxis}
                stroke={COLORS[0]}
                fill={COLORS[0]}
                fillOpacity={config.opacity}
                strokeWidth={config.strokeWidth}
                isAnimationActive={config.animated}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
          <IconButton
            size="small"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Settings Panel */}
      {showSettings && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>Chart Configuration</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Chart Type</InputLabel>
                <Select
                  value={chartType}
                  label="Chart Type"
                  onChange={(e) => onConfigChange && onConfigChange({ chartType: e.target.value })}
                >
                  <MenuItem value="line">Line Chart</MenuItem>
                  <MenuItem value="bar">Bar Chart</MenuItem>
                  <MenuItem value="scatter">Scatter Plot</MenuItem>
                  <MenuItem value="pie">Pie Chart</MenuItem>
                  <MenuItem value="area">Area Chart</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>X-Axis</InputLabel>
                <Select
                  value={xAxis}
                  label="X-Axis"
                  onChange={(e) => onConfigChange && onConfigChange({ xAxis: e.target.value })}
                >
                  {availableColumns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Y-Axis</InputLabel>
                <Select
                  value={yAxis}
                  label="Y-Axis"
                  onChange={(e) => onConfigChange && onConfigChange({ yAxis: e.target.value })}
                >
                  {chartType === 'pie' ? availableColumns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  )) : numericColumns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Height (px)"
                type="number"
                value={config.height}
                onChange={(e) => handleConfigChange('height', parseInt(e.target.value))}
                inputProps={{ min: 200, max: 800 }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.showGrid}
                  onChange={(e) => handleConfigChange('showGrid', e.target.checked)}
                  size="small"
                />
              }
              label="Grid"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={config.showLegend}
                  onChange={(e) => handleConfigChange('showLegend', e.target.checked)}
                  size="small"
                />
              }
              label="Legend"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={config.showTooltip}
                  onChange={(e) => handleConfigChange('showTooltip', e.target.checked)}
                  size="small"
                />
              }
              label="Tooltip"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={config.animated}
                  onChange={(e) => handleConfigChange('animated', e.target.checked)}
                  size="small"
                />
              }
              label="Animation"
            />
          </Box>
        </Box>
      )}

      {/* Chart */}
      <Box sx={{ height: config.height }}>
        {renderChart()}
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          if (onExport) onExport('png');
          setAnchorEl(null);
        }}>
          <Download sx={{ mr: 1 }} />
          Export as PNG
        </MenuItem>
        <MenuItem onClick={() => {
          if (onExport) onExport('pdf');
          setAnchorEl(null);
        }}>
          <Download sx={{ mr: 1 }} />
          Export as PDF
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          setShowSettings(!showSettings);
          setAnchorEl(null);
        }}>
          <Settings sx={{ mr: 1 }} />
          Chart Settings
        </MenuItem>
      </Menu>
    </Paper>
  );
});

export default ChartComponent;