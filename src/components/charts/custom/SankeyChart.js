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

const SankeyChart = ({ 
  data, 
  title = 'Sankey Diagram', 
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

      // Process data for Sankey
      const processedData = processDataForSankey(data.data, xAxis, yAxis, sizeBy);
      
      if (!processedData.nodes.length || !processedData.links.length) {
        setError('No valid source-target relationships found in data');
        setLoading(false);
        return;
      }

      // Set up dimensions
      const containerWidth = svgRef.current.clientWidth || 800;
      const containerHeight = 600;
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;

      // Create SVG
      const svg = d3.select(svgRef.current)
        .attr('width', containerWidth)
        .attr('height', containerHeight);

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create simple Sankey-like layout
      const { nodes, links } = createSankeyLayout(processedData, width, height);

      // Color scale for nodes and links
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      // Draw links
      const link = g.append('g')
        .selectAll('path')
        .data(links)
        .join('path')
        .attr('d', d => createLinkPath(d))
        .attr('stroke', d => color(d.source.name))
        .attr('stroke-width', d => Math.max(1, d.width))
        .attr('fill', 'none')
        .attr('opacity', 0.5)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('opacity', 0.8);
          showTooltip(event, `${d.source.name} → ${d.target.name}<br/>Value: ${d.value}`);
        })
        .on('mouseout', function() {
          d3.select(this).attr('opacity', 0.5);
          hideTooltip();
        });

      // Draw nodes
      const node = g.append('g')
        .selectAll('rect')
        .data(nodes)
        .join('rect')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('height', d => d.height)
        .attr('width', 15)
        .attr('fill', d => color(d.name))
        .attr('stroke', '#000')
        .attr('stroke-width', 0.5)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('opacity', 0.8);
          showTooltip(event, `${d.name}<br/>Total Value: ${d.value}`);
        })
        .on('mouseout', function() {
          d3.select(this).attr('opacity', 1);
          hideTooltip();
        });

      // Add labels
      g.append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .attr('x', d => d.x < width / 2 ? d.x + 20 : d.x - 5)
        .attr('y', d => d.y + d.height / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', d => d.x < width / 2 ? 'start' : 'end')
        .text(d => d.name)
        .style('font-size', '12px')
        .style('fill', '#333');

      setLoading(false);
    } catch (err) {
      console.error('Error rendering Sankey chart:', err);
      setError(`Failed to render Sankey diagram: ${err.message}`);
      setLoading(false);
    }
  }, [data, xAxis, yAxis, sizeBy, colorBy]);

  // Process data for Sankey format
  const processDataForSankey = (rawData, sourceCol, targetCol, valueCol) => {
    const nodeMap = new Map();
    const links = [];

    rawData.forEach(d => {
      const source = String(d[sourceCol] || '');
      const target = String(d[targetCol] || '');
      const value = parseFloat(d[valueCol]) || 1;

      if (!source || !target) return;

      // Add nodes to map
      if (!nodeMap.has(source)) {
        nodeMap.set(source, { name: source, id: source });
      }
      if (!nodeMap.has(target)) {
        nodeMap.set(target, { name: target, id: target });
      }

      // Add link
      links.push({
        source: source,
        target: target,
        value: value
      });
    });

    return { nodes: Array.from(nodeMap.values()), links };
  };

  // Create simple Sankey layout
  const createSankeyLayout = (data, width, height) => {
    const { nodes, links } = data;
    
    // Separate source and target nodes
    const sourceNodes = new Set(links.map(l => l.source));
    const targetNodes = new Set(links.map(l => l.target));
    
    // Calculate node values
    const nodeValues = new Map();
    links.forEach(link => {
      nodeValues.set(link.source, (nodeValues.get(link.source) || 0) + link.value);
      nodeValues.set(link.target, (nodeValues.get(link.target) || 0) + link.value);
    });

    // Position nodes
    const leftNodes = nodes.filter(n => sourceNodes.has(n.name) && !targetNodes.has(n.name));
    const rightNodes = nodes.filter(n => targetNodes.has(n.name) && !sourceNodes.has(n.name));
    const middleNodes = nodes.filter(n => sourceNodes.has(n.name) && targetNodes.has(n.name));

    const allNodes = [...leftNodes, ...middleNodes, ...rightNodes];
    const totalValue = Math.max(...Array.from(nodeValues.values()));
    
    // Position nodes vertically
    let yPos = 0;
    const positionedNodes = allNodes.map((node, i) => {
      const nodeValue = nodeValues.get(node.name) || 1;
      const nodeHeight = Math.max(5, (nodeValue / totalValue) * height * 0.8);
      
      let x;
      if (leftNodes.includes(node)) x = 0;
      else if (rightNodes.includes(node)) x = width - 15;
      else x = width / 2 - 7.5;

      const positioned = {
        ...node,
        x,
        y: yPos,
        height: nodeHeight,
        value: nodeValue
      };
      
      yPos += nodeHeight + 10;
      if (yPos > height - nodeHeight) yPos = 0;
      
      return positioned;
    });

    // Create positioned links
    const positionedLinks = links.map(link => {
      const sourceNode = positionedNodes.find(n => n.name === link.source);
      const targetNode = positionedNodes.find(n => n.name === link.target);
      
      return {
        source: sourceNode,
        target: targetNode,
        value: link.value,
        width: Math.max(1, (link.value / totalValue) * 50)
      };
    });

    return { nodes: positionedNodes, links: positionedLinks };
  };

  // Create link path
  const createLinkPath = (link) => {
    const x0 = link.source.x + 15;
    const y0 = link.source.y + link.source.height / 2;
    const x1 = link.target.x;
    const y1 = link.target.y + link.target.height / 2;
    
    const xi = d3.interpolateNumber(x0, x1);
    const x2 = xi(0.6);
    const x3 = xi(0.4);
    
    return `M${x0},${y0}C${x2},${y0} ${x3},${y1} ${x1},${y1}`;
  };

  // Tooltip functions
  const showTooltip = (event, content) => {
    const tooltip = d3.select('body').append('div')
      .attr('class', 'sankey-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .html(content)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px');
  };

  const hideTooltip = () => {
    d3.selectAll('.sankey-tooltip').remove();
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
      a.download = `${title.replace(/\s+/g, '_')}_sankey.svg`;
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

export default SankeyChart;