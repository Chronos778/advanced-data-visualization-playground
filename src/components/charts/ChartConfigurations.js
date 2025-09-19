// Chart configuration definitions for different chart types
// This defines what configuration options each chart type needs

export const chartConfigurations = {
  // Recharts configurations
  line: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'X-Axis',
    yAxisLabel: 'Y-Axis (Numeric)',
    xAxisType: 'any',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: []
  },
  bar: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Category',
    yAxisLabel: 'Value (Numeric)',
    xAxisType: 'any',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: []
  },
  scatter: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'X-Axis (Numeric)',
    yAxisLabel: 'Y-Axis (Numeric)',
    xAxisType: 'numeric',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: true,
    supportsZAxis: false,
    additionalFields: []
  },
  pie: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Category',
    yAxisLabel: 'Value (Numeric)',
    xAxisType: 'any',
    yAxisType: 'numeric',
    supportsColorBy: false,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: []
  },
  area: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'X-Axis',
    yAxisLabel: 'Y-Axis (Numeric)',
    xAxisType: 'any',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: []
  },

  // Plotly configurations
  bubble: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'X-Axis (Numeric)',
    yAxisLabel: 'Y-Axis (Numeric)',
    xAxisType: 'numeric',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: true,
    supportsZAxis: false,
    additionalFields: []
  },
  scatter3d: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'X-Axis (Numeric)',
    yAxisLabel: 'Y-Axis (Numeric)',
    xAxisType: 'numeric',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: true,
    supportsZAxis: true,
    zAxisLabel: 'Z-Axis (Numeric)',
    additionalFields: []
  },
  heatmap: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'X-Axis',
    yAxisLabel: 'Y-Axis',
    xAxisType: 'any',
    yAxisType: 'any',
    supportsColorBy: false,
    supportsSizeBy: false,
    supportsZAxis: true,
    zAxisLabel: 'Value (Numeric)',
    additionalFields: []
  },
  contour: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'X-Axis (Numeric)',
    yAxisLabel: 'Y-Axis (Numeric)',
    xAxisType: 'numeric',
    yAxisType: 'numeric',
    supportsColorBy: false,
    supportsSizeBy: false,
    supportsZAxis: true,
    zAxisLabel: 'Value (Numeric)',
    additionalFields: []
  },
  surface: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'X-Axis (Numeric)',
    yAxisLabel: 'Y-Axis (Numeric)',
    xAxisType: 'numeric',
    yAxisType: 'numeric',
    supportsColorBy: false,
    supportsSizeBy: false,
    supportsZAxis: true,
    zAxisLabel: 'Z-Axis (Numeric)',
    additionalFields: []
  },

  // RAWGraphs configurations
  raw_alluvial: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Source',
    yAxisLabel: 'Target',
    xAxisType: 'any',
    yAxisType: 'any',
    supportsColorBy: false,
    supportsSizeBy: true,
    sizeByLabel: 'Flow Value (Numeric)',
    supportsZAxis: false,
    additionalFields: [
      { name: 'steps', label: 'Steps', type: 'multiselect', required: false }
    ]
  },
  raw_arc: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Source',
    yAxisLabel: 'Target',
    xAxisType: 'any',
    yAxisType: 'any',
    supportsColorBy: true,
    supportsSizeBy: true,
    sizeByLabel: 'Weight (Numeric)',
    supportsZAxis: false,
    additionalFields: []
  },
  raw_bar: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Category',
    yAxisLabel: 'Value (Numeric)',
    xAxisType: 'any',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'series', label: 'Series', type: 'select', required: false }
    ]
  },
  raw_multiset_bar: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Category',
    yAxisLabel: 'Value (Numeric)',
    xAxisType: 'any',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'series', label: 'Series', type: 'multiselect', required: true }
    ]
  },
  raw_beeswarm: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Category',
    yAxisLabel: 'Value (Numeric)',
    xAxisType: 'any',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: true,
    sizeByLabel: 'Size (Numeric)',
    supportsZAxis: false,
    additionalFields: []
  },
  raw_boxplot: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Category',
    yAxisLabel: 'Value (Numeric)',
    xAxisType: 'any',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: []
  },
  raw_bump: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Time/Step',
    yAxisLabel: 'Value (Numeric)',
    xAxisType: 'any',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'series', label: 'Series', type: 'select', required: true }
    ]
  },
  raw_calendar: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Date',
    yAxisLabel: 'Value (Numeric)',
    xAxisType: 'date',
    yAxisType: 'numeric',
    supportsColorBy: false,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: []
  },
  raw_chord: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Source',
    yAxisLabel: 'Target',
    xAxisType: 'any',
    yAxisType: 'any',
    supportsColorBy: false,
    supportsSizeBy: true,
    sizeByLabel: 'Weight (Numeric)',
    supportsZAxis: false,
    additionalFields: []
  },
  raw_circlepacking: {
    requiresXAxis: false,
    requiresYAxis: true,
    yAxisLabel: 'Value (Numeric)',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'hierarchy', label: 'Hierarchy', type: 'multiselect', required: true }
    ]
  },
  raw_dendrogram: {
    requiresXAxis: false,
    requiresYAxis: false,
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'hierarchy', label: 'Hierarchy', type: 'multiselect', required: true },
      { name: 'value', label: 'Value (Numeric)', type: 'select', required: false }
    ]
  },
  raw_convexhull: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'X-Axis (Numeric)',
    yAxisLabel: 'Y-Axis (Numeric)',
    xAxisType: 'numeric',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: true,
    supportsZAxis: false,
    additionalFields: [
      { name: 'group', label: 'Group By', type: 'select', required: true }
    ]
  },
  raw_gantt: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Task',
    yAxisLabel: 'Start Date',
    xAxisType: 'any',
    yAxisType: 'date',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'endDate', label: 'End Date', type: 'select', required: true }
    ]
  },
  raw_hexbin: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'X-Axis (Numeric)',
    yAxisLabel: 'Y-Axis (Numeric)',
    xAxisType: 'numeric',
    yAxisType: 'numeric',
    supportsColorBy: false,
    supportsSizeBy: true,
    sizeByLabel: 'Value (Numeric)',
    supportsZAxis: false,
    additionalFields: []
  },
  raw_horizon: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Time',
    yAxisLabel: 'Value (Numeric)',
    xAxisType: 'date',
    yAxisType: 'numeric',
    supportsColorBy: false,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'series', label: 'Series', type: 'select', required: false }
    ]
  },
  raw_matrix: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Row',
    yAxisLabel: 'Column',
    xAxisType: 'any',
    yAxisType: 'any',
    supportsColorBy: false,
    supportsSizeBy: true,
    sizeByLabel: 'Value (Numeric)',
    supportsZAxis: false,
    additionalFields: []
  },
  raw_parallel: {
    requiresXAxis: false,
    requiresYAxis: false,
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'dimensions', label: 'Dimensions', type: 'multiselect', required: true }
    ]
  },
  raw_radar: {
    requiresXAxis: false,
    requiresYAxis: false,
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'dimensions', label: 'Dimensions (Numeric)', type: 'multiselect', required: true },
      { name: 'series', label: 'Series', type: 'select', required: false }
    ]
  },
  raw_sankey: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Source',
    yAxisLabel: 'Target',
    xAxisType: 'any',
    yAxisType: 'any',
    supportsColorBy: false,
    supportsSizeBy: true,
    sizeByLabel: 'Value (Numeric)',
    supportsZAxis: false,
    additionalFields: []
  },
  raw_slope: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Period',
    yAxisLabel: 'Value (Numeric)',
    xAxisType: 'any',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'series', label: 'Series', type: 'select', required: true }
    ]
  },
  raw_streamgraph: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Time',
    yAxisLabel: 'Value (Numeric)',
    xAxisType: 'date',
    yAxisType: 'numeric',
    supportsColorBy: false,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'series', label: 'Series', type: 'select', required: true }
    ]
  },
  raw_sunburst: {
    requiresXAxis: false,
    requiresYAxis: true,
    yAxisLabel: 'Value (Numeric)',
    yAxisType: 'numeric',
    supportsColorBy: false,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'hierarchy', label: 'Hierarchy', type: 'multiselect', required: true }
    ]
  },
  raw_treemap: {
    requiresXAxis: false,
    requiresYAxis: true,
    yAxisLabel: 'Value (Numeric)',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'hierarchy', label: 'Hierarchy', type: 'multiselect', required: true }
    ]
  },
  raw_violin: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'Category',
    yAxisLabel: 'Value (Numeric)',
    xAxisType: 'any',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: []
  },
  raw_voronoi: {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'X-Axis (Numeric)',
    yAxisLabel: 'Y-Axis (Numeric)',
    xAxisType: 'numeric',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: true,
    supportsZAxis: false,
    additionalFields: []
  },
  raw_voronoitreemap: {
    requiresXAxis: false,
    requiresYAxis: true,
    yAxisLabel: 'Value (Numeric)',
    yAxisType: 'numeric',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: [
      { name: 'hierarchy', label: 'Hierarchy', type: 'multiselect', required: true }
    ]
  }
};

// Helper function to get configuration for a chart type
export const getChartConfig = (chartType) => {
  return chartConfigurations[chartType] || {
    requiresXAxis: true,
    requiresYAxis: true,
    xAxisLabel: 'X-Axis',
    yAxisLabel: 'Y-Axis',
    xAxisType: 'any',
    yAxisType: 'any',
    supportsColorBy: true,
    supportsSizeBy: false,
    supportsZAxis: false,
    additionalFields: []
  };
};

// Helper function to validate if required fields are filled
export const validateChartConfig = (chartType, config) => {
  const chartConfig = getChartConfig(chartType);
  
  if (!config.title) return false;
  if (chartConfig.requiresXAxis && !config.xAxis) return false;
  if (chartConfig.requiresYAxis && !config.yAxis) return false;
  if (chartConfig.supportsZAxis && chartConfig.zAxisRequired && !config.zAxis) return false;
  
  // Check additional required fields
  for (const field of chartConfig.additionalFields) {
    if (field.required && !config[field.name]) return false;
  }
  
  return true;
};