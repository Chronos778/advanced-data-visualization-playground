# 🚀 Advanced Data Visualization Playground

A powerful, modern web application for advanced data visualization, transformation, and analysis. Built with React and featuring an intuitive drag-and-drop interface, AI-powered insights, and comprehensive export capabilities.

![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3.2-blue?logo=mui)
![Plotly.js](https://img.shields.io/badge/Plotly.js-3.1.0-green?logo=plotly)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### 📊 **Multi-Format Data Support**
- **File Upload**: Drag-and-drop support for CSV, JSON, and Excel files
- **Real-time Validation**: Instant data parsing and error detection
- **Data Preview**: Interactive tables with pagination and search

### 🔧 **Advanced Data Transformation**
- **Filtering**: Complex multi-column filtering with various operators
- **Sorting**: Multi-level sorting with custom order
- **Grouping**: Data aggregation with statistical functions
- **Statistics**: Automatic calculation of mean, median, mode, and more

### 📈 **Comprehensive Visualization Library**
- **Recharts Integration**: Line, bar, pie, scatter, and area charts
- **Plotly.js Power**: 3D visualizations, heatmaps, surface plots, and advanced charts
- **Interactive Controls**: Real-time chart customization and styling
- **Responsive Design**: Charts that adapt to different screen sizes

### 🎯 **Drag-and-Drop Dashboard**
- **Grid Layout**: Responsive, resizable chart widgets
- **Live Editing**: Add, remove, and configure charts in real-time
- **Layout Persistence**: Save and restore dashboard configurations
- **Widget Management**: Easy chart creation and customization

### 🤖 **AI-Powered Insights**
- **Correlation Analysis**: Automatic detection of data relationships
- **Outlier Identification**: Statistical anomaly detection
- **Trend Analysis**: Pattern recognition and forecasting suggestions
- **Smart Recommendations**: AI-generated visualization suggestions

### 💾 **Export & Sharing**
- **Multiple Formats**: PNG, PDF, JSON, CSV exports
- **Quality Settings**: Configurable resolution and compression
- **Batch Export**: Download multiple visualizations at once
- **Data Export**: Transform and export processed datasets

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1 with modern hooks and context
- **UI Framework**: Material-UI v7 with custom theming
- **Visualization**: 
  - Plotly.js for advanced 3D and scientific charts
  - Recharts for standard business charts
- **Layout**: react-grid-layout for drag-and-drop dashboards
- **Data Processing**: 
  - papaparse for CSV handling
  - simple-statistics for AI insights
  - lodash for data manipulation
- **Export**: html2canvas + jsPDF for image/PDF generation

## 🚀 Getting Started

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/advanced-data-visualization-playground.git
   cd advanced-data-visualization-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📖 Usage Guide

### 1. **Upload Your Data**
- Navigate to the **File Upload** tab
- Drag and drop your CSV, JSON, or Excel file
- Review the data preview and statistics

### 2. **Transform Your Data**
- Use the **Data Processing** tab to filter, sort, and group data
- Apply statistical functions and create calculated columns
- Preview transformations in real-time

### 3. **Create Visualizations**
- **Charts Tab**: Create standard business charts (line, bar, pie, scatter)
- **Advanced Charts Tab**: Build 3D visualizations, heatmaps, and surface plots
- Customize colors, labels, and styling options

### 4. **Build Dashboards**
- Go to the **Dashboard** tab
- Add chart widgets using the "+" button
- Drag and resize widgets to create your layout
- Configure each chart with different data and settings

### 5. **Generate AI Insights**
- Visit the **AI Insights** tab for automatic analysis
- View correlation matrices and outlier detection
- Get smart recommendations for data exploration

### 6. **Export Your Work**
- Use the **Export Manager** to download visualizations
- Choose from PNG, PDF, JSON, or CSV formats
- Configure quality settings and batch export options

## 🎨 Customization

### Themes
The application supports both light and dark themes. Toggle using the theme switcher in the top navigation bar.

### Chart Styling
Each chart type offers extensive customization options:
- Colors and gradients
- Labels and legends
- Axes configuration
- Interactive features

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
