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
      <Box sx={{ p: 6, textAlign: 'center', border: '2px solid black', backgroundColor: 'white' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'black', mb: 1, letterSpacing: '0.05em' }}>
          ANALYTICS_LOCKED
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'black' }}>
          UPLOAD_DATA_TO_INITIALIZE_ENGINE
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, border: '2px solid black', backgroundColor: 'white' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ border: '2px solid black', p: 1, display: 'flex', mr: 2 }}><Psychology color="inherit" /></Box>
        <Typography variant="h4" sx={{ flex: 1, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Advanced Analytics Engine
        </Typography>
        <Chip
          label={`${data.data.length.toLocaleString()} ROWS`}
          variant="outlined"
          sx={{ borderRadius: 0, border: '2px solid black', fontWeight: 'bold', color: 'black' }}
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
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{
          mb: 4,
          borderBottom: '2px solid black',
          minHeight: 48,
          '& .MuiTabs-indicator': { backgroundColor: 'black', height: 4 },
          '& .MuiTab-root': { textTransform: 'uppercase', fontWeight: 'bold', color: 'text.secondary' },
          '& .Mui-selected': { color: 'black !important', fontWeight: 800 }
        }}
      >
        <Tab icon={<Functions />} label="STATISTICS" sx={{ minHeight: 48 }} />
        <Tab icon={<ScatterPlot />} label="CORRELATION" sx={{ minHeight: 48 }} />
        <Tab icon={<AutoGraph />} label="REGRESSION" sx={{ minHeight: 48 }} />
        <Tab icon={<Warning />} label="OUTLIERS" sx={{ minHeight: 48 }} />
      </Tabs>

      {/* Statistics Tab */}
      {activeTab === 0 && statistics && (
        <Grid container spacing={3}>
          {[
            { label: 'COUNT', value: statistics.count.toLocaleString() },
            { label: 'MEAN', value: statistics.mean.toFixed(2) },
            { label: 'STD_DEV', value: statistics.std.toFixed(2) },
            { label: 'MIN', value: statistics.min.toFixed(2) },
            { label: 'MEDIAN', value: statistics.median.toFixed(2) },
            { label: 'MAX', value: statistics.max.toFixed(2) }
          ].map((stat, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Box sx={{ border: '2px solid black', p: 3, backgroundColor: '#F7F7F5' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', letterSpacing: '0.1em' }}>{stat.label}</Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
                  {stat.value}
                </Typography>
              </Box>
            </Grid>
          ))}

          {/* Box Plot Visualization */}
          <Grid item xs={12}>
            <Box sx={{ border: '2px solid black', p: 3, backgroundColor: 'white' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 3 }}>DISTRIBUTION_ANALYSIS</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'MIN', value: statistics.min },
                  { name: 'Q1', value: statistics.q1 },
                  { name: 'MEDIAN', value: statistics.median },
                  { name: 'Q3', value: statistics.q3 },
                  { name: 'MAX', value: statistics.max }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#000" />
                  <XAxis dataKey="name" tick={{ fill: '#000', fontWeight: 'bold' }} stroke="#000" />
                  <YAxis tick={{ fill: '#000', fontWeight: 'bold' }} stroke="#000" />
                  <RechartsTooltip contentStyle={{ borderRadius: 0, border: '2px solid black', fontWeight: 'bold' }} />
                  <Bar dataKey="value" fill="#000" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Correlation Tab */}
      {activeTab === 1 && correlation !== null && (
        <Box>
          <Box sx={{ border: '2px solid black', p: 4, mb: 3, backgroundColor: '#F7F7F5', textAlign: 'center' }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {correlation.toFixed(4)}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mt: 1, letterSpacing: '0.1em' }}>
              CORRELATION_COEFFICIENT
            </Typography>
            <Box sx={{ width: '100%', height: 24, border: '2px solid black', mt: 3, mb: 2, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ width: `${Math.abs(correlation) * 100}%`, height: '100%', backgroundColor: 'black' }} />
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              {Math.abs(correlation) > 0.7 ? 'STRONG' : Math.abs(correlation) > 0.4 ? 'MODERATE' : 'WEAK'} {correlation > 0 ? 'POSITIVE' : 'NEGATIVE'} CORRELATION
            </Typography>
          </Box>

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
            {[
              { label: 'SLOPE', value: regression.slope.toFixed(4) },
              { label: 'INTERCEPT', value: regression.intercept.toFixed(4) },
              { label: 'R²_SCORE', value: regression.r2.toFixed(4) }
            ].map((stat, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Box sx={{ border: '2px solid black', p: 3, backgroundColor: '#F7F7F5' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', letterSpacing: '0.1em' }}>{stat.label}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>{stat.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ border: '2px solid black', p: 3, mb: 3, backgroundColor: 'white' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'uppercase', mb: 1 }}>REGRESSION_EQUATION</Typography>
            <Typography variant="h5" sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 'bold', p: 2, border: '2px solid black', backgroundColor: '#F7F7F5' }}>
              {regression.equation}
            </Typography>
          </Box>

          {/* Scatter plot with regression line */}
          <Box sx={{ border: '2px solid black', p: 3, backgroundColor: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 3 }}>REGRESSION_VISUALIZATION</Typography>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000" />
                <XAxis dataKey="x" name={selectedColumn} stroke="#000" tick={{ fill: '#000', fontWeight: 'bold' }} />
                <YAxis dataKey="y" name={selectedColumn2} stroke="#000" tick={{ fill: '#000', fontWeight: 'bold' }} />
                <RechartsTooltip cursor={{ strokeDasharray: '3 3', stroke: '#000' }} contentStyle={{ borderRadius: 0, border: '2px solid black', fontWeight: 'bold' }} />
                <Legend iconType="square" wrapperStyle={{ fontWeight: 'bold' }} />
                <Scatter name="ACTUAL_DATA" data={regression.predictions} fill="#000" />
                <Scatter name="PREDICTED" data={regression.predictions.map(p => ({ x: p.x, y: p.predicted }))} fill="#000" line={{ stroke: '#000', strokeWidth: 2 }} shape={() => null} />
              </ScatterChart>
            </ResponsiveContainer>
          </Box>

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
    </Box>
  );
};

AdvancedAnalytics.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.array.isRequired,
    columns: PropTypes.array
  })
};

export default React.memo(AdvancedAnalytics);
