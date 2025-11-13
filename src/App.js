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
  ];

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <div className="App">
        <Box className="app-content">
        {/* Simple App Bar with minimalistic design */}
        <AppBar 
          position="sticky" 
          elevation={0}
          role="banner"
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box 
                sx={{ 
                  p: 1.5, 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
                aria-label="DataViz Pro Logo"
                className="glow-animation"
              >
                <Assessment sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography 
                  variant="h5" 
                  component="h1"
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary',
                    background: 'linear-gradient(135deg, #ffffff 0%, #b4b4c6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  DataViz Pro
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ fontWeight: 500 }}
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
                  sx={{ 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': { 
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      borderColor: 'rgba(102, 126, 234, 0.4)'
                    }
                  }}
                >
                  <GitHub />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
          
          {/* Simple Tabs */}
          <Box sx={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
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
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontWeight: 500,
                  textTransform: 'none',
                  borderRadius: '4px 4px 0 0',
                  margin: '0 2px',
                  transition: 'all 0.3s ease',
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: 'text.primary',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
                  },
                  '&:hover:not(.Mui-selected)': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'text.primary'
                  }
                },
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  height: 3
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

          {/* Enhanced Tab Content with animations */}
          <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
            {/* Tab Panels with minimalist styling */}
            <TabPanel value={currentTab} index={0}>
              <ErrorBoundary>
                <Paper className="card">
                  <FileUploader
                    onDataLoaded={handleDataLoaded}
                    onError={handleError}
                  />
                </Paper>
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <ErrorBoundary>
                <Paper className="card">
                  <DataPreview
                    data={getCurrentData()}
                    title={transformedData ? "Transformed Data Preview" : "Data Preview"}
                  />
                </Paper>
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <ErrorBoundary>
                <Paper className="card">
                  <DataTransformer
                    data={data}
                    onTransformedData={handleDataTransformed}
                  />
                </Paper>
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              <ErrorBoundary>
                <div className="card">
                  <Dashboard
                    data={getCurrentData()}
                    onExport={(widgetId, format) => {
                      setSuccess(`Exporting widget ${widgetId} as ${format}`);
                    }}
                  />
                </div>
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={4}>
              <ErrorBoundary>
                <Paper className="card">
                  <AIInsights data={getCurrentData()} />
                </Paper>
              </ErrorBoundary>
            </TabPanel>

            {/* Enhanced Welcome Message with modern design */}
            {!data && currentTab === 0 && (
              <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Box className="float-animation" sx={{ mb: 6 }}>
                  <Box sx={{ 
                    display: 'inline-block',
                    p: 3,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)'
                  }}
                  className="glow-animation"
                  >
                    <AutoAwesome sx={{ fontSize: 64, color: 'white' }} />
                  </Box>
                </Box>
                
                <Typography 
                  variant="h2" 
                  className="glass-text"
                  sx={{ 
                    mb: 3,
                    fontWeight: 900,
                    letterSpacing: '-0.025em',
                    background: 'linear-gradient(135deg, #ffffff 0%, #b4b4c6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Welcome to DataViz Pro
                </Typography>
                
                <Typography 
                  variant="h5" 
                  className="glass-text-secondary"
                  sx={{ 
                    mb: 6, 
                    maxWidth: 700, 
                    mx: 'auto',
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: 'text.secondary'
                  }}
                >
                  Transform your data into stunning visualizations with AI-powered insights and advanced analytics
                </Typography>
                
                <Paper 
                  className="modern-card" 
                  sx={{ 
                    p: 6, 
                    maxWidth: 900, 
                    mx: 'auto',
                    borderRadius: 4
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2
                    }}
                  >
                    <AutoAwesome />
                    Platform Features
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                    gap: 4,
                    textAlign: 'left'
                  }}>
                    <Box className="modern-card" sx={{ 
                      p: 3, 
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      color: 'white' 
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assessment />
                        Advanced Visualizations
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                        Create stunning charts with Plotly.js and Recharts in one unified dashboard with drag-and-drop functionality
                      </Typography>
                    </Box>
                    
                    <Box className="modern-card" sx={{ 
                      p: 3, 
                      background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.2) 0%, rgba(245, 87, 108, 0.2) 100%)',
                      border: '1px solid rgba(240, 147, 251, 0.3)',
                      color: 'white' 
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoAwesome />
                        AI-Powered Insights
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                        Discover patterns and correlations automatically with Google's Gemini AI integration
                      </Typography>
                    </Box>
                    
                    <Box className="modern-card" sx={{ 
                      p: 3, 
                      background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%)',
                      border: '1px solid rgba(79, 172, 254, 0.3)',
                      color: 'white' 
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timeline />
                        Interactive Dashboard
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                        Drag, drop, and resize charts in a flexible grid layout with real-time data transformations
                      </Typography>
                    </Box>
                    
                    <Box className="modern-card" sx={{ 
                      p: 3, 
                      background: 'linear-gradient(135deg, rgba(250, 112, 154, 0.2) 0%, rgba(254, 225, 64, 0.2) 100%)',
                      border: '1px solid rgba(250, 112, 154, 0.3)',
                      color: 'white' 
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Upload />
                        Multiple Formats
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                        Support for CSV, JSON, Excel files and more with advanced data processing capabilities
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      Ready to start? Upload your data file to begin exploring!
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Box className="modern-card" sx={{ 
                        p: 1.5, 
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.3)'
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#667eea' }}>
                          📊 CSV Files
                        </Typography>
                      </Box>
                      <Box className="modern-card" sx={{ 
                        p: 1.5, 
                        background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.15) 100%)',
                        border: '1px solid rgba(79, 172, 254, 0.3)'
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#4facfe' }}>
                          📋 Excel Files
                        </Typography>
                      </Box>
                      <Box className="modern-card" sx={{ 
                        p: 1.5, 
                        background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(245, 87, 108, 0.15) 100%)',
                        border: '1px solid rgba(240, 147, 251, 0.3)'
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#f093fb' }}>
                          🔗 JSON Data
                        </Typography>
                      </Box>
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
              sx={{ 
                width: '100%',
                background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(79, 172, 254, 0.3)',
                color: 'white'
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
              sx={{ 
                width: '100%',
                background: 'linear-gradient(135deg, rgba(245, 87, 108, 0.2) 0%, rgba(240, 147, 251, 0.2) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(245, 87, 108, 0.3)',
                color: 'white'
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
