import React, { useState, useCallback } from 'react';
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
  Tabs,
  Tab,
  Card,
  CardContent
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Download,
  BarChart,
  ShowChart,
  PieChart,
  ScatterPlot,
  Insights
} from '@mui/icons-material';
import ChartComponent from '../charts/ChartComponent';
import PlotlyChart from '../charts/PlotlyChart';
import ChartTypeGrid from '../charts/ChartTypeGrid';

// Custom TabPanel component
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, height: 'calc(100vh - 200px)' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Dashboard = ({ data, onExport }) => {
  const [widgets, setWidgets] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [addWidgetOpen, setAddWidgetOpen] = useState(false);
  const [editWidget, setEditWidget] = useState(null);
  const [dialogStep, setDialogStep] = useState(0); // 0: Chart type, 1: Configuration
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

    setWidgets(prev => {
      const newWidgets = [...prev, widget];
      setActiveTab(newWidgets.length - 1); // Switch to the new tab
      return newWidgets;
    });
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
    setDialogStep(0);
    setAddWidgetOpen(false);
  }, [newWidget]);

  const deleteWidget = useCallback((widgetId) => {
    setWidgets(prev => {
      const newWidgets = prev.filter(w => w.id !== widgetId);
      const deletedIndex = prev.findIndex(w => w.id === widgetId);
      
      // Adjust active tab if necessary
      if (deletedIndex === activeTab && activeTab > 0) {
        setActiveTab(activeTab - 1);
      } else if (deletedIndex < activeTab) {
        setActiveTab(activeTab - 1);
      } else if (newWidgets.length === 0) {
        setActiveTab(0);
      }
      
      return newWidgets;
    });
  }, [activeTab]);

  const updateWidget = useCallback((widgetId, updates) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, ...updates } : w
    ));
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const exportDashboard = useCallback(() => {
    const dashboardConfig = {
      widgets,
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
  }, [widgets, data]);

  const handleChartTypeSelect = (chartType) => {
    setNewWidget(prev => ({
      ...prev,
      chartType: chartType.value,
      library: chartType.library,
      title: chartType.label
    }));
    setDialogStep(1);
  };

  const handleDialogClose = () => {
    setAddWidgetOpen(false);
    setDialogStep(0);
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
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip icon={<Add />} label="Add Charts" variant="outlined" />
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

      {/* Dashboard Tabs */}
      {widgets.length > 0 ? (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }
              }}
            >
              {widgets.map((widget, index) => (
                <Tab
                  key={widget.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{widget.title}</span>
                      <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditWidget(widget);
                          }}
                          sx={{ 
                            p: 0.25, 
                            opacity: 0.7,
                            '&:hover': { opacity: 1 }
                          }}
                        >
                          <Edit fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteWidget(widget.id);
                          }}
                          color="error"
                          sx={{ 
                            p: 0.25, 
                            opacity: 0.7,
                            '&:hover': { opacity: 1 }
                          }}
                        >
                          <Delete fontSize="inherit" />
                        </IconButton>
                      </Box>
                    </Box>
                  }
                  id={`simple-tab-${index}`}
                  aria-controls={`simple-tabpanel-${index}`}
                />
              ))}
            </Tabs>
          </Box>
          
          {widgets.map((widget, index) => (
            <CustomTabPanel key={widget.id} value={activeTab} index={index}>
              <Paper 
                sx={{ 
                  height: '100%', 
                  width: '100%', 
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ 
                  flexGrow: 1, 
                  height: '100%',
                  '& > *': {
                    height: '100%'
                  }
                }}>
                  {renderWidget(widget)}
                </Box>
              </Paper>
            </CustomTabPanel>
          ))}
        </Box>
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
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {dialogStep === 0 && 'Select Chart Type'}
          {dialogStep === 1 && 'Configure Chart'}
        </DialogTitle>
        <DialogContent>
          {/* Step 0: Chart Type Selection */}
          {dialogStep === 0 && (
            <ChartTypeGrid
              onChartTypeSelect={handleChartTypeSelect}
            />
          )}

          {/* Step 1: Configuration */}
          {dialogStep === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="Chart Title"
                value={newWidget.title}
                onChange={(e) => setNewWidget(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter a descriptive title for your chart"
              />
              
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          {dialogStep > 0 && (
            <Button onClick={() => setDialogStep(dialogStep - 1)}>Back</Button>
          )}
          {dialogStep === 1 && (
            <Button 
              onClick={addWidget} 
              variant="contained"
              disabled={!newWidget.title || !newWidget.xAxis || !newWidget.yAxis}
            >
              Add Chart
            </Button>
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