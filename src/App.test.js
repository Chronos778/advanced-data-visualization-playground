import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock chart.js dependencies to avoid ESM issues
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
    defaults: {
      color: '#000000',
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      plugins: {
        legend: {
          labels: {
            color: '#000000'
          }
        },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#000000',
          bodyColor: '#000000',
          borderColor: '#000000'
        }
      }
    }
  },
  registerables: [],
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  BarElement: jest.fn(),
  ArcElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  Filler: jest.fn(),
  RadialLinearScale: jest.fn(),
  TimeScale: jest.fn(),
  LogarithmicScale: jest.fn(),
}));

jest.mock('chartjs-adapter-date-fns', () => ({}));
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => children
}));
jest.mock('chartjs-chart-matrix', () => ({
  MatrixController: jest.fn(),
  MatrixElement: jest.fn(),
}));
jest.mock('chartjs-chart-sankey', () => ({
  SankeyController: jest.fn(),
  Flow: jest.fn(),
}));
jest.mock('chartjs-chart-treemap', () => ({
  TreemapController: jest.fn(),
  TreemapElement: jest.fn(),
}));
jest.mock('@sgratzl/chartjs-chart-boxplot', () => ({
  BoxPlotController: jest.fn(),
  BoxAndWiskers: jest.fn(),
}));

import App from './App';

test('renders main application components', () => {
  render(<App />);
  
  // Check if main navigation elements are present (use getAllByText for duplicates)
  const datavizElements = screen.getAllByText(/DataViz Pro/i);
  expect(datavizElements.length).toBeGreaterThan(0);
  expect(screen.getByText(/Upload Data/i)).toBeInTheDocument();
  expect(screen.getByText(/Advanced Analytics Platform/i)).toBeInTheDocument();
});

test('renders file upload tab by default', () => {
  render(<App />);
  
  // Check if upload section is visible
  expect(screen.getByText(/Upload Your Data/i)).toBeInTheDocument();
  expect(screen.getByText(/Choose Files/i)).toBeInTheDocument();
});

test('data-dependent tabs are disabled initially', () => {
  render(<App />);
  
  // These tabs should be disabled when there's no data
  const previewTab = screen.getByRole('tab', { name: /Preview Data/i });
  const transformTab = screen.getByRole('tab', { name: /Transform Data/i });
  const dashboardTab = screen.getByRole('tab', { name: /Charts & Dashboard/i });
  
  // Material-UI uses disabled prop, not aria-disabled
  expect(previewTab).toHaveClass('Mui-disabled');
  expect(transformTab).toHaveClass('Mui-disabled');
  expect(dashboardTab).toHaveClass('Mui-disabled');
});
