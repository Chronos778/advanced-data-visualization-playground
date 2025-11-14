import React, { useState, useCallback } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import appTheme from './theme/appTheme';
import {
  Dashboard as DashboardIcon,
  Upload,
  TableView,
  Transform,
  GitHub,
  AutoAwesome,
  Assessment,
  Timeline
} from '@mui/icons-material';
import './App.css';

// Import our components
import FileUploader from './components/dataProcessing/FileUploader';
import DataPreview from './components/dataProcessing/DataPreview';
import DataTransformer from './components/dataProcessing/DataTransformer';
import Dashboard from './components/dashboard/Dashboard';
import AIInsights from './components/insights/AIInsights';
import AdvancedAnalytics from './components/insights/AdvancedAnalytics';
import RealTimeDataStream from './components/dataProcessing/RealTimeDataStream';
import ErrorBoundary from './components/common/ErrorBoundary';

// Memoize TabPanel to prevent unnecessary re-renders
const TabPanel = React.memo(({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
});

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [data, setData] = useState(null);
  const [transformedData, setTransformedData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Memoize event handlers to prevent unnecessary re-renders
  const handleDataLoaded = useCallback((newData) => {
    setData(newData);
    setTransformedData(null); // Reset transformed data when new data is loaded
    setSuccess(`Successfully loaded ${newData.fileName} with ${newData.rowCount} rows`);
    
    // Auto-switch to data preview tab
    setCurrentTab(1);
  }, []);

  const handleDataTransformed = useCallback((newTransformedData) => {
    setTransformedData(newTransformedData);
    setSuccess(`Data transformed: ${newTransformedData.filteredRowCount} of ${newTransformedData.originalRowCount} rows`);
  }, []);

  const handleError = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  const handleTabChange = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const getCurrentData = () => {
    return transformedData || data;
  };

  const tabs = [
    { label: 'Upload Data', icon: <Upload />, disabled: false },
    { label: 'Preview Data', icon: <TableView />, disabled: !data },
    { label: 'Transform Data', icon: <Transform />, disabled: !data },
    { label: 'Charts & Dashboard', icon: <DashboardIcon />, disabled: !data },
    { label: 'AI Insights', icon: <AutoAwesome />, disabled: !data },
    { label: 'Advanced Analytics', icon: <Assessment />, disabled: !data },
    { label: 'Real-Time Stream', icon: <Timeline />, disabled: false },
  ];

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <div className="App">
        <Box className="app-content">
        {/* TradingView-style App Bar */}
        <AppBar 
          position="sticky" 
          elevation={0}
          role="banner"
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1.5, minHeight: 56 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box 
                sx={{ 
                  p: 1, 
                  borderRadius: '4px', 
                  background: '#2962FF',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="DataViz Pro Logo"
              >
                <Assessment sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography 
                  variant="h6" 
                  component="h1"
                  sx={{ 
                    fontWeight: 500, 
                    color: 'text.primary',
                    fontSize: '16px',
                    lineHeight: 1.2
                  }}
                >
                  DataViz Pro
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ fontWeight: 400, fontSize: '11px' }}
                  component="p"
                >
                  Advanced Analytics Platform
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="View on GitHub">
                <IconButton 
                  component="a" 
                  href="https://github.com/Chronos778/advanced-data-visualization-playground" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source code on GitHub"
                >
                  <GitHub />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
          
          {/* TradingView-style Tabs */}
          <Box sx={{ 
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
          role="navigation"
          aria-label="Main navigation tabs"
          >
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 48,
                '& .MuiTab-root': {
                  minHeight: 48,
                  fontWeight: 400,
                  textTransform: 'none',
                  fontSize: '13px',
                  px: 3,
                  transition: 'color 0.2s ease',
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'text.primary',
                    fontWeight: 500
                  },
                  '&:hover:not(.Mui-selected)': {
                    color: 'text.primary'
                  }
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab.icon}
                      <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                        {tab.label}
                      </Typography>
                    </Box>
                  }
                  disabled={tab.disabled}
                  sx={{ 
                    opacity: tab.disabled ? 0.5 : 1,
                    minWidth: 160
                  }}
                />
              ))}
            </Tabs>
          </Box>
        </AppBar>

          {/* Tab Content */}
          <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            <TabPanel value={currentTab} index={0}>
              <ErrorBoundary>
                <Paper elevation={0}>
                  <FileUploader
                    onDataLoaded={handleDataLoaded}
                    onError={handleError}
                  />
                </Paper>
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <ErrorBoundary>
                <Paper elevation={0}>
                  <DataPreview
                    data={getCurrentData()}
                    title={transformedData ? "Transformed Data Preview" : "Data Preview"}
                  />
                </Paper>
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <ErrorBoundary>
                <Paper elevation={0}>
                  <DataTransformer
                    data={data}
                    onTransformedData={handleDataTransformed}
                  />
                </Paper>
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              <ErrorBoundary>
                <Paper elevation={0} sx={{ p: 0 }}>
                  <Dashboard
                    data={getCurrentData()}
                    onExport={(widgetId, format) => {
                      setSuccess(`Exporting widget ${widgetId} as ${format}`);
                    }}
                  />
                </Paper>
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={4}>
              <ErrorBoundary>
                <Paper elevation={0}>
                  <AIInsights data={getCurrentData()} />
                </Paper>
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={5}>
              <ErrorBoundary>
                <Paper elevation={0}>
                  <AdvancedAnalytics data={getCurrentData()} />
                </Paper>
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={6}>
              <ErrorBoundary>
                <Paper elevation={0}>
                  <RealTimeDataStream 
                    onDataUpdate={(newData) => {
                      // Merge real-time data with existing data
                      if (data) {
                        const updatedData = {
                          ...data,
                          data: [...data.data, newData],
                          rowCount: data.rowCount + 1
                        };
                        setData(updatedData);
                      }
                    }}
                  />
                </Paper>
              </ErrorBoundary>
            </TabPanel>

            {/* Welcome Message */}
            {!data && currentTab === 0 && (
              <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ 
                    p: 3,
                    borderRadius: '8px',
                    background: '#2962FF',
                    display: 'inline-flex'
                  }}>
                    <AutoAwesome sx={{ fontSize: 48, color: 'white' }} />
                  </Box>
                </Box>
                
                <Typography 
                  variant="h3" 
                  sx={{ 
                    mb: 2,
                    fontWeight: 500,
                    color: 'text.primary'
                  }}
                >
                  Welcome to DataViz Pro
                </Typography>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4, 
                    maxWidth: 600, 
                    mx: 'auto',
                    color: 'text.secondary',
                    lineHeight: 1.6
                  }}
                >
                  Transform your data into stunning visualizations with AI-powered insights and advanced analytics
                </Typography>
                
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    maxWidth: 900, 
                    mx: 'auto',
                    mt: 4
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 3,
                      fontWeight: 500,
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1
                    }}
                  >
                    <AutoAwesome sx={{ color: 'primary.main' }} />
                    Platform Features
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                    gap: 2,
                    textAlign: 'left'
                  }}>
                    <Box sx={{ 
                      p: 3, 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '4px',
                      background: 'background.paper'
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                        <Assessment sx={{ fontSize: 20 }} />
                        Advanced Visualizations
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                        Create stunning charts with Plotly.js and Recharts in one unified dashboard with drag-and-drop functionality
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      p: 3, 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '4px',
                      background: 'background.paper'
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                        <AutoAwesome sx={{ fontSize: 20 }} />
                        AI-Powered Insights
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                        Discover patterns and correlations automatically with Google's Gemini AI integration
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      p: 3, 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '4px',
                      background: 'background.paper'
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                        <Timeline sx={{ fontSize: 20 }} />
                        Interactive Dashboard
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                        Drag, drop, and resize charts in a flexible grid layout with real-time data transformations
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      p: 3, 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '4px',
                      background: 'background.paper'
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                        <Upload sx={{ fontSize: 20 }} />
                        Multiple Formats
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                        Support for CSV, JSON, Excel files and more with advanced data processing capabilities
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Ready to start? Upload your data file to begin exploring!
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ 
                        px: 2,
                        py: 0.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '4px',
                        background: 'background.paper'
                      }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          📊 CSV Files
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        px: 2,
                        py: 0.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '4px',
                        background: 'background.paper'
                      }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          📋 Excel Files
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        px: 2,
                        py: 0.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '4px',
                        background: 'background.paper'
                      }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          🔗 JSON Data
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
          </Container>

          {/* Notifications */}
          <Snackbar
            open={!!success}
            autoHideDuration={4000}
            onClose={() => setSuccess('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={() => setSuccess('')} 
              severity="success"
            >
              {success}
            </Alert>
          </Snackbar>

          <Snackbar
            open={!!error}
            autoHideDuration={5000}
            onClose={() => setError('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={() => setError('')} 
              severity="error"
            >
              {error}
            </Alert>
          </Snackbar>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
