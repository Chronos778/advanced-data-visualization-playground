/* eslint-disable no-restricted-globals */
/**
 * Web Worker for Heavy Data Processing
 * Offloads expensive computations from main thread
 */

// Statistical calculations
function calculateStatistics(data, column) {
  const values = data.map(row => parseFloat(row[column])).filter(v => !isNaN(v));
  
  if (values.length === 0) return null;
  
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  
  return {
    count: values.length,
    sum,
    mean,
    median: sorted[Math.floor(sorted.length / 2)],
    min: sorted[0],
    max: sorted[sorted.length - 1],
    std: Math.sqrt(variance),
    variance,
    q1: sorted[Math.floor(sorted.length * 0.25)],
    q3: sorted[Math.floor(sorted.length * 0.75)]
  };
}

// Correlation analysis
function calculateCorrelation(data, col1, col2) {
  const pairs = data
    .map(row => [parseFloat(row[col1]), parseFloat(row[col2])])
    .filter(([x, y]) => !isNaN(x) && !isNaN(y));
  
  if (pairs.length === 0) return 0;
  
  const n = pairs.length;
  const sumX = pairs.reduce((sum, [x]) => sum + x, 0);
  const sumY = pairs.reduce((sum, [, y]) => sum + y, 0);
  const sumXY = pairs.reduce((sum, [x, y]) => sum + x * y, 0);
  const sumX2 = pairs.reduce((sum, [x]) => sum + x * x, 0);
  const sumY2 = pairs.reduce((sum, [, y]) => sum + y * y, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  return denominator === 0 ? 0 : numerator / denominator;
}

// Data aggregation
function aggregateData(data, groupBy, valueColumn, operation) {
  const groups = {};
  
  data.forEach(row => {
    const key = row[groupBy] || 'N/A';
    if (!groups[key]) {
      groups[key] = [];
    }
    const value = parseFloat(row[valueColumn]);
    if (!isNaN(value)) {
      groups[key].push(value);
    }
  });
  
  return Object.entries(groups).map(([key, values]) => {
    let result;
    switch (operation) {
      case 'sum':
        result = values.reduce((a, b) => a + b, 0);
        break;
      case 'avg':
        result = values.reduce((a, b) => a + b, 0) / values.length;
        break;
      case 'min':
        result = Math.min(...values);
        break;
      case 'max':
        result = Math.max(...values);
        break;
      case 'count':
        result = values.length;
        break;
      default:
        result = values.length;
    }
    
    return {
      [groupBy]: key,
      [valueColumn]: result
    };
  });
}

// Data filtering
function filterData(data, filters) {
  return data.filter(row => {
    return filters.every(filter => {
      const value = row[filter.column];
      const filterValue = filter.value;
      
      switch (filter.operator) {
        case 'equals':
          return value == filterValue; // eslint-disable-line eqeqeq
        case 'notEquals':
          return value != filterValue; // eslint-disable-line eqeqeq
        case 'contains':
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        case 'greaterThan':
          return parseFloat(value) > parseFloat(filterValue);
        case 'lessThan':
          return parseFloat(value) < parseFloat(filterValue);
        case 'greaterOrEqual':
          return parseFloat(value) >= parseFloat(filterValue);
        case 'lessOrEqual':
          return parseFloat(value) <= parseFloat(filterValue);
        default:
          return true;
      }
    });
  });
}

// Linear regression
function linearRegression(data, xCol, yCol) {
  const points = data
    .map(row => [parseFloat(row[xCol]), parseFloat(row[yCol])])
    .filter(([x, y]) => !isNaN(x) && !isNaN(y));
  
  if (points.length === 0) return null;
  
  const n = points.length;
  const sumX = points.reduce((sum, [x]) => sum + x, 0);
  const sumY = points.reduce((sum, [, y]) => sum + y, 0);
  const sumXY = points.reduce((sum, [x, y]) => sum + x * y, 0);
  const sumX2 = points.reduce((sum, [x]) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const predictions = points.map(([x]) => slope * x + intercept);
  const errors = points.map(([, y], i) => y - predictions[i]);
  const mse = errors.reduce((sum, e) => sum + e * e, 0) / n;
  const r2 = 1 - (mse / (points.reduce((sum, [, y]) => sum + Math.pow(y - sumY / n, 2), 0) / n));
  
  return {
    slope,
    intercept,
    r2,
    equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
    predictions: points.map(([x, y], i) => ({
      x,
      y,
      predicted: predictions[i],
      residual: errors[i]
    }))
  };
}

// Outlier detection using IQR method
function detectOutliers(data, column) {
  const values = data.map(row => parseFloat(row[column])).filter(v => !isNaN(v));
  const sorted = [...values].sort((a, b) => a - b);
  
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  return data
    .map((row, index) => ({
      index,
      value: parseFloat(row[column]),
      isOutlier: parseFloat(row[column]) < lowerBound || parseFloat(row[column]) > upperBound
    }))
    .filter(item => item.isOutlier);
}

// Message handler
self.addEventListener('message', (e) => {
  const { type, payload, taskId } = e.data;
  
  try {
    let result;
    
    switch (type) {
      case 'CALCULATE_STATISTICS':
        result = calculateStatistics(payload.data, payload.column);
        break;
        
      case 'CALCULATE_CORRELATION':
        result = calculateCorrelation(payload.data, payload.col1, payload.col2);
        break;
        
      case 'AGGREGATE_DATA':
        result = aggregateData(
          payload.data,
          payload.groupBy,
          payload.valueColumn,
          payload.operation
        );
        break;
        
      case 'FILTER_DATA':
        result = filterData(payload.data, payload.filters);
        break;
        
      case 'LINEAR_REGRESSION':
        result = linearRegression(payload.data, payload.xCol, payload.yCol);
        break;
        
      case 'DETECT_OUTLIERS':
        result = detectOutliers(payload.data, payload.column);
        break;
        
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
    
    self.postMessage({
      taskId,
      success: true,
      result
    });
  } catch (error) {
    self.postMessage({
      taskId,
      success: false,
      error: error.message
    });
  }
});

// Notify ready
self.postMessage({ type: 'READY' });
