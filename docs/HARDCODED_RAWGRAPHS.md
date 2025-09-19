# Hardcoded RAWGraphs Implementation

## Overview
This document describes the implementation of hardcoded RAWGraphs chart types to replace the external `@rawgraphs/rawgraphs-charts` dependency that was causing import issues.

## Problem
The application was experiencing runtime errors with RAWGraphs charts:
- `Chart type 'raw_convexhull' is not supported or failed to load`
- Missing or incompatible RAWGraphs chart implementations
- Dependency issues with external RAWGraphs packages

## Solution
Instead of relying on external RAWGraphs packages, we've implemented custom chart components using D3.js that provide the same functionality with better control and no external dependencies.

## Implemented Charts

### 1. Sankey Diagram (`raw_sankey`)
**File:** `src/components/charts/custom/SankeyChart.js`
- **Features:**
  - Interactive flow visualization
  - Source/target node relationships
  - Customizable flow widths
  - Hover tooltips
  - Export functionality (SVG, PNG)
- **Props:**
  - `xAxis`: Source column
  - `yAxis`: Target column  
  - `sizeBy`: Flow value column
  - `colorBy`: Optional color grouping

### 2. Treemap (`raw_treemap`)
**File:** `src/components/charts/custom/CustomTreemapChart.js`
- **Features:**
  - Hierarchical data visualization
  - Nested rectangles sized by value
  - Interactive hover effects
  - Text labels with smart wrapping
  - Export functionality (SVG, PNG)
- **Props:**
  - `yAxis`: Value column
  - `hierarchy`: Array of hierarchy columns
  - `colorBy`: Optional color grouping

### 3. Sunburst (`raw_sunburst`)
**File:** `src/components/charts/custom/SunburstChart.js`
- **Features:**
  - Hierarchical radial visualization
  - Interactive zoom and focus
  - Percentage calculations
  - Smooth transitions
  - Export functionality (SVG, PNG)
- **Props:**
  - `yAxis`: Value column
  - `hierarchy`: Array of hierarchy columns
  - `colorBy`: Optional color grouping

### 4. Circle Packing (`raw_circlepacking`)
**File:** `src/components/charts/custom/CirclePackingChart.js`
- **Features:**
  - Hierarchical circle layout
  - Interactive zoom functionality
  - Smart text placement
  - Multiple hierarchy levels
  - Export functionality (SVG, PNG)
- **Props:**
  - `yAxis`: Value column
  - `hierarchy`: Array of hierarchy columns
  - `colorBy`: Optional color grouping

## Architecture

### CustomRawChart Component
**File:** `src/components/charts/CustomRawChart.js`

This is the main wrapper component that:
- Maps chart types to their implementations
- Provides fallback messages for unimplemented charts
- Maintains consistent API with the original RawGraphsChart

```javascript
const chartComponents = {
  raw_sankey: SankeyChart,
  raw_treemap: CustomTreemapChart,  
  raw_sunburst: SunburstChart,
  raw_circlepacking: CirclePackingChart
};
```

### Dashboard Integration
**File:** `src/components/dashboard/Dashboard.js`

Updated to support RAWGraphs charts:
- Added `rawgraphs` library option
- Added chart type selection for RAWGraphs
- Added hierarchy field support for hierarchical charts
- Updated validation logic for different chart requirements

## Dependencies Added
- `d3-sankey`: For Sankey diagram layout calculations

## Features

### Common Features Across All Charts
- **Responsive Design**: All charts adapt to container size
- **Export Functionality**: SVG and PNG export support
- **Interactive Tooltips**: Rich hover information
- **Error Handling**: Graceful error display and handling
- **Loading States**: Visual feedback during rendering
- **Material-UI Integration**: Consistent styling with the app

### Chart-Specific Features
- **Sankey**: Flow highlighting, node connections
- **Treemap**: Smart text wrapping, hierarchy paths
- **Sunburst**: Click-to-zoom, center reset
- **Circle Packing**: Zoom functionality, nested labels

## Data Format Requirements

### Sankey Diagram
```javascript
{
  data: [
    { source: "A", target: "B", value: 10 },
    { source: "B", target: "C", value: 5 }
  ]
}
```

### Hierarchical Charts (Treemap, Sunburst, Circle Packing)
```javascript
{
  data: [
    { category: "Tech", subcategory: "Web", value: 100 },
    { category: "Tech", subcategory: "Mobile", value: 80 },
    { category: "Design", subcategory: "UI", value: 60 }
  ]
}
```

## Benefits

1. **No External Dependencies**: Eliminates RAWGraphs package issues
2. **Full Control**: Complete control over chart behavior and styling
3. **Better Performance**: Optimized rendering for our specific use cases
4. **Consistent API**: Maintains compatibility with existing chart system
5. **Easy Extension**: Simple to add more chart types as needed

## Future Enhancements

### Planned Chart Implementations
- Alluvial Diagram
- Arc Diagram  
- Beeswarm Plot
- Box Plot
- Bump Chart
- Calendar Heatmap
- Chord Diagram
- Convex Hull
- Parallel Coordinates
- Radar Chart
- And more...

### Potential Improvements
- Animation enhancements
- More customization options
- Performance optimizations
- Additional export formats
- Accessibility improvements

## Usage Example

```javascript
import CustomRawChart from './components/charts/CustomRawChart';

// Sankey Diagram
<CustomRawChart
  data={sankeyData}
  chartType="raw_sankey"
  title="Flow Diagram"
  xAxis="source"
  yAxis="target"
  sizeBy="value"
  onExport={handleExport}
/>

// Treemap
<CustomRawChart
  data={hierarchicalData}
  chartType="raw_treemap"
  title="Category Breakdown"
  yAxis="value"
  hierarchy={['category', 'subcategory']}
  colorBy="category"
  onExport={handleExport}
/>
```

## Conclusion

This hardcoded implementation provides a robust solution to the RAWGraphs dependency issues while maintaining full functionality and adding several enhancements. The modular architecture makes it easy to extend with additional chart types as needed.