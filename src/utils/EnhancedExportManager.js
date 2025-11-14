/**
 * Enhanced Data Export/Import Manager
 * Supports multiple formats and advanced options
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export data to various formats
 */
export const exportData = {
  /**
   * Export to CSV
   */
  toCSV: (data, filename = 'data.csv', options = {}) => {
    if (!data || !data.data || data.data.length === 0) {
      throw new Error('No data to export');
    }

    const columns = data.columns || Object.keys(data.data[0]);
    const separator = options.separator || ',';
    const includeHeaders = options.includeHeaders !== false;
    
    let csv = '';
    
    // Add headers
    if (includeHeaders) {
      csv += columns.join(separator) + '\n';
    }
    
    // Add data rows
    data.data.forEach(row => {
      const values = columns.map(col => {
        let value = row[col];
        if (value === null || value === undefined) return '';
        
        // Escape quotes and wrap in quotes if contains separator
        value = String(value);
        if (value.includes(separator) || value.includes('"') || value.includes('\n')) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      });
      csv += values.join(separator) + '\n';
    });

    downloadFile(csv, filename, 'text/csv');
  },

  /**
   * Export to JSON
   */
  toJSON: (data, filename = 'data.json', options = {}) => {
    if (!data) {
      throw new Error('No data to export');
    }

    const pretty = options.pretty !== false;
    const includeMetadata = options.includeMetadata !== false;
    
    const exportData = {
      ...(includeMetadata && {
        metadata: {
          exportDate: new Date().toISOString(),
          rowCount: data.data?.length || 0,
          columnCount: data.columns?.length || 0,
          fileName: data.fileName
        }
      }),
      columns: data.columns,
      data: data.data
    };

    const json = JSON.stringify(exportData, null, pretty ? 2 : 0);
    downloadFile(json, filename, 'application/json');
  },

  /**
   * Export to Excel (CSV format for Excel)
   */
  toExcel: (data, filename = 'data.xlsx', options = {}) => {
    // Use CSV format but with .xlsx extension for Excel compatibility
    const csvFilename = filename.replace(/\.[^/.]+$/, '') + '.csv';
    exportData.toCSV(data, csvFilename, options);
  },

  /**
   * Export dashboard configuration
   */
  toDashboardConfig: (widgets, layout, filename = 'dashboard-config.json') => {
    const config = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      widgets,
      layout
    };

    const json = JSON.stringify(config, null, 2);
    downloadFile(json, filename, 'application/json');
  },

  /**
   * Export chart as PNG
   */
  toChartPNG: async (chartElement, filename = 'chart.png', options = {}) => {
    if (!chartElement) {
      throw new Error('Chart element not found');
    }

    const scale = options.scale || 2;
    const backgroundColor = options.backgroundColor || '#131722';

    const canvas = await html2canvas(chartElement, {
      scale,
      backgroundColor,
      logging: false,
      useCORS: true
    });

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  },

  /**
   * Export dashboard as PDF
   */
  toDashboardPDF: async (dashboardElement, filename = 'dashboard.pdf', options = {}) => {
    if (!dashboardElement) {
      throw new Error('Dashboard element not found');
    }

    const scale = options.scale || 2;
    const orientation = options.orientation || 'landscape';
    const format = options.format || 'a4';

    const canvas = await html2canvas(dashboardElement, {
      scale,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF(orientation, 'mm', format);
    
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
  },

  /**
   * Export statistics report
   */
  toStatisticsReport: (statistics, filename = 'statistics-report.json') => {
    const report = {
      generatedAt: new Date().toISOString(),
      statistics
    };

    const json = JSON.stringify(report, null, 2);
    downloadFile(json, filename, 'application/json');
  }
};

/**
 * Import data from various sources
 */
export const importData = {
  /**
   * Import from CSV
   */
  fromCSV: (file, options = {}) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const separator = options.separator || detectSeparator(text);
          const hasHeaders = options.hasHeaders !== false;
          
          const lines = text.split('\n').filter(line => line.trim());
          if (lines.length === 0) {
            reject(new Error('Empty file'));
            return;
          }

          let columns;
          let startRow = 0;

          if (hasHeaders) {
            columns = parseLine(lines[0], separator);
            startRow = 1;
          } else {
            // Generate column names
            const firstLine = parseLine(lines[0], separator);
            columns = firstLine.map((_, i) => `Column ${i + 1}`);
          }

          const data = lines.slice(startRow).map(line => {
            const values = parseLine(line, separator);
            const row = {};
            columns.forEach((col, i) => {
              row[col] = values[i] || '';
            });
            return row;
          });

          resolve({
            columns,
            data,
            fileName: file.name,
            rowCount: data.length
          });
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  /**
   * Import from JSON
   */
  fromJSON: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          
          // Handle different JSON structures
          let data, columns;
          
          if (Array.isArray(json)) {
            data = json;
            columns = json.length > 0 ? Object.keys(json[0]) : [];
          } else if (json.data && Array.isArray(json.data)) {
            data = json.data;
            columns = json.columns || (json.data.length > 0 ? Object.keys(json.data[0]) : []);
          } else {
            reject(new Error('Invalid JSON structure'));
            return;
          }

          resolve({
            columns,
            data,
            fileName: file.name,
            rowCount: data.length
          });
        } catch (err) {
          reject(new Error('Invalid JSON file'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  /**
   * Import from Excel
   */
  fromExcel: async (file) => {
    const readExcelFile = require('read-excel-file');
    
    try {
      const rows = await readExcelFile(file);
      
      if (rows.length === 0) {
        throw new Error('Empty Excel file');
      }

      const columns = rows[0].map((col, i) => col || `Column ${i + 1}`);
      const data = rows.slice(1).map(row => {
        const obj = {};
        columns.forEach((col, i) => {
          obj[col] = row[i] !== null ? row[i] : '';
        });
        return obj;
      });

      return {
        columns,
        data,
        fileName: file.name,
        rowCount: data.length
      };
    } catch (err) {
      throw new Error(`Failed to read Excel file: ${err.message}`);
    }
  },

  /**
   * Import dashboard configuration
   */
  fromDashboardConfig: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          
          if (!config.widgets || !config.layout) {
            reject(new Error('Invalid dashboard configuration'));
            return;
          }

          resolve(config);
        } catch (err) {
          reject(new Error('Invalid configuration file'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
};

/**
 * Helper functions
 */

// Download file helper
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Detect CSV separator
function detectSeparator(text) {
  const firstLine = text.split('\n')[0];
  const separators = [',', ';', '\t', '|'];
  
  let maxCount = 0;
  let detected = ',';
  
  separators.forEach(sep => {
    const count = (firstLine.match(new RegExp(sep, 'g')) || []).length;
    if (count > maxCount) {
      maxCount = count;
      detected = sep;
    }
  });
  
  return detected;
}

// Parse CSV line
function parseLine(line, separator) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === separator && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current);
  return values;
}

export default {
  exportData,
  importData
};
