import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { hierarchy, treemap } from 'd3-hierarchy';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { Download } from '@mui/icons-material';

const CustomTreemapChart = ({ 
  data, 
  title = 'Treemap', 
  yAxis = 'value', 
  colorBy = null,
  hierarchy: hierarchyCols = [],
  onExport 
}) => {
  const svgRef = useRef();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data || !data.data || !svgRef.current) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Clear previous content
      d3.select(svgRef.current).selectAll('*').remove();

      // Process data for Treemap
      const processedData = processDataForTreemap(data.data, hierarchyCols, yAxis, colorBy);
      
      if (!processedData) {
        setError('No valid hierarchy or value data found');
        setLoading(false);
        return;
      }

      // Set up dimensions
      const containerWidth = svgRef.current.clientWidth || 800;
      const containerHeight = 600;
      const margin = { top: 10, right: 10, bottom: 10, left: 10 };
      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;

      // Create SVG
      const svg = d3.select(svgRef.current)
        .attr('width', containerWidth)
        .attr('height', containerHeight);

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create Treemap layout
      const treemapLayout = treemap()
        .size([width, height])
        .padding(1)
        .round(true);

      // Create hierarchy and compute layout
      const root = hierarchy(processedData)
        .sum(d => d.value || 0)
        .sort((a, b) => b.value - a.value);

      treemapLayout(root);

      // Color scale
      const color = d3.scaleOrdinal(d3.schemeCategory10);
      
      // Create groups for each leaf
      const leaf = g.selectAll('g')
        .data(root.leaves())
        .enter().append('g')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);

      // Add rectangles
      leaf.append('rect')
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', d => {
          if (colorBy && d.data.colorValue) {
            return color(d.data.colorValue);
          }
          // Use parent color if available
          return color(d.parent ? d.parent.data.name : d.data.name);
        })
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('opacity', 1);
          showTooltip(event, d);
        })
        .on('mouseout', function(event, d) {
          d3.select(this).attr('opacity', 0.8);
          hideTooltip();
        });

      // Add text labels
      leaf.append('text')
        .selectAll('tspan')
        .data(d => {
          const text = d.data.name || '';
          const words = text.toString().split(/\s+/);
          const maxWidth = d.x1 - d.x0 - 6;
          const maxHeight = d.y1 - d.y0 - 6;
          
          if (maxWidth < 30 || maxHeight < 15) return []; // Too small for text
          
          // Simple word wrapping
          const lines = [];
          let currentLine = [];
          
          for (let word of words) {
            const testLine = currentLine.concat(word).join(' ');
            if (testLine.length * 6 > maxWidth && currentLine.length > 0) {
              lines.push(currentLine.join(' '));
              currentLine = [word];
            } else {
              currentLine.push(word);
            }
            if (lines.length * 14 > maxHeight - 14) break;
          }
          if (currentLine.length > 0) lines.push(currentLine.join(' '));
          
          return lines.slice(0, Math.floor(maxHeight / 14));
        })
        .enter().append('tspan')
        .attr('x', 3)
        .attr('y', (d, i) => 15 + (i * 14))
        .text(d => d)
        .style('font-size', '11px')
        .style('fill', 'white')
        .style('font-weight', 'bold')
        .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.7)');

      setLoading(false);
    } catch (err) {
      console.error('Error rendering Treemap chart:', err);
      setError(`Failed to render Treemap: ${err.message}`);
      setLoading(false);
    }
  }, [data, hierarchyCols, yAxis, colorBy]);

  // Process data for Treemap format
  const processDataForTreemap = (rawData, hierarchyColumns, valueCol, colorCol) => {
    if (!rawData.length) return null;

    // If no hierarchy columns provided, create a flat structure
    if (!hierarchyColumns || hierarchyColumns.length === 0) {
      return {
        name: 'root',
        children: rawData.map((d, i) => ({
          name: d.name || d.label || `Item ${i + 1}`,
          value: parseFloat(d[valueCol]) || 0,
          colorValue: colorCol ? d[colorCol] : null
        }))
      };
    }

    // Build hierarchical structure
    const buildHierarchy = (items, level = 0) => {
      if (level >= hierarchyColumns.length) {
        return items.map(item => ({
          name: item.name || item.label || 'Item',
          value: parseFloat(item[valueCol]) || 0,
          colorValue: colorCol ? item[colorCol] : null
        }));
      }

      const col = hierarchyColumns[level];
      const grouped = d3.group(items, d => d[col] || 'Unknown');
      
      return Array.from(grouped, ([key, values]) => ({
        name: key,
        children: buildHierarchy(values, level + 1)
      }));
    };

    const children = buildHierarchy(rawData);
    return {
      name: 'root',
      children: children
    };
  };

  const showTooltip = (event, d) => {
    const hierarchyPath = [];
    let current = d;
    while (current.parent) {
      hierarchyPath.unshift(current.data.name);
      current = current.parent;
    }

    const tooltip = d3.select('body').append('div')
      .attr('class', 'treemap-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    tooltip.html(`
      <strong>${hierarchyPath.join(' > ')}</strong><br/>
      Value: ${d.data.value || 0}
      ${d.data.colorValue ? `<br/>Color: ${d.data.colorValue}` : ''}
    `)
    .style('left', (event.pageX + 10) + 'px')
    .style('top', (event.pageY - 10) + 'px');
  };

  const hideTooltip = () => {
    d3.selectAll('.treemap-tooltip').remove();
  };

  // Handle export
  const handleExport = (format) => {
    if (!svgRef.current) return;
    
    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}_treemap.svg`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    if (onExport) {
      onExport(format);
    }
  };

  if (error) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
          <Box>
            <Tooltip title="Export as SVG">
              <IconButton size="small" onClick={() => handleExport('svg')}>
                <Download />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
      
      <CardContent sx={{ flex: 1, pt: 0, display: 'flex', flexDirection: 'column' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress />
          </Box>
        )}
        
        <Box sx={{ flex: 1, minHeight: 400 }}>
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

export default CustomTreemapChart;