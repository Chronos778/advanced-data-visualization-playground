import React, { useState, useCallback, useEffect } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Chip,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Divider
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Download,
  DragIndicator,
  BarChart,
  ShowChart,
  PieChart,
  ScatterPlot,
  Insights,
  Timeline,
  BubbleChart,
  DonutLarge,
  AccountTree,
  GridOn,
  ThreeDRotation,
  ThermostatAuto,
  Landscape,
  Hub,
  PanoramaFishEye,
  AccountBalance
} from '@mui/icons-material';
import ChartComponent from '../charts/ChartComponent';
import PlotlyChart from '../charts/PlotlyChart';
import CustomRawChart from '../charts/CustomRawChart';
import ChartTypeGrid from '../charts/ChartTypeGrid';
import { chartConfigurations } from '../charts/ChartConfigurations';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(RGL);

const Dashboard = ({ data, onExport, initialState, onStateChange }) => {
  const [widgets, setWidgets] = useState(initialState?.widgets || []);
  const [layout, setLayout] = useState(initialState?.layout || []);

  // Update state when initialState changes (from localStorage)
  useEffect(() => {
    if (initialState) {
      setWidgets(initialState.widgets || []);
      setLayout(initialState.layout || []);
    }
  }, [initialState]);

  // Notify parent component when state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(widgets, layout);
    }
  }, [widgets, layout, onStateChange]);
  const [addWidgetOpen, setAddWidgetOpen] = useState(false);
  const [editWidget, setEditWidget] = useState(null);
  const [newWidget, setNewWidget] = useState({
    type: 'chart',
    chartType: '',
    library: '',
    title: '',
    xAxis: '',
    yAxis: '',
    zAxis: '',
    colorBy: '',
    sizeBy: '',
    hierarchy: [],
    series: '',
    dimensions: []
  });
  const [chartSelectionStep, setChartSelectionStep] = useState('select'); // 'select' or 'configure'


  const availableColumns = data && data.columns ? data.columns : [];
  const numericColumns = React.useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];
    return availableColumns.filter(col => {
      const sampleValue = data.data[0][col];
      return !isNaN(parseFloat(sampleValue)) && isFinite(sampleValue);
    });
  }, [availableColumns, data]);

  const generateId = () => `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Get chart configuration for the current chart type
  const getCurrentChartConfig = () => {
    return chartConfigurations[newWidget.chartType] || {};
  };

  const handleChartTypeSelection = (chartType) => {
    setNewWidget(prev => ({
      ...prev,
      chartType: chartType.value,
      library: chartType.library,
      title: chartType.label // Pre-fill title with chart type name
    }));
    setChartSelectionStep('configure');
  };

  const handleDialogClose = () => {
    setAddWidgetOpen(false);
    setChartSelectionStep('select');
    setNewWidget({
      type: 'chart',
      chartType: '',
      library: '',
      title: '',
      xAxis: '',
      yAxis: '',
      zAxis: '',
      colorBy: '',
      sizeBy: '',
      hierarchy: [],
      series: '',
      dimensions: []
    });
  };

  const addWidget = useCallback(() => {
    if (!newWidget.title) return;
    
    // Validate based on chart configuration
    if (!newWidget.chartType) return;
    
    const config = getCurrentChartConfig();
    
    // Check required axes
    if (config.requiresXAxis && !newWidget.xAxis) return;
    if (config.requiresYAxis && !newWidget.yAxis) return;
    if (config.supportsZAxis && config.requiresZAxis && !newWidget.zAxis) return;
    
    // Check required additional fields
    if (config.additionalFields) {
      for (const field of config.additionalFields) {
        if (field.required) {
          if (field.name === 'hierarchy' && (!newWidget.hierarchy || newWidget.hierarchy.length === 0)) return;
          if (field.name === 'series' && !newWidget.series) return;
          if (field.name === 'dimensions' && (!newWidget.dimensions || newWidget.dimensions.length === 0)) return;
        }
      }
    }
    
    // Check size by requirement for specific charts
    if (config.supportsSizeBy && 
        (newWidget.chartType === 'raw_sankey' || newWidget.chartType === 'raw_chord') && 
        !newWidget.sizeBy) {
      return;
    }

    const id = generateId();
    const widget = {
      id,
      ...newWidget,
      config: {}
    };

    const layoutItem = {
      i: id,
      x: (widgets.length * 2) % 12,
      y: Math.floor(widgets.length / 6) * 6,
      w: 6,
      h: 6,
      minW: 3,
      minH: 3
    };

    setWidgets(prev => [...prev, widget]);
    setLayout(prev => [...prev, layoutItem]);
    setNewWidget({
      type: 'chart',
      chartType: '',
      library: '',
      title: '',
      xAxis: '',
      yAxis: '',
      zAxis: '',
      colorBy: '',
      sizeBy: '',
      hierarchy: [],
      series: '',
      dimensions: []
    });
    setChartSelectionStep('select');
    setAddWidgetOpen(false);
  }, [newWidget, widgets.length]);

  const deleteWidget = useCallback((widgetId) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
    setLayout(prev => prev.filter(l => l.i !== widgetId));
  }, []);

  const updateWidget = useCallback((widgetId, updates) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, ...updates } : w
    ));
  }, []);

  const handleLayoutChange = useCallback((newLayout) => {
    setLayout(newLayout);
  }, []);

  const exportDashboard = useCallback(() => {
    const dashboardConfig = {
      widgets,
      layout,
      timestamp: new Date().toISOString(),
      dataInfo: data ? {
        fileName: data.fileName,
        rowCount: data.data?.length,
        columnCount: data.columns?.length
      } : null
    };

    const blob = new Blob([JSON.stringify(dashboardConfig, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [widgets, layout, data]);

  const renderWidget = (widget) => {
    const widgetData = data;

    switch (widget.type) {
      case 'chart':
        if (widget.library === 'plotly') {
          return (
            <PlotlyChart
              data={widgetData}
              chartType={widget.chartType}
              title={widget.title}
              xAxis={widget.xAxis}
              yAxis={widget.yAxis}
              zAxis={widget.zAxis}
              colorBy={widget.colorBy}
              sizeBy={widget.sizeBy}
              chartConfig={widget.config}
              onConfigChange={(config) => updateWidget(widget.id, { config })}
              onExport={(format) => {
                if (onExport) {
                  onExport(widget.id, format);
                }
              }}
            />
          );
        } else if (widget.library === 'rawgraphs') {
          return (
            <CustomRawChart
              data={widgetData}
              chartType={widget.chartType}
              title={widget.title}
              xAxis={widget.xAxis}
              yAxis={widget.yAxis}
              zAxis={widget.zAxis}
              colorBy={widget.colorBy}
              sizeBy={widget.sizeBy}
              hierarchy={widget.hierarchy}
              onExport={(format) => {
                if (onExport) {
                  onExport(widget.id, format);
                }
              }}
            />
          );
        } else {
          return (
            <ChartComponent
              data={widgetData}
              chartType={widget.chartType}
              title={widget.title}
              xAxis={widget.xAxis}
              yAxis={widget.yAxis}
              colorBy={widget.colorBy}
              chartConfig={widget.config}
              onConfigChange={(config) => updateWidget(widget.id, { config })}
              onExport={(format) => {
                if (onExport) {
                  onExport(widget.id, format);
                }
              }}
            />
          );
        }
      default:
        return (
          <Paper sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography>Unknown widget type</Typography>
          </Paper>
        );
    }
  };

  const getWidgetHeader = (widget) => (
    <Box sx={{
      position: 'absolute',
      top: 8,
      right: 8,
      zIndex: 1000,
      display: 'flex',
      gap: 0.5,
      opacity: 0.7,
      '&:hover': { opacity: 1 }
    }}>
      <IconButton
        size="small"
        onClick={() => setEditWidget(widget)}
        sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
      >
        <Edit fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => deleteWidget(widget.id)}
        sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
        color="error"
      >
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  );

  if (!data || !data.data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Dashboard
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Upload data to start creating visualizations in your dashboard
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Once you upload a CSV, JSON, or Excel file, you'll be able to:
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip icon={<Add />} label="Add Charts" variant="outlined" />
          <Chip icon={<DragIndicator />} label="Drag & Drop" variant="outlined" />
          <Chip icon={<Download />} label="Export" variant="outlined" />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100vh', overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Visualization Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={`${widgets.length} widgets`} 
              size="small" 
              color="primary" 
            />
            {data.fileName && (
              <Chip 
                label={data.fileName} 
                size="small" 
                variant="outlined" 
              />
            )}
            <Chip 
              label={`${data.data.length} rows`} 
              size="small" 
              variant="outlined" 
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={exportDashboard}
            disabled={widgets.length === 0}
          >
            Export Dashboard
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddWidgetOpen(true)}
          >
            Add Chart
          </Button>
        </Box>
      </Box>

      {/* Dashboard Grid */}
      {widgets.length > 0 ? (
        <ResponsiveGridLayout
          className="layout"
          layout={layout}
          onLayoutChange={handleLayoutChange}
          cols={12}
          rowHeight={60}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          isDraggable={true}
          isResizable={true}
          compactType="vertical"
          preventCollision={false}
        >
          {widgets.map((widget) => (
            <Box key={widget.id} sx={{ position: 'relative' }}>
              {getWidgetHeader(widget)}
              {renderWidget(widget)}
            </Box>
          ))}
        </ResponsiveGridLayout>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your dashboard is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add your first chart to start visualizing your data
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => setAddWidgetOpen(true)}
          >
            Create First Chart
          </Button>
        </Paper>
      )}

      {/* Add Widget Dialog */}
      <Dialog 
        open={addWidgetOpen} 
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {chartSelectionStep === 'select' ? 'Select Chart Type' : 'Configure Chart'}
        </DialogTitle>
        <DialogContent sx={{ minHeight: chartSelectionStep === 'select' ? '500px' : 'auto' }}>
          {chartSelectionStep === 'select' ? (
            <ChartTypeGrid
              onChartTypeSelect={handleChartTypeSelection}
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary">
                  Selected: {newWidget.title}
                </Typography>
                <Chip size="small" label={newWidget.library} variant="outlined" />
              </Box>
              
              <TextField
                fullWidth
                label="Chart Title"
                value={newWidget.title}
                onChange={(e) => setNewWidget(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter a descriptive title for your chart"
              />

              {/* Dynamic configuration fields based on chart requirements */}
              {(() => {
                const config = getCurrentChartConfig();
                const fields = [];

                // X-Axis and Y-Axis fields
                const axisFields = [];
                if (config.requiresXAxis) {
                  axisFields.push(
                    <FormControl key="xAxis" fullWidth>
                      <InputLabel>{config.xAxisLabel || 'X-Axis'}</InputLabel>
                      <Select
                        value={newWidget.xAxis}
                        label={config.xAxisLabel || 'X-Axis'}
                        onChange={(e) => setNewWidget(prev => ({ ...prev, xAxis: e.target.value }))}
                      >
                        {(config.xAxisType === 'numeric' ? numericColumns : availableColumns).map(col => (
                          <MenuItem key={col} value={col}>{col}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }

                if (config.requiresYAxis) {
                  axisFields.push(
                    <FormControl key="yAxis" fullWidth>
                      <InputLabel>{config.yAxisLabel || 'Y-Axis'}</InputLabel>
                      <Select
                        value={newWidget.yAxis}
                        label={config.yAxisLabel || 'Y-Axis'}
                        onChange={(e) => setNewWidget(prev => ({ ...prev, yAxis: e.target.value }))}
                      >
                        {(config.yAxisType === 'numeric' ? numericColumns : availableColumns).map(col => (
                          <MenuItem key={col} value={col}>{col}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }

                if (axisFields.length > 0) {
                  fields.push(
                    <Box key="axes" sx={{ display: 'grid', gridTemplateColumns: axisFields.length === 1 ? '1fr' : '1fr 1fr', gap: 2 }}>
                      {axisFields}
                    </Box>
                  );
                }

                // Z-Axis field
                if (config.supportsZAxis) {
                  fields.push(
                    <FormControl key="zAxis" fullWidth>
                      <InputLabel>{config.zAxisLabel || 'Z-Axis'}</InputLabel>
                      <Select
                        value={newWidget.zAxis}
                        label={config.zAxisLabel || 'Z-Axis'}
                        onChange={(e) => setNewWidget(prev => ({ ...prev, zAxis: e.target.value }))}
                      >
                        {numericColumns.map(col => (
                          <MenuItem key={col} value={col}>{col}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }

                // Additional fields (hierarchy, series, dimensions, etc.)
                if (config.additionalFields) {
                  config.additionalFields.forEach(field => {
                    if (field.name === 'hierarchy') {
                      fields.push(
                        <FormControl key={field.name} fullWidth>
                          <InputLabel>{field.label}{field.required ? ' *' : ' (Optional)'}</InputLabel>
                          <Select
                            multiple
                            value={newWidget.hierarchy || []}
                            label={field.label}
                            onChange={(e) => setNewWidget(prev => ({ ...prev, hierarchy: e.target.value }))}
                          >
                            {availableColumns.map(col => (
                              <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      );
                    } else if (field.name === 'series') {
                      fields.push(
                        <FormControl key={field.name} fullWidth>
                          <InputLabel>{field.label}{field.required ? ' *' : ' (Optional)'}</InputLabel>
                          <Select
                            multiple={field.type === 'multiselect'}
                            value={field.type === 'multiselect' ? (newWidget.series || []) : (newWidget.series || '')}
                            label={field.label}
                            onChange={(e) => setNewWidget(prev => ({ ...prev, series: e.target.value }))}
                          >
                            {availableColumns.map(col => (
                              <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      );
                    } else if (field.name === 'dimensions') {
                      fields.push(
                        <FormControl key={field.name} fullWidth>
                          <InputLabel>{field.label}{field.required ? ' *' : ' (Optional)'}</InputLabel>
                          <Select
                            multiple
                            value={newWidget.dimensions || []}
                            label={field.label}
                            onChange={(e) => setNewWidget(prev => ({ ...prev, dimensions: e.target.value }))}
                          >
                            {(field.label.includes('Numeric') ? numericColumns : availableColumns).map(col => (
                              <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      );
                    }
                  });
                }

                // Color By and Size By fields
                const optionalFields = [];
                if (config.supportsColorBy) {
                  optionalFields.push(
                    <FormControl key="colorBy" fullWidth>
                      <InputLabel>Color By (Optional)</InputLabel>
                      <Select
                        value={newWidget.colorBy}
                        label="Color By (Optional)"
                        onChange={(e) => setNewWidget(prev => ({ ...prev, colorBy: e.target.value }))}
                      >
                        <MenuItem value="">None</MenuItem>
                        {availableColumns.map(col => (
                          <MenuItem key={col} value={col}>{col}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }

                if (config.supportsSizeBy) {
                  const isRequired = newWidget.chartType === 'raw_sankey' || newWidget.chartType === 'raw_chord';
                  optionalFields.push(
                    <FormControl key="sizeBy" fullWidth>
                      <InputLabel>{config.sizeByLabel || `Size By ${isRequired ? '*' : '(Optional)'}`}</InputLabel>
                      <Select
                        value={newWidget.sizeBy}
                        label={config.sizeByLabel || `Size By ${isRequired ? '*' : '(Optional)'}`}
                        onChange={(e) => setNewWidget(prev => ({ ...prev, sizeBy: e.target.value }))}
                      >
                        {!isRequired && <MenuItem value="">None</MenuItem>}
                        {numericColumns.map(col => (
                          <MenuItem key={col} value={col}>{col}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }

                if (optionalFields.length > 0) {
                  fields.push(
                    <Box key="optional" sx={{ display: 'grid', gridTemplateColumns: optionalFields.length === 1 ? '1fr' : '1fr 1fr', gap: 2 }}>
                      {optionalFields}
                    </Box>
                  );
                }

                return fields;
              })()}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {chartSelectionStep === 'select' ? (
            <Button onClick={handleDialogClose}>Cancel</Button>
          ) : (
            <>
              <Button onClick={() => setChartSelectionStep('select')}>Back</Button>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button 
                onClick={addWidget} 
                variant="contained"
                disabled={(() => {
                  if (!newWidget.title || !newWidget.chartType) return true;
                  
                  const config = getCurrentChartConfig();
                  
                  // Check required axes
                  if (config.requiresXAxis && !newWidget.xAxis) return true;
                  if (config.requiresYAxis && !newWidget.yAxis) return true;
                  if (config.supportsZAxis && config.requiresZAxis && !newWidget.zAxis) return true;
                  
                  // Check required additional fields
                  if (config.additionalFields) {
                    for (const field of config.additionalFields) {
                      if (field.required) {
                        if (field.name === 'hierarchy' && (!newWidget.hierarchy || newWidget.hierarchy.length === 0)) return true;
                        if (field.name === 'series' && !newWidget.series) return true;
                        if (field.name === 'dimensions' && (!newWidget.dimensions || newWidget.dimensions.length === 0)) return true;
                      }
                    }
                  }
                  
                  // Check size by requirement for specific charts
                  if (config.supportsSizeBy && 
                      (newWidget.chartType === 'raw_sankey' || newWidget.chartType === 'raw_chord') && 
                      !newWidget.sizeBy) {
                    return true;
                  }
                  
                  return false;
                })()}
              >
                Add Chart
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Edit Widget Dialog */}
      <Dialog 
        open={Boolean(editWidget)} 
        onClose={() => setEditWidget(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Chart</DialogTitle>
        <DialogContent>
          {editWidget && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="Chart Title"
                value={editWidget.title}
                onChange={(e) => setEditWidget(prev => ({ ...prev, title: e.target.value }))}
              />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>X-Axis</InputLabel>
                  <Select
                    value={editWidget.xAxis}
                    label="X-Axis"
                    onChange={(e) => setEditWidget(prev => ({ ...prev, xAxis: e.target.value }))}
                  >
                    {availableColumns.map(col => (
                      <MenuItem key={col} value={col}>{col}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Y-Axis</InputLabel>
                  <Select
                    value={editWidget.yAxis}
                    label="Y-Axis"
                    onChange={(e) => setEditWidget(prev => ({ ...prev, yAxis: e.target.value }))}
                  >
                    {editWidget.chartType === 'pie' ? availableColumns.map(col => (
                      <MenuItem key={col} value={col}>{col}</MenuItem>
                    )) : numericColumns.map(col => (
                      <MenuItem key={col} value={col}>{col}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditWidget(null)}>Cancel</Button>
          <Button 
            onClick={() => {
              updateWidget(editWidget.id, editWidget);
              setEditWidget(null);
            }}
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;