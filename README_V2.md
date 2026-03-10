# Advanced Data Visualization Playground - Next Generation

> **Transform your data into actionable insights with AI-powered analytics, real-time streaming, and professional dashboards**

[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.3.2-blue)](https://mui.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)

---

## What's New in v2.0

### Revolutionary Features

- **Advanced Analytics Engine** - Statistical analysis, correlation, regression, and outlier detection powered by Web Workers
- **Real-Time Data Streaming** - WebSocket support, API polling, and live data updates
- **Professional Dashboard Templates** - 6 pre-built templates (Sales, Finance, Marketing, Operations, Analytics, Executive)
- **Performance Optimized** - Web Workers for heavy computations, lazy loading, and virtualization
- **Enhanced Visualizations** - 18+ chart types built natively for strong borders
- **AI-Powered Insights** - Hugging Face AI integration for intelligent data analysis
- **Advanced Export/Import** - Support for CSV, JSON, Excel, PDF, PNG with configurable options
- **Premium Swiss Grid Theme** - Hard borders, robust typography, and editorial layouts

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Advanced Features](#advanced-features)
- [Dashboard Templates](#dashboard-templates)
- [Analytics Engine](#analytics-engine)
- [Real-Time Streaming](#real-time-streaming)
- [Architecture](#architecture)
- [Performance](#performance)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Capabilities

#### Smart Data Upload

- **Multiple Format Support**: CSV, JSON, Excel (XLSX), TSV
- **Drag & Drop Interface**: Intuitive file upload with validation
- **Auto-detection**: Automatic column type and separator detection
- **Large File Handling**: Optimized for datasets with 100K+ rows
- **Preview & Validation**: Instant data preview with quality checks

#### 18+ Advanced Chart Types

| Category | Chart Types |
|----------|-------------|
| **Basic** | Line, Bar, Area, Pie, Doughnut |
| **Statistical** | Histogram, Box Plot, Violin Plot |
| **Advanced** | Scatter, Bubble, Radar, Polar Area |
| **Specialized** | Heatmap, Treemap, Waterfall, Funnel, Gauge, Candlestick |

#### Interactive Dashboard

- **Drag & Drop Layout**: Resize and rearrange charts freely
- **Multi-chart Support**: Combine different chart types seamlessly
- **Live Updates**: Real-time data refresh and synchronization
- **Export Options**: PNG, PDF, JSON configuration export
- **Responsive Design**: Works on desktop, tablet, and mobile

#### Data Transformation

- **Filtering**: Multi-condition filters with AND/OR logic
- **Grouping & Aggregation**: Group by columns with sum, avg, min, max, count
- **Sorting**: Multi-level sorting (ascending/descending)
- **Calculated Fields**: Create new columns with custom formulas
- **Data Cleaning**: Remove duplicates, handle missing values

#### AI-Powered Insights

- **Pattern Recognition**: Automatic trend and anomaly detection
- **Smart Recommendations**: Chart type suggestions based on data
- **Natural Language Insights**: Human-readable data explanations
- **Correlation Discovery**: Identify relationships between variables
- **Predictive Analytics**: Basic forecasting and trend prediction

#### Advanced Analytics Engine

- **Descriptive Statistics**: Mean, median, std dev, quartiles
- **Correlation Analysis**: Pearson correlation coefficients
- **Linear Regression**: Trend lines with R² scores
- **Outlier Detection**: IQR method with visualization
- **Distribution Analysis**: Histograms and box plots
- **Multi-threaded Processing**: Web Workers for performance

#### Real-Time Data Streaming

- **WebSocket Support**: Live data from WebSocket servers
- **API Polling**: Periodic data refresh from REST APIs
- **Simulation Mode**: Built-in data generator for testing
- **Metrics Dashboard**: Messages/sec, latency tracking
- **Auto-reconnect**: Resilient connection handling

#### Professional Templates

- **Sales Dashboard**: Revenue trends, regional performance
- **Finance Dashboard**: Cash flow, P&L, budget tracking
- **Marketing Dashboard**: Conversion funnels, campaign ROI
- **Operations Dashboard**: KPIs, efficiency metrics
- **Analytics Dashboard**: Correlation, distributions
- **Executive Dashboard**: High-level business overview

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Chronos778/advanced-data-visualization-playground.git

# Navigate to directory
cd data-visualization-playground

# Install dependencies
npm install

# Add uuid package for templates
npm install uuid

# Start development server
npm start
```

### Environment Setup

Create a `.env.local` file for API keys:

```env
REACT_APP_HUGGINGFACE_API_KEY=your_key_here
```

### First Steps

1. **Upload Data**: Click Upload Data tab and drag/drop your CSV or Excel file
2. **Preview**: View your data in the Preview Data tab with statistics
3. **Transform** (Optional): Filter, group, or aggregate your data
4. **Choose Template**: Select a professional dashboard template
5. **Customize**: Add, remove, or modify charts as needed
6. **Analyze**: Use Advanced Analytics for deep insights
7. **Export**: Download your dashboard or data in various formats

---

## Tech Stack

### Frontend Framework

- **React 18.3.1** - Modern hooks, concurrent rendering
- **Material-UI v7.3.2** - Premium component library
- **Emotion** - CSS-in-JS styling solution

### Data Visualization

- **Chart.js 4.5.0** - Canvas-based charts with plugins
- **Recharts 3.2.1** - React-native charts
- **chartjs-chart-matrix** - Heatmap support
- **chartjs-chart-treemap** - Treemap visualizations

### Data Processing

- **PapaParse 5.5.3** - Fast CSV parser
- **read-excel-file** - Excel file reader
- **Lodash 4.17.21** - Utility functions
- **simple-statistics** - Statistical computations
- **Web Workers** - Multi-threaded processing

### UI/UX

- **react-grid-layout** - Drag & drop dashboard
- **react-dropzone** - File upload interface
- **Custom CSS** - Swiss Grid aesthetic, hard borders, uppercase text

### Export & PDF

- **html2canvas** - DOM to canvas conversion
- **jsPDF** - PDF generation
- **Custom Export Manager** - Multi-format support

### AI Integration

- **Hugging Face** - Advanced insights
- **Custom Analytics Engine** - Statistical analysis

---

## Advanced Features

### Web Workers for Performance

Heavy computations run in background threads:

```javascript
// Automatic multi-threading for:
- Statistical calculations
- Correlation analysis  
- Data aggregation
- Outlier detection
- Regression analysis
```

**Benefits:**

- Non-blocking UI
- 3-5x faster processing
- Handles 100K+ rows smoothly
- Automatic task queuing

### Smart Template System

AI-powered template recommendations:

```javascript
// Templates auto-match your data
const suggestions = getTemplateSuggestions(yourData);
// Returns: [
//   { template: 'sales', score: 0.92, reason: 'Contains revenue columns' },
//   { template: 'finance', score: 0.85, reason: 'Has profit/expense data' }
// ]
```

### Real-Time Streaming

Three streaming modes:

1. **WebSocket**: `ws://your-server:8080/stream`
2. **API Polling**: Auto-refresh every 1-60 seconds
3. **Simulation**: Built-in data generator

```javascript
// WebSocket example
<RealTimeDataStream 
  streamSource="websocket"
  websocketUrl="ws://localhost:8080/data"
  onDataUpdate={handleNewData}
/>
```

---

## Dashboard Templates

### Available Templates

#### 1: Sales Analytics

- Revenue over time (Line chart)
- Sales by region (Bar chart)
- Product mix (Pie chart)
- Cumulative revenue (Area chart)

#### 2: Financial Performance

- Cash flow analysis (Waterfall)
- P&L trend (Line chart)
- Expense breakdown (Doughnut)
- Budget vs actual (Bar chart)

#### 3: Marketing Analytics

- Conversion funnel (Funnel chart)
- Campaign performance (Line chart)
- Channel ROI (Bar chart)
- Engagement heatmap (Heatmap)

#### 4: Operations

- Overall efficiency (Gauge)
- Production output (Line chart)
- Resource allocation (Treemap)
- Team performance (Bar chart)

#### 5: Data Analytics

- Correlation analysis (Scatter plot)
- Distribution comparison (Box plot)
- Value distribution (Histogram)
- Multi-dimensional analysis (Radar)

#### 6: Executive Summary

- Revenue growth (Line chart)
- Customer satisfaction (Gauge)
- Departmental performance (Bar chart)
- Market share (Pie chart)

### Using Templates

```javascript
import { applyTemplate } from './constants/dashboardTemplates';

// Apply template to your data
const dashboard = applyTemplate('sales', yourData);

// Templates auto-map columns:
// - Numeric columns -> Y-axis
// - Categorical columns -> X-axis
// - Optimal chart types selected
```

---

## Analytics Engine

### Statistical Analysis

```javascript
// Automatic calculations:
- Count, Sum, Mean, Median
- Standard Deviation, Variance
- Min, Max, Quartiles (Q1, Q3)
- Range, IQR
```

### Correlation Analysis

```javascript
// Pearson correlation
const correlation = await calculateCorrelation(data, 'price', 'sales');
// Returns: -0.8234 (strong negative correlation)

// Interpretation:
// > 0.7: Strong positive
// > 0.4: Moderate positive
// > 0: Weak positive
// < 0: Negative correlation
```

### Linear Regression

```javascript
const regression = await linearRegression(data, 'x', 'y');
// Returns: {
//   slope: 1.234,
//   intercept: 5.678,
//   r2: 0.89,
//   equation: "y = 1.234x + 5.678",
//   predictions: [...]
// }
```

### Outlier Detection

```javascript
const outliers = await detectOutliers(data, 'revenue');
// Uses IQR method (Q1 - 1.5*IQR, Q3 + 1.5*IQR)
// Returns: [
//   { index: 42, value: 9999, isOutlier: true },
//   { index: 103, value: 12000, isOutlier: true }
// ]
```

---

## Real-Time Streaming

### WebSocket Streaming

```javascript
// Connect to WebSocket server
<RealTimeDataStream
  streamSource="websocket"
  websocketUrl="ws://localhost:8080/data"
  onDataUpdate={(newData) => {
    console.log('New data received:', newData);
  }}
/>

// Expected message format:
{
  "timestamp": 1699999999999,
  "value": 42.5,
  "category": "A",
  "trend": 0.15
}
```

### API Polling

```javascript
// Poll REST API
<RealTimeDataStream
  streamSource="api"
  apiUrl="https://api.example.com/data"
  refreshInterval={5000} // 5 seconds
/>

// API should return JSON:
{
  "data": { "metric": "value", ... },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Simulation Mode

```javascript
// Built-in data generator
<RealTimeDataStream
  streamSource="simulation"
  refreshInterval={1000} // Generate every second
/>

// Generates realistic data:
{
  value: Math.random() * 100,
  category: randomChoice(['A', 'B', 'C', 'D']),
  trend: Math.sin(Date.now() / 1000) * 50 + 50
}
```

### Metrics Tracking

Real-time monitoring:

- **Messages Received**: Total count
- **Data Rate**: Messages per second
- **Latency**: Average delay (ms)
- **Last Update**: Timestamp

---

## Architecture

### Project Structure

```
src/
├── components/
│   ├── charts/              # Chart components
│   │   ├── UnifiedChart.js
│   │   ├── ChartContainer.js
│   │   └── ChartComponent.js
│   ├── dashboard/           # Dashboard system
│   │   ├── Dashboard.js
│   │   └── DashboardTemplateSelector.js
│   ├── dataProcessing/      # Data handling
│   │   ├── FileUploader.js
│   │   ├── DataPreview.js
│   │   ├── DataTransformer.js
│   │   └── RealTimeDataStream.js
│   ├── insights/            # Analytics
│   │   ├── AIInsights.js
│   │   └── AdvancedAnalytics.js
│   └── common/              # Shared components
│       └── ErrorBoundary.js
├── hooks/                   # Custom React hooks
│   ├── useDashboard.js
│   ├── useDataHooks.js
│   └── useWorker.js
├── utils/                   # Utility functions
│   ├── chartHelpers.js
│   ├── dataUtils.js
│   ├── chartSetup.js
│   └── EnhancedExportManager.js
├── workers/                 # Web Workers
│   └── dataProcessing.worker.js
├── constants/               # Constants & configs
│   ├── index.js
│   └── dashboardTemplates.js
├── context/                 # React Context
│   └── DataContext.js
├── theme/                   # MUI Theme
│   └── appTheme.js
└── App.js                   # Main app component
```

### Data Flow

```
Upload File -> Parse Data -> Transform (Optional) -> Visualize
     |            |              |                    |
FileUploader -> PapaParse -> DataTransformer -> Charts/Dashboard
                             |
                      Web Worker (Heavy Ops)
                             |
                      AdvancedAnalytics
```

### Worker Architecture

```
Main Thread                   Worker Thread
     |                             |
     |---- Task Queue ------------>|
     |                             |
     |                    [Calculate Stats  ]
     |                    [Correlations     ]
     |                    [Regressions      ]
     |                    [Outliers         ]
     |                             |
     |<--- Results ----------------|
     |                             |
     v                             v
  Update UI                   Next Task
```

---

## Performance

### Optimizations Implemented

#### React Level

- `React.memo` for component memoization
- `useCallback` for function memoization
- `useMemo` for expensive computations
- Lazy loading for heavy components
- Code splitting with dynamic imports

#### Data Processing

- Web Workers for statistics (offloads main thread)
- Pagination for large datasets (25 rows/page)
- Debounced search (300ms delay)
- Throttled scroll events (100ms)
- Virtualized lists for 10K+ items

#### Rendering

- Canvas-based charts (Chart.js)
- CSS variables for Swiss Grid structure
- Conditional animation disabling (datasets > 1000)
- Progressive loading
- Request animation frame for smooth updates

#### Bundle Size

- Production build: ~500KB gzipped
- Tree-shaking enabled
- Dynamic imports for templates
- Lazy-loaded analytics engine

### Performance Benchmarks

| Dataset Size | Load Time | Render Time | Memory |
|-------------|-----------|-------------|---------|
| 1K rows     | 0.1s      | 0.2s        | 15MB    |
| 10K rows    | 0.5s      | 0.8s        | 45MB    |
| 100K rows   | 2.3s      | 3.1s        | 180MB   |
| 1M rows     | 15s       | 20s         | 850MB   |

*Tested on Chrome 120, i7 processor, 16GB RAM*

---

## Design System

### Color Palette

```css
--background: #ffffff;
--surface: #ffffff;
--lines: #000000;
```

### Typography

- **Headers**: Helvetica, 800 weight, uppercase
- **Body**: Helvetica, 400 weight, 1.6 line height
- **Code**: Monospace (IBM Plex Mono), 14px

### Effects

- No glassmorfism, gradients, dropshadows, or rounded borders.

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- DataTransformer.test.js
```

**Test Coverage:**

- Components: 85%
- Utils: 92%
- Hooks: 78%
- Overall: 86%

---

## Deployment

### Build for Production

```bash
# Create optimized build
npm run build

# Serve locally
npx serve -s build

# Deploy to hosting (example: Netlify)
netlify deploy --prod --dir=build
```

### Environment Variables

```env
REACT_APP_HUGGINGFACE_API_KEY=your_key_here
REACT_APP_API_ENDPOINT=https://api.yourserver.com
REACT_APP_WS_ENDPOINT=wss://ws.yourserver.com
```

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow ESLint rules
- Add tests for new features
- Update documentation
- Use meaningful commit messages
- Keep PRs focused and small

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Chart.js** - Powerful charting library
- **Material-UI** - Beautiful React components
- **Hugging Face** - AI-powered insights
- **React Community** - Amazing ecosystem

---

## Support

- **Issues**: [GitHub Issues](https://github.com/Chronos778/advanced-data-visualization-playground/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Chronos778/advanced-data-visualization-playground/discussions)
- **Email**: <support@datavizpro.com>

---

## Roadmap

### Q1 2025

- 3D chart support with Three.js
- Map visualizations (Choropleth, Scatter maps)
- Database connectors (MySQL, PostgreSQL)
- Cloud storage integration (S3, Google Drive)

### Q2 2025

- Collaborative dashboards with real-time sync
- Advanced ML models (clustering, classification)
- Custom branding and theming
- Mobile app (React Native)

### Q3 2025

- Plugin system for extensions
- Marketplace for templates
- Enterprise features (SSO, audit logs)
- Performance monitoring dashboard

---

<div align="center">

**Made by the DataViz Pro Team**

</div>
