import { useState, useEffect, useCallback, useMemo } from 'react';

// Custom hook for managing dashboard layout state with persistence
export const useDashboardLayout = (initialWidgets = [], initialLayout = []) => {
  const [widgets, setWidgets] = useState(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('dashboard-widgets');
    return saved ? JSON.parse(saved) : initialWidgets;
  });
  
  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem('dashboard-layout');
    return saved ? JSON.parse(saved) : initialLayout;
  });

  // Save to localStorage whenever widgets or layout changes
  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
  }, [widgets]);

  useEffect(() => {
    localStorage.setItem('dashboard-layout', JSON.stringify(layout));
  }, [layout]);

  const addWidget = useCallback((widget) => {
    const id = `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newWidget = { id, ...widget };
    
    const layoutItem = {
      i: id,
      x: (widgets.length * 6) % 12,
      y: Math.floor(widgets.length / 2) * 6,
      w: 6,
      h: 6,
      minW: 3,
      minH: 3,
      maxW: 12,
      maxH: 12
    };

    setWidgets(prev => [...prev, newWidget]);
    setLayout(prev => [...prev, layoutItem]);
    
    return id;
  }, [widgets.length]);

  const updateWidget = useCallback((widgetId, updates) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, ...updates } : w
    ));
  }, []);

  const deleteWidget = useCallback((widgetId) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
    setLayout(prev => prev.filter(l => l.i !== widgetId));
  }, []);

  const duplicateWidget = useCallback((widgetId) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      const newWidget = {
        ...widget,
        title: `${widget.title} (Copy)`
      };
      addWidget(newWidget);
    }
  }, [widgets, addWidget]);

  const clearAll = useCallback(() => {
    setWidgets([]);
    setLayout([]);
    localStorage.removeItem('dashboard-widgets');
    localStorage.removeItem('dashboard-layout');
  }, []);

  return {
    widgets,
    layout,
    setLayout,
    addWidget,
    updateWidget,
    deleteWidget,
    duplicateWidget,
    clearAll
  };
};

// Custom hook for chart configuration management
export const useChartConfig = (initialConfig = {}) => {
  const [config, setConfig] = useState({
    // Default configuration
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    animated: true,
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: '#1E222D',
    borderColor: '#2962FF',
    borderWidth: 2,
    pointRadius: 4,
    tension: 0.4,
    opacity: 0.8,
    ...initialConfig
  });

  const updateConfig = useCallback((updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig({
      showGrid: true,
      showLegend: true,
      showTooltip: true,
      animated: true,
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: '#1E222D',
      borderColor: '#2962FF',
      borderWidth: 2,
      pointRadius: 4,
      tension: 0.4,
      opacity: 0.8,
      ...initialConfig
    });
  }, [initialConfig]);

  return {
    config,
    updateConfig,
    resetConfig
  };
};

// Hook for managing chart data transformations
export const useChartData = (rawData, xAxis, yAxis, chartType, filters = {}) => {
  const processedData = useMemo(() => {
    if (!rawData || !rawData.data || !xAxis || !yAxis) return [];

    let data = rawData.data;

    // Apply filters
    if (filters.dateRange) {
      data = data.filter(item => {
        const date = new Date(item[xAxis]);
        return date >= filters.dateRange.start && date <= filters.dateRange.end;
      });
    }

    if (filters.valueRange) {
      data = data.filter(item => {
        const value = parseFloat(item[yAxis]);
        return value >= filters.valueRange.min && value <= filters.valueRange.max;
      });
    }

    // Transform based on chart type
    switch (chartType) {
      case 'pie':
      case 'doughnut':
        return aggregateData(data, xAxis, yAxis);
      case 'histogram':
        return createHistogramData(data, yAxis);
      case 'boxplot':
        return createBoxPlotData(data, yAxis, xAxis);
      default:
        return data.map((item, index) => ({
          ...item,
          _index: index,
          _id: `data_${index}`
        }));
    }
  }, [rawData, xAxis, yAxis, chartType, filters]);

  return processedData;
};

// Helper functions for data transformation
const aggregateData = (data, groupBy, valueField) => {
  const grouped = data.reduce((acc, item) => {
    const key = item[groupBy];
    const value = parseFloat(item[valueField]) || 0;
    acc[key] = (acc[key] || 0) + value;
    return acc;
  }, {});

  return Object.entries(grouped).map(([key, value]) => ({
    [groupBy]: key,
    [valueField]: value,
    label: key,
    value: value
  }));
};

const createHistogramData = (data, field, bins = 10) => {
  const values = data.map(item => parseFloat(item[field])).filter(v => !isNaN(v));
  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / bins;

  const histogram = Array(bins).fill(0).map((_, i) => ({
    bin: `${(min + i * binSize).toFixed(1)}-${(min + (i + 1) * binSize).toFixed(1)}`,
    count: 0,
    range: [min + i * binSize, min + (i + 1) * binSize]
  }));

  values.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1);
    histogram[binIndex].count++;
  });

  return histogram;
};

const createBoxPlotData = (data, valueField, groupField) => {
  const grouped = data.reduce((acc, item) => {
    const group = item[groupField] || 'All';
    const value = parseFloat(item[valueField]);
    if (!isNaN(value)) {
      if (!acc[group]) acc[group] = [];
      acc[group].push(value);
    }
    return acc;
  }, {});

  return Object.entries(grouped).map(([group, values]) => {
    values.sort((a, b) => a - b);
    const q1 = values[Math.floor(values.length * 0.25)];
    const median = values[Math.floor(values.length * 0.5)];
    const q3 = values[Math.floor(values.length * 0.75)];
    const min = values[0];
    const max = values[values.length - 1];

    return {
      group,
      min,
      q1,
      median,
      q3,
      max,
      outliers: [] // Could add outlier detection here
    };
  });
};

export { useMemo } from 'react';