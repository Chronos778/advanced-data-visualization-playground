import React from 'react';
import {
  Box,
  Alert,
  Card,
  CardContent,
  Typography
} from '@mui/material';

// Import our custom hardcoded chart implementations
import SankeyChart from './custom/SankeyChart';
import CustomTreemapChart from './custom/CustomTreemapChart';
import ChordChart from './custom/ChordChart';

const CustomRawChart = ({ 
  data, 
  chartType, 
  title, 
  xAxis,
  yAxis,
  zAxis,
  colorBy,
  sizeBy,
  hierarchy,
  onConfigChange,
  onExport 
}) => {

  // Map of chart types to their implementations
  const chartComponents = {
    raw_sankey: SankeyChart,
    raw_treemap: CustomTreemapChart,
    raw_chord: ChordChart
  };

  // Get the appropriate chart component
  const ChartComponent = chartComponents[chartType];

  if (!ChartComponent) {
    // For chart types we haven't implemented yet, show a placeholder
    const notImplementedCharts = [
      'raw_alluvial', 'raw_arc', 'raw_bar', 'raw_multiset_bar', 'raw_beeswarm',
      'raw_boxplot', 'raw_bump', 'raw_calendar', 'raw_chord', 'raw_dendrogram',
      'raw_convexhull', 'raw_gantt', 'raw_hexbin', 'raw_horizon', 'raw_matrix',
      'raw_parallel', 'raw_radar', 'raw_slope', 'raw_streamgraph', 'raw_violin',
      'raw_voronoi', 'raw_voronoitreemap'
    ];

    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title || chartType}
          </Typography>
          <Alert severity="info">
            <Typography variant="body1" gutterBottom>
              <strong>{chartType}</strong> chart is coming soon!
            </Typography>
            <Typography variant="body2">
              This chart type will be implemented in a future update. 
              Currently available hardcoded charts:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0 }}>
              <li>Sankey Diagram (raw_sankey)</li>
              <li>Treemap (raw_treemap)</li>
              <li>Chord Diagram (raw_chord)</li>
            </Box>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Render the appropriate chart component
  return (
    <ChartComponent
      data={data}
      title={title}
      xAxis={xAxis}
      yAxis={yAxis}
      zAxis={zAxis}
      colorBy={colorBy}
      sizeBy={sizeBy}
      hierarchy={hierarchy}
      onExport={onExport}
    />
  );
};

export default CustomRawChart;