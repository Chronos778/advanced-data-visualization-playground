import React, { useState, useCallback } from 'react';
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
  Chip
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
  Insights
} from '@mui/icons-material';
import ChartComponent from '../charts/ChartComponent';
import PlotlyChart from '../charts/PlotlyChart';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(RGL);

const Dashboard = ({ data, onExport }) => {
  const [widgets, setWidgets] = useState([]);
  const [layout, setLayout] = useState([]);
  const [addWidgetOpen, setAddWidgetOpen] = useState(false);
  const [editWidget, setEditWidget] = useState(null);
  const [newWidget, setNewWidget] = useState({
    type: 'chart',
    chartType: 'line',
    library: 'recharts',
    title: '',
    xAxis: '',
    yAxis: '',
    zAxis: '',
    colorBy: '',
    sizeBy: ''
  });

  const chartTypes = {
    recharts: [
      { value: 'line', label: 'Line Chart', icon: <ShowChart /> },
      { value: 'bar', label: 'Bar Chart', icon: <BarChart /> },
      { value: 'scatter', label: 'Scatter Plot', icon: <ScatterPlot /> },
      { value: 'pie', label: 'Pie Chart', icon: <PieChart /> },
      { value: 'area', label: 'Area Chart', icon: <ShowChart /> }
    ],
    plotly: [
      { value: 'scatter', label: 'Scatter Plot', icon: <ScatterPlot /> },
      { value: 'bubble', label: 'Bubble Chart', icon: <ScatterPlot /> },
      { value: 'scatter3d', label: '3D Scatter', icon: <Insights /> },
      { value: 'heatmap', label: 'Heatmap', icon: <Insights /> },
      { value: 'contour', label: 'Contour Plot', icon: <Insights /> },
      { value: 'surface', label: '3D Surface', icon: <Insights /> }
    ]
  };

  const availableColumns = data && data.columns ? data.columns : [];
  const numericColumns = React.useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];
    return availableColumns.filter(col => {
      const sampleValue = data.data[0][col];
      return !isNaN(parseFloat(sampleValue)) && isFinite(sampleValue);
    });
  }, [availableColumns, data]);

  const generateId = () => `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addWidget = useCallback(() => {
    if (!newWidget.title || !newWidget.xAxis || !newWidget.yAxis) {
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
      chartType: 'line',
      library: 'recharts',
      title: '',
      xAxis: '',
      yAxis: '',
      zAxis: '',
      colorBy: '',
      sizeBy: ''
    });
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
        onClose={() => setAddWidgetOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Chart</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Chart Title"
              value={newWidget.title}
              onChange={(e) => setNewWidget(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a descriptive title for your chart"
            />
            
            <FormControl fullWidth>
              <InputLabel>Chart Library</InputLabel>
              <Select
                value={newWidget.library}
                label="Chart Library"
                onChange={(e) => setNewWidget(prev => ({ 
                  ...prev, 
                  library: e.target.value,
                  chartType: chartTypes[e.target.value][0].value 
                }))}
              >
                <MenuItem value="recharts">Recharts (Basic Charts)</MenuItem>
                <MenuItem value="plotly">Plotly (Advanced Charts)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={newWidget.chartType}
                label="Chart Type"
                onChange={(e) => setNewWidget(prev => ({ ...prev, chartType: e.target.value }))}
              >
                {chartTypes[newWidget.library].map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>X-Axis</InputLabel>
                <Select
                  value={newWidget.xAxis}
                  label="X-Axis"
                  onChange={(e) => setNewWidget(prev => ({ ...prev, xAxis: e.target.value }))}
                >
                  {availableColumns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Y-Axis</InputLabel>
                <Select
                  value={newWidget.yAxis}
                  label="Y-Axis"
                  onChange={(e) => setNewWidget(prev => ({ ...prev, yAxis: e.target.value }))}
                >
                  {newWidget.chartType === 'pie' ? availableColumns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  )) : numericColumns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {newWidget.library === 'plotly' && ['scatter3d', 'heatmap', 'contour', 'surface'].includes(newWidget.chartType) && (
              <FormControl fullWidth>
                <InputLabel>Z-Axis</InputLabel>
                <Select
                  value={newWidget.zAxis}
                  label="Z-Axis"
                  onChange={(e) => setNewWidget(prev => ({ ...prev, zAxis: e.target.value }))}
                >
                  {numericColumns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth>
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

              {(newWidget.chartType === 'scatter' || newWidget.chartType === 'bubble') && (
                <FormControl fullWidth>
                  <InputLabel>Size By (Optional)</InputLabel>
                  <Select
                    value={newWidget.sizeBy}
                    label="Size By (Optional)"
                    onChange={(e) => setNewWidget(prev => ({ ...prev, sizeBy: e.target.value }))}
                  >
                    <MenuItem value="">None</MenuItem>
                    {numericColumns.map(col => (
                      <MenuItem key={col} value={col}>{col}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddWidgetOpen(false)}>Cancel</Button>
          <Button 
            onClick={addWidget} 
            variant="contained"
            disabled={!newWidget.title || !newWidget.xAxis || !newWidget.yAxis}
          >
            Add Chart
          </Button>
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