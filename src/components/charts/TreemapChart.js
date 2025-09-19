import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { hierarchy, treemap } from 'd3-hierarchy';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Grid,
  Chip,
  Divider,
  Slider
} from '@mui/material';
import {
  Settings,
  Download,
  MoreVert,
  AccountTree,
  ViewModule
} from '@mui/icons-material';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
  '#d084d0', '#87d068', '#ffb347', '#ff6b6b', '#4ecdc4',
  '#45b7d1', '#96ceb4', '#ffeaa7', '#fab1a0', '#fd79a8'
];

const TreemapChart = ({ 
  data, 
  title = 'Treemap Chart',
  valueColumn = '',
  labelColumn = '',
  categoryColumn = '',
  onExport,
  onConfigChange,
  chartConfig = {}
}) => {
  const svgRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState({
    width: 800,
    height: 500,
    padding: 2,
    showLabels: true,
    showValues: true,
    fontSizeMin: 10,
    fontSizeMax: 18,
    colorScheme: 'category10',
    opacity: 0.8,
    animated: true,
    cornerRadius: 0,
    ...chartConfig
  });

  const availableColumns = useMemo(() => {
    if (!data || !data.columns) return [];
    return data.columns;
  }, [data]);

  const numericColumns = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];
    return availableColumns.filter(col => {
      const sampleValue = data.data[0][col];
      return !isNaN(parseFloat(sampleValue)) && isFinite(sampleValue);
    });
  }, [availableColumns, data]);

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
  };

  // Process data for treemap
  const processedData = useMemo(() => {
    if (!data || !data.data || data.data.length === 0 || !valueColumn) {
      return null;
    }

    const processedItems = data.data.map((item, index) => ({
      id: `item-${index}`,
      label: labelColumn ? String(item[labelColumn]) : `Item ${index + 1}`,
      value: parseFloat(item[valueColumn]) || 0,
      category: categoryColumn ? String(item[categoryColumn]) : 'Default',
      originalData: item
    })).filter(item => item.value > 0);

    // Group by category if category column is specified
    if (categoryColumn) {
      const grouped = {};
      processedItems.forEach(item => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      });

      return {
        name: 'root',
        children: Object.entries(grouped).map(([category, items]) => ({
          name: category,
          children: items.map(item => ({
            name: item.label,
            value: item.value,
            originalData: item.originalData
          }))
        }))
      };
    } else {
      return {
        name: 'root',
        children: processedItems.map(item => ({
          name: item.label,
          value: item.value,
          originalData: item.originalData
        }))
      };
    }
  }, [data, valueColumn, labelColumn, categoryColumn]);

  // Create treemap layout
  useEffect(() => {
    if (!processedData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const root = hierarchy(processedData)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    const treemapLayout = treemap()
      .size([config.width, config.height])
      .padding(config.padding)
      .round(true);

    treemapLayout(root);

    // Color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create groups for each leaf
    const leaves = svg.selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // Add rectangles
    const rects = leaves.append('rect')
      .attr('width', d => Math.max(0, d.x1 - d.x0))
      .attr('height', d => Math.max(0, d.y1 - d.y0))
      .attr('fill', (d, i) => {
        if (categoryColumn) {
          return colorScale(d.parent.data.name);
        } else {
          return COLORS[i % COLORS.length];
        }
      })
      .attr('opacity', config.opacity)
      .attr('stroke', 'white')
      .attr('stroke-width', 1);

    // Add corner radius if specified
    if (config.cornerRadius > 0) {
      rects.attr('rx', config.cornerRadius)
        .attr('ry', config.cornerRadius);
    }

    // Add labels if enabled
    if (config.showLabels) {
      const labels = leaves.append('text')
        .attr('x', d => (d.x1 - d.x0) / 2)
        .attr('y', d => (d.y1 - d.y0) / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .attr('pointer-events', 'none')
        .style('font-size', d => {
          const width = d.x1 - d.x0;
          const height = d.y1 - d.y0;
          const area = width * height;
          const fontSize = Math.max(
            config.fontSizeMin,
            Math.min(config.fontSizeMax, Math.sqrt(area) / 8)
          );
          return `${fontSize}px`;
        })
        .each(function(d) {
          const text = d3.select(this);
          const width = d.x1 - d.x0;
          const height = d.y1 - d.y0;
          
          if (width < 30 || height < 20) {
            text.style('display', 'none');
            return;
          }

          // Add name
          text.append('tspan')
            .attr('x', width / 2)
            .attr('dy', '0em')
            .text(d.data.name.length > 15 ? d.data.name.substring(0, 15) + '...' : d.data.name);

          // Add value if enabled
          if (config.showValues && height > 40) {
            text.append('tspan')
              .attr('x', width / 2)
              .attr('dy', '1.2em')
              .style('font-size', '0.8em')
              .style('opacity', 0.9)
              .text(d.value.toLocaleString());
          }
        });
    }

    // Add hover effects and tooltips
    leaves
      .on('mouseover', function(event, d) {
        d3.select(this).select('rect')
          .attr('opacity', 1)
          .attr('stroke-width', 2);

        // Create tooltip
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'treemap-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', 1000)
          .style('opacity', 0);

        const tooltipContent = [
          `<strong>${d.data.name}</strong>`,
          `Value: ${d.value.toLocaleString()}`
        ];

        if (categoryColumn && d.parent) {
          tooltipContent.unshift(`Category: ${d.parent.data.name}`);
        }

        tooltip.html(tooltipContent.join('<br/>'))
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mousemove', function(event) {
        d3.select('.treemap-tooltip')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).select('rect')
          .attr('opacity', config.opacity)
          .attr('stroke-width', 1);

        d3.select('.treemap-tooltip').remove();
      });

    // Animation
    if (config.animated) {
      rects
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .attr('opacity', config.opacity);
    }

  }, [processedData, config, categoryColumn]);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format) => {
    if (onExport) {
      onExport(format, svgRef.current);
    }
    handleMenuClose();
  };

  const renderSettings = () => (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth size="small">
          <InputLabel>Value Column</InputLabel>
          <Select
            value={valueColumn}
            label="Value Column"
            onChange={(e) => handleConfigChange('valueColumn', e.target.value)}
          >
            {numericColumns.map(col => (
              <MenuItem key={col} value={col}>{col}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth size="small">
          <InputLabel>Label Column</InputLabel>
          <Select
            value={labelColumn}
            label="Label Column"
            onChange={(e) => handleConfigChange('labelColumn', e.target.value)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {availableColumns.map(col => (
              <MenuItem key={col} value={col}>{col}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth size="small">
          <InputLabel>Category Column</InputLabel>
          <Select
            value={categoryColumn}
            label="Category Column"
            onChange={(e) => handleConfigChange('categoryColumn', e.target.value)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {availableColumns.map(col => (
              <MenuItem key={col} value={col}>{col}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography gutterBottom>Padding</Typography>
        <Slider
          value={config.padding}
          onChange={(e, value) => handleConfigChange('padding', value)}
          min={0}
          max={10}
          step={1}
          valueLabelDisplay="auto"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography gutterBottom>Opacity</Typography>
        <Slider
          value={config.opacity}
          onChange={(e, value) => handleConfigChange('opacity', value)}
          min={0.1}
          max={1}
          step={0.1}
          valueLabelDisplay="auto"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <Typography gutterBottom>Corner Radius</Typography>
        <Slider
          value={config.cornerRadius}
          onChange={(e, value) => handleConfigChange('cornerRadius', value)}
          min={0}
          max={10}
          step={1}
          valueLabelDisplay="auto"
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={config.showLabels}
              onChange={(e) => handleConfigChange('showLabels', e.target.checked)}
            />
          }
          label="Show Labels"
        />
        <FormControlLabel
          control={
            <Switch
              checked={config.showValues}
              onChange={(e) => handleConfigChange('showValues', e.target.checked)}
            />
          }
          label="Show Values"
        />
        <FormControlLabel
          control={
            <Switch
              checked={config.animated}
              onChange={(e) => handleConfigChange('animated', e.target.checked)}
            />
          }
          label="Animated"
        />
      </Grid>
    </Grid>
  );

  if (!processedData || !valueColumn) {
    return (
      <Paper elevation={3} sx={{ p: 2, height: config.height }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountTree color="primary" />
            <Typography variant="h6">{title}</Typography>
          </Box>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            size="small"
          >
            <MoreVert />
          </IconButton>
        </Box>

        <Box 
          sx={{ 
            height: '70%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            color: 'text.secondary'
          }}
        >
          <ViewModule sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" gutterBottom>
            Treemap Configuration Required
          </Typography>
          <Typography variant="body2" textAlign="center">
            Please select a value column to display the treemap
          </Typography>
          <Box sx={{ mt: 2 }}>
            {!valueColumn && <Chip label="Value Column needed" color="warning" size="small" />}
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => setShowSettings(!showSettings)}>
            <Settings sx={{ mr: 1 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={() => handleExport('png')}>
            <Download sx={{ mr: 1 }} />
            Export PNG
          </MenuItem>
          <MenuItem onClick={() => handleExport('svg')}>
            <Download sx={{ mr: 1 }} />
            Export SVG
          </MenuItem>
        </Menu>

        {showSettings && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" gutterBottom>Chart Settings</Typography>
            {renderSettings()}
          </Box>
        )}
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, height: 'fit-content' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountTree color="primary" />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          size="small"
        >
          <MoreVert />
        </IconButton>
      </Box>

      <Box sx={{ width: '100%', overflow: 'auto' }}>
        <svg
          ref={svgRef}
          width={config.width}
          height={config.height}
          style={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '4px',
            background: '#fafafa'
          }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => setShowSettings(!showSettings)}>
          <Settings sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={() => handleExport('png')}>
          <Download sx={{ mr: 1 }} />
          Export PNG
        </MenuItem>
        <MenuItem onClick={() => handleExport('svg')}>
          <Download sx={{ mr: 1 }} />
          Export SVG
        </MenuItem>
      </Menu>

      {showSettings && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" gutterBottom>Treemap Settings</Typography>
          {renderSettings()}
        </Box>
      )}
    </Paper>
  );
};

export default TreemapChart;