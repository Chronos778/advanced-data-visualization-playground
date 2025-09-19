import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
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
  Timeline,
  BubbleChart,
  Insights,
  Map,
  AccountTree
} from '@mui/icons-material';
import TreemapChart from './TreemapChart';

const PlotlyChart = ({ 
  data, 
  chartType = 'scatter',
  title = 'Advanced Chart',
  xAxis = '',
  yAxis = '',
  zAxis = '',
  colorBy = '',
  sizeBy = '',
  onExport,
  onConfigChange,
  chartConfig = {}
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState({
    width: 800,
    height: 500,
    showGrid: true,
    showLegend: true,
    colorScale: 'Viridis',
    opacity: 0.7,
    markerSize: 8,
    animated: true,
    theme: 'plotly_white',
    ...chartConfig
  });

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

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
  };

  const getPlotlyData = () => {
    if (!data || !data.data || data.data.length === 0) return [];

    const plotData = data.data;
    
    switch (chartType) {
      case 'scatter':
        return [{
          x: plotData.map(row => row[xAxis]),
          y: plotData.map(row => row[yAxis]),
          mode: 'markers',
          type: 'scatter',
          marker: {
            size: sizeBy ? plotData.map(row => parseFloat(row[sizeBy]) || config.markerSize) : config.markerSize,
            color: colorBy ? plotData.map(row => row[colorBy]) : '#1f77b4',
            colorscale: config.colorScale,
            opacity: config.opacity,
            showscale: !!colorBy,
            colorbar: colorBy ? { title: colorBy } : undefined
          },
          text: plotData.map(row => 
            Object.keys(row).map(key => `${key}: ${row[key]}`).join('<br>')
          ),
          hovertemplate: '%{text}<extra></extra>',
          name: 'Data Points'
        }];

      case 'scatter3d':
        return [{
          x: plotData.map(row => row[xAxis]),
          y: plotData.map(row => row[yAxis]),
          z: plotData.map(row => row[zAxis]),
          mode: 'markers',
          type: 'scatter3d',
          marker: {
            size: sizeBy ? plotData.map(row => (parseFloat(row[sizeBy]) || config.markerSize) / 2) : config.markerSize / 2,
            color: colorBy ? plotData.map(row => row[colorBy]) : '#1f77b4',
            colorscale: config.colorScale,
            opacity: config.opacity,
            showscale: !!colorBy,
            colorbar: colorBy ? { title: colorBy } : undefined
          },
          text: plotData.map(row => 
            Object.keys(row).map(key => `${key}: ${row[key]}`).join('<br>')
          ),
          hovertemplate: '%{text}<extra></extra>',
          name: '3D Data Points'
        }];

      case 'heatmap':
        // Create a pivot table for heatmap
        const uniqueX = [...new Set(plotData.map(row => row[xAxis]))].sort();
        const uniqueY = [...new Set(plotData.map(row => row[yAxis]))].sort();
        const zMatrix = uniqueY.map(y => 
          uniqueX.map(x => {
            const point = plotData.find(row => row[xAxis] === x && row[yAxis] === y);
            return point ? parseFloat(point[zAxis]) || 0 : 0;
          })
        );

        return [{
          z: zMatrix,
          x: uniqueX,
          y: uniqueY,
          type: 'heatmap',
          colorscale: config.colorScale,
          showscale: true,
          colorbar: { title: zAxis },
          hoverongaps: false
        }];

      case 'surface':
        // Create surface plot data
        const xVals = plotData.map(row => parseFloat(row[xAxis])).filter(v => !isNaN(v));
        const yVals = plotData.map(row => parseFloat(row[yAxis])).filter(v => !isNaN(v));
        
        // Create a grid for surface plot
        const xMin = Math.min(...xVals);
        const xMax = Math.max(...xVals);
        const yMin = Math.min(...yVals);
        const yMax = Math.max(...yVals);
        
        const gridSize = 20;
        const xGrid = Array.from({length: gridSize}, (_, i) => xMin + (xMax - xMin) * i / (gridSize - 1));
        const yGrid = Array.from({length: gridSize}, (_, i) => yMin + (yMax - yMin) * i / (gridSize - 1));
        
        const zGrid = yGrid.map(y => 
          xGrid.map(x => {
            // Simple interpolation - find closest point
            let minDist = Infinity;
            let closestZ = 0;
            plotData.forEach(row => {
              const dist = Math.sqrt(
                Math.pow(parseFloat(row[xAxis]) - x, 2) + 
                Math.pow(parseFloat(row[yAxis]) - y, 2)
              );
              if (dist < minDist) {
                minDist = dist;
                closestZ = parseFloat(row[zAxis]) || 0;
              }
            });
            return closestZ;
          })
        );

        return [{
          z: zGrid,
          x: xGrid,
          y: yGrid,
          type: 'surface',
          colorscale: config.colorScale,
          showscale: true,
          colorbar: { title: zAxis }
        }];

      case 'bubble':
        return [{
          x: plotData.map(row => row[xAxis]),
          y: plotData.map(row => row[yAxis]),
          mode: 'markers',
          type: 'scatter',
          marker: {
            size: sizeBy ? plotData.map(row => Math.max(5, (parseFloat(row[sizeBy]) || 5) * 2)) : config.markerSize * 2,
            sizemode: 'diameter',
            sizeref: 2,
            color: colorBy ? plotData.map(row => row[colorBy]) : '#1f77b4',
            colorscale: config.colorScale,
            opacity: config.opacity,
            showscale: !!colorBy,
            colorbar: colorBy ? { title: colorBy } : undefined,
            line: { color: 'white', width: 1 }
          },
          text: plotData.map((row, i) => 
            `${xAxis}: ${row[xAxis]}<br>${yAxis}: ${row[yAxis]}${sizeBy ? `<br>${sizeBy}: ${row[sizeBy]}` : ''}${colorBy ? `<br>${colorBy}: ${row[colorBy]}` : ''}`
          ),
          hovertemplate: '%{text}<extra></extra>',
          name: 'Bubbles'
        }];

      case 'contour':
        // Similar to heatmap but with contour lines
        const contourX = [...new Set(plotData.map(row => row[xAxis]))].sort();
        const contourY = [...new Set(plotData.map(row => row[yAxis]))].sort();
        const contourZ = contourY.map(y => 
          contourX.map(x => {
            const point = plotData.find(row => row[xAxis] === x && row[yAxis] === y);
            return point ? parseFloat(point[zAxis]) || 0 : 0;
          })
        );

        return [{
          z: contourZ,
          x: contourX,
          y: contourY,
          type: 'contour',
          colorscale: config.colorScale,
          showscale: true,
          colorbar: { title: zAxis },
          contours: {
            showlabels: true,
            labelfont: { size: 12, color: 'white' }
          }
        }];

      default:
        return [];
    }
  };

  const getLayout = () => ({
    title: {
      text: title,
      font: { size: 16 }
    },
    width: config.width,
    height: config.height,
    template: config.theme,
    xaxis: {
      title: xAxis,
      showgrid: config.showGrid,
      zeroline: false
    },
    yaxis: {
      title: yAxis,
      showgrid: config.showGrid,
      zeroline: false
    },
    ...(chartType === 'scatter3d' && {
      scene: {
        xaxis: { title: xAxis },
        yaxis: { title: yAxis },
        zaxis: { title: zAxis }
      }
    }),
    showlegend: config.showLegend,
    hovermode: 'closest',
    margin: { l: 60, r: 60, t: 60, b: 60 }
  });

  const getChartIcon = (type) => {
    switch (type) {
      case 'scatter':
      case 'bubble':
        return <BubbleChart />;
      case 'scatter3d':
      case 'surface':
        return <Insights />;
      case 'heatmap':
      case 'contour':
        return <Map />;
      case 'treemap':
        return <AccountTree />;
      default:
        return <Timeline />;
    }
  };

  const chartTypeOptions = [
    { value: 'scatter', label: 'Scatter Plot', requiresZ: false },
    { value: 'bubble', label: 'Bubble Chart', requiresZ: false },
    { value: 'scatter3d', label: '3D Scatter', requiresZ: true },
    { value: 'heatmap', label: 'Heatmap', requiresZ: true },
    { value: 'contour', label: 'Contour Plot', requiresZ: true },
    { value: 'surface', label: '3D Surface', requiresZ: true },
    { value: 'treemap', label: 'Treemap', requiresZ: false }
  ];

  const colorScales = [
    'Viridis', 'Plasma', 'Inferno', 'Magma', 'Cividis',
    'Blues', 'Greens', 'Reds', 'YlOrRd', 'YlGnBu',
    'RdYlBu', 'Spectral', 'Jet', 'Hot', 'Cool'
  ];

  const themes = [
    'plotly', 'plotly_white', 'plotly_dark', 'ggplot2',
    'seaborn', 'simple_white', 'none'
  ];

  if (!data || !data.data || data.data.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
        <Typography variant="h6" color="text.secondary">
          No data available for visualization
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload and select data to create advanced visualizations
        </Typography>
      </Paper>
    );
  }

  const currentChartType = chartTypeOptions.find(opt => opt.value === chartType);
  const needsAllAxes = xAxis && yAxis && (!currentChartType?.requiresZ || zAxis);

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
            label={currentChartType?.label || chartType.toUpperCase()} 
            size="small" 
            variant="outlined" 
            color="secondary"
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
          <Typography variant="subtitle2" gutterBottom>Advanced Chart Configuration</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Chart Type</InputLabel>
                <Select
                  value={chartType}
                  label="Chart Type"
                  onChange={(e) => onConfigChange && onConfigChange({ chartType: e.target.value })}
                >
                  {chartTypeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
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
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Y-Axis</InputLabel>
                <Select
                  value={yAxis}
                  label="Y-Axis"
                  onChange={(e) => onConfigChange && onConfigChange({ yAxis: e.target.value })}
                >
                  {numericColumns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {currentChartType?.requiresZ && (
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Z-Axis</InputLabel>
                  <Select
                    value={zAxis}
                    label="Z-Axis"
                    onChange={(e) => onConfigChange && onConfigChange({ zAxis: e.target.value })}
                  >
                    {numericColumns.map(col => (
                      <MenuItem key={col} value={col}>{col}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Color By</InputLabel>
                <Select
                  value={colorBy}
                  label="Color By"
                  onChange={(e) => onConfigChange && onConfigChange({ colorBy: e.target.value })}
                >
                  <MenuItem value="">None</MenuItem>
                  {availableColumns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {(chartType === 'scatter' || chartType === 'bubble') && (
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Size By</InputLabel>
                  <Select
                    value={sizeBy}
                    label="Size By"
                    onChange={(e) => onConfigChange && onConfigChange({ sizeBy: e.target.value })}
                  >
                    <MenuItem value="">None</MenuItem>
                    {numericColumns.map(col => (
                      <MenuItem key={col} value={col}>{col}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Color Scale</InputLabel>
                <Select
                  value={config.colorScale}
                  label="Color Scale"
                  onChange={(e) => handleConfigChange('colorScale', e.target.value)}
                >
                  {colorScales.map(scale => (
                    <MenuItem key={scale} value={scale}>{scale}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Theme</InputLabel>
                <Select
                  value={config.theme}
                  label="Theme"
                  onChange={(e) => handleConfigChange('theme', e.target.value)}
                >
                  {themes.map(theme => (
                    <MenuItem key={theme} value={theme}>{theme}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <Typography gutterBottom>Opacity</Typography>
              <Slider
                value={config.opacity}
                onChange={(e, value) => handleConfigChange('opacity', value)}
                min={0.1}
                max={1}
                step={0.1}
                valueLabelDisplay="auto"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography gutterBottom>Marker Size</Typography>
              <Slider
                value={config.markerSize}
                onChange={(e, value) => handleConfigChange('markerSize', value)}
                min={3}
                max={20}
                step={1}
                valueLabelDisplay="auto"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Chart */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {chartType === 'treemap' ? (
          <TreemapChart
            data={data}
            title={title}
            valueColumn={yAxis}
            labelColumn={xAxis}
            categoryColumn={colorBy}
            onExport={onExport}
            onConfigChange={(newConfig) => {
              setConfig(prev => ({ ...prev, ...newConfig }));
              if (onConfigChange) onConfigChange(newConfig);
            }}
            chartConfig={config}
          />
        ) : needsAllAxes ? (
          <Plot
            data={getPlotlyData()}
            layout={getLayout()}
            config={{
              responsive: true,
              displayModeBar: true,
              modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
              displaylogo: false
            }}
          />
        ) : (
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
            <Typography variant="body2" sx={{ mb: 2 }}>
              Please configure all required axes for this chart type
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {!xAxis && <Chip label="X-Axis needed" color="warning" size="small" />}
              {!yAxis && <Chip label="Y-Axis needed" color="warning" size="small" />}
              {currentChartType?.requiresZ && !zAxis && <Chip label="Z-Axis needed" color="warning" size="small" />}
            </Box>
          </Box>
        )}
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
          if (onExport) onExport('html');
          setAnchorEl(null);
        }}>
          <Download sx={{ mr: 1 }} />
          Export as HTML
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
};

export default PlotlyChart;