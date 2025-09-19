import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  ShowChart,
  PieChart,
  ScatterPlot,
  Insights,
  Timeline,
  DonutSmall,
  BubbleChart
} from '@mui/icons-material';

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

const ChartTypeGrid = ({ onChartTypeSelect, selectedLibrary = 'recharts' }) => {
  const theme = useTheme();

  const chartTypes = {
    recharts: [
      { 
        value: 'line', 
        label: 'Line Chart', 
        icon: <ShowChart />,
        description: 'Show trends over time'
      },
      { 
        value: 'bar', 
        label: 'Bar Chart', 
        icon: <BarChart />,
        description: 'Compare categories'
      },
      { 
        value: 'scatter', 
        label: 'Scatter Plot', 
        icon: <ScatterPlot />,
        description: 'Show correlations'
      },
      { 
        value: 'pie', 
        label: 'Pie Chart', 
        icon: <PieChart />,
        description: 'Show proportions'
      },
      { 
        value: 'area', 
        label: 'Area Chart', 
        icon: <AreaChartIcon />,
        description: 'Show cumulative data'
      }
    ],
    plotly: [
      { 
        value: 'scatter', 
        label: 'Scatter Plot', 
        icon: <ScatterPlot />,
        description: 'Basic scatter plot'
      },
      { 
        value: 'bubble', 
        label: 'Bubble Chart', 
        icon: <BubbleChart />,
        description: 'Size-encoded scatter'
      },
      { 
        value: 'scatter3d', 
        label: '3D Scatter', 
        icon: <Insights />,
        description: '3D data visualization'
      },
      { 
        value: 'heatmap', 
        label: 'Heatmap', 
        icon: <HeatmapIcon />,
        description: 'Color-coded matrix'
      },
      { 
        value: 'contour', 
        label: 'Contour Plot', 
        icon: <ContourIcon />,
        description: 'Contour lines'
      },
      { 
        value: 'surface', 
        label: '3D Surface', 
        icon: <SurfaceIcon />,
        description: '3D surface plot'
      }
    ]
  };

  const handleChartSelect = (chartType) => {
    onChartTypeSelect(chartType);
  };

  const currentChartTypes = chartTypes[selectedLibrary] || chartTypes.recharts;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select Chart Type
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose a visualization type for your data
      </Typography>
      
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
        {currentChartTypes.map((chartType) => (
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
        ))}
      </Box>
    </Box>
  );
};

export default ChartTypeGrid;