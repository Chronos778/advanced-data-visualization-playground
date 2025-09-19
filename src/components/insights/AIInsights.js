import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Alert,
  Button,
  Tooltip
} from '@mui/material';
import {
  Psychology,
  ExpandMore,
  Warning,
  CheckCircle,
  Info,
  BubbleChart,
  Timeline,
  Assessment,
  Refresh
} from '@mui/icons-material';
import { 
  variance, 
  standardDeviation, 
  sampleCorrelation, 
  linearRegression,
  rSquared,
  mean,
  median,
  min,
  max,
  quantile
} from 'simple-statistics';

const AIInsights = ({ data }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [insights, setInsights] = useState(null);

  const numericData = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return {};
    
    const numeric = {};
    data.columns.forEach(column => {
      const values = data.data
        .map(row => parseFloat(row[column]))
        .filter(val => !isNaN(val) && isFinite(val));
      
      if (values.length > data.data.length * 0.5) { // At least 50% numeric
        numeric[column] = values;
      }
    });
    
    return numeric;
  }, [data]);

  const categoricalData = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return {};
    
    const categorical = {};
    data.columns.forEach(column => {
      if (!numericData[column]) {
        const values = data.data
          .map(row => row[column])
          .filter(val => val !== null && val !== undefined && val !== '');
        categorical[column] = values;
      }
    });
    
    return categorical;
  }, [data, numericData]);

  const generateInsights = async () => {
    setAnalyzing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generatedInsights = {
      summary: generateSummaryInsights(),
      distributions: generateDistributionInsights(),
      correlations: generateCorrelationInsights(),
      outliers: generateOutlierInsights(),
      trends: generateTrendInsights(),
      recommendations: generateRecommendations()
    };
    
    setInsights(generatedInsights);
    setAnalyzing(false);
  };

  const generateSummaryInsights = () => {
    const insights = [];
    
    // Dataset overview
    insights.push({
      type: 'info',
      title: 'Dataset Overview',
      description: `The dataset contains ${data.data.length.toLocaleString()} rows and ${data.columns.length} columns. ${Object.keys(numericData).length} columns are numeric and ${Object.keys(categoricalData).length} are categorical.`,
      confidence: 1.0
    });

    // Missing data analysis
    const missingData = data.columns.map(col => {
      const nullCount = data.data.filter(row => row[col] === null || row[col] === undefined || row[col] === '').length;
      return { column: col, missing: nullCount, percentage: (nullCount / data.data.length) * 100 };
    }).filter(item => item.missing > 0);

    if (missingData.length > 0) {
      const highMissing = missingData.filter(item => item.percentage > 10);
      if (highMissing.length > 0) {
        insights.push({
          type: 'warning',
          title: 'Significant Missing Data',
          description: `${highMissing.length} columns have more than 10% missing data: ${highMissing.map(item => `${item.column} (${item.percentage.toFixed(1)}%)`).join(', ')}.`,
          confidence: 0.9
        });
      }
    }

    return insights;
  };

  const generateDistributionInsights = () => {
    const insights = [];
    
    Object.entries(numericData).forEach(([column, values]) => {
      if (values.length < 10) return;
      
      const meanVal = mean(values);
      const medianVal = median(values);
      const stdDev = standardDeviation(values);
      const skewness = (meanVal - medianVal) / stdDev;
      
      // Distribution shape
      if (Math.abs(skewness) > 1) {
        insights.push({
          type: 'info',
          title: `${column} Distribution`,
          description: `${column} shows ${skewness > 0 ? 'right' : 'left'} skewness (${skewness.toFixed(2)}), indicating ${skewness > 0 ? 'a long tail of high values' : 'a concentration of high values'}.`,
          confidence: 0.8,
          column
        });
      }
      
      // Potential normal distribution
      if (Math.abs(skewness) < 0.5) {
        insights.push({
          type: 'success',
          title: `${column} Normal Distribution`,
          description: `${column} appears to follow a normal distribution (skewness: ${skewness.toFixed(2)}), making it suitable for parametric statistical tests.`,
          confidence: 0.7,
          column
        });
      }
    });
    
    return insights;
  };

  const generateCorrelationInsights = () => {
    const insights = [];
    const numColumns = Object.keys(numericData);
    
    if (numColumns.length < 2) return insights;
    
    const correlations = [];
    
    for (let i = 0; i < numColumns.length; i++) {
      for (let j = i + 1; j < numColumns.length; j++) {
        const col1 = numColumns[i];
        const col2 = numColumns[j];
        
        try {
          // Find common indices where both values exist
          const commonData = data.data
            .map((row, idx) => ({ 
              val1: parseFloat(row[col1]), 
              val2: parseFloat(row[col2]),
              index: idx 
            }))
            .filter(item => !isNaN(item.val1) && !isNaN(item.val2) && isFinite(item.val1) && isFinite(item.val2));
          
          if (commonData.length < 10) continue;
          
          const values1 = commonData.map(item => item.val1);
          const values2 = commonData.map(item => item.val2);
          
          const correlation = sampleCorrelation(values1, values2);
          
          correlations.push({
            col1,
            col2,
            correlation,
            strength: Math.abs(correlation),
            sampleSize: commonData.length
          });
        } catch (error) {
          // Skip if correlation calculation fails
          continue;
        }
      }
    }
    
    // Sort by strength
    correlations.sort((a, b) => b.strength - a.strength);
    
    // Strong correlations
    const strongCorrelations = correlations.filter(corr => corr.strength > 0.7);
    strongCorrelations.slice(0, 3).forEach(corr => {
      insights.push({
        type: corr.correlation > 0 ? 'success' : 'warning',
        title: `Strong ${corr.correlation > 0 ? 'Positive' : 'Negative'} Correlation`,
        description: `${corr.col1} and ${corr.col2} show a strong ${corr.correlation > 0 ? 'positive' : 'negative'} correlation (r = ${corr.correlation.toFixed(3)}). This suggests they move ${corr.correlation > 0 ? 'together' : 'in opposite directions'}.`,
        confidence: Math.min(0.9, corr.strength),
        columns: [corr.col1, corr.col2]
      });
    });
    
    // Moderate correlations worth noting
    const moderateCorrelations = correlations.filter(corr => corr.strength > 0.4 && corr.strength <= 0.7);
    moderateCorrelations.slice(0, 2).forEach(corr => {
      insights.push({
        type: 'info',
        title: `Moderate Correlation`,
        description: `${corr.col1} and ${corr.col2} have a moderate correlation (r = ${corr.correlation.toFixed(3)}), suggesting some relationship worth investigating.`,
        confidence: 0.6,
        columns: [corr.col1, corr.col2]
      });
    });
    
    return insights;
  };

  const generateOutlierInsights = () => {
    const insights = [];
    
    Object.entries(numericData).forEach(([column, values]) => {
      if (values.length < 20) return;
      
      const q1 = quantile(values, 0.25);
      const q3 = quantile(values, 0.75);
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      
      const outliers = values.filter(val => val < lowerBound || val > upperBound);
      const outlierPercentage = (outliers.length / values.length) * 100;
      
      if (outlierPercentage > 5) {
        insights.push({
          type: 'warning',
          title: `Outliers in ${column}`,
          description: `${column} contains ${outliers.length} outliers (${outlierPercentage.toFixed(1)}% of data). Range: ${min(outliers).toFixed(2)} to ${max(outliers).toFixed(2)}. Consider investigating these extreme values.`,
          confidence: 0.8,
          column
        });
      }
    });
    
    return insights;
  };

  const generateTrendInsights = () => {
    const insights = [];
    
    // Look for time-series patterns if there's a date-like column
    const dateColumns = data.columns.filter(col => {
      const sampleValues = data.data.slice(0, 10).map(row => row[col]);
      return sampleValues.some(val => {
        if (!val) return false;
        const date = new Date(val);
        return !isNaN(date.getTime()) && val.toString().length > 8;
      });
    });
    
    if (dateColumns.length > 0 && Object.keys(numericData).length > 0) {
      const dateCol = dateColumns[0];
      const numCol = Object.keys(numericData)[0];
      
      // Sort by date and look for trends
      const sortedData = data.data
        .filter(row => row[dateCol] && !isNaN(parseFloat(row[numCol])))
        .sort((a, b) => new Date(a[dateCol]) - new Date(b[dateCol]));
      
      if (sortedData.length > 10) {
        const values = sortedData.map(row => parseFloat(row[numCol]));
        const xValues = values.map((_, i) => i); // Use indices as x values
        
        try {
          const regression = linearRegression(xValues.map((x, i) => [x, values[i]]));
          const r2 = rSquared(xValues.map((x, i) => [x, values[i]]), regression);
          
          if (r2 > 0.3) { // Reasonable trend
            insights.push({
              type: regression.m > 0 ? 'success' : 'warning',
              title: `Temporal Trend in ${numCol}`,
              description: `${numCol} shows a ${regression.m > 0 ? 'increasing' : 'decreasing'} trend over time (R² = ${r2.toFixed(3)}). The ${regression.m > 0 ? 'upward' : 'downward'} trajectory suggests ${regression.m > 0 ? 'growth' : 'decline'}.`,
              confidence: Math.min(0.9, r2),
              columns: [dateCol, numCol]
            });
          }
        } catch (error) {
          // Skip if regression fails
        }
      }
    }
    
    return insights;
  };

  const generateRecommendations = () => {
    const recommendations = [];
    
    // Chart recommendations based on data characteristics
    const numericCount = Object.keys(numericData).length;
    const categoricalCount = Object.keys(categoricalData).length;
    
    if (numericCount >= 2) {
      recommendations.push({
        type: 'chart',
        title: 'Scatter Plot Analysis',
        description: `With ${numericCount} numeric columns, scatter plots can reveal relationships and patterns. Consider plotting correlated variables to explore their relationship further.`,
        action: 'Create scatter plot',
        priority: 'high'
      });
    }
    
    if (categoricalCount >= 1 && numericCount >= 1) {
      recommendations.push({
        type: 'chart',
        title: 'Category Comparison',
        description: `Bar charts or box plots can show how numeric values vary across categorical groups. This can reveal important differences between categories.`,
        action: 'Create bar chart',
        priority: 'medium'
      });
    }
    
    if (data.data.length > 1000) {
      recommendations.push({
        type: 'performance',
        title: 'Large Dataset Optimization',
        description: `With ${data.data.length.toLocaleString()} rows, consider sampling or aggregating data for better performance in interactive visualizations.`,
        action: 'Apply data sampling',
        priority: 'medium'
      });
    }
    
    // Data quality recommendations
    const highVarianceColumns = Object.entries(numericData)
      .map(([col, values]) => ({ col, variance: variance(values) }))
      .filter(item => item.variance > mean(Object.values(numericData).map(vals => variance(vals))) * 2);
    
    if (highVarianceColumns.length > 0) {
      recommendations.push({
        type: 'analysis',
        title: 'High Variance Columns',
        description: `${highVarianceColumns.map(item => item.col).join(', ')} show high variance. Consider normalization or log transformation for better visualization.`,
        action: 'Apply data transformation',
        priority: 'low'
      });
    }
    
    return recommendations;
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle color="success" />;
      case 'warning': return <Warning color="warning" />;
      case 'error': return <Warning color="error" />;
      case 'info':
      default: return <Info color="info" />;
    }
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'chart': return <Assessment color="primary" />;
      case 'performance': return <Timeline color="secondary" />;
      case 'analysis': return <BubbleChart color="info" />;
      default: return <Assessment />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  if (!data || !data.data) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Psychology sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          AI Insights
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload data to generate automated insights and recommendations
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Psychology color="primary" />
            <Typography variant="h6">AI-Powered Insights</Typography>
          </Box>
          <Button
            variant={insights ? 'outlined' : 'contained'}
            startIcon={analyzing ? null : <Refresh />}
            onClick={generateInsights}
            disabled={analyzing}
          >
            {analyzing ? 'Analyzing...' : insights ? 'Refresh Insights' : 'Generate Insights'}
          </Button>
        </Box>

        {analyzing && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              Analyzing data patterns and generating insights...
            </Typography>
          </Box>
        )}

        {!insights && !analyzing && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Click "Generate Insights" to automatically analyze your data and discover patterns, correlations, and recommendations.
          </Alert>
        )}

        {insights && (
          <Box>
            {/* Summary Insights */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Data Summary</Typography>
                <Chip 
                  label={`${insights.summary.length} insights`} 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {insights.summary.map((insight, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {getInsightIcon(insight.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={insight.title}
                        secondary={insight.description}
                      />
                      <Tooltip title={`Confidence: ${(insight.confidence * 100).toFixed(0)}%`}>
                        <Chip 
                          label={`${(insight.confidence * 100).toFixed(0)}%`} 
                          size="small" 
                          variant="outlined"
                        />
                      </Tooltip>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* Statistical Insights */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Statistical Analysis</Typography>
                <Chip 
                  label={`${insights.distributions.length + insights.correlations.length + insights.outliers.length} insights`} 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {/* Distributions */}
                  {insights.distributions.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>Distribution Analysis</Typography>
                      <List dense>
                        {insights.distributions.map((insight, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              {getInsightIcon(insight.type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={insight.title}
                              secondary={insight.description}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}

                  {/* Correlations */}
                  {insights.correlations.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>Correlation Analysis</Typography>
                      <List dense>
                        {insights.correlations.map((insight, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              {getInsightIcon(insight.type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={insight.title}
                              secondary={insight.description}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}

                  {/* Outliers */}
                  {insights.outliers.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>Outlier Detection</Typography>
                      <List dense>
                        {insights.outliers.map((insight, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              {getInsightIcon(insight.type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={insight.title}
                              secondary={insight.description}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Trend Analysis */}
            {insights.trends.length > 0 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Trend Analysis</Typography>
                  <Chip 
                    label={`${insights.trends.length} trends`} 
                    size="small" 
                    sx={{ ml: 2 }} 
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {insights.trends.map((insight, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {getInsightIcon(insight.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={insight.title}
                          secondary={insight.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Recommendations */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Recommendations</Typography>
                <Chip 
                  label={`${insights.recommendations.length} recommendations`} 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {insights.recommendations.map((rec, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                            {getRecommendationIcon(rec.type)}
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" gutterBottom>
                                {rec.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {rec.description}
                              </Typography>
                            </Box>
                            <Chip 
                              label={rec.priority} 
                              size="small" 
                              color={getPriorityColor(rec.priority)}
                            />
                          </Box>
                          <Button size="small" variant="outlined" sx={{ mt: 1 }}>
                            {rec.action}
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AIInsights;