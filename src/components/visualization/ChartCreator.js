import React, { useState, useCallback, useMemo } from 'react';
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
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Chip,
  Menu,
  MenuItem as MenuItemComponent,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  ContentCopy,
  MoreVert,
  Fullscreen,
  BarChart,
  ShowChart,
  PieChart,
  ScatterPlot,
  Timeline,
  Close
} from '@mui/icons-material';
import ChartComponent from '../charts/ChartComponent';
import PlotlyChart from '../charts/PlotlyChart';

const ChartCreator = ({ uploadedFiles, cleanedData }) => {
  const [charts, setCharts] = useState([]);
  const [currentChartTab, setCurrentChartTab] = useState(0);
  const [addChartOpen, setAddChartOpen] = useState(false);
  const [newChart, setNewChart] = useState({
    type: 'recharts',
    chartType: 'line',
    title: '',
    xAxis: '',
    yAxis: '',
    zAxis: '',
    colorBy: '',
    sizeBy: '',
    dataSource: null
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuChartId, setMenuChartId] = useState(null);
  const [expandedChart, setExpandedChart] = useState(null);

  // Memoize data sources to prevent recalculation
  const dataSources = useMemo(() => {
    const sources = [];
    if (uploadedFiles && uploadedFiles.length > 0) {
      uploadedFiles.forEach(file => {
        sources.push({ value: file.id, label: file.fileName, data: file });
      });
    }
    if (cleanedData) {
      sources.push({ value: 'cleaned', label: 'Cleaned Data', data: cleanedData });
    }
    return sources;
  }, [uploadedFiles, cleanedData]);

  // Memoize data columns to prevent recalculation
  const dataColumns = useMemo(() => {
    if (!newChart.dataSource) return [];
    
    const dataSource = dataSources.find(source => source.value === newChart.dataSource);
    if (!dataSource || !dataSource.data) return [];
    
    return dataSource.data.columns || [];
  }, [newChart.dataSource, dataSources]);

  // Memoize chart types to prevent recreation
  const chartTypes = useMemo(() => ({
    recharts: [
      { value: 'line', label: 'Line Chart', icon: <ShowChart />, description: 'Time series and trend analysis' },
      { value: 'bar', label: 'Bar Chart', icon: <BarChart />, description: 'Compare categories' },
      { value: 'area', label: 'Area Chart', icon: <Timeline />, description: 'Show cumulative values' },
      { value: 'pie', label: 'Pie Chart', icon: <PieChart />, description: 'Show proportions' },
      { value: 'scatter', label: 'Scatter Plot', icon: <ScatterPlot />, description: 'Show correlations' }
    ],
    plotly: [
      { value: 'scatter', label: 'Scatter Plot', icon: <ScatterPlot />, description: 'Basic scatter with customization', requiresZ: false },
      { value: 'scatter3d', label: '3D Scatter', icon: <ScatterPlot />, description: '3D scatter plot', requiresZ: true },
      { value: 'line', label: 'Line Chart', icon: <ShowChart />, description: 'Interactive line charts', requiresZ: false },
      { value: 'bar', label: 'Bar Chart', icon: <BarChart />, description: 'Interactive bar charts', requiresZ: false },
      { value: 'surface', label: '3D Surface', icon: <Timeline />, description: '3D surface plot', requiresZ: true },
      { value: 'heatmap', label: 'Heatmap', icon: <Timeline />, description: '2D heat map', requiresZ: false },
      { value: 'contour', label: 'Contour Plot', icon: <Timeline />, description: 'Contour lines', requiresZ: true },
      { value: 'bubble', label: 'Bubble Chart', icon: <ScatterPlot />, description: 'Size-encoded scatter', requiresZ: false },
      { value: 'violin', label: 'Violin Plot', icon: <BarChart />, description: 'Distribution shape', requiresZ: false },
      { value: 'box', label: 'Box Plot', icon: <BarChart />, description: 'Statistical summary', requiresZ: false },
      { value: 'histogram', label: 'Histogram', icon: <BarChart />, description: 'Value distribution', requiresZ: false },
      { value: 'parallel', label: 'Parallel Coordinates', icon: <ShowChart />, description: 'Multi-dimensional data', requiresZ: false }
    ]
  }), []);

  // Helper functions
  const getDataSources = useCallback(() => dataSources, [dataSources]);
  const getDataColumns = useCallback(() => dataColumns, [dataColumns]);

  const generateId = () => `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addChart = useCallback(() => {
    // Basic validation - title and data source are always required
    if (!newChart.title || !newChart.dataSource) {
      return;
    }

    // Chart type specific validation
    const chartTypeInfo = chartTypes[newChart.type]?.find(t => t.value === newChart.chartType);
    
    // Most charts need both X and Y axis
    let isValid = true;
    
    if (['histogram'].includes(newChart.chartType)) {
      // Histogram only needs X-axis
      isValid = !!newChart.xAxis;
    } else if (['violin', 'box'].includes(newChart.chartType)) {
      // Violin and box plots only need Y-axis
      isValid = !!newChart.yAxis;
    } else {
      // Most charts need both X and Y axis
      isValid = !!(newChart.xAxis && newChart.yAxis);
    }

    // 3D charts need Z-axis
    if (chartTypeInfo?.requiresZ && !newChart.zAxis) {
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const dataSource = dataSources.find(source => source.value === newChart.dataSource);
    
    const chart = {
      id: generateId(),
      ...newChart,
      data: dataSource.data,
      created: new Date().toISOString()
    };

    setCharts(prev => [...prev, chart]);
    setCurrentChartTab(charts.length); // Switch to new chart tab
    setAddChartOpen(false);
    setNewChart({
      type: 'recharts',
      chartType: 'line',
      title: '',
      xAxis: '',
      yAxis: '',
      zAxis: '',
      colorBy: '',
      sizeBy: '',
      dataSource: null
    });
  }, [newChart, charts.length, dataSources]);

  const removeChart = useCallback((chartId) => {
    const chartIndex = charts.findIndex(chart => chart.id === chartId);
    setCharts(prev => prev.filter(chart => chart.id !== chartId));
    
    // Adjust current tab if necessary
    if (chartIndex <= currentChartTab && currentChartTab > 0) {
      setCurrentChartTab(prev => prev - 1);
    } else if (charts.length === 1) {
      setCurrentChartTab(0);
    }
  }, [charts, currentChartTab]);

  const duplicateChart = useCallback((chartId) => {
    const chart = charts.find(chart => chart.id === chartId);
    if (chart) {
      const duplicatedChart = {
        ...chart,
        id: generateId(),
        title: `${chart.title} (Copy)`,
        created: new Date().toISOString()
      };
      setCharts(prev => [...prev, duplicatedChart]);
      setCurrentChartTab(charts.length); // Switch to duplicated chart
    }
  }, [charts]);

  const handleMenuOpen = useCallback((event, chartId) => {
    setAnchorEl(event.currentTarget);
    setMenuChartId(chartId);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setMenuChartId(null);
  }, []);

  const handleExpandChart = useCallback((chart) => {
    setExpandedChart(chart);
    handleMenuClose();
  }, [handleMenuClose]);

  // Memoize chart rendering to prevent unnecessary re-renders
  const renderChart = useCallback((chart) => {
    if (chart.type === 'plotly') {
      return (
        <PlotlyChart
          data={chart.data}
          chartType={chart.chartType}
          xAxis={chart.xAxis}
          yAxis={chart.yAxis}
          zAxis={chart.zAxis}
          colorBy={chart.colorBy}
          sizeBy={chart.sizeBy}
          title={chart.title}
        />
      );
    } else {
      return (
        <ChartComponent
          data={chart.data}
          chartType={chart.chartType}
          xAxis={chart.xAxis}
          yAxis={chart.yAxis}
          title={chart.title}
        />
      );
    }
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Chart Tabs Header */}
      <Card className="clean-card" sx={{ mb: 3 }}>
        <CardContent sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" className="text-primary" sx={{ fontWeight: 600 }}>
              📈 Chart Workspace
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddChartOpen(true)}
              className="btn-primary"
              disabled={!uploadedFiles?.length && !cleanedData}
            >
              Add Chart
            </Button>
          </Box>

          {/* Chart Tabs */}
          {charts.length > 0 && (
            <Paper elevation={0} sx={{ backgroundColor: '#f8fafc', borderRadius: 2 }}>
              <Tabs
                value={currentChartTab}
                onChange={(event, newValue) => setCurrentChartTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    minHeight: 48,
                    color: '#64748b',
                    '&.Mui-selected': {
                      color: '#3b82f6',
                      fontWeight: 600,
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#3b82f6',
                  },
                }}
              >
                {charts.map((chart, index) => (
                  <Tab
                    key={chart.id}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                          {chart.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={chart.chartType}
                          sx={{ 
                            height: 20, 
                            fontSize: '0.7rem',
                            backgroundColor: '#e2e8f0',
                            color: '#64748b'
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuOpen(e, chart.id);
                          }}
                          sx={{ ml: 1, p: 0.5 }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* Chart Content */}
      {charts.length > 0 ? (
        <Card className="dashboard-card">
          <CardContent sx={{ p: 4 }}>
            {charts[currentChartTab] && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Typography variant="h5" className="text-primary" sx={{ fontWeight: 600 }}>
                      {charts[currentChartTab].title}
                    </Typography>
                    <Typography variant="body2" className="text-secondary">
                      {charts[currentChartTab].chartType} chart • Created {new Date(charts[currentChartTab].created).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Tooltip title="Expand Chart">
                    <IconButton 
                      onClick={() => handleExpandChart(charts[currentChartTab])}
                      className="btn-secondary"
                    >
                      <Fullscreen />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Box sx={{ height: 400, width: '100%' }}>
                  {renderChart(charts[currentChartTab])}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="clean-card" sx={{ p: 6, textAlign: 'center' }}>
          <BarChart sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
          <Typography variant="h6" className="text-primary" sx={{ mb: 1 }}>
            No Charts Created Yet
          </Typography>
          <Typography variant="body2" className="text-secondary" sx={{ mb: 3 }}>
            Create your first chart to start visualizing your data
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddChartOpen(true)}
            className="btn-primary"
            disabled={!uploadedFiles?.length && !cleanedData}
          >
            Create First Chart
          </Button>
        </Card>
      )}

      {/* Chart Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItemComponent onClick={() => { handleExpandChart(charts.find(c => c.id === menuChartId)); }}>
          <Fullscreen sx={{ mr: 1 }} />
          Expand
        </MenuItemComponent>
        <MenuItemComponent onClick={() => { duplicateChart(menuChartId); handleMenuClose(); }}>
          <ContentCopy sx={{ mr: 1 }} />
          Duplicate
        </MenuItemComponent>
        <Divider />
        <MenuItemComponent 
          onClick={() => { removeChart(menuChartId); handleMenuClose(); }}
          sx={{ color: '#ef4444' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItemComponent>
      </Menu>

      {/* Add Chart Dialog */}
      <Dialog 
        open={addChartOpen} 
        onClose={() => setAddChartOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-primary">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Create New Chart
            </Typography>
            <Chip 
              label={newChart.type === 'plotly' ? 'Plotly (Advanced)' : 'Recharts (Simple)'} 
              color={newChart.type === 'plotly' ? 'primary' : 'secondary'}
              size="small"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {/* Help Text */}
            <Paper sx={{ p: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Typography variant="body2" color="text.secondary">
                💡 <strong>Quick Guide:</strong> Choose Recharts for simple charts or Plotly for advanced 3D visualizations with interactive features.
                {newChart.type === 'plotly' && ' Plotly supports Z-axis, color coding, and size encoding for complex data exploration.'}
              </Typography>
            </Paper>

            <TextField
              label="Chart Title"
              value={newChart.title}
              onChange={(e) => setNewChart(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
              required
            />

            <FormControl fullWidth>
              <InputLabel>Data Source</InputLabel>
              <Select
                value={newChart.dataSource || ''}
                onChange={(e) => setNewChart(prev => ({ ...prev, dataSource: e.target.value }))}
              >
                {getDataSources().map((source) => (
                  <MenuItem key={source.value} value={source.value}>
                    {source.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Chart Library</InputLabel>
              <Select
                value={newChart.type}
                onChange={(e) => setNewChart(prev => ({ ...prev, type: e.target.value }))}
              >
                <MenuItem value="recharts">Recharts</MenuItem>
                <MenuItem value="plotly">Plotly</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={newChart.chartType}
                onChange={(e) => setNewChart(prev => ({ ...prev, chartType: e.target.value }))}
              >
                {chartTypes[newChart.type]?.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      {type.icon}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {type.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type.description}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>X-Axis Column</InputLabel>
              <Select
                value={newChart.xAxis}
                onChange={(e) => setNewChart(prev => ({ ...prev, xAxis: e.target.value }))}
              >
                {getDataColumns().map((column) => (
                  <MenuItem key={column} value={column}>
                    {column}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Y-Axis Column</InputLabel>
              <Select
                value={newChart.yAxis}
                onChange={(e) => setNewChart(prev => ({ ...prev, yAxis: e.target.value }))}
              >
                {getDataColumns().map((column) => (
                  <MenuItem key={column} value={column}>
                    {column}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Additional Plotly Options */}
            {newChart.type === 'plotly' && (
              <>
                {/* Z-Axis for 3D charts */}
                {chartTypes.plotly.find(t => t.value === newChart.chartType)?.requiresZ && (
                  <FormControl fullWidth>
                    <InputLabel>Z-Axis Column (3D)</InputLabel>
                    <Select
                      value={newChart.zAxis}
                      onChange={(e) => setNewChart(prev => ({ ...prev, zAxis: e.target.value }))}
                    >
                      <MenuItem value="">None</MenuItem>
                      {getDataColumns().map((column) => (
                        <MenuItem key={column} value={column}>
                          {column}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* Color By Column */}
                <FormControl fullWidth>
                  <InputLabel>Color By (Optional)</InputLabel>
                  <Select
                    value={newChart.colorBy}
                    onChange={(e) => setNewChart(prev => ({ ...prev, colorBy: e.target.value }))}
                  >
                    <MenuItem value="">None</MenuItem>
                    {getDataColumns().map((column) => (
                      <MenuItem key={column} value={column}>
                        {column}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Size By Column */}
                {['scatter', 'scatter3d', 'bubble'].includes(newChart.chartType) && (
                  <FormControl fullWidth>
                    <InputLabel>Size By (Optional)</InputLabel>
                    <Select
                      value={newChart.sizeBy}
                      onChange={(e) => setNewChart(prev => ({ ...prev, sizeBy: e.target.value }))}
                    >
                      <MenuItem value="">Fixed Size</MenuItem>
                      {getDataColumns().map((column) => (
                        <MenuItem key={column} value={column}>
                          {column}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddChartOpen(false)} className="btn-secondary">
            Cancel
          </Button>
          <Button 
            onClick={addChart} 
            variant="contained" 
            className="btn-primary"
            disabled={!newChart.title || !newChart.xAxis || !newChart.yAxis || !newChart.dataSource}
          >
            Create Chart
          </Button>
        </DialogActions>
      </Dialog>

      {/* Expanded Chart Dialog */}
      <Dialog
        open={Boolean(expandedChart)}
        onClose={() => setExpandedChart(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" className="text-primary">
            {expandedChart?.title}
          </Typography>
          <IconButton onClick={() => setExpandedChart(null)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ height: 'calc(100% - 64px)' }}>
          {expandedChart && (
            <Box sx={{ height: '100%', width: '100%' }}>
              {renderChart(expandedChart)}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ChartCreator;