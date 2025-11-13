import React, { memo, useMemo } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';

// Mini chart components for dashboard preview
export const MiniLineChart = memo(({ data, width = 80, height = 30, color = '#000' }) => {
  const points = useMemo(() => {
    if (!data || data.length === 0) return '';
    
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    return data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - minValue) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');
  }, [data, width, height]);

  if (!data || data.length === 0) {
    return <Box sx={{ width, height, bgcolor: 'grey.100', borderRadius: 1 }} />;
  }

  return (
    <svg width={width} height={height}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
});

export const MiniBarChart = memo(({ data, width = 80, height = 30, color = '#000' }) => {
  const bars = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const maxValue = Math.max(...data);
    const barWidth = width / data.length;
    
    return data.map((value, index) => {
      const barHeight = (value / maxValue) * height;
      const x = index * barWidth;
      const y = height - barHeight;
      
      return (
        <rect
          key={index}
          x={x}
          y={y}
          width={barWidth - 1}
          height={barHeight}
          fill={color}
          opacity={0.7}
        />
      );
    });
  }, [data, width, height, color]);

  if (!data || data.length === 0) {
    return <Box sx={{ width, height, bgcolor: 'grey.100', borderRadius: 1 }} />;
  }

  return (
    <svg width={width} height={height}>
      {bars}
    </svg>
  );
});

// Chart type definitions with enhanced metadata
export const CHART_TYPES = {
  unified: [
    {
      value: 'line',
      label: 'Line Chart',
      category: 'Basic',
      description: 'Show trends over time or continuous data',
      bestFor: ['Time series', 'Trends', 'Continuous data'],
      requiresNumeric: ['y'],
      icon: '📈',
      complexity: 1
    },
    {
      value: 'bar',
      label: 'Bar Chart',
      category: 'Basic',
      description: 'Compare values across categories',
      bestFor: ['Categorical comparison', 'Rankings', 'Counts'],
      requiresNumeric: ['y'],
      icon: '📊',
      complexity: 1
    },
    {
      value: 'area',
      label: 'Area Chart',
      category: 'Basic',
      description: 'Show cumulative values over time',
      bestFor: ['Cumulative data', 'Parts of whole over time'],
      requiresNumeric: ['y'],
      icon: '📈',
      complexity: 1
    },
    {
      value: 'pie',
      label: 'Pie Chart',
      category: 'Basic',
      description: 'Show parts of a whole',
      bestFor: ['Proportions', 'Market share', 'Composition'],
      requiresNumeric: ['y'],
      icon: '🥧',
      complexity: 1
    },
    {
      value: 'doughnut',
      label: 'Doughnut Chart',
      category: 'Basic',
      description: 'Pie chart with hollow center for multiple series',
      bestFor: ['Nested proportions', 'Multiple categories'],
      requiresNumeric: ['y'],
      icon: '🍩',
      complexity: 2
    },
    {
      value: 'scatter',
      label: 'Scatter Plot',
      category: 'Statistical',
      description: 'Show correlation between two variables',
      bestFor: ['Correlation', 'Outliers', 'Distribution'],
      requiresNumeric: ['x', 'y'],
      icon: '🔵',
      complexity: 2
    },
    {
      value: 'bubble',
      label: 'Bubble Chart',
      category: 'Statistical',
      description: '3D scatter plot with size dimension',
      bestFor: ['Three-dimensional relationships', 'Complex comparisons'],
      requiresNumeric: ['x', 'y', 'size'],
      icon: '⭕',
      complexity: 3
    },
    {
      value: 'histogram',
      label: 'Histogram',
      category: 'Statistical',
      description: 'Show data distribution',
      bestFor: ['Distribution', 'Frequency', 'Statistical analysis'],
      requiresNumeric: ['y'],
      icon: '📊',
      complexity: 2
    },
    {
      value: 'boxplot',
      label: 'Box Plot',
      category: 'Statistical',
      description: 'Show data quartiles and outliers',
      bestFor: ['Statistical summary', 'Outliers', 'Data quality'],
      requiresNumeric: ['y'],
      icon: '📦',
      complexity: 3
    },
    {
      value: 'violin',
      label: 'Violin Plot',
      category: 'Statistical',
      description: 'Box plot with distribution shape',
      bestFor: ['Distribution shape', 'Statistical analysis'],
      requiresNumeric: ['y'],
      icon: '🎻',
      complexity: 4
    },
    {
      value: 'heatmap',
      label: 'Heatmap',
      category: 'Advanced',
      description: 'Show correlation matrix or 2D data density',
      bestFor: ['Correlations', '2D patterns', 'Matrix data'],
      requiresNumeric: ['x', 'y', 'z'],
      icon: '🔥',
      complexity: 3
    },
    {
      value: 'treemap',
      label: 'Treemap',
      category: 'Advanced',
      description: 'Hierarchical data as nested rectangles',
      bestFor: ['Hierarchical data', 'Proportional sizes'],
      requiresNumeric: ['size'],
      icon: '🌳',
      complexity: 3
    },
    {
      value: 'waterfall',
      label: 'Waterfall Chart',
      category: 'Business',
      description: 'Show cumulative effect of values',
      bestFor: ['Financial analysis', 'Step-by-step changes'],
      requiresNumeric: ['y'],
      icon: '💧',
      complexity: 3
    },
    {
      value: 'funnel',
      label: 'Funnel Chart',
      category: 'Business',
      description: 'Show process flow with declining values',
      bestFor: ['Sales funnels', 'Process efficiency'],
      requiresNumeric: ['y'],
      icon: '🚁',
      complexity: 2
    },
    {
      value: 'gauge',
      label: 'Gauge Chart',
      category: 'Business',
      description: 'Show single value within a range',
      bestFor: ['KPIs', 'Performance metrics', 'Progress'],
      requiresNumeric: ['value'],
      icon: '⚡',
      complexity: 2
    },
    {
      value: 'radar',
      label: 'Radar Chart',
      category: 'Multivariate',
      description: 'Compare multiple variables',
      bestFor: ['Multi-dimensional comparison', 'Performance profiles'],
      requiresNumeric: ['multiple'],
      icon: '🎯',
      complexity: 3
    },
    {
      value: 'polarArea',
      label: 'Polar Area',
      category: 'Multivariate',
      description: 'Circular bar chart',
      bestFor: ['Cyclical data', 'Angular measurements'],
      requiresNumeric: ['y'],
      icon: '🌀',
      complexity: 3
    }
  ],
  recharts: [
    {
      value: 'line',
      label: 'Line Chart',
      category: 'Basic',
      description: 'Simple line charts with animations',
      bestFor: ['Time series', 'Simple trends'],
      requiresNumeric: ['y'],
      icon: '📈',
      complexity: 1
    },
    {
      value: 'bar',
      label: 'Bar Chart',
      category: 'Basic',
      description: 'Animated bar charts',
      bestFor: ['Category comparison'],
      requiresNumeric: ['y'],
      icon: '📊',
      complexity: 1
    },
    {
      value: 'area',
      label: 'Area Chart',
      category: 'Basic',
      description: 'Filled line charts',
      bestFor: ['Cumulative values'],
      requiresNumeric: ['y'],
      icon: '📈',
      complexity: 1
    },
    {
      value: 'pie',
      label: 'Pie Chart',
      category: 'Basic',
      description: 'Interactive pie charts',
      bestFor: ['Proportions'],
      requiresNumeric: ['y'],
      icon: '🥧',
      complexity: 1
    },
    {
      value: 'scatter',
      label: 'Scatter Plot',
      category: 'Statistical',
      description: 'Interactive scatter plots',
      bestFor: ['Correlation analysis'],
      requiresNumeric: ['x', 'y'],
      icon: '🔵',
      complexity: 2
    }
  ]
};

// Chart recommendation engine
export const getChartRecommendations = (data) => {
  if (!data || !data.data || !data.columns) return [];

  const numericColumns = data.columns.filter(col => {
    const sample = data.data[0]?.[col];
    return !isNaN(parseFloat(sample)) && isFinite(sample);
  });

  const categoricalColumns = data.columns.filter(col => {
    const sample = data.data[0]?.[col];
    return isNaN(parseFloat(sample)) || !isFinite(sample);
  });

  const recommendations = [];
  const dataSize = data.data.length;

  // Basic recommendations
  if (numericColumns.length >= 1) {
    recommendations.push({
      type: 'histogram',
      reason: 'Explore data distribution',
      priority: 'high',
      columns: { y: numericColumns[0] }
    });
  }

  if (numericColumns.length >= 2) {
    recommendations.push({
      type: 'scatter',
      reason: 'Explore relationships between variables',
      priority: 'high',
      columns: { x: numericColumns[0], y: numericColumns[1] }
    });
  }

  if (categoricalColumns.length >= 1 && numericColumns.length >= 1) {
    recommendations.push({
      type: 'bar',
      reason: 'Compare values across categories',
      priority: 'medium',
      columns: { x: categoricalColumns[0], y: numericColumns[0] }
    });
  }

  // Time series detection
  const timeColumns = data.columns.filter(col => {
    const sample = data.data[0]?.[col];
    return !isNaN(Date.parse(sample));
  });

  if (timeColumns.length >= 1 && numericColumns.length >= 1) {
    recommendations.push({
      type: 'line',
      reason: 'Time series analysis',
      priority: 'high',
      columns: { x: timeColumns[0], y: numericColumns[0] }
    });
  }

  // Advanced recommendations for larger datasets
  if (dataSize > 1000) {
    recommendations.push({
      type: 'heatmap',
      reason: 'Pattern detection in large dataset',
      priority: 'medium',
      columns: { x: categoricalColumns[0], y: categoricalColumns[1] }
    });
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
};

// Chart performance optimizer
export const getOptimalChartConfig = (chartType, dataSize, renderContext = 'dashboard') => {
  const baseConfig = {
    animated: dataSize < 1000,
    responsive: true,
    maintainAspectRatio: renderContext !== 'fullscreen',
    interaction: {
      intersect: dataSize < 5000,
      mode: dataSize < 1000 ? 'point' : 'nearest'
    }
  };

  // Specific optimizations per chart type
  switch (chartType) {
    case 'scatter':
    case 'bubble':
      return {
        ...baseConfig,
        elements: {
          point: {
            radius: dataSize > 1000 ? 2 : 4,
            hoverRadius: dataSize > 1000 ? 3 : 6
          }
        }
      };
    
    case 'line':
    case 'area':
      return {
        ...baseConfig,
        elements: {
          line: {
            tension: 0.4,
            borderWidth: dataSize > 5000 ? 1 : 2
          },
          point: {
            radius: dataSize > 1000 ? 0 : 3
          }
        }
      };
    
    case 'bar':
      return {
        ...baseConfig,
        scales: {
          x: {
            maxBarThickness: dataSize > 50 ? 10 : 30,
            categoryPercentage: dataSize > 100 ? 0.6 : 0.8
          }
        }
      };
    
    default:
      return baseConfig;
  }
};

export default {
  CHART_TYPES,
  getChartRecommendations,
  getOptimalChartConfig,
  MiniLineChart,
  MiniBarChart
};