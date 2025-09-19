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
  const dashboardRef = useRef(null);

  // Minimalistic black and white theme
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#000000',
        light: '#333333',
        dark: '#000000',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#666666',
        light: '#999999',
        dark: '#333333',
        contrastText: '#ffffff',
      },
      background: {
        default: '#ffffff',
        paper: '#ffffff',
      },
      text: {
        primary: '#000000',
        secondary: '#666666',
      },
      divider: '#e0e0e0',
      error: {
        main: '#000000',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#666666',
        contrastText: '#ffffff',
      },
      info: {
        main: '#333333',
        contrastText: '#ffffff',
      },
      success: {
        main: '#000000',
        contrastText: '#ffffff',
      },
    },
    components: {
      // Override Material-UI component defaults
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: '#000000',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#333333',
            },
          },
          contained: {
            backgroundColor: '#000000',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#333333',
            },
          },
          outlined: {
            borderColor: '#000000',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#f5f5f5',
              borderColor: '#333333',
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            '& .MuiTab-root': {
              color: '#666666',
              '&.Mui-selected': {
                color: '#000000',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#000000',
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: '#666666',
            '&.Mui-selected': {
              color: '#000000',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: '#f5f5f5',
            color: '#000000',
            '& .MuiChip-deleteIcon': {
              color: '#666666',
            },
          },
          filled: {
            backgroundColor: '#000000',
            color: '#ffffff',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#000000',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#ffffff',
            color: '#000000',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      h4: {
        fontWeight: 700,
        color: '#000000',
      },
      h5: {
        fontWeight: 600,
        color: '#000000',
      },
      h6: {
        fontWeight: 600,
        color: '#000000',
      },
      body1: {
        color: '#333333',
        fontWeight: 500,
      },
      body2: {
        color: '#666666',
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 4,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderRadius: 4,
            border: '1px solid #cccccc',
            backgroundColor: '#ffffff',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 4,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: '#ffffff',
            borderBottom: '1px solid #cccccc',
            boxShadow: 'none',
            color: '#000000',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            color: '#666666',
            '&.Mui-selected': {
              color: '#000000',
              fontWeight: 600,
            },
          },
        },
      },
    },
  }), []); // Removed darkMode dependency since we only have light theme

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
        {/* Simple App Bar with minimalistic design */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            background: '#ffffff',
            borderBottom: '1px solid #cccccc',
            color: '#000000'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: '4px', 
                background: '#000000',
                color: 'white'
              }}>
                <Assessment sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#000000'
                  }}
                >
                  DataViz Pro
                </Typography>
                <Typography variant="caption" color="#666666" sx={{ fontWeight: 500 }}>
                  Advanced Analytics Platform
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="View on GitHub">
                <IconButton 
                  component="a" 
                  href="https://github.com/your-repo" 
                  target="_blank"
                  sx={{ 
                    color: '#000000',
                    border: '1px solid #cccccc',
                    '&:hover': { 
                      backgroundColor: '#f5f5f5'
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
            background: '#ffffff',
            borderTop: '1px solid #cccccc'
          }}>
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
                  transition: 'all 0.2s ease',
                  color: '#666666',
                  '&.Mui-selected': {
                    background: '#ffffff',
                    color: '#000000',
                    fontWeight: 600,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  },
                  '&:hover:not(.Mui-selected)': {
                    background: '#f8f8f8',
                    color: '#333333'
                  }
                },
                '& .MuiTabs-indicator': {
                  background: '#000000',
                  height: 2
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
              <Paper className="card">
                <FileUploader
                  onDataLoaded={handleDataLoaded}
                  onError={handleError}
                />
              </Paper>
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <Paper className="card">
                <DataPreview
                  data={getCurrentData()}
                  title={transformedData ? "Transformed Data Preview" : "Data Preview"}
                />
              </Paper>
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <Paper className="card">
                <DataTransformer
                  data={data}
                  onTransformedData={handleDataTransformed}
                />
              </Paper>
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              <div className="card">
                <Dashboard
                  data={getCurrentData()}
                  onExport={(widgetId, format) => {
                    console.log(`Exporting widget ${widgetId} as ${format}`);
                  }}
                />
              </div>
            </TabPanel>

            <TabPanel value={currentTab} index={4}>
              <Paper className="card">
                <AIInsights data={getCurrentData()} />
              </Paper>
            </TabPanel>

            {/* Enhanced Welcome Message with modern design */}
            {!data && currentTab === 0 && (
              <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Box className="float-animation" sx={{ mb: 6 }}>
                  <Box sx={{ 
                    display: 'inline-block',
                    p: 3,
                    borderRadius: '50%',
                    background: '#000000',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                  }}>
                    <AutoAwesome sx={{ fontSize: 64, color: 'white' }} />
                  </Box>
                </Box>
                
                <Typography 
                  variant="h2" 
                  className="glass-text text-gradient"
                  sx={{ 
                    mb: 3,
                    fontWeight: 900,
                    letterSpacing: '-0.025em',
                    color: '#000000',
                    textShadow: 'none'
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
                  className="glass-card modern-card" 
                  sx={{ 
                    p: 6, 
                    maxWidth: 900, 
                    mx: 'auto',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 4
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4,
                      fontWeight: 700,
                      color: 'primary.main',
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
                    <Box className="modern-card" sx={{ p: 3, background: '#000000', color: 'white' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assessment />
                        Advanced Visualizations
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        Create stunning charts with Plotly.js and Recharts in one unified dashboard with drag-and-drop functionality
                      </Typography>
                    </Box>
                    
                    <Box className="modern-card" sx={{ p: 3, background: '#333333', color: 'white' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoAwesome />
                        AI-Powered Insights
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        Discover patterns and correlations automatically with Google's Gemini AI integration
                      </Typography>
                    </Box>
                    
                    <Box className="modern-card" sx={{ p: 3, background: '#666666', color: 'white' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timeline />
                        Interactive Dashboard
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        Drag, drop, and resize charts in a flexible grid layout with real-time data transformations
                      </Typography>
                    </Box>
                    
                    <Box className="modern-card" sx={{ p: 3, background: '#999999', color: 'white' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Upload />
                        Multiple Formats
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        Support for CSV, JSON, Excel files and more with advanced data processing capabilities
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 6, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      Ready to start? Upload your data file to begin exploring!
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Box className="modern-card" sx={{ p: 1.5, background: '#f5f5f5' }}>
                        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                          📊 CSV Files
                        </Typography>
                      </Box>
                      <Box className="modern-card" sx={{ p: 1.5, background: '#f5f5f5' }}>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                          📋 Excel Files
                        </Typography>
                      </Box>
                      <Box className="modern-card" sx={{ p: 1.5, background: '#f5f5f5' }}>
                        <Typography variant="body2" color="info.main" sx={{ fontWeight: 600 }}>
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
