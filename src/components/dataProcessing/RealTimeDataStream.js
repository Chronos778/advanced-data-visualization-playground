import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Refresh,
  Settings,
  TrendingUp,
  Speed,
  Timeline,
  Download,
  Share,
  Notifications
} from '@mui/icons-material';

/**
 * Real-time Data Streaming Component
 * Supports WebSocket connections, auto-refresh, and live updates
 */
const RealTimeDataStream = ({ onDataUpdate, initialData = null }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamSource, setStreamSource] = useState('websocket'); // websocket, api, simulation
  const [websocketUrl, setWebsocketUrl] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [dataPoints, setDataPoints] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // idle, connecting, connected, error
  const [metrics, setMetrics] = useState({
    messagesReceived: 0,
    lastUpdate: null,
    dataRate: 0,
    latency: 0
  });

  const wsRef = useRef(null);
  const intervalRef = useRef(null);
  const metricsIntervalRef = useRef(null);
  const lastMessageTimeRef = useRef(null);
  const messageCountRef = useRef(0);

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    try {
      setStatus('connecting');
      wsRef.current = new WebSocket(websocketUrl);

      wsRef.current.onopen = () => {
        setStatus('connected');
        setError('');
        console.log('WebSocket connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const now = Date.now();
          
          // Update metrics
          messageCountRef.current++;
          if (lastMessageTimeRef.current) {
            const latency = now - lastMessageTimeRef.current;
            setMetrics(prev => ({
              messagesReceived: messageCountRef.current,
              lastUpdate: new Date(),
              dataRate: prev.dataRate * 0.9 + (1000 / latency) * 0.1, // Moving average
              latency: prev.latency * 0.9 + latency * 0.1
            }));
          }
          lastMessageTimeRef.current = now;

          // Update data
          setDataPoints(prev => [...prev, { ...data, timestamp: now }]);
          if (onDataUpdate) {
            onDataUpdate(data);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      wsRef.current.onerror = (error) => {
        setError('WebSocket error occurred');
        setStatus('error');
        console.error('WebSocket error:', error);
      };

      wsRef.current.onclose = () => {
        setStatus('idle');
        console.log('WebSocket disconnected');
      };
    } catch (err) {
      setError(`Failed to connect: ${err.message}`);
      setStatus('error');
    }
  }, [websocketUrl, onDataUpdate]);

  // API polling
  const startApiPolling = useCallback(() => {
    setStatus('connected');
    
    const poll = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const now = Date.now();
        
        messageCountRef.current++;
        setMetrics(prev => ({
          messagesReceived: messageCountRef.current,
          lastUpdate: new Date(),
          dataRate: 1000 / refreshInterval,
          latency: 0
        }));
        
        setDataPoints(prev => [...prev, { ...data, timestamp: now }]);
        if (onDataUpdate) {
          onDataUpdate(data);
        }
      } catch (err) {
        setError(`API polling error: ${err.message}`);
        setStatus('error');
      }
    };

    poll(); // Initial poll
    intervalRef.current = setInterval(poll, refreshInterval);
  }, [apiUrl, refreshInterval, onDataUpdate]);

  // Simulated data stream
  const startSimulation = useCallback(() => {
    setStatus('connected');
    
    const simulate = () => {
      const simulatedData = {
        value: Math.random() * 100,
        category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
        trend: Math.sin(Date.now() / 1000) * 50 + 50,
        noise: Math.random() * 10
      };
      
      const now = Date.now();
      messageCountRef.current++;
      
      setMetrics(prev => ({
        messagesReceived: messageCountRef.current,
        lastUpdate: new Date(),
        dataRate: 1000 / refreshInterval,
        latency: 0
      }));
      
      setDataPoints(prev => [...prev, { ...simulatedData, timestamp: now }]);
      if (onDataUpdate) {
        onDataUpdate(simulatedData);
      }
    };

    simulate(); // Initial data
    intervalRef.current = setInterval(simulate, refreshInterval);
  }, [refreshInterval, onDataUpdate]);

  // Start streaming
  const handleStart = useCallback(() => {
    setIsStreaming(true);
    setDataPoints([]);
    messageCountRef.current = 0;
    setError('');

    switch (streamSource) {
      case 'websocket':
        if (!websocketUrl) {
          setError('Please enter a WebSocket URL');
          setIsStreaming(false);
          return;
        }
        connectWebSocket();
        break;
      case 'api':
        if (!apiUrl) {
          setError('Please enter an API URL');
          setIsStreaming(false);
          return;
        }
        startApiPolling();
        break;
      case 'simulation':
        startSimulation();
        break;
      default:
        setError('Invalid stream source');
        setIsStreaming(false);
    }
  }, [streamSource, websocketUrl, apiUrl, connectWebSocket, startApiPolling, startSimulation]);

  // Stop streaming
  const handleStop = useCallback(() => {
    setIsStreaming(false);
    setStatus('idle');
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Clear data
  const handleClear = useCallback(() => {
    setDataPoints([]);
    messageCountRef.current = 0;
    setMetrics({
      messagesReceived: 0,
      lastUpdate: null,
      dataRate: 0,
      latency: 0
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
    };
  }, []);

  // Export data
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(dataPoints, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `realtime-data-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [dataPoints]);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Timeline sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h5" sx={{ flex: 1, fontWeight: 600 }}>
          Real-Time Data Streaming
        </Typography>
        <Chip 
          label={status.toUpperCase()} 
          color={status === 'connected' ? 'success' : status === 'error' ? 'error' : 'default'}
          icon={<Notifications />}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stream Metrics */}
      {isStreaming && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Messages</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {metrics.messagesReceived.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Data Rate</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {metrics.dataRate.toFixed(1)} <small>msg/s</small>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Latency</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {metrics.latency.toFixed(0)} <small>ms</small>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Last Update</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {metrics.lastUpdate ? metrics.lastUpdate.toLocaleTimeString() : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Configuration */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Stream Source</InputLabel>
          <Select
            value={streamSource}
            onChange={(e) => setStreamSource(e.target.value)}
            disabled={isStreaming}
          >
            <MenuItem value="websocket">WebSocket</MenuItem>
            <MenuItem value="api">API Polling</MenuItem>
            <MenuItem value="simulation">Simulation (Demo)</MenuItem>
          </Select>
        </FormControl>

        {streamSource === 'websocket' && (
          <TextField
            fullWidth
            label="WebSocket URL"
            value={websocketUrl}
            onChange={(e) => setWebsocketUrl(e.target.value)}
            disabled={isStreaming}
            placeholder="ws://localhost:8080/stream"
            sx={{ mb: 2 }}
          />
        )}

        {streamSource === 'api' && (
          <TextField
            fullWidth
            label="API Endpoint URL"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            disabled={isStreaming}
            placeholder="https://api.example.com/data"
            sx={{ mb: 2 }}
          />
        )}

        {(streamSource === 'api' || streamSource === 'simulation') && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Refresh Interval</InputLabel>
            <Select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              disabled={isStreaming}
            >
              <MenuItem value={1000}>1 second</MenuItem>
              <MenuItem value={5000}>5 seconds</MenuItem>
              <MenuItem value={10000}>10 seconds</MenuItem>
              <MenuItem value={30000}>30 seconds</MenuItem>
              <MenuItem value={60000}>1 minute</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {!isStreaming ? (
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handleStart}
            size="large"
          >
            Start Streaming
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            startIcon={<Stop />}
            onClick={handleStop}
            size="large"
          >
            Stop Streaming
          </Button>
        )}

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleClear}
          disabled={dataPoints.length === 0}
        >
          Clear Data
        </Button>

        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
          disabled={dataPoints.length === 0}
        >
          Export Data
        </Button>
      </Box>

      {/* Data Preview */}
      {dataPoints.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Live Data Stream ({dataPoints.length} records)
          </Typography>
          <Box sx={{ 
            maxHeight: 300, 
            overflow: 'auto', 
            bgcolor: 'grey.100', 
            p: 2, 
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.875rem'
          }}>
            {dataPoints.slice(-10).reverse().map((point, index) => (
              <Box key={index} sx={{ mb: 1, pb: 1, borderBottom: '1px solid', borderColor: 'grey.300' }}>
                <Typography variant="caption" color="text.secondary">
                  {new Date(point.timestamp).toLocaleTimeString()}
                </Typography>
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(point, null, 2)}
                </pre>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

RealTimeDataStream.propTypes = {
  onDataUpdate: PropTypes.func,
  initialData: PropTypes.object
};

export default React.memo(RealTimeDataStream);
