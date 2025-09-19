import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Tabs,
  Tab,
  Chip,
  InputBase,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  BarChart,
  ShowChart,
  PieChart,
  ScatterPlot,
  Insights,
  Timeline,
  DonutSmall,
  BubbleChart,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

// Import custom chart icons
import {
  AlluvialIcon,
  ArcIcon,
  StackedBarIcon,
  MultisetBarIcon,
  BeeswarmIcon,
  BoxPlotIcon,
  BumpIcon,
  CalendarIcon,
  ChordIcon,
  CirclePackingIcon,
  DendrogramIcon,
  ConvexHullIcon,
  GanttIcon,
  HexbinIcon,
  HorizonIcon,
  MatrixIcon,
  ParallelIcon,
  RadarIcon,
  SankeyIcon,
  SlopeIcon,
  StreamIcon,
  SunburstIcon,
  TreemapIcon,
  ViolinIcon,
  VoronoiIcon,
  VoronoiTreemapIcon
} from './CustomChartIcons';

// Custom SVG icons for chart types not covered by Material-UI
const HeatmapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="2" width="4" height="4" opacity="0.3"/>
    <rect x="6" y="2" width="4" height="4" opacity="0.7"/>
    <rect x="10" y="2" width="4" height="4" opacity="0.5"/>
    <rect x="14" y="2" width="4" height="4" opacity="0.9"/>
    <rect x="18" y="2" width="4" height="4" opacity="0.6"/>
    <rect x="2" y="6" width="4" height="4" opacity="0.8"/>
    <rect x="6" y="6" width="4" height="4" opacity="0.4"/>
    <rect x="10" y="6" width="4" height="4" opacity="1"/>
    <rect x="14" y="6" width="4" height="4" opacity="0.2"/>
    <rect x="18" y="6" width="4" height="4" opacity="0.7"/>
    <rect x="2" y="10" width="4" height="4" opacity="0.6"/>
    <rect x="6" y="10" width="4" height="4" opacity="0.9"/>
    <rect x="10" y="10" width="4" height="4" opacity="0.3"/>
    <rect x="14" y="10" width="4" height="4" opacity="0.8"/>
    <rect x="18" y="10" width="4" height="4" opacity="0.5"/>
    <rect x="2" y="14" width="4" height="4" opacity="0.4"/>
    <rect x="6" y="14" width="4" height="4" opacity="0.6"/>
    <rect x="10" y="14" width="4" height="4" opacity="0.7"/>
    <rect x="14" y="14" width="4" height="4" opacity="0.3"/>
    <rect x="18" y="14" width="4" height="4" opacity="0.9"/>
    <rect x="2" y="18" width="4" height="4" opacity="0.7"/>
    <rect x="6" y="18" width="4" height="4" opacity="0.5"/>
    <rect x="10" y="18" width="4" height="4" opacity="0.8"/>
    <rect x="14" y="18" width="4" height="4" opacity="0.4"/>
    <rect x="18" y="18" width="4" height="4" opacity="0.6"/>
  </svg>
);

const SurfaceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 20L8 16L12 18L16 14L22 16V20H2Z" opacity="0.6"/>
    <path d="M2 16L8 12L12 14L16 10L22 12V16L16 14L12 18L8 16L2 20V16Z" opacity="0.8"/>
    <path d="M2 12L8 8L12 10L16 6L22 8V12L16 10L12 14L8 12L2 16V12Z"/>
  </svg>
);

const ContourIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <ellipse cx="12" cy="12" rx="10" ry="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
    <ellipse cx="12" cy="12" rx="7" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <ellipse cx="12" cy="12" rx="4" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.9"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
  </svg>
);

const AreaChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 20L8 12L12 16L18 8L22 10V20H2Z" opacity="0.6"/>
    <path d="M2 20L8 12L12 16L18 8L22 10" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ChartTypeGrid = ({ onChartTypeSelect }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };
  
  // Original chart types (Recharts & Plotly)
  const basicChartTypes = [
    { 
      value: 'line', 
      label: 'Line Chart', 
      icon: <ShowChart />,
      description: 'Show trends over time',
      library: 'recharts'
    },
    { 
      value: 'bar', 
      label: 'Bar Chart', 
      icon: <BarChart />,
      description: 'Compare categories',
      library: 'recharts'
    },
    { 
      value: 'scatter', 
      label: 'Scatter Plot', 
      icon: <ScatterPlot />,
      description: 'Show correlations',
      library: 'recharts'
    },
    { 
      value: 'pie', 
      label: 'Pie Chart', 
      icon: <PieChart />,
      description: 'Show proportions',
      library: 'recharts'
    },
    { 
      value: 'area', 
      label: 'Area Chart', 
      icon: <AreaChartIcon />,
      description: 'Show cumulative data',
      library: 'recharts'
    },
    { 
      value: 'bubble', 
      label: 'Bubble Chart', 
      icon: <BubbleChart />,
      description: 'Size-encoded scatter',
      library: 'plotly'
    },
    { 
      value: 'scatter3d', 
      label: '3D Scatter', 
      icon: <Insights />,
      description: '3D data visualization',
      library: 'plotly'
    },
    { 
      value: 'heatmap', 
      label: 'Heatmap', 
      icon: <HeatmapIcon />,
      description: 'Color-coded matrix',
      library: 'plotly'
    },
    { 
      value: 'contour', 
      label: 'Contour Plot', 
      icon: <ContourIcon />,
      description: 'Contour lines',
      library: 'plotly'
    },
    { 
      value: 'surface', 
      label: '3D Surface', 
      icon: <SurfaceIcon />,
      description: '3D surface plot',
      library: 'plotly'
    }
  ];

  // RAWGraphs chart types
  const rawChartTypes = [
    { 
      value: 'raw_alluvial', 
      label: 'Alluvial Diagram', 
      icon: <AlluvialIcon />,
      description: 'Show flow between categories',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_arc', 
      label: 'Arc Diagram', 
      icon: <ArcIcon />,
      description: 'Visualize network connections',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_bar', 
      label: 'Stacked Bar Chart', 
      icon: <StackedBarIcon />,
      description: 'Show parts of a whole',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_multiset_bar', 
      label: 'Multiset Bar Chart', 
      icon: <MultisetBarIcon />,
      description: 'Compare multiple sets',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_beeswarm', 
      label: 'Beeswarm Plot', 
      icon: <BeeswarmIcon />,
      description: 'Non-overlapping scatter',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_boxplot', 
      label: 'Box Plot', 
      icon: <BoxPlotIcon />,
      description: 'Show data distribution',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_bump', 
      label: 'Bump Chart', 
      icon: <BumpIcon />,
      description: 'Track ranking changes',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_calendar', 
      label: 'Calendar Chart', 
      icon: <CalendarIcon />,
      description: 'Temporal heatmap',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_chord', 
      label: 'Chord Diagram', 
      icon: <ChordIcon />,
      description: 'Show relationships',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_circlepacking', 
      label: 'Circle Packing', 
      icon: <CirclePackingIcon />,
      description: 'Hierarchical data',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_dendrogram', 
      label: 'Dendrogram', 
      icon: <DendrogramIcon />,
      description: 'Tree structure visualization',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_convexhull', 
      label: 'Convex Hull', 
      icon: <ConvexHullIcon />,
      description: 'Group data points',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_gantt', 
      label: 'Gantt Chart', 
      icon: <GanttIcon />,
      description: 'Project timeline',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_hexbin', 
      label: 'Hexbin', 
      icon: <HexbinIcon />,
      description: 'Density visualization',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_horizon', 
      label: 'Horizon Graph', 
      icon: <HorizonIcon />,
      description: 'Condensed time series',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_matrix', 
      label: 'Matrix Plot', 
      icon: <MatrixIcon />,
      description: 'Show relationship matrix',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_parallel', 
      label: 'Parallel Coordinates', 
      icon: <ParallelIcon />,
      description: 'Multi-dimensional data',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_radar', 
      label: 'Radar Chart', 
      icon: <RadarIcon />,
      description: 'Multi-variable comparison',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_sankey', 
      label: 'Sankey Diagram', 
      icon: <SankeyIcon />,
      description: 'Show flows and transfers',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_slope', 
      label: 'Slope Graph', 
      icon: <SlopeIcon />,
      description: 'Before/after comparison',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_streamgraph', 
      label: 'Stream Graph', 
      icon: <StreamIcon />,
      description: 'Flowing time series',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_sunburst', 
      label: 'Sunburst Diagram', 
      icon: <SunburstIcon />,
      description: 'Hierarchical proportions',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_treemap', 
      label: 'Treemap', 
      icon: <TreemapIcon />,
      description: 'Hierarchical proportions',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_violin', 
      label: 'Violin Plot', 
      icon: <ViolinIcon />,
      description: 'Distribution visualization',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_voronoi', 
      label: 'Voronoi Tessellation', 
      icon: <VoronoiIcon />,
      description: 'Space partitioning',
      library: 'rawgraphs'
    },
    { 
      value: 'raw_voronoitreemap', 
      label: 'Voronoi Treemap', 
      icon: <VoronoiTreemapIcon />,
      description: 'Hierarchical proportions',
      library: 'rawgraphs'
    }
  ];

  // Combine chart types based on active tab
  const allChartTypes = [...basicChartTypes, ...rawChartTypes];
  
  // Filter chart types based on active tab and search term
  const getFilteredChartTypes = () => {
    let filtered = [];
    
    switch(activeTab) {
      case 0: // All
        filtered = allChartTypes;
        break;
      case 1: // Recharts
        filtered = basicChartTypes.filter(chart => chart.library === 'recharts');
        break;
      case 2: // Plotly
        filtered = basicChartTypes.filter(chart => chart.library === 'plotly');
        break;
      case 3: // RAWGraphs
        filtered = rawChartTypes;
        break;
      default:
        filtered = allChartTypes;
    }
    
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(chart => 
        chart.label.toLowerCase().includes(search) || 
        chart.description.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  };

  const filteredChartTypes = getFilteredChartTypes();

  const handleChartSelect = (chartType) => {
    onChartTypeSelect(chartType);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select Chart Type
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose a visualization type for your data
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Charts" />
            <Tab label="Recharts" />
            <Tab label="Plotly" />
            <Tab label="RAWGraphs" />
          </Tabs>
          <Chip 
            label={`${filteredChartTypes.length} Charts`} 
            size="small" 
            color="primary" 
            variant="outlined" 
            sx={{ ml: 1 }}
          />
        </Box>
        
        <Box sx={{ width: '100%', mb: 2 }}>
          <InputBase
            placeholder="Search charts..."
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '4px',
              padding: '4px 12px',
              '&:hover': {
                borderColor: theme.palette.action.active,
              },
            }}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            }
            endAdornment={
              searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="clear search"
                    onClick={clearSearch}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }
          />
        </Box>
      </Box>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
          maxWidth: '800px'
        }}
      >
        {filteredChartTypes.length === 0 ? (
          <Box 
            sx={{
              gridColumn: '1 / -1', 
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              textAlign: 'center',
              p: 3,
              bgcolor: theme.palette.background.paper,
              borderRadius: 1,
              border: `1px dashed ${theme.palette.divider}`
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No matching chart types found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try a different search term or category
            </Typography>
          </Box>
        ) : (
          filteredChartTypes.map((chartType) => (
          <Card
            key={chartType.value}
            sx={{
              cursor: 'pointer',
              aspectRatio: '1',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.2s ease-in-out',
              border: `2px solid transparent`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
                borderColor: theme.palette.primary.main,
              },
            }}
            onClick={() => handleChartSelect(chartType)}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                height: '100%',
                p: 2,
                '&:last-child': {
                  paddingBottom: 2
                }
              }}
            >
              <Box
                sx={{
                  fontSize: '2.5rem',
                  color: theme.palette.primary.main,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '& svg': {
                    width: '40px',
                    height: '40px'
                  }
                }}
              >
                {chartType.icon}
              </Box>
              <Typography
                variant="subtitle2"
                fontWeight="600"
                sx={{ mb: 0.5, lineHeight: 1.2 }}
              >
                {chartType.label}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: '0.75rem',
                  lineHeight: 1.2,
                  textAlign: 'center'
                }}
              >
                {chartType.description}
              </Typography>
            </CardContent>
          </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ChartTypeGrid;