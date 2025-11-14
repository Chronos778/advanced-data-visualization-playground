import { v4 as uuidv4 } from 'uuid';

/**
 * Professional Dashboard Templates
 * Pre-built configurations for common use cases
 */

export const DASHBOARD_TEMPLATES = {
  sales: {
    name: 'Sales Analytics Dashboard',
    description: 'Track sales performance, revenue trends, and key metrics',
    icon: 'TrendingUp',
    color: '#4facfe',
    widgets: [
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'line',
        title: 'Revenue Over Time',
        xAxis: 'date',
        yAxis: 'revenue',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'bar',
        title: 'Sales by Region',
        xAxis: 'region',
        yAxis: 'sales',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'pie',
        title: 'Product Mix',
        xAxis: 'product',
        yAxis: 'quantity',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'area',
        title: 'Cumulative Revenue',
        xAxis: 'month',
        yAxis: 'cumulative_revenue',
        config: { showLegend: true, animated: true }
      }
    ],
    layout: [
      { i: '0', x: 0, y: 0, w: 6, h: 4 },
      { i: '1', x: 6, y: 0, w: 6, h: 4 },
      { i: '2', x: 0, y: 4, w: 4, h: 4 },
      { i: '3', x: 4, y: 4, w: 8, h: 4 }
    ]
  },

  finance: {
    name: 'Financial Performance Dashboard',
    description: 'Monitor financial metrics, cash flow, and profitability',
    icon: 'AccountBalance',
    color: '#667eea',
    widgets: [
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'waterfall',
        title: 'Cash Flow Analysis',
        xAxis: 'category',
        yAxis: 'amount',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'line',
        title: 'Profit & Loss Trend',
        xAxis: 'quarter',
        yAxis: 'profit',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'doughnut',
        title: 'Expense Breakdown',
        xAxis: 'expense_category',
        yAxis: 'amount',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'bar',
        title: 'Budget vs Actual',
        xAxis: 'department',
        yAxis: 'budget',
        config: { showLegend: true, animated: true }
      }
    ],
    layout: [
      { i: '0', x: 0, y: 0, w: 8, h: 4 },
      { i: '1', x: 8, y: 0, w: 4, h: 4 },
      { i: '2', x: 0, y: 4, w: 4, h: 4 },
      { i: '3', x: 4, y: 4, w: 8, h: 4 }
    ]
  },

  marketing: {
    name: 'Marketing Analytics Dashboard',
    description: 'Track campaigns, conversion rates, and customer engagement',
    icon: 'Campaign',
    color: '#f093fb',
    widgets: [
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'funnel',
        title: 'Conversion Funnel',
        xAxis: 'stage',
        yAxis: 'users',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'line',
        title: 'Campaign Performance',
        xAxis: 'date',
        yAxis: 'conversions',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'bar',
        title: 'Channel ROI',
        xAxis: 'channel',
        yAxis: 'roi',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'heatmap',
        title: 'Engagement Heatmap',
        xAxis: 'day',
        yAxis: 'hour',
        config: { showLegend: false, animated: true }
      }
    ],
    layout: [
      { i: '0', x: 0, y: 0, w: 4, h: 4 },
      { i: '1', x: 4, y: 0, w: 8, h: 4 },
      { i: '2', x: 0, y: 4, w: 6, h: 4 },
      { i: '3', x: 6, y: 4, w: 6, h: 4 }
    ]
  },

  operations: {
    name: 'Operations Dashboard',
    description: 'Monitor KPIs, productivity, and operational efficiency',
    icon: 'Settings',
    color: '#43e97b',
    widgets: [
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'gauge',
        title: 'Overall Efficiency',
        xAxis: 'metric',
        yAxis: 'percentage',
        config: { showLegend: false, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'line',
        title: 'Production Output',
        xAxis: 'week',
        yAxis: 'units',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'treemap',
        title: 'Resource Allocation',
        xAxis: 'resource',
        yAxis: 'allocation',
        config: { showLegend: false, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'bar',
        title: 'Team Performance',
        xAxis: 'team',
        yAxis: 'kpi_score',
        config: { showLegend: true, animated: true }
      }
    ],
    layout: [
      { i: '0', x: 0, y: 0, w: 3, h: 4 },
      { i: '1', x: 3, y: 0, w: 9, h: 4 },
      { i: '2', x: 0, y: 4, w: 6, h: 4 },
      { i: '3', x: 6, y: 4, w: 6, h: 4 }
    ]
  },

  analytics: {
    name: 'Data Analytics Dashboard',
    description: 'Deep dive into data patterns, correlations, and distributions',
    icon: 'Analytics',
    color: '#764ba2',
    widgets: [
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'scatter',
        title: 'Correlation Analysis',
        xAxis: 'variable1',
        yAxis: 'variable2',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'boxplot',
        title: 'Distribution Comparison',
        xAxis: 'category',
        yAxis: 'value',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'histogram',
        title: 'Value Distribution',
        xAxis: 'bins',
        yAxis: 'frequency',
        config: { showLegend: false, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'radar',
        title: 'Multi-dimensional Analysis',
        xAxis: 'dimension',
        yAxis: 'score',
        config: { showLegend: true, animated: true }
      }
    ],
    layout: [
      { i: '0', x: 0, y: 0, w: 6, h: 4 },
      { i: '1', x: 6, y: 0, w: 6, h: 4 },
      { i: '2', x: 0, y: 4, w: 4, h: 4 },
      { i: '3', x: 4, y: 4, w: 8, h: 4 }
    ]
  },

  executive: {
    name: 'Executive Summary Dashboard',
    description: 'High-level overview with key business metrics',
    icon: 'Business',
    color: '#f5576c',
    widgets: [
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'line',
        title: 'Revenue Growth',
        xAxis: 'month',
        yAxis: 'revenue',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'gauge',
        title: 'Customer Satisfaction',
        xAxis: 'metric',
        yAxis: 'score',
        config: { showLegend: false, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'bar',
        title: 'Departmental Performance',
        xAxis: 'department',
        yAxis: 'performance',
        config: { showLegend: true, animated: true }
      },
      {
        id: uuidv4(),
        type: 'chart',
        library: 'unified',
        chartType: 'pie',
        title: 'Market Share',
        xAxis: 'segment',
        yAxis: 'percentage',
        config: { showLegend: true, animated: true }
      }
    ],
    layout: [
      { i: '0', x: 0, y: 0, w: 8, h: 4 },
      { i: '1', x: 8, y: 0, w: 4, h: 4 },
      { i: '2', x: 0, y: 4, w: 6, h: 4 },
      { i: '3', x: 6, y: 4, w: 6, h: 4 }
    ]
  }
};

/**
 * Apply template to dashboard
 * @param {string} templateId - Template identifier
 * @param {Object} data - Data to map to template
 * @returns {Object} - Template configuration with data mapping
 */
export const applyTemplate = (templateId, data) => {
  const template = DASHBOARD_TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  // Auto-map data columns to template axes
  const availableColumns = data?.columns || [];
  const numericColumns = availableColumns.filter(col => {
    const sample = data?.data?.[0]?.[col];
    return !isNaN(parseFloat(sample)) && isFinite(sample);
  });
  const categoricalColumns = availableColumns.filter(col => {
    const sample = data?.data?.[0]?.[col];
    return isNaN(parseFloat(sample)) || !isFinite(sample);
  });

  // Map widgets with available columns
  const mappedWidgets = template.widgets.map((widget, index) => {
    return {
      ...widget,
      xAxis: categoricalColumns[index % categoricalColumns.length] || availableColumns[0] || '',
      yAxis: numericColumns[index % numericColumns.length] || availableColumns[1] || ''
    };
  });

  return {
    ...template,
    widgets: mappedWidgets
  };
};

/**
 * Get template suggestions based on data
 * @param {Object} data - Dataset to analyze
 * @returns {Array} - Recommended templates
 */
export const getTemplateSuggestions = (data) => {
  if (!data || !data.data || data.data.length === 0) {
    return [];
  }

  const columns = data.columns || Object.keys(data.data[0]);
  const suggestions = [];

  // Analyze column names for keywords
  const columnNames = columns.join(' ').toLowerCase();
  
  if (columnNames.includes('revenue') || columnNames.includes('sales') || columnNames.includes('price')) {
    suggestions.push({ id: 'sales', score: 0.9, template: DASHBOARD_TEMPLATES.sales });
  }
  
  if (columnNames.includes('profit') || columnNames.includes('expense') || columnNames.includes('budget')) {
    suggestions.push({ id: 'finance', score: 0.85, template: DASHBOARD_TEMPLATES.finance });
  }
  
  if (columnNames.includes('conversion') || columnNames.includes('campaign') || columnNames.includes('click')) {
    suggestions.push({ id: 'marketing', score: 0.8, template: DASHBOARD_TEMPLATES.marketing });
  }
  
  if (columnNames.includes('efficiency') || columnNames.includes('production') || columnNames.includes('kpi')) {
    suggestions.push({ id: 'operations', score: 0.75, template: DASHBOARD_TEMPLATES.operations });
  }

  // Default to analytics if no specific match
  if (suggestions.length === 0) {
    suggestions.push({ id: 'analytics', score: 0.7, template: DASHBOARD_TEMPLATES.analytics });
  }

  return suggestions.sort((a, b) => b.score - a.score);
};

export default {
  DASHBOARD_TEMPLATES,
  applyTemplate,
  getTemplateSuggestions
};
