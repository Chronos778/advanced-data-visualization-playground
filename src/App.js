import React, { useState, useRef, useEffect } from 'react';
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
  CircularProgress,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Upload,
  Analytics,
  TableView,
  Transform,
  Brightness4,
  Brightness7,
  GitHub,
  MoreVert,
  Delete,
  Storage
} from '@mui/icons-material';

// Import our components
import FileUploader from './components/dataProcessing/FileUploader';
import DataPreviewWithTransform from './components/dataProcessing/DataPreviewWithTransform';
import Dashboard from './components/dashboard/Dashboard';
import AIInsights from './components/insights/AIInsights';
import ExportManager from './utils/ExportManager';
import PersistenceManager from './utils/persistence';

function TabPanel({ children, value, index, ...other }) {
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
}

function App() {
  // Initialize state from localStorage
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [data, setData] = useState(null);
  const [transformedData, setTransformedData] = useState(null);
  const [dashboardState, setDashboardState] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const dashboardRef = useRef(null);

  // Load persisted state on app startup
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const persistedState = PersistenceManager.loadAppState();
        
        if (persistedState.data) {
          setData(persistedState.data);
          setSuccess(`Restored previous session with ${persistedState.data.fileName || 'your data'}`);
        }
        
        if (persistedState.transformedData) {
          setTransformedData(persistedState.transformedData);
        }
        
        if (persistedState.dashboardState) {
          setDashboardState(persistedState.dashboardState);
        }
        
        setCurrentTab(persistedState.currentTab);
        setDarkMode(persistedState.darkMode);
      } catch (error) {
        console.error('Error loading persisted state:', error);
        setError('Failed to restore previous session');
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedState();
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    if (!isLoading) {
      const saveState = () => {
        PersistenceManager.saveAppState({
          data,
          transformedData,
          currentTab,
          darkMode,
          dashboardState
        });
      };

      // Debounce saves to avoid excessive localStorage writes
      const timeoutId = setTimeout(saveState, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [data, transformedData, currentTab, darkMode, dashboardState, isLoading]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      h4: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 500,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : '#1976d2',
          },
        },
      },
    },
  });

  const handleDataLoaded = (newData) => {
    setData(newData);
    setTransformedData(null); // Reset transformed data when new data is loaded
    setDashboardState(null); // Reset dashboard when new data is loaded
    setSuccess(`Successfully loaded ${newData.fileName} with ${newData.rowCount} rows`);
    
    // Stay on the same tab - user can navigate manually
  };

  const handleDataTransformed = (newTransformedData) => {
    setTransformedData(newTransformedData);
    setDashboardState(null); // Reset dashboard when data is transformed
    setSuccess(`Data transformed: ${newTransformedData.filteredRowCount} of ${newTransformedData.originalRowCount} rows`);
  };

  const handleDashboardStateChange = (widgets, layout) => {
    setDashboardState({ widgets, layout });
  };

  const handleClearAllData = () => {
    PersistenceManager.clearAllData();
    setData(null);
    setTransformedData(null);
    setDashboardState(null);
    setCurrentTab(0);
    setMenuAnchor(null);
    setSuccess('All data cleared successfully');
  };

  const getStorageInfo = () => {
    return PersistenceManager.getStorageInfo();
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getCurrentData = () => {
    return transformedData || data;
  };

  const tabs = [
    { label: 'Upload Data', icon: <Upload />, disabled: false },
    { label: 'Data Preview', icon: <TableView />, disabled: !data },
    { label: 'Dashboard', icon: <DashboardIcon />, disabled: !data },
    { label: 'AI Insights', icon: <Analytics />, disabled: !data },
  ];

  // Show loading screen during initial load
  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          bgcolor: 'background.default'
        }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading your data...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {/* App Bar */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              📊 c.it
            </Typography>
            
            {data && (
              <Box sx={{ mr: 2 }}>
                <ExportManager
                  dashboardRef={dashboardRef}
                  widgets={[]} // This would be passed from Dashboard component
                  data={getCurrentData()}
                  layout={[]} // This would be passed from Dashboard component
                />
              </Box>
            )}
            
            <Tooltip title="Data Management">
              <IconButton 
                color="inherit" 
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{ mr: 1 }}
              >
                <MoreVert />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Toggle dark mode">
              <IconButton 
                color="inherit" 
                onClick={() => setDarkMode(!darkMode)}
                sx={{ mr: 1 }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="View on GitHub">
              <IconButton 
                color="inherit"
                component="a"
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHub />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          {/* Navigation Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                  disabled={tab.disabled}
                  sx={{ minHeight: 64 }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={currentTab} index={0}>
            <FileUploader
              onDataLoaded={handleDataLoaded}
              onError={handleError}
            />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <DataPreviewWithTransform
              data={getCurrentData()}
              title={transformedData ? "Transformed Data Preview" : "Data Preview"}
              onTransformedData={handleDataTransformed}
            />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <div ref={dashboardRef}>
              <Dashboard
                data={getCurrentData()}
                initialState={dashboardState}
                onStateChange={handleDashboardStateChange}
                onExport={(widgetId, format) => {
                  // Handle individual widget export
                  console.log(`Exporting widget ${widgetId} as ${format}`);
                }}
              />
            </div>
          </TabPanel>

          <TabPanel value={currentTab} index={3}>
            <AIInsights data={getCurrentData()} />
          </TabPanel>

          {/* Welcome Message */}
          {!data && currentTab === 0 && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom color="primary">
                Welcome to c.it
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Advanced data visualization platform with intelligent insights
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Alert severity="info" sx={{ textAlign: 'left' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Features:
                  </Typography>
                  <Typography variant="body2" component="div">
                    • Support for CSV, JSON, and Excel files<br/>
                    • Interactive drag-and-drop dashboard<br/>
                    • Advanced filtering and data transformation<br/>
                    • AI-powered insights and pattern recognition<br/>
                    • Multiple chart types (basic and advanced)<br/>
                    • Auto-save: Your data persists across sessions<br/>
                    • Export capabilities (PNG, PDF, JSON, CSV)
                  </Typography>
                </Alert>
              </Box>
            </Box>
          )}
        </Container>

        {/* Data Management Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => {
            const info = getStorageInfo();
            setSuccess(`Storage used: ${info.totalSizeMB} MB`);
            setMenuAnchor(null);
          }}>
            <Storage sx={{ mr: 1 }} />
            Storage Info
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={handleClearAllData}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} />
            Clear All Data
          </MenuItem>
        </Menu>

        {/* Snackbar for notifications */}
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess('')}
        >
          <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
