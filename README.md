# 🚀 Advanced Data Visualization Playground

A powerful, modern web application for advanced data visualization, transformation, and analysis. Built with React and featuring an intuitive drag-and-drop interface, AI-powered insights, and comprehensive export capabilities.

**🎨 Beautiful Premium Dark Theme** | **⚡ Lightning-fast Performance** | **🤖 AI-Powered Analysis**

![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3.2-blue?logo=mui)
![Recharts](https://img.shields.io/badge/Recharts-3.2.1-green)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Key Features

### 🎨 **Premium Dark Theme with Glassmorphism**
- Modern dark interface with vibrant gradient accents
- Smooth animations and transitions
- Glassmorphic cards with backdrop blur effects
- Responsive design for all devices
- Accessible color scheme with high contrast

### 📊 **Multi-Format Data Support**
- **File Upload**: Drag-and-drop support for CSV, JSON, and Excel files
- **Real-time Validation**: Instant data parsing and error detection
- **Data Preview**: Interactive tables with pagination and search
- **Advanced Filtering**: Complex multi-column filtering with operators

### 🔧 **Advanced Data Transformation**
- **Filtering**: Complex multi-column filtering with various operators
- **Sorting**: Multi-level sorting with custom order
- **Grouping**: Data aggregation with statistical functions
- **Statistics**: Automatic calculation of mean, median, mode, percentiles, and more
- **Data Pivoting**: Cross-tabulation and summary tables

### 📈 **Comprehensive Visualization Library**
- **Recharts Integration**: Line, bar, pie, scatter, area, and radar charts
- **Chart.js Power**: Advanced chart types with rich customization
- **Interactive Controls**: Real-time chart customization and styling
- **Vibrant Gradients**: Beautiful color palettes with gradient effects
- **Responsive Design**: Charts adapt seamlessly to screen sizes
- **Multiple Chart Types**: 10+ chart types including heatmaps, treemaps, and funnels

### 🎯 **Drag-and-Drop Dashboard**
- **Grid Layout**: Responsive, resizable chart widgets
- **Live Editing**: Add, remove, and configure charts in real-time
- **Layout Persistence**: Save dashboard configurations locally
- **Widget Management**: Easy chart creation and customization
- **Export Dashboard**: Download entire dashboard as image or PDF

### 🤖 **AI-Powered Insights (Gemini AI)**
- **Correlation Analysis**: Automatic detection of data relationships
- **Outlier Identification**: Statistical anomaly detection
- **Trend Analysis**: Pattern recognition and insights
- **Smart Recommendations**: AI-generated analysis and suggestions
- **Data Summarization**: Automatic data insights generation

### 💾 **Export & Sharing**
- **Multiple Formats**: PNG, PDF, JSON, CSV exports
- **Quality Settings**: Configurable resolution and compression
- **Batch Export**: Download multiple visualizations
- **Data Export**: Transform and export processed datasets
- **Shareable Links**: Generate shareable dashboard links

## 🎯 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Chronos778/advanced-data-visualization-playground.git
cd advanced-data-visualization-playground

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Environment Setup
Create a `.env` file for API keys:
```bash
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

## � Tech Stack

```

```

## 📦 Tech Stack

- **Frontend**: React 19.1.1 with modern hooks and context
- **UI Framework**: Material-UI v7 with premium dark theme
- **Visualization**: 
  - Recharts 3.2.1 for responsive business charts
  - Chart.js 4.5.0 for advanced chart types
  - Custom gradient color system
- **Layout**: react-grid-layout for drag-and-drop dashboards
- **Data Processing**: 
  - papaparse for CSV parsing
  - simple-statistics for statistical analysis
  - lodash for data manipulation
- **Export**: html2canvas + jsPDF for image/PDF generation
- **AI**: Google Gemini AI API for intelligent insights
- **Testing**: Jest with React Testing Library
- **Styling**: Custom CSS with CSS variables and animations
- **Performance**: React.memo, useCallback, and useMemo optimizations

## 🎨 Design System

### Color Palette
- **Primary Gradient**: #667eea → #764ba2 (Purple-Blue)
- **Secondary Gradient**: #f093fb → #f5576c (Pink-Coral)
- **Success Gradient**: #4facfe → #00f2fe (Blue-Cyan)
- **Warning Gradient**: #fa709a → #fee140 (Rose-Yellow)
- **Background**: #0f0f23 with radial gradients
- **Surface**: rgba(255, 255, 255, 0.03) with backdrop blur

## 📊 Chart Types Supported

1. **Line Chart** - Trend analysis
2. **Bar Chart** - Category comparisons
3. **Pie Chart** - Proportional data
4. **Area Chart** - Cumulative visualization
5. **Scatter Plot** - Correlation analysis
6. **Radar Chart** - Multi-dimensional data
7. **Funnel Chart** - Process flows
8. **Heatmap** - Pattern recognition
9. **Treemap** - Hierarchical data
10. **Polar Chart** - Cyclical data

## 🚀 Getting Started

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager
- Google Gemini API key (optional, for AI insights)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chronos778/advanced-data-visualization-playground.git
   cd advanced-data-visualization-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   Create a `.env.local` file:
   ```
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## 📖 Quick Start Guide

### 1. **Upload Your Data** 📤
- Go to **Upload Data** tab
- Drag & drop CSV, JSON, or Excel file
- Auto-detection of data types and formats
- Instant validation with error feedback

### 2. **Preview Data** 👀
- Switch to **Preview Data** tab
- Search and filter your dataset
- View statistical summaries
- Check data quality metrics

### 3. **Transform Data** 🔧
- Go to **Transform Data** tab
- Apply filters, sort, and grouping
- Create calculated columns
- Perform statistical aggregations

### 4. **Create Charts** 📊
- Switch to **Charts & Dashboard** tab
- Add visualization widgets
- Select from 10+ chart types
- Customize colors, labels, and styling

### 5. **Get AI Insights** 🤖
- Navigate to **AI Insights** tab
- Get automatic analysis from Gemini AI
- View correlations and patterns
- Receive smart recommendations

### 6. **Export & Share** 💾
- Download visualizations as PNG/PDF
- Export data as CSV/JSON
- Save dashboard configurations
- Generate shareable reports

## 🎨 Design Features

### Premium Dark Theme
- Modern dark interface (#0f0f23)
- Glassmorphism with backdrop blur
- Vibrant gradient accents
- Smooth animations and transitions

### Responsive Design
- Mobile-friendly layouts
- Touch-optimized controls
- Adaptive chart sizing
- Flexible grid system

### Accessibility
- High contrast color scheme
- Keyboard navigation support
- ARIA labels and descriptions
- Focus management

## 🔐 Security & Privacy

- **No Data Storage**: Data is processed locally in your browser
- **No Tracking**: No analytics or tracking cookies
- **API Keys**: Store API keys in environment variables only
- **Open Source**: Full transparency with MIT license

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/Chronos778/advanced-data-visualization-playground/issues)
- Check existing documentation
- Review the examples

## 🙏 Acknowledgments

- Material-UI for the excellent component library
- Recharts for flexible charting
- Chart.js for advanced visualizations
- Google Gemini for AI capabilities
- React community for amazing tools and libraries

## 📈 Roadmap

- [ ] Real-time data streaming support
- [ ] Collaborative dashboard sharing
- [ ] Advanced SQL query builder
- [ ] Custom plugin system
- [ ] Cloud data source integration
- [ ] Enhanced mobile app
- [ ] Team collaboration features
- [ ] Advanced scheduling for reports

---

**Built with ❤️ for data enthusiasts and analysts**

### Dashboard Layouts
- Responsive grid system
- Breakpoint-based layouts
- Persistent configurations
- Custom widget sizes

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/              # Chart components
│   │   ├── ChartComponent.js
│   │   └── PlotlyChart.js
│   ├── dashboard/           # Dashboard functionality
│   │   └── Dashboard.js
│   ├── dataProcessing/      # Data handling
│   │   ├── FileUploader.js
│   │   ├── DataPreview.js
│   │   └── DataTransformer.js
│   └── insights/            # AI insights
│       └── AIInsights.js
├── utils/                   # Utility functions
│   └── ExportManager.js
├── context/                 # React context
│   └── DataContext.js
└── App.js                   # Main application
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the excellent framework
- **Material-UI** for the beautiful component library
- **Plotly.js** for powerful visualization capabilities
- **Recharts** for easy-to-use chart components
- **Simple Statistics** for statistical analysis functions

## 🐛 Known Issues

- Large datasets (>10MB) may cause performance issues
- 3D charts require WebGL support
- Export functionality works best in modern browsers

## 🔮 Future Enhancements

- [ ] Real-time data streaming support
- [ ] Advanced machine learning integrations
- [ ] Collaborative editing features
- [ ] Cloud storage integration
- [ ] Mobile responsive optimizations

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/advanced-data-visualization-playground/issues) page
2. Create a new issue with detailed information
3. Include sample data and steps to reproduce

---

**Built with ❤️ by the Data Visualization Team**

*Transform your data into insights with the power of modern web technologies!*
