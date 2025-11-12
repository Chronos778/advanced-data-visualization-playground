/**
 * Utility functions for data processing and validation
 */

/**
 * Check if a value is numeric
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is numeric
 */
export const isNumeric = (value) => {
  if (value === null || value === undefined || value === '') return false;
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Get numeric columns from data
 * @param {Array} data - Array of data objects
 * @param {Array} columns - Array of column names
 * @returns {Array} Array of numeric column names
 */
export const getNumericColumns = (data, columns) => {
  if (!data || !data.length || !columns) return [];
  
  return columns.filter(col => {
    const sampleValue = data[0][col];
    return isNumeric(sampleValue);
  });
};

/**
 * Get categorical columns from data
 * @param {Array} data - Array of data objects
 * @param {Array} columns - Array of column names
 * @returns {Array} Array of categorical column names
 */
export const getCategoricalColumns = (data, columns) => {
  if (!data || !data.length || !columns) return [];
  
  return columns.filter(col => {
    const sampleValue = data[0][col];
    return !isNumeric(sampleValue);
  });
};

/**
 * Format number with appropriate precision
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (num, decimals = 2) => {
  if (!isNumeric(num)) return num;
  
  const parsed = parseFloat(num);
  if (Number.isInteger(parsed)) {
    return parsed.toLocaleString();
  }
  return parsed.toLocaleString(undefined, { 
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals 
  });
};

/**
 * Calculate basic statistics for numeric data
 * @param {Array} values - Array of numeric values
 * @returns {Object} Statistics object
 */
export const calculateStats = (values) => {
  const numericValues = values.filter(isNumeric).map(Number);
  
  if (numericValues.length === 0) {
    return { count: 0, min: null, max: null, mean: null, median: null };
  }
  
  const sorted = [...numericValues].sort((a, b) => a - b);
  const sum = numericValues.reduce((acc, val) => acc + val, 0);
  const mean = sum / numericValues.length;
  
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
  
  return {
    count: numericValues.length,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean: mean,
    median: median,
    sum: sum
  };
};

/**
 * Truncate text to a specific length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  const str = String(text);
  return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
};

/**
 * Generate a unique ID
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validate data structure
 * @param {*} data - Data to validate
 * @returns {Object} Validation result
 */
export const validateData = (data) => {
  const errors = [];
  const warnings = [];
  
  if (!data) {
    errors.push('No data provided');
    return { valid: false, errors, warnings };
  }
  
  if (!data.data || !Array.isArray(data.data)) {
    errors.push('Data must contain an array of records');
  }
  
  if (!data.columns || !Array.isArray(data.columns)) {
    errors.push('Data must contain column definitions');
  }
  
  if (data.data && data.data.length === 0) {
    warnings.push('Dataset is empty');
  }
  
  if (data.data && data.data.length > 10000) {
    warnings.push('Large dataset detected - performance may be affected');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Export data to CSV format
 * @param {Array} data - Data to export
 * @param {string} filename - Name of the file
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Download JSON data
 * @param {Object} data - Data to download
 * @param {string} filename - Name of the file
 */
export const downloadJSON = (data, filename = 'data.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.href = url;
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(url);
};

/**
 * Color utilities
 */
export const colors = {
  // Vibrant gradient palette
  gradient: [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe',
    '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'
  ],
  
  // Professional color palette
  professional: [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ],
  
  // Get color by index
  get: (index, palette = 'bw') => {
    const colorArray = colors[palette] || colors.bw;
    return colorArray[index % colorArray.length];
  }
};
