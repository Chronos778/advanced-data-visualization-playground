import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import {
  Download,
  Image,
  PictureAsPdf,
  Code,
  TableChart,
  Settings,
  CheckCircle,
  Error,
  Delete
} from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ExportManager = ({ dashboardRef, widgets, data, layout }) => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportConfig, setExportConfig] = useState({
    format: 'png',
    quality: 'high',
    includeTitle: true,
    includeTimestamp: true,
    fileName: 'dashboard_export',
    individualCharts: false,
    paperSize: 'a4',
    orientation: 'landscape'
  });
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState([]);

  const formatOptions = [
    { value: 'png', label: 'PNG Image', icon: <Image />, description: 'High-quality raster image' },
    { value: 'pdf', label: 'PDF Document', icon: <PictureAsPdf />, description: 'Portable document format' },
    { value: 'json', label: 'Dashboard Config', icon: <Code />, description: 'JSON configuration file' },
    { value: 'csv', label: 'Data CSV', icon: <TableChart />, description: 'Comma-separated values' }
  ];

  const qualityOptions = [
    { value: 'low', label: 'Low (1x)', scale: 1 },
    { value: 'medium', label: 'Medium (2x)', scale: 2 },
    { value: 'high', label: 'High (3x)', scale: 3 },
    { value: 'ultra', label: 'Ultra (4x)', scale: 4 }
  ];

  const paperSizes = [
    { value: 'a4', label: 'A4', width: 210, height: 297 },
    { value: 'a3', label: 'A3', width: 297, height: 420 },
    { value: 'letter', label: 'Letter', width: 216, height: 279 },
    { value: 'legal', label: 'Legal', width: 216, height: 356 }
  ];

  const addStatus = (message, type = 'info') => {
    setExportStatus(prev => [...prev, {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearStatus = () => {
    setExportStatus([]);
  };

  const exportAsPNG = async () => {
    if (!dashboardRef.current) {
      addStatus('Dashboard not found', 'error');
      return;
    }

    try {
      addStatus('Capturing dashboard screenshot...', 'info');
      
      const quality = qualityOptions.find(q => q.value === exportConfig.quality);
      const scale = quality ? quality.scale : 2;

      const canvas = await html2canvas(dashboardRef.current, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: dashboardRef.current.scrollWidth,
        height: dashboardRef.current.scrollHeight
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${exportConfig.fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      addStatus('PNG export completed successfully', 'success');
    } catch (error) {
      addStatus(`PNG export failed: ${error.message}`, 'error');
    }
  };

  const exportAsPDF = async () => {
    if (!dashboardRef.current) {
      addStatus('Dashboard not found', 'error');
      return;
    }

    try {
      addStatus('Generating PDF document...', 'info');

      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const paperSize = paperSizes.find(p => p.value === exportConfig.paperSize);
      const isLandscape = exportConfig.orientation === 'landscape';
      
      const pdf = new jsPDF({
        orientation: exportConfig.orientation,
        unit: 'mm',
        format: [paperSize.width, paperSize.height]
      });

      // Calculate dimensions
      const pdfWidth = isLandscape ? paperSize.height : paperSize.width;
      const pdfHeight = isLandscape ? paperSize.width : paperSize.height;
      const margin = 10;
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - (margin * 2);

      // Add title if requested
      let yOffset = margin;
      if (exportConfig.includeTitle) {
        pdf.setFontSize(16);
        pdf.text('Data Visualization Dashboard', margin, yOffset);
        yOffset += 10;
      }

      // Add timestamp if requested
      if (exportConfig.includeTimestamp) {
        pdf.setFontSize(10);
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, yOffset);
        yOffset += 8;
      }

      // Calculate image dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(availableWidth / imgWidth, (availableHeight - yOffset) / imgHeight);
      
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', margin, yOffset, scaledWidth, scaledHeight);

      // Save PDF
      pdf.save(`${exportConfig.fileName}.pdf`);

      addStatus('PDF export completed successfully', 'success');
    } catch (error) {
      addStatus(`PDF export failed: ${error.message}`, 'error');
    }
  };

  const exportAsJSON = () => {
    try {
      addStatus('Generating dashboard configuration...', 'info');

      const config = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        widgets: widgets,
        layout: layout,
        data: {
          fileName: data?.fileName,
          columns: data?.columns,
          rowCount: data?.data?.length,
          // Don't include actual data for privacy/size reasons
        },
        exportConfig: exportConfig
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportConfig.fileName}.json`;
      link.click();
      URL.revokeObjectURL(url);

      addStatus('JSON configuration exported successfully', 'success');
    } catch (error) {
      addStatus(`JSON export failed: ${error.message}`, 'error');
    }
  };

  const exportAsCSV = () => {
    if (!data || !data.data) {
      addStatus('No data available to export', 'error');
      return;
    }

    try {
      addStatus('Generating CSV file...', 'info');

      const headers = data.columns.join(',');
      const rows = data.data.map(row => 
        data.columns.map(col => {
          const value = row[col];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      );

      const csvContent = [headers, ...rows].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportConfig.fileName}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      addStatus('CSV export completed successfully', 'success');
    } catch (error) {
      addStatus(`CSV export failed: ${error.message}`, 'error');
    }
  };

  const exportIndividualCharts = async () => {
    if (!widgets || widgets.length === 0) {
      addStatus('No charts to export', 'error');
      return;
    }

    addStatus(`Exporting ${widgets.length} individual charts...`, 'info');

    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i];
      try {
        const element = document.getElementById(widget.id);
        if (element) {
          const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff'
          });

          const link = document.createElement('a');
          link.download = `${widget.title || `chart_${i + 1}`}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();

          addStatus(`Exported chart: ${widget.title || `Chart ${i + 1}`}`, 'success');
        }
      } catch (error) {
        addStatus(`Failed to export chart ${i + 1}: ${error.message}`, 'error');
      }
    }
  };

  const handleExport = async () => {
    setExporting(true);
    clearStatus();

    try {
      switch (exportConfig.format) {
        case 'png':
          await exportAsPNG();
          if (exportConfig.individualCharts) {
            await exportIndividualCharts();
          }
          break;
        case 'pdf':
          await exportAsPDF();
          break;
        case 'json':
          exportAsJSON();
          break;
        case 'csv':
          exportAsCSV();
          break;
        default:
          addStatus('Unknown export format', 'error');
      }
    } catch (error) {
      addStatus(`Export failed: ${error.message}`, 'error');
    }

    setExporting(false);
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle color="success" />;
      case 'error': return <Error color="error" />;
      default: return <Settings color="info" />;
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<Download />}
        onClick={() => setExportDialogOpen(true)}
        disabled={!data && exportConfig.format !== 'png' && exportConfig.format !== 'pdf'}
      >
        Export
      </Button>

      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Export Dashboard</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Export Format */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Export Format</InputLabel>
                <Select
                  value={exportConfig.format}
                  label="Export Format"
                  onChange={(e) => setExportConfig(prev => ({ ...prev, format: e.target.value }))}
                >
                  {formatOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.icon}
                        <Box>
                          <Typography>{option.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* File Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="File Name"
                value={exportConfig.fileName}
                onChange={(e) => setExportConfig(prev => ({ ...prev, fileName: e.target.value }))}
                placeholder="dashboard_export"
              />
            </Grid>

            {/* Quality (for PNG) */}
            {exportConfig.format === 'png' && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Quality</InputLabel>
                  <Select
                    value={exportConfig.quality}
                    label="Quality"
                    onChange={(e) => setExportConfig(prev => ({ ...prev, quality: e.target.value }))}
                  >
                    {qualityOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* PDF Options */}
            {exportConfig.format === 'pdf' && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Paper Size</InputLabel>
                    <Select
                      value={exportConfig.paperSize}
                      label="Paper Size"
                      onChange={(e) => setExportConfig(prev => ({ ...prev, paperSize: e.target.value }))}
                    >
                      {paperSizes.map(size => (
                        <MenuItem key={size.value} value={size.value}>
                          {size.label} ({size.width}×{size.height}mm)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Orientation</InputLabel>
                    <Select
                      value={exportConfig.orientation}
                      label="Orientation"
                      onChange={(e) => setExportConfig(prev => ({ ...prev, orientation: e.target.value }))}
                    >
                      <MenuItem value="landscape">Landscape</MenuItem>
                      <MenuItem value="portrait">Portrait</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {/* Options */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Options</Typography>
              
              {(exportConfig.format === 'png' || exportConfig.format === 'pdf') && (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exportConfig.includeTitle}
                        onChange={(e) => setExportConfig(prev => ({ ...prev, includeTitle: e.target.checked }))}
                      />
                    }
                    label="Include title"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exportConfig.includeTimestamp}
                        onChange={(e) => setExportConfig(prev => ({ ...prev, includeTimestamp: e.target.checked }))}
                      />
                    }
                    label="Include timestamp"
                  />
                </>
              )}

              {exportConfig.format === 'png' && widgets && widgets.length > 0 && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportConfig.individualCharts}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, individualCharts: e.target.checked }))}
                    />
                  }
                  label={`Export individual charts (${widgets.length} charts)`}
                />
              )}
            </Grid>

            {/* Export Status */}
            {exportStatus.length > 0 && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">Export Status</Typography>
                    <IconButton size="small" onClick={clearStatus}>
                      <Delete />
                    </IconButton>
                  </Box>
                  <List dense>
                    {exportStatus.map(status => (
                      <ListItem key={status.id}>
                        <ListItemIcon>
                          {getStatusIcon(status.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={status.message}
                          secondary={status.timestamp}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}

            {/* Progress Bar */}
            {exporting && (
              <Grid item xs={12}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  Exporting... Please wait
                </Typography>
              </Grid>
            )}

            {/* Warnings */}
            {exportConfig.format === 'csv' && !data && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  No data available to export as CSV. Please upload data first.
                </Alert>
              </Grid>
            )}

            {(exportConfig.format === 'png' || exportConfig.format === 'pdf') && widgets.length === 0 && (
              <Grid item xs={12}>
                <Alert severity="info">
                  Your dashboard appears to be empty. The export will contain only the dashboard structure.
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleExport}
            variant="contained"
            disabled={exporting}
            startIcon={<Download />}
          >
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExportManager;