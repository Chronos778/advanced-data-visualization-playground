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
    <Box sx={{ p: 3 }}>
      {/* Enhanced Dashboard Header */}
      <Paper className="modern-card" sx={{ 
        p: 4, 
        mb: 4,
        background: '#ffffff',
        border: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 800,
              color: '#000000',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              Visualization Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              Create and customize visual insights from your data
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={exportDashboard}
              disabled={widgets.length === 0}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                border: '2px solid #667eea',
                color: '#667eea',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.1)',
                  border: '2px solid #5a6acf',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  border: '2px solid #e2e8f0',
                  color: '#a0aec0'
                }
              }}
            >
              Export Dashboard
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddWidgetOpen(true)}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6acf 0%, #6b4489 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                }
              }}
            >
              Add Chart
            </Button>
          </Box>
        </Box>
        
        {/* Dashboard Stats */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BarChart sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {widgets.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Widgets
              </Typography>
            </Box>
          </Box>
          {data.fileName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Insights sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {data.fileName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Data Source
                </Typography>
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShowChart sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.main' }}>
                {data.data.length.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Data Points
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

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
        <Paper className="modern-card" sx={{ p: 8, textAlign: 'center', mt: 4 }}>
          <Box sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 4
          }}>
            <BarChart sx={{ fontSize: 60, color: '#667eea' }} />
          </Box>
          <Typography variant="h3" sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            Create Your First Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            Transform your data into beautiful, interactive visualizations. Start by adding your first chart to see insights come to life.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => setAddWidgetOpen(true)}
            sx={{
              px: 4,
              py: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
              fontSize: '1.1rem',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6acf 0%, #6b4489 100%)',
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)'
              }
            }}
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