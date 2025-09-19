import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
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

const ChordChart = ({ 
  data, 
  title = 'Chord Diagram', 
  xAxis = 'source', 
  yAxis = 'target', 
  sizeBy = 'value',
  colorBy = null,
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

      // Process data for Chord diagram
      const processedData = processDataForChord(data.data, xAxis, yAxis, sizeBy);
      
      if (!processedData || !processedData.matrix.length) {
        setError('No valid relationships found in data');
        setLoading(false);
        return;
      }

      // Set up dimensions
      const containerWidth = svgRef.current.clientWidth || 800;
      const containerHeight = 600;
      const radius = Math.min(containerWidth, containerHeight) / 2 - 50;

      // Create SVG
      const svg = d3.select(svgRef.current)
        .attr('width', containerWidth)
        .attr('height', containerHeight);

      const g = svg.append('g')
        .attr('transform', `translate(${containerWidth/2},${containerHeight/2})`);

      // Create chord layout
      const chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending);

      const chords = chord(processedData.matrix);

      // Color scale
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      // Create arc generator for groups
      const arc = d3.arc()
        .innerRadius(radius)
        .outerRadius(radius + 20);

      // Create ribbon generator
      const ribbon = d3.ribbon()
        .radius(radius);

      // Add groups (nodes)
      const group = g.append('g')
        .selectAll('g')
        .data(chords.groups)
        .join('g');

      group.append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i))
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('opacity', 0.8);
          showTooltip(event, processedData.names[d.index], d.value);
        })
        .on('mouseout', function() {
          d3.select(this).attr('opacity', 1);
          hideTooltip();
        });

      // Add labels
      group.append('text')
        .attr('transform', d => {
          const angle = (d.startAngle + d.endAngle) / 2;
          return `rotate(${(angle * 180 / Math.PI - 90)}) translate(${radius + 25}) ${angle > Math.PI ? 'rotate(180)' : ''}`;
        })
        .attr('text-anchor', d => {
          const angle = (d.startAngle + d.endAngle) / 2;
          return angle > Math.PI ? 'end' : 'start';
        })
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('fill', '#333')
        .text((d, i) => processedData.names[i]);

      // Add ribbons (connections)
      g.append('g')
        .selectAll('path')
        .data(chords)
        .join('path')
        .attr('d', ribbon)
        .attr('fill', d => color(d.source.index))
        .attr('opacity', 0.6)
        .attr('stroke', '#000')
        .attr('stroke-width', 0.5)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('opacity', 0.8);
          const sourceName = processedData.names[d.source.index];
          const targetName = processedData.names[d.target.index];
          showTooltip(event, `${sourceName} → ${targetName}`, d.source.value);
        })
        .on('mouseout', function() {
          d3.select(this).attr('opacity', 0.6);
          hideTooltip();
        });

      setLoading(false);
    } catch (err) {
      console.error('Error rendering Chord chart:', err);
      setError(`Failed to render Chord diagram: ${err.message}`);
      setLoading(false);
    }
  }, [data, xAxis, yAxis, sizeBy, colorBy]);

  // Process data for Chord diagram
  const processDataForChord = (rawData, sourceCol, targetCol, valueCol) => {
    // Get all unique nodes
    const nodes = new Set();
    rawData.forEach(d => {
      nodes.add(d[sourceCol]);
      nodes.add(d[targetCol]);
    });

    const names = Array.from(nodes);
    const n = names.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));

    // Fill matrix
    rawData.forEach(d => {
      const sourceIndex = names.indexOf(d[sourceCol]);
      const targetIndex = names.indexOf(d[targetCol]);
      const value = parseFloat(d[valueCol]) || 1;
      
      if (sourceIndex >= 0 && targetIndex >= 0) {
        matrix[sourceIndex][targetIndex] += value;
      }
    });

    return { matrix, names };
  };

  const showTooltip = (event, label, value) => {
    d3.select('body').append('div')
      .attr('class', 'chord-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .html(`<strong>${label}</strong><br/>Value: ${value}`)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px');
  };

  const hideTooltip = () => {
    d3.selectAll('.chord-tooltip').remove();
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
      a.download = `${title.replace(/\s+/g, '_')}_chord.svg`;
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

export default ChordChart;