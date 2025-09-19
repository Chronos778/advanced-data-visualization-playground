import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  ThemeProvider,
  createTheme,
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
import {
  Dashboard as DashboardIcon,
  Upload,
  TableView,
  Transform,
  Brightness4,
  Brightness7,
  GitHub,
  AutoAwesome
} from '@mui/icons-material';
import './App.css';

// Import our components
import FileUploader from './components/dataProcessing/FileUploader';
import DataPreview from './components/dataProcessing/DataPreview';
import DataTransformer from './components/dataProcessing/DataTransformer';
import Dashboard from './components/dashboard/Dashboard';
import AIInsights from './components/insights/AIInsights';
import ExportManager from './utils/ExportManager';

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
  const [darkMode, setDarkMode] = useState(false);
  const dashboardRef = useRef(null);

  // Memoize theme to prevent recreation on every render
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb',
      },
      secondary: {
        main: '#64748b',
        light: '#94a3b8',
        dark: '#475569',
      },
      background: {
        default: darkMode ? '#0f172a' : '#f8fafc',
        paper: darkMode ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#f1f5f9' : '#0f172a',
        secondary: darkMode ? '#94a3b8' : '#64748b',
      },
      divider: darkMode ? '#334155' : '#e2e8f0',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      h4: {
        fontWeight: 700,
        color: '#0f172a',
      },
      h5: {
        fontWeight: 600,
        color: '#0f172a',
      },
      h6: {
        fontWeight: 600,
        color: '#0f172a',
      },
      body1: {
        color: '#64748b',
        fontWeight: 500,
      },
      body2: {
        color: '#94a3b8',
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 8,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            color: '#0f172a',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            color: '#64748b',
            '&.Mui-selected': {
              color: '#3b82f6',
              fontWeight: 600,
            },
          },
        },
      },
    },
  }), [darkMode]); // Add darkMode as dependency

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
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Box className="app-content">
          {/* Enhanced App Bar */}
          <AppBar position="static" elevation={0} className="app-header-glass">
            <Toolbar sx={{ py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <AutoAwesome sx={{ mr: 2, color: 'white', fontSize: 28 }} />
                <Typography 
                  variant="h6" 
                  component="div" 
                  className="glass-text"
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Advanced Data Visualization Playground
                </Typography>
              </Box>
              
              {data && (
                <Box sx={{ mr: 2 }}>
                  <ExportManager
                    dashboardRef={dashboardRef}
                    widgets={[]}
                    data={getCurrentData()}
                    layout={[]}
                  />
                </Box>
              )}
              
              <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
                <IconButton 
                  className="glass-button"
                  onClick={() => setDarkMode(!darkMode)}
                  sx={{ mr: 1 }}
                >
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="View on GitHub">
                <IconButton 
                  className="glass-button"
                  component="a"
                  href="https://github.com/Chronos778/advanced-data-visualization-playground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHub />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>

          {/* Enhanced Tab Navigation */}
          <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Paper className="modern-tabs slide-in-up" elevation={0}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  },
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    icon={tab.icon}
                    label={tab.label}
                    disabled={tab.disabled}
                    className={`modern-tab ${currentTab === index ? 'Mui-selected' : ''}`}
                    sx={{
                      '&.Mui-disabled': {
                        color: 'rgba(255, 255, 255, 0.3) !important',
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Paper>
          </Container>

          {/* Enhanced Tab Content */}
          <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
            {/* Tab Panels */}
            <TabPanel value={currentTab} index={0}>
              <Paper className="glass-panel slide-in-up">
                <FileUploader
                  onDataLoaded={handleDataLoaded}
                  onError={handleError}
                />
              </Paper>
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <Paper className="glass-panel slide-in-up">
                <DataPreview
                  data={getCurrentData()}
                  title={transformedData ? "Transformed Data Preview" : "Data Preview"}
                />
              </Paper>
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <Paper className="glass-panel slide-in-up">
                <DataTransformer
                  data={data}
                  onTransformedData={handleDataTransformed}
                />
              </Paper>
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              <div ref={dashboardRef}>
                <Dashboard
                  data={getCurrentData()}
                  onExport={(widgetId, format) => {
                    console.log(`Exporting widget ${widgetId} as ${format}`);
                  }}
                />
              </div>
            </TabPanel>

            <TabPanel value={currentTab} index={4}>
              <Paper className="glass-panel slide-in-up">
                <AIInsights data={getCurrentData()} />
              </Paper>
            </TabPanel>

            {/* Enhanced Welcome Message */}
            {!data && currentTab === 0 && (
              <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Box className="pulse-animation" sx={{ mb: 4 }}>
                  <AutoAwesome sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.8)' }} />
                </Box>
                <Typography 
                  variant="h3" 
                  className="glass-text"
                  sx={{ 
                    mb: 2,
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #fff, #e3f2fd, #f3e5f5)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Welcome to the Future of Data
                </Typography>
                <Typography 
                  variant="h6" 
                  className="glass-text-secondary"
                  sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
                >
                  Transform your data into stunning visualizations with AI-powered insights
                </Typography>
                
                <Paper className="glass-card" sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
                  <Typography variant="h6" className="glass-text" sx={{ mb: 3 }}>
                    ✨ What You Can Do
                  </Typography>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                    gap: 3,
                    textAlign: 'left'
                  }}>
                    <Box>
                      <Typography variant="subtitle1" className="glass-text" sx={{ fontWeight: 600, mb: 1 }}>
                        📊 Advanced Visualizations
                      </Typography>
                      <Typography variant="body2" className="glass-text-secondary">
                        Create stunning charts with Plotly.js and Recharts in one unified dashboard
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" className="glass-text" sx={{ fontWeight: 600, mb: 1 }}>
                        🤖 AI-Powered Insights
                      </Typography>
                      <Typography variant="body2" className="glass-text-secondary">
                        Discover patterns and correlations automatically
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" className="glass-text" sx={{ fontWeight: 600, mb: 1 }}>
                        🎯 Interactive Dashboard
                      </Typography>
                      <Typography variant="body2" className="glass-text-secondary">
                        Drag, drop, and resize charts in a flexible grid layout
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" className="glass-text" sx={{ fontWeight: 600, mb: 1 }}>
                        📁 Multiple Formats
                      </Typography>
                      <Typography variant="body2" className="glass-text-secondary">
                        Support for CSV, JSON, Excel files and more
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
          </Container>

          {/* Enhanced Notifications */}
          <Snackbar
            open={!!success}
            autoHideDuration={6000}
            onClose={() => setSuccess('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={() => setSuccess('')} 
              severity="success" 
              className="glass-card"
              sx={{ 
                width: '100%',
                color: 'white',
                '& .MuiAlert-icon': { color: 'white' }
              }}
            >
              {success}
            </Alert>
          </Snackbar>

          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={() => setError('')} 
              severity="error" 
              className="glass-card"
              sx={{ 
                width: '100%',
                color: 'white',
                '& .MuiAlert-icon': { color: 'white' }
              }}
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
