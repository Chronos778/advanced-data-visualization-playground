/**
 * Application-wide constants
 */

// Chart types supported by the application
export const CHART_TYPES = {
  BAR: 'bar',
  LINE: 'line',
  PIE: 'pie',
  DOUGHNUT: 'doughnut',
  SCATTER: 'scatter',
  POLAR_AREA: 'polarArea',
  RADAR: 'radar',
  HISTOGRAM: 'histogram',
  BOXPLOT: 'boxplot',
  VIOLIN: 'violin',
  HEATMAP: 'heatmap',
  TREEMAP: 'treemap',
  WATERFALL: 'waterfall',
  FUNNEL: 'funnel',
  GAUGE: 'gauge',
  CANDLESTICK: 'candlestick',
  AREA: 'area',
  BUBBLE: 'bubble'
};

// Chart type categories
export const CHART_CATEGORIES = {
  BASIC: ['bar', 'line', 'pie', 'doughnut', 'scatter', 'area'],
  STATISTICAL: ['histogram', 'boxplot', 'violin'],
  ADVANCED: ['heatmap', 'treemap', 'waterfall', 'funnel', 'gauge', 'candlestick', 'bubble'],
  SPECIALIZED: ['radar', 'polarArea']
};

// File upload constants
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: {
    'text/csv': ['.csv'],
    'application/json': ['.json'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls']
  },
  CHUNK_SIZE: 1000 // Process files in chunks of 1000 rows
};

// Data transformation constants
export const FILTERS = {
  OPERATORS: {
    EQUALS: 'equals',
    NOT_EQUALS: 'not_equals',
    CONTAINS: 'contains',
    NOT_CONTAINS: 'not_contains',
    STARTS_WITH: 'starts_with',
    ENDS_WITH: 'ends_with',
    GREATER_THAN: 'greater_than',
    LESS_THAN: 'less_than',
    GREATER_EQUAL: 'greater_equal',
    LESS_EQUAL: 'less_equal',
    IS_NULL: 'is_null',
    IS_NOT_NULL: 'is_not_null'
  }
};

// Aggregation functions
export const AGGREGATIONS = {
  SUM: 'sum',
  AVERAGE: 'average',
  COUNT: 'count',
  MIN: 'min',
  MAX: 'max',
  MEDIAN: 'median',
  MODE: 'mode',
  STDEV: 'stdev',
  VARIANCE: 'variance'
};

// Export formats
export const EXPORT_FORMATS = {
  PNG: 'png',
  PDF: 'pdf',
  JSON: 'json',
  CSV: 'csv',
  SVG: 'svg'
};

// Dashboard layout constants
export const DASHBOARD_LAYOUT = {
  DEFAULT_COLS: 12,
  DEFAULT_ROW_HEIGHT: 60,
  DEFAULT_WIDGET_WIDTH: 6,
  DEFAULT_WIDGET_HEIGHT: 6,
  MIN_WIDGET_WIDTH: 3,
  MIN_WIDGET_HEIGHT: 3,
  MAX_WIDGET_WIDTH: 12,
  MAX_WIDGET_HEIGHT: 12,
  BREAKPOINTS: {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0
  },
  COLS: {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
    xxs: 2
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  DASHBOARD_WIDGETS: 'dashboard-widgets',
  DASHBOARD_LAYOUT: 'dashboard-layout',
  USER_PREFERENCES: 'user-preferences',
  RECENT_FILES: 'recent-files',
  THEME: 'theme-preference'
};

// Color palettes
export const COLOR_PALETTES = {
  GRADIENT: {
    name: 'Vibrant Gradient',
    colors: [
      '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe',
      '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'
    ]
  },
  PROFESSIONAL: {
    name: 'Professional',
    colors: [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
      '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ]
  },
  PASTEL: {
    name: 'Pastel',
    colors: [
      '#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6',
      '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2', '#b3e2cd'
    ]
  },
  VIBRANT: {
    name: 'Vibrant',
    colors: [
      '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00',
      '#ffff33', '#a65628', '#f781bf', '#999999', '#66c2a5'
    ]
  }
};

// Chart configuration defaults
export const DEFAULT_CHART_CONFIG = {
  animated: true,
  showLegend: true,
  showTooltip: true,
  maintainAspectRatio: false,
  responsive: true,
  borderWidth: 2,
  pointRadius: 4,
  opacity: 0.8,
  tension: 0.4, // For line charts
  fillOpacity: 0.2 // For area charts
};

// Performance constants
export const PERFORMANCE = {
  LARGE_DATASET_THRESHOLD: 10000,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  MAX_RENDER_ITEMS: 1000,
  PAGINATION_DEFAULT: 25,
  PAGINATION_OPTIONS: [10, 25, 50, 100]
};

// Validation messages
export const VALIDATION_MESSAGES = {
  NO_DATA: 'No data available',
  INVALID_DATA_FORMAT: 'Invalid data format',
  EMPTY_DATASET: 'Dataset is empty',
  LARGE_DATASET: 'Large dataset detected - performance may be affected',
  MISSING_COLUMNS: 'Column definitions are missing',
  INVALID_CHART_TYPE: 'Invalid chart type selected',
  MISSING_AXIS: 'Please select axis values',
  INSUFFICIENT_DATA: 'Insufficient data for this visualization'
};

// Tab indices
export const TABS = {
  UPLOAD: 0,
  PREVIEW: 1,
  TRANSFORM: 2,
  DASHBOARD: 3,
  AI_INSIGHTS: 4
};

// API endpoints (if needed for future features)
export const API_ENDPOINTS = {
  UPLOAD: '/api/upload',
  EXPORT: '/api/export',
  AI_INSIGHTS: '/api/insights',
  SAVE_DASHBOARD: '/api/dashboard/save',
  LOAD_DASHBOARD: '/api/dashboard/load'
};

// Error types
export const ERROR_TYPES = {
  FILE_UPLOAD: 'file_upload_error',
  DATA_PROCESSING: 'data_processing_error',
  CHART_RENDERING: 'chart_rendering_error',
  EXPORT: 'export_error',
  VALIDATION: 'validation_error',
  NETWORK: 'network_error'
};
