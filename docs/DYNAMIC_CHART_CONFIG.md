# Dynamic Chart Configuration System

## Overview

The application now uses a fully dynamic chart configuration system that automatically adapts the configuration form based on each chart type's specific requirements. This replaces the previous hardcoded approach with a flexible, maintainable solution.

## Key Components

### 1. ChartConfigurations.js
- **Purpose**: Central definition of all chart types and their configuration requirements
- **Location**: `src/components/charts/ChartConfigurations.js`
- **Exports**:
  - `chartConfigurations`: Object mapping chart types to their config requirements
  - `getChartConfig(chartType)`: Helper to get config for a specific chart
  - `validateChartConfig(chartType, config)`: Validation helper

### 2. DynamicChartConfig.js
- **Purpose**: Dynamic form component that renders configuration fields based on chart requirements
- **Location**: `src/components/charts/DynamicChartConfig.js`
- **Features**:
  - Automatically shows/hides fields based on chart requirements
  - Supports different field types (select, multiselect, text)
  - Handles different column types (numeric, date, any)
  - Organized sections (Main Axes, Chart-specific, Visual Encoding)

### 3. Updated Dashboard.js
- **Changes**: Replaced hardcoded configuration form with DynamicChartConfig
- **Benefits**: Cleaner code, automatic support for new chart types

## Chart Configuration Schema

Each chart type in `chartConfigurations` has the following properties:

```javascript
{
  // Axis Requirements
  requiresXAxis: boolean,     // Whether X-axis is required
  requiresYAxis: boolean,     // Whether Y-axis is required
  xAxisLabel: string,         // Label for X-axis field
  yAxisLabel: string,         // Label for Y-axis field
  xAxisType: 'numeric'|'date'|'any',  // Expected data type for X-axis
  yAxisType: 'numeric'|'date'|'any',  // Expected data type for Y-axis
  
  // Optional Features
  supportsColorBy: boolean,   // Whether chart supports color encoding
  supportsSizeBy: boolean,    // Whether chart supports size encoding
  supportsZAxis: boolean,     // Whether chart supports Z-axis (3D)
  zAxisLabel: string,         // Custom label for Z-axis
  sizeByLabel: string,        // Custom label for size encoding
  
  // Additional Fields
  additionalFields: [         // Chart-specific configuration fields
    {
      name: string,           // Field name in config object
      label: string,          // Display label
      type: 'select'|'multiselect',  // Field type
      required: boolean       // Whether field is required
    }
  ]
}
```

## Chart Type Examples

### Standard Charts (Line, Bar, Scatter)
- Require both X and Y axes
- Support color encoding
- Some support size encoding (scatter, bubble)

### Hierarchical Charts (Treemap, Sunburst, Circle Packing)
- No X-axis required
- Require Y-axis for values
- Need hierarchy multiselect for data structure
- Support color encoding

### Network Charts (Sankey, Alluvial, Chord)
- Use Source/Target instead of X/Y labels
- Support size encoding for weights/flows
- No color encoding (colors determined by flow)

### Multi-dimensional Charts (Parallel Coordinates, Radar)
- No traditional X/Y axes
- Require dimensions multiselect
- Support color encoding for series

### Time Series Charts (Calendar, Horizon, Stream Graph)
- Expect date-type columns for time axis
- May require series configuration

## Adding New Chart Types

To add a new chart type:

1. **Add configuration** to `chartConfigurations` object in `ChartConfigurations.js`
2. **Add to ChartTypeGrid** with appropriate icon and description
3. **Update chart rendering** in Dashboard.js renderWidget function
4. **Create chart component** if using new library

The configuration form will automatically adapt to the new chart's requirements.

## Benefits

### For Users
- **Contextual Fields**: Only see relevant configuration options
- **Clear Labels**: Descriptive field names (e.g., "Source/Target" for network charts)
- **Proper Validation**: Can't create invalid chart configurations
- **Better UX**: Organized sections with clear visual hierarchy

### For Developers
- **Maintainable**: Single source of truth for chart requirements
- **Extensible**: Easy to add new chart types
- **Type Safety**: Centralized validation logic
- **Clean Code**: No hardcoded conditional logic in UI components

## Chart Type Categories

### Basic Charts (10 types)
- Line, Bar, Scatter, Pie, Area (Recharts)
- Bubble, 3D Scatter, Heatmap, Contour, Surface (Plotly)

### RAWGraphs Charts (26 types)
- **Flow/Network**: Alluvial, Arc, Chord, Sankey
- **Hierarchical**: Circle Packing, Dendrogram, Sunburst, Treemap, Voronoi Treemap
- **Distribution**: Beeswarm, Box Plot, Violin, Hexbin
- **Time Series**: Bump, Calendar, Gantt, Horizon, Stream Graph
- **Comparative**: Slope, Parallel Coordinates
- **Spatial**: Convex Hull, Voronoi
- **Matrix**: Matrix Plot
- **Multi-dimensional**: Radar
- **Bar Variants**: Stacked Bar, Multiset Bar

Total: **36 chart types** with custom configurations for each.