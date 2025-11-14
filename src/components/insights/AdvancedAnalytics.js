import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Timeline,
  ScatterPlot,
  Functions,
  AutoGraph,
  Refresh,
  Download,
  Lightbulb
} from '@mui/icons-material';
import { useDataWorker } from '../../hooks/useWorker';
import {
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * Advanced Analytics Engine
 * Provides statistical analysis, ML insights, anomaly detection, and predictions
 */
const AdvancedAnalytics = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedColumn2, setSelectedColumn2] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [correlation, setCorrelation] = useState(null);
  const [regression, setRegression] = useState(null);
  const [outliers, setOutliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    calculateStatistics,
    calculateCorrelation,
    linearRegression,
    detectOutliers
  } = useDataWorker();

  // Get numeric columns
  const numericColumns = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];
    const columns = data.columns || Object.keys(data.data[0]);
    return columns.filter(col => {
      const sampleValue = data.data[0][col];
      return !isNaN(parseFloat(sampleValue)) && isFinite(sampleValue);
    });
  }, [data]);

  // Auto-select first column
  useEffect(() => {
    if (numericColumns.length > 0 && !selectedColumn) {
      setSelectedColumn(numericColumns[0]);
    }
    if (numericColumns.length > 1 && !selectedColumn2) {
      setSelectedColumn2(numericColumns[1]);
    }
  }, [numericColumns, selectedColumn, selectedColumn2]);

  // Calculate statistics
  const handleCalculateStats = useCallback(async () => {
    if (!selectedColumn || !data) return;
    
    setLoading(true);
    setError('');
    
    try {
      const stats = await calculateStatistics(data.data, selectedColumn);
      setStatistics(stats);
    } catch (err) {
      setError(`Statistics calculation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedColumn, data, calculateStatistics]);

  // Calculate correlation
  const handleCalculateCorrelation = useCallback(async () => {
    if (!selectedColumn || !selectedColumn2 || !data) return;
    
    setLoading(true);
    setError('');
    
    try {
      const corr = await calculateCorrelation(data.data, selectedColumn, selectedColumn2);
      setCorrelation(corr);
    } catch (err) {
      setError(`Correlation calculation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedColumn, selectedColumn2, data, calculateCorrelation]);

  // Calculate regression
  const handleCalculateRegression = useCallback(async () => {
    if (!selectedColumn || !selectedColumn2 || !data) return;
    
    setLoading(true);
    setError('');
    
    try {
      const reg = await linearRegression(data.data, selectedColumn, selectedColumn2);
      setRegression(reg);
    } catch (err) {
      setError(`Regression calculation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedColumn, selectedColumn2, data, linearRegression]);

  // Detect outliers
  const handleDetectOutliers = useCallback(async () => {
    if (!selectedColumn || !data) return;
    
    setLoading(true);
    setError('');
    
    try {
      const detected = await detectOutliers(data.data, selectedColumn);
      setOutliers(detected);
    } catch (err) {
      setError(`Outlier detection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedColumn, data, detectOutliers]);

  // Auto-analyze when column changes
  useEffect(() => {
    if (selectedColumn && activeTab === 0) {
      handleCalculateStats();
    }
  }, [selectedColumn, activeTab, handleCalculateStats]);

  useEffect(() => {
    if (selectedColumn && selectedColumn2 && activeTab === 1) {
      handleCalculateCorrelation();
    }
  }, [selectedColumn, selectedColumn2, activeTab, handleCalculateCorrelation]);

  useEffect(() => {
    if (selectedColumn && selectedColumn2 && activeTab === 2) {
      handleCalculateRegression();
    }
  }, [selectedColumn, selectedColumn2, activeTab, handleCalculateRegression]);

  useEffect(() => {
    if (selectedColumn && activeTab === 3) {
      handleDetectOutliers();
    }
  }, [selectedColumn, activeTab, handleDetectOutliers]);

  if (!data || !data.data || data.data.length === 0) {
    return (
      <Alert severity="info">
        No data available for analysis. Please upload data first.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Psychology sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h5" sx={{ flex: 1, fontWeight: 600 }}>
          Advanced Analytics Engine
        </Typography>
        <Chip 
          label={`${data.data.length.toLocaleString()} rows`} 
          color="primary" 
          variant="outlined"
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Column Selection */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Primary Column</InputLabel>
            <Select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              label="Primary Column"
            >
              {numericColumns.map(col => (
                <MenuItem key={col} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Secondary Column</InputLabel>
            <Select
              value={selectedColumn2}
              onChange={(e) => setSelectedColumn2(e.target.value)}
              label="Secondary Column"
            >
              {numericColumns.map(col => (
                <MenuItem key={col} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Analysis Tabs */}
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab icon={<Functions />} label="Statistics" />
        <Tab icon={<ScatterPlot />} label="Correlation" />
        <Tab icon={<AutoGraph />} label="Regression" />
        <Tab icon={<Warning />} label="Outliers" />
      </Tabs>

      {/* Statistics Tab */}
      {activeTab === 0 && statistics && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Count</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {statistics.count.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Mean</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {statistics.mean.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Std Dev</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {statistics.std.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Minimum</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {statistics.min.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Median</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {statistics.median.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Maximum</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {statistics.max.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Box Plot Visualization */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Distribution Analysis</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Min', value: statistics.min },
                    { name: 'Q1', value: statistics.q1 },
                    { name: 'Median', value: statistics.median },
                    { name: 'Q3', value: statistics.q3 },
                    { name: 'Max', value: statistics.max }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#667eea" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Correlation Tab */}
      {activeTab === 1 && correlation !== null && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center' }}>
                {correlation.toFixed(4)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                Correlation Coefficient
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={Math.abs(correlation) * 100} 
                sx={{ mt: 2, height: 10, borderRadius: 5 }}
                color={Math.abs(correlation) > 0.7 ? 'success' : Math.abs(correlation) > 0.4 ? 'warning' : 'error'}
              />
              <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                {Math.abs(correlation) > 0.7 ? 'Strong' : Math.abs(correlation) > 0.4 ? 'Moderate' : 'Weak'} {correlation > 0 ? 'positive' : 'negative'} correlation
              </Typography>
            </CardContent>
          </Card>

          <Alert severity="info" icon={<Lightbulb />}>
            <Typography variant="body2">
              <strong>Interpretation:</strong> A correlation of {correlation.toFixed(4)} indicates{' '}
              {Math.abs(correlation) > 0.7 ? 'a strong' : Math.abs(correlation) > 0.4 ? 'a moderate' : 'a weak'}{' '}
              {correlation > 0 ? 'positive' : 'negative'} relationship between {selectedColumn} and {selectedColumn2}.
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Regression Tab */}
      {activeTab === 2 && regression && (
        <Box>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">Slope</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {regression.slope.toFixed(4)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">Intercept</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {regression.intercept.toFixed(4)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">R² Score</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {regression.r2.toFixed(4)}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={regression.r2 * 100} 
                    sx={{ mt: 1 }}
                    color={regression.r2 > 0.7 ? 'success' : regression.r2 > 0.4 ? 'warning' : 'error'}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Regression Equation</Typography>
              <Typography variant="h5" sx={{ fontFamily: 'monospace', p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                {regression.equation}
              </Typography>
            </CardContent>
          </Card>

          {/* Scatter plot with regression line */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Regression Visualization</Typography>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" name={selectedColumn} />
                  <YAxis dataKey="y" name={selectedColumn2} />
                  <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter name="Actual Data" data={regression.predictions} fill="#667eea" />
                  <Scatter name="Predicted" data={regression.predictions.map(p => ({ x: p.x, y: p.predicted }))} fill="#f5576c" line />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Alert severity="info" icon={<Lightbulb />} sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Model Quality:</strong> The R² score of {regression.r2.toFixed(4)} indicates that{' '}
              {(regression.r2 * 100).toFixed(1)}% of the variance in {selectedColumn2} can be explained by {selectedColumn}.
              {regression.r2 > 0.7 ? ' This is a good fit!' : regression.r2 > 0.4 ? ' This is a moderate fit.' : ' Consider using a different model.'}
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Outliers Tab */}
      {activeTab === 3 && (
        <Box>
          <Alert severity={outliers.length > 0 ? 'warning' : 'success'} sx={{ mb: 3 }}>
            {outliers.length > 0 ? (
              <>
                <strong>Found {outliers.length} outliers</strong> in {selectedColumn} using IQR method.
              </>
            ) : (
              <>
                <strong>No outliers detected</strong> in {selectedColumn}.
              </>
            )}
          </Alert>

          {outliers.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Outlier Details</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Row Index</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {outliers.slice(0, 20).map((outlier, index) => (
                      <TableRow key={index}>
                        <TableCell>{outlier.index}</TableCell>
                        <TableCell>{outlier.value.toFixed(4)}</TableCell>
                        <TableCell>
                          <Chip label="Outlier" color="warning" size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {outliers.length > 20 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Showing first 20 of {outliers.length} outliers
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Paper>
  );
};

AdvancedAnalytics.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.array
  })
};

export default React.memo(AdvancedAnalytics);
