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
  Alert,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Download
} from '@mui/icons-material';
import ChartComponent from '../charts/ChartComponent';
import PlotlyChart from '../charts/PlotlyChart';
import RawGraphsChart from '../charts/RawGraphsChart';
import ChartTypeGrid from '../charts/ChartTypeGrid';
import DynamicChartConfig from '../charts/DynamicChartConfig';
import { validateChartConfig } from '../charts/ChartConfigurations';

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
    title: ''
  });


  const availableColumns = data && data.columns ? data.columns : [];
  const numericColumns = React.useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];
    return availableColumns.filter(col => {
      const sampleValue = data.data[0][col];
      return !isNaN(parseFloat(sampleValue)) && isFinite(sampleValue);
    });
  }, [availableColumns, data]);

  const dateColumns = React.useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];
    return availableColumns.filter(col => {
      const sampleValue = data.data[0][col];
      return !isNaN(Date.parse(sampleValue));
    });
  }, [availableColumns, data]);

  const generateId = () => `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addWidget = useCallback(() => {
    // Use dynamic validation from ChartConfigurations
    if (!validateChartConfig(newWidget.chartType, newWidget)) {
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
      title: ''
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
      title: ''
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
        } else if (widget.library === 'rawgraphs') {
          return (
            <RawGraphsChart
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
            <DynamicChartConfig
              chartType={newWidget.chartType}
              config={newWidget}
              onConfigChange={(updates) => setNewWidget(prev => ({ ...prev, ...updates }))}
              availableColumns={availableColumns}
              numericColumns={numericColumns}
              dateColumns={dateColumns}
            />
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
              disabled={!validateChartConfig(newWidget.chartType, newWidget)}
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
            <DynamicChartConfig
              chartType={editWidget.chartType}
              config={editWidget}
              onConfigChange={(updates) => setEditWidget(prev => ({ ...prev, ...updates }))}
              availableColumns={availableColumns}
              numericColumns={numericColumns}
              dateColumns={dateColumns}
            />
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
            disabled={editWidget && !validateChartConfig(editWidget.chartType, editWidget)}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;