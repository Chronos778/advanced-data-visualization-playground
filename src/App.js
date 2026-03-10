import React, { useState, useCallback } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Typography,
  Container,
  Box,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
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

const DRAWER_WIDTH = 280;

// Memoize TabPanel to prevent unnecessary re-renders
const TabPanel = React.memo(({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{ height: '100%', display: value === index ? 'block' : 'none' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 3, md: 5 }, height: '100%' }} className="animate-reveal">
          {children}
        </Box>
      )}
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
    setCurrentTab(1); // Auto-switch to data preview tab
  }, []);

  const handleDataTransformed = useCallback((newTransformedData) => {
    setTransformedData(newTransformedData);
    setSuccess(`Data transformed: ${newTransformedData.filteredRowCount} of ${newTransformedData.originalRowCount} rows`);
  }, []);

  const handleError = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  const handleTabChange = useCallback((index) => {
    setCurrentTab(index);
  }, []);

  const getCurrentData = () => {
    return transformedData || data;
  };

  const navItems = [
    { label: 'Ingest.Data', icon: <Upload fontSize="small" />, disabled: false, id: '01' },
    { label: 'View.Matrix', icon: <TableView fontSize="small" />, disabled: !data, id: '02' },
    { label: 'Transform.Sets', icon: <Transform fontSize="small" />, disabled: !data, id: '03' },
    { label: 'Render.Charts', icon: <DashboardIcon fontSize="small" />, disabled: !data, id: '04' },
    { label: 'Neural.Insights', icon: <AutoAwesome fontSize="small" />, disabled: !data, id: '05' },
    { label: 'Deep.Analytics', icon: <Assessment fontSize="small" />, disabled: !data, id: '06' },
    { label: 'Live.Stream', icon: <Timeline fontSize="small" />, disabled: false, id: '07' },
  ];

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>

        {/* Swiss Grid Command Rail (Sidebar) */}
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3
            },
          }}
        >
          <Box>
            {/* Massive Typographic Header */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h2" sx={{ mb: 1 }}>
                DATAVIZ
                <br />
                PRO.
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 4, letterSpacing: '0.1em' }}>
                {'//'} ANALYTICS_TERMINAL_V2
              </Typography>
              <Box sx={{ height: '2px', width: '40px', bgcolor: 'primary.main', mb: 4 }} />
            </Box>

            {/* Navigation Rail */}
            <List sx={{ p: 0, gap: 1, display: 'flex', flexDirection: 'column' }}>
              {navItems.map((item, index) => {
                const isSelected = currentTab === index;
                return (
                  <ListItem key={item.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleTabChange(index)}
                      disabled={item.disabled}
                      sx={{
                        py: 1.5,
                        px: 2,
                        border: '1px solid',
                        borderColor: isSelected ? 'primary.main' : 'transparent',
                        bgcolor: isSelected ? 'background.default' : 'transparent',
                        opacity: item.disabled ? 0.3 : 1,
                        '&:hover': {
                          bgcolor: 'background.default',
                          borderColor: !item.disabled && !isSelected ? 'text.secondary' : isSelected ? 'primary.main' : 'transparent',
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          variant: 'button',
                          color: isSelected ? 'primary.main' : 'text.secondary'
                        }}
                      />
                      <Typography variant="caption" sx={{ opacity: 0.5 }}>{item.id}</Typography>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* Footer Metadata */}
          <Box sx={{ borderTop: '1px solid black', pt: 3 }}>
            <Tooltip title="Source Repository">
              <IconButton
                component="a"
                href="https://github.com/Chronos778/advanced-data-visualization-playground"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ border: '1px solid black', p: 1 }}
              >
                <GitHub fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="caption" sx={{ display: 'block', mt: 2 }}>
              STATUS: {data ? 'ONLINE' : 'AWAITING_DATA'}
            </Typography>
          </Box>
        </Drawer>

        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

          {/* Header Strip for current context context */}
          <Box sx={{
            borderBottom: '1px solid black',
            bgcolor: 'background.paper',
            py: 2,
            px: { xs: 3, md: 5 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6" sx={{ letterSpacing: '0.2em' }}>
              {navItems[currentTab].label}
            </Typography>
            {data && (
              <Typography variant="caption" sx={{ bgcolor: 'black', color: 'white', px: 1, py: 0.5 }}>
                {data.rowCount} ROWS LOADED
              </Typography>
            )}
          </Box>

          {/* Scrollable Content Container */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: 'background.default' }}>

            {/* Welcome Screen (Empty State) */}
            {!data && currentTab === 0 && (
              <Container maxWidth="md" sx={{ mt: { xs: 5, md: 10 } }} className="animate-reveal stagger-1">
                <Box sx={{ border: '2px solid black', bgcolor: 'background.paper', p: { xs: 4, md: 8 } }}>
                  <Typography variant="h1" sx={{ mb: 2, borderBottom: '2px solid black', pb: 2 }}>
                    THE FORGE.
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 6, color: 'text.secondary' }}>
                    A precision instrument for structural data analysis.
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 6 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: 3, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                      <Typography variant="h6">01.</Typography>
                      <Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>INGEST VOLUME</Typography>
                        <Typography variant="body1">Upload dimensional datasets via CSV, JSON, or XLS. Strict validation protocols enforced.</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: 3, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                      <Typography variant="h6">02.</Typography>
                      <Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>APPLY TRANSFORMATIONS</Typography>
                        <Typography variant="body1">Filter, aggregate, and compute new dimensions. Maintain absolute data integrity.</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: 3, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                      <Typography variant="h6">03.</Typography>
                      <Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>SYNTHESIZE MODELS</Typography>
                        <Typography variant="body1">Generate rigid, precise visual matrices using Plotly and Recharts engines.</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ p: 4, bgcolor: 'background.default', border: '2px solid black' }}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
                      [ ACTION_REQUIRED : UPLOAD_DATASET ]
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <FileUploader onDataLoaded={handleDataLoaded} onError={handleError} />
                    </Box>
                  </Box>
                </Box>
              </Container>
            )}

            {/* Active Component Views */}
            {data && currentTab === 0 && (
              <TabPanel value={currentTab} index={0}>
                <Typography variant="h3" sx={{ mb: 4 }}>DATA_INGESTION</Typography>
                <FileUploader onDataLoaded={handleDataLoaded} onError={handleError} />
              </TabPanel>
            )}

            <TabPanel value={currentTab} index={1}>
              <ErrorBoundary>
                <DataPreview data={getCurrentData()} title={transformedData ? "DATA_MATRIX [TRANSFORMED]" : "DATA_MATRIX [RAW]"} />
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <ErrorBoundary>
                <DataTransformer data={data} onTransformedData={handleDataTransformed} />
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              <ErrorBoundary>
                <Box sx={{ border: '2px solid black', bgcolor: 'background.paper', height: '100%', minHeight: '800px' }}>
                  <Dashboard data={getCurrentData()} onExport={(wId, fmt) => setSuccess(`Export initialized: [${wId}] as ${fmt}`)} />
                </Box>
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={4}>
              <ErrorBoundary>
                <AIInsights data={getCurrentData()} />
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={5}>
              <ErrorBoundary>
                <AdvancedAnalytics data={getCurrentData()} />
              </ErrorBoundary>
            </TabPanel>

            <TabPanel value={currentTab} index={6}>
              <ErrorBoundary>
                <RealTimeDataStream
                  onDataUpdate={(newData) => {
                    if (data) {
                      setData({
                        ...data,
                        data: [...data.data, newData],
                        rowCount: data.rowCount + 1
                      });
                    }
                  }}
                />
              </ErrorBoundary>
            </TabPanel>

          </Box>
        </Box>

        {/* Notifications */}
        <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert onClose={() => setSuccess('')} severity="success" variant="filled" sx={{ bgcolor: 'black', color: 'white', borderRadius: 0, '& .MuiAlert-icon': { color: '#00CC44 !important' } }}>
            {success}
          </Alert>
        </Snackbar>

        <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert onClose={() => setError('')} severity="error" variant="filled" sx={{ borderRadius: 0 }}>
            {error}
          </Alert>
        </Snackbar>

      </Box>
    </ThemeProvider>
  );
}

export default App;
