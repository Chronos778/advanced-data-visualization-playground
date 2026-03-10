import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import RGL, { WidthProvider } from 'react-grid-layout';
import {
  Box,
  Typography,
  Button,
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
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Snackbar
} from '@mui/material';
import {
  Add,
  Download,
  DragIndicator,
  BarChart,
  ShowChart,
  PieChart,
  ScatterPlot,
  Insights,
  Assessment,
  Save,
  DeleteSweep
} from '@mui/icons-material';
import ChartComponent from '../charts/ChartComponent';
import UnifiedChart from '../charts/UnifiedChart';
import ChartContainer from '../charts/ChartContainer';
import { useDashboardLayout } from '../../hooks/useDashboard';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(RGL);

const Dashboard = ({ data, onExport }) => {
  const {
    widgets,
    layout,
    setLayout,
    addWidget,
    updateWidget,
    deleteWidget,
    duplicateWidget,
    clearAll
  } = useDashboardLayout();

  const [addWidgetOpen, setAddWidgetOpen] = useState(false);
  const [editWidget, setEditWidget] = useState(null);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [isLayoutLocked, setIsLayoutLocked] = useState(false);
  const dashboardRef = useRef(null);

  const [newWidget, setNewWidget] = useState({
    type: 'chart',
    chartType: 'line',
    library: 'unified',
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
    unified: [
      { value: 'bar', label: 'Bar Chart', icon: <BarChart /> },
      { value: 'line', label: 'Line Chart', icon: <ShowChart /> },
      { value: 'area', label: 'Area Chart', icon: <ShowChart /> },
      { value: 'pie', label: 'Pie Chart', icon: <PieChart /> },
      { value: 'doughnut', label: 'Doughnut Chart', icon: <PieChart /> },
      { value: 'scatter', label: 'Scatter Plot', icon: <ScatterPlot /> },
      { value: 'bubble', label: 'Bubble Chart', icon: <ScatterPlot /> },
      { value: 'polarArea', label: 'Polar Area', icon: <Insights /> },
      { value: 'radar', label: 'Radar Chart', icon: <Assessment /> },
      { value: 'histogram', label: 'Histogram', icon: <BarChart /> },
      { value: 'boxplot', label: 'Box Plot', icon: <BarChart /> },
      { value: 'violin', label: 'Violin Plot', icon: <BarChart /> },
      { value: 'heatmap', label: 'Heatmap', icon: <Assessment /> },
      { value: 'treemap', label: 'Treemap', icon: <Assessment /> },
      { value: 'waterfall', label: 'Waterfall Chart', icon: <BarChart /> },
      { value: 'funnel', label: 'Funnel Chart', icon: <PieChart /> },
      { value: 'gauge', label: 'Gauge Chart', icon: <Assessment /> },
      { value: 'candlestick', label: 'Candlestick Chart', icon: <BarChart /> }
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

  const handleAddWidget = useCallback(() => {
    if (!newWidget.title || !newWidget.xAxis || !newWidget.yAxis) {
      setNotification({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'warning'
      });
      return;
    }

    const widget = {
      ...newWidget,
      config: {}
    };

    const widgetId = addWidget(widget);
    setNewWidget({
      type: 'chart',
      chartType: 'line',
      library: 'unified',
      title: '',
      xAxis: '',
      yAxis: '',
      zAxis: '',
      colorBy: '',
      sizeBy: ''
    });
    setAddWidgetOpen(false);
    setNotification({
      open: true,
      message: 'Chart added successfully!',
      severity: 'success'
    });
  }, [newWidget, addWidget]);

  const handleDeleteWidget = useCallback((widgetId) => {
    deleteWidget(widgetId);
    setNotification({
      open: true,
      message: 'Chart deleted',
      severity: 'info'
    });
  }, [deleteWidget]);

  const handleDuplicateWidget = useCallback((widgetId) => {
    duplicateWidget(widgetId);
    setNotification({
      open: true,
      message: 'Chart duplicated',
      severity: 'success'
    });
  }, [duplicateWidget]);

  const handleLayoutChange = useCallback((newLayout) => {
    if (!isLayoutLocked) {
      setLayout(newLayout);
    }
  }, [setLayout, isLayoutLocked]);

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

  const renderWidget = useCallback((widget) => {
    const widgetData = data;

    // Safety: Block 3D charts at the dashboard level
    const safeWidget = {
      ...widget,
      chartType: (widget.chartType === 'scatter3d' || widget.chartType === 'surface') ? 'scatter' : widget.chartType
    };

    // Determine chart status
    const hasData = widgetData && widgetData.data && widgetData.data.length > 0;
    const hasValidAxes = safeWidget.xAxis && safeWidget.yAxis;
    const status = !hasData ? 'error' : !hasValidAxes ? 'error' : 'ready';
    const error = !hasData ? 'No data available' : !hasValidAxes ? 'Missing axis configuration' : '';

    const chartElement = (() => {
      switch (safeWidget.type) {
        case 'chart':
          if (safeWidget.library === 'unified') {
            return (
              <UnifiedChart
                data={widgetData}
                chartType={safeWidget.chartType}
                title={safeWidget.title}
                xAxis={safeWidget.xAxis}
                yAxis={safeWidget.yAxis}
                colorBy={safeWidget.colorBy}
                sizeBy={safeWidget.sizeBy}
                config={safeWidget.config}
                onError={(error) => {
                  setNotification({
                    open: true,
                    message: `Chart error: ${error.message || 'Unknown error'}`,
                    severity: 'error'
                  });
                }}
              />
            );
          } else {
            return (
              <ChartComponent
                data={widgetData}
                chartType={safeWidget.chartType}
                title={safeWidget.title}
                xAxis={safeWidget.xAxis}
                yAxis={safeWidget.yAxis}
                colorBy={safeWidget.colorBy}
                chartConfig={safeWidget.config}
              />
            );
          }
        default:
          return <div>Unknown widget type</div>;
      }
    })();

    return (
      <ChartContainer
        title={safeWidget.title}
        chartType={safeWidget.chartType}
        status={status}
        error={error}
        config={safeWidget.config || {}}
        onEdit={() => setEditWidget(safeWidget)}
        onDelete={() => handleDeleteWidget(safeWidget.id)}
        onDuplicate={() => handleDuplicateWidget(safeWidget.id)}
        onExport={(format) => onExport && onExport(safeWidget.id, format)}
        onConfigChange={(config) => updateWidget(safeWidget.id, { config })}
      >
        {chartElement}
      </ChartContainer>
    );
  }, [data, updateWidget, handleDeleteWidget, handleDuplicateWidget, onExport]);



  if (!data || !data.data) {
    return (
      <Box sx={{ p: 6, textAlign: 'center', border: '2px solid black', backgroundColor: 'white' }}>
        <Typography variant="h3" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2 }}>
          DASHBOARD_LOCKED
        </Typography>
        <Box sx={{ p: 2, border: '2px solid black', display: 'inline-block', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            UPLOAD_DATA_TO_INITIALIZE
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Chip icon={<Add />} label="ADD_CHARTS" sx={{ borderRadius: 0, border: '2px solid black', backgroundColor: 'transparent', fontWeight: 'bold' }} />
          <Chip icon={<DragIndicator />} label="DRAG_AND_DROP" sx={{ borderRadius: 0, border: '2px solid black', backgroundColor: 'transparent', fontWeight: 'bold' }} />
          <Chip icon={<Download />} label="EXPORT_DASHBOARD" sx={{ borderRadius: 0, border: '2px solid black', backgroundColor: 'transparent', fontWeight: 'bold' }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, backgroundColor: 'transparent' }}>
      {/* Enhanced Dashboard Header */}
      <Box sx={{
        p: 4,
        mb: 4,
        backgroundColor: 'white',
        border: '2px solid black'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h3" sx={{
              fontWeight: 800,
              color: 'black',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1
            }}>
              Visualization Dashboard
            </Typography>
            <Typography variant="subtitle1" color="black" sx={{ fontWeight: 'bold' }}>
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
                borderRadius: 0,
                border: '2px solid black',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'black',
                  color: 'white',
                  border: '2px solid black',
                },
                '&:disabled': {
                  borderColor: 'rgba(0,0,0,0.3)',
                  color: 'rgba(0,0,0,0.3)'
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
                borderRadius: 0,
                border: '2px solid black',
                backgroundColor: 'black',
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'black',
                  boxShadow: 'none',
                  border: '2px solid black'
                }
              }}
            >
              Add Chart
            </Button>
          </Box>
        </Box>

        {/* Dashboard Stats */}
        <Box sx={{ display: 'flex', gap: 0, borderTop: '2px solid black', mx: -4, mb: -4, borderBottom: '0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, borderRight: '2px solid black', flex: 1 }}>
            <Box sx={{ border: '2px solid black', p: 1, display: 'flex' }}>
              <BarChart sx={{ color: 'black', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ letterSpacing: '0.1em', fontWeight: 'bold' }}>WIDGETS</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{widgets.length}</Typography>
            </Box>
          </Box>
          {data.fileName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, borderRight: '2px solid black', flex: 1, minWidth: 0 }}>
              <Box sx={{ border: '2px solid black', p: 1, display: 'flex' }}>
                <Insights sx={{ color: 'black', fontSize: 24 }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ letterSpacing: '0.1em', fontWeight: 'bold' }}>DATA_SOURCE</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase' }} noWrap>{data.fileName}</Typography>
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, flex: 1 }}>
            <Box sx={{ border: '2px solid black', p: 1, display: 'flex' }}>
              <ShowChart sx={{ color: 'black', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ letterSpacing: '0.1em', fontWeight: 'bold' }}>DATA_POINTS</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{data.data.length.toLocaleString()}</Typography>
            </Box>
          </Box>
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
            <Box key={widget.id}>
              {renderWidget(widget)}
            </Box>
          ))}
        </ResponsiveGridLayout>
      ) : (
        <Box sx={{ p: 8, textAlign: 'center', mt: 4, border: '2px solid black', backgroundColor: 'white' }}>
          <Box sx={{
            width: 120,
            height: 120,
            border: '4px solid black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 4
          }}>
            <BarChart sx={{ fontSize: 60, color: 'black' }} />
          </Box>
          <Typography variant="h2" sx={{
            fontWeight: 800,
            textTransform: 'uppercase',
            color: 'black',
            mb: 2,
            letterSpacing: '0.02em'
          }}>
            SYSTEM_INITIALIZED
          </Typography>
          <Typography variant="h6" color="black" sx={{ mb: 4, maxWidth: 500, mx: 'auto', fontFamily: '"IBM Plex Mono", monospace' }}>
            Transform your data into structural insight. Add your first grid element.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => setAddWidgetOpen(true)}
            sx={{
              px: 4,
              py: 2,
              borderRadius: 0,
              border: '2px solid black',
              backgroundColor: 'black',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'black',
                boxShadow: 'none',
                border: '2px solid black'
              }
            }}
          >
            Create Chart Block
          </Button>
        </Box>
      )}

      {/* Add Widget Dialog */}
      <Dialog
        open={addWidgetOpen}
        onClose={() => setAddWidgetOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 0, border: '2px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid black', pb: 2 }}>ADD_NEW_CHART</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
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
                <MenuItem value="unified">Chart.js (Modern Charts)</MenuItem>
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
        <DialogActions sx={{ borderTop: '2px solid black', p: 2 }}>
          <Button
            onClick={() => setAddWidgetOpen(false)}
            sx={{ borderRadius: 0, color: 'black', fontWeight: 'bold' }}
          >
            CANCEL
          </Button>
          <Button
            onClick={handleAddWidget}
            variant="contained"
            disabled={!newWidget.title || !newWidget.xAxis || !newWidget.yAxis}
            sx={{
              borderRadius: 0,
              backgroundColor: 'black',
              color: 'white',
              fontWeight: 'bold',
              border: '2px solid black',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'black',
                boxShadow: 'none'
              }
            }}
          >
            ADD_CHART
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Widget Dialog */}
      <Dialog
        open={Boolean(editWidget)}
        onClose={() => setEditWidget(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 0, border: '2px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid black', pb: 2 }}>EDIT_CHART</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
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
        <DialogActions sx={{ borderTop: '2px solid black', p: 2 }}>
          <Button
            onClick={() => setEditWidget(null)}
            sx={{ borderRadius: 0, color: 'black', fontWeight: 'bold' }}
          >
            CANCEL
          </Button>
          <Button
            onClick={() => {
              updateWidget(editWidget.id, editWidget);
              setEditWidget(null);
            }}
            variant="contained"
            sx={{
              borderRadius: 0,
              backgroundColor: 'black',
              color: 'white',
              fontWeight: 'bold',
              border: '2px solid black',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'black',
                boxShadow: 'none'
              }
            }}
          >
            SAVE_CHANGES
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced SpeedDial for Dashboard Actions */}
      <SpeedDial
        ariaLabel="Dashboard actions"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        icon={<SpeedDialIcon />}
        open={speedDialOpen}
        onOpen={() => setSpeedDialOpen(true)}
        onClose={() => setSpeedDialOpen(false)}
      >
        <SpeedDialAction
          icon={<Add />}
          tooltipTitle="Add Chart"
          onClick={() => {
            setAddWidgetOpen(true);
            setSpeedDialOpen(false);
          }}
        />
        <SpeedDialAction
          icon={<Save />}
          tooltipTitle="Save Dashboard"
          onClick={() => {
            exportDashboard();
            setSpeedDialOpen(false);
          }}
        />
        <SpeedDialAction
          icon={<DragIndicator />}
          tooltipTitle={isLayoutLocked ? "Unlock Layout" : "Lock Layout"}
          onClick={() => {
            setIsLayoutLocked(!isLayoutLocked);
            setNotification({
              open: true,
              message: `Layout ${isLayoutLocked ? 'unlocked' : 'locked'}`,
              severity: 'info'
            });
            setSpeedDialOpen(false);
          }}
        />
        <SpeedDialAction
          icon={<DeleteSweep />}
          tooltipTitle="Clear All"
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all charts?')) {
              clearAll();
              setNotification({
                open: true,
                message: 'Dashboard cleared',
                severity: 'info'
              });
            }
            setSpeedDialOpen(false);
          }}
        />
      </SpeedDial>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

Dashboard.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.arrayOf(PropTypes.string),
    fileName: PropTypes.string,
    rowCount: PropTypes.number
  }),
  onExport: PropTypes.func
};

Dashboard.defaultProps = {
  onExport: () => { }
};

export default React.memo(Dashboard);
