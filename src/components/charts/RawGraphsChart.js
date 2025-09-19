import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import { Download, Settings } from '@mui/icons-material';
import * as d3 from 'd3';
import { 
  alluvialdiagram,
  arcdiagram,
  barchart,
  barchartmultiset,
  barchartstacked,
  beeswarm,
  boxplot,
  bubblechart,
  bumpchart,
  chorddiagram,
  circlepacking,
  circularDendrogram,
  contourPlot,
  convexHull,
  dendrogram,
  ganttChart,
  hexagonalBinning,
  horizongraph,
  linechart,
  matrixplot,
  parallelcoordinates,
  piechart,
  radarchart,
  sankeydiagram,
  slopechart,
  streamgraph,
  sunburst,
  treemap,
  violinplot,
  voronoidiagram,
  voronoitreemap,
} from '@rawgraphs/rawgraphs-charts';
import { calendarHeatmap } from '@rawgraphs/rawgraphs-calendar-heatmap';

// Map chart types to their implementations
const chartMap = {
  alluvialdiagram,
  arcdiagram,
  rawbarchart: barchart, // Renamed to avoid conflict
  barchartmultiset,
  barchartstacked,
  beeswarm,
  boxplot,
  rawbubblechart: bubblechart, // Renamed to avoid conflict
  bumpchart,
  calendarHeatmap,
  chorddiagram,
  circlepacking,
  circularDendrogram,
  rawcontourplot: contourPlot, // Renamed to avoid conflict
  convexHull,
  dendrogram,
  ganttChart,
  hexagonalBinning,
  horizongraph,
  rawlinechart: linechart, // Renamed to avoid conflict
  matrixplot,
  parallelcoordinates,
  rawpiechart: piechart, // Renamed to avoid conflict
  radarchart,
  sankeydiagram,
  slopechart,
  streamgraph,
  sunburst,
  treemap,
  violinplot,
  voronoidiagram,
  voronoitreemap,
};

const RawGraphsChart = ({ 
  data, 
  chartType, 
  title, 
  mapping = {},
  visualOptions = {},
  onConfigChange,
  onExport 
}) => {
  const svgRef = useRef();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartInstance, setChartInstance] = useState(null);

  // Get the chart implementation
  const chart = useMemo(() => {
    return chartMap[chartType];
  }, [chartType]);

  // Transform data format for RAWGraphs
  const transformedData = useMemo(() => {
    if (!data || !data.data) return null;
    
    try {
      // RAWGraphs expects data in a specific format
      const rawData = data.data.map(row => {
        const transformedRow = {};
        Object.keys(row).forEach(key => {
          transformedRow[key] = row[key];
        });
        return transformedRow;
      });

      return {
        data: rawData,
        dataTypes: data.columns ? data.columns.reduce((acc, col) => {
          // Determine data type based on sample values
          const sampleValue = rawData[0]?.[col];
          if (sampleValue !== undefined && sampleValue !== null) {
            if (!isNaN(parseFloat(sampleValue)) && isFinite(sampleValue)) {
              acc[col] = 'number';
            } else if (!isNaN(Date.parse(sampleValue))) {
              acc[col] = 'date';
            } else {
              acc[col] = 'string';
            }
          } else {
            acc[col] = 'string';
          }
          return acc;
        }, {}) : {}
      };
    } catch (err) {
      console.error('Error transforming data:', err);
      setError('Failed to transform data for visualization');
      return null;
    }
  }, [data]);

  // Render the chart
  useEffect(() => {
    if (!chart || !transformedData || !svgRef.current) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Clear previous content
      d3.select(svgRef.current).selectAll('*').remove();
      
      // Set up dimensions
      const containerWidth = svgRef.current.clientWidth || 800;
      const containerHeight = 400;
      
      // Create SVG
      const svg = d3.select(svgRef.current)
        .attr('width', containerWidth)
        .attr('height', containerHeight);

      // Default visual options for the chart
      const defaultOptions = chart.visualOptions ? 
        Object.keys(chart.visualOptions).reduce((acc, key) => {
          const option = chart.visualOptions[key];
          acc[key] = option.default !== undefined ? option.default : option.defaultValue;
          return acc;
        }, {}) : {};

      const finalOptions = { ...defaultOptions, ...visualOptions };

      // Default mapping based on available data
      const defaultMapping = {};
      if (chart.dimensions && transformedData.data.length > 0) {
        const availableColumns = Object.keys(transformedData.data[0]);
        chart.dimensions.forEach((dimension, index) => {
          if (dimension.required && availableColumns[index]) {
            defaultMapping[dimension.id] = {
              value: [availableColumns[index]],
              config: {}
            };
          }
        });
      }

      const finalMapping = { ...defaultMapping, ...mapping };

      // Render the chart using RAWGraphs render function
      if (chart.render) {
        const renderResult = chart.render(
          svg.node(),
          transformedData.data,
          finalMapping,
          finalOptions,
          transformedData.dataTypes
        );
        
        setChartInstance({ chart, svg, mapping: finalMapping, options: finalOptions });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error rendering RAWGraphs chart:', err);
      setError(`Failed to render ${chartType}: ${err.message}`);
      setLoading(false);
    }
  }, [chart, transformedData, mapping, visualOptions, chartType]);

  // Handle export
  const handleExport = (format) => {
    if (!svgRef.current) return;
    
    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || chartType}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${title || chartType}.png`;
          a.click();
          URL.revokeObjectURL(url);
        });
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
    
    if (onExport) {
      onExport(format);
    }
  };

  if (!chart) {
    return (
      <Alert severity="error">
        Chart type "{chartType}" is not supported or failed to load.
      </Alert>
    );
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3">
            {title || chart.metadata?.name || chartType}
          </Typography>
          <Box>
            <Tooltip title="Export as SVG">
              <IconButton size="small" onClick={() => handleExport('svg')}>
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export as PNG">
              <IconButton size="small" onClick={() => handleExport('png')}>
                <Download />
              </IconButton>
            </Tooltip>
            {onConfigChange && (
              <Tooltip title="Chart Settings">
                <IconButton size="small" onClick={onConfigChange}>
                  <Settings />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
      
      <CardContent sx={{ flex: 1, pt: 0, display: 'flex', flexDirection: 'column' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ flex: 1, minHeight: 300 }}>
          <svg
            ref={svgRef}
            style={{
              width: '100%',
              height: '100%',
              display: loading ? 'none' : 'block'
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default RawGraphsChart;