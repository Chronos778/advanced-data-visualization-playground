import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  InsertDriveFile,
  TableChart,
  DataObject
} from '@mui/icons-material';

const FileUploader = ({ onDataLoaded, onError }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const processCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
          } else {
            resolve({
              data: results.data,
              columns: results.meta.fields,
              fileName: file.name,
              fileType: 'CSV',
              rowCount: results.data.length
            });
          }
        },
        error: (error) => reject(error)
      });
    });
  };

  const processExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length === 0) {
            reject(new Error('Excel file contains no data'));
            return;
          }

          const columns = Object.keys(jsonData[0]);
          resolve({
            data: jsonData,
            columns: columns,
            fileName: file.name,
            fileType: 'Excel',
            rowCount: jsonData.length,
            sheetName: sheetName
          });
        } catch (error) {
          reject(new Error(`Excel parsing error: ${error.message}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const processJSON = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          let processedData = [];
          let columns = [];

          if (Array.isArray(jsonData)) {
            processedData = jsonData;
            if (jsonData.length > 0 && typeof jsonData[0] === 'object') {
              columns = Object.keys(jsonData[0]);
            }
          } else if (typeof jsonData === 'object') {
            // If it's a single object, convert to array
            processedData = [jsonData];
            columns = Object.keys(jsonData);
          } else {
            reject(new Error('JSON must be an array of objects or a single object'));
            return;
          }

          resolve({
            data: processedData,
            columns: columns,
            fileName: file.name,
            fileType: 'JSON',
            rowCount: processedData.length
          });
        } catch (error) {
          reject(new Error(`JSON parsing error: ${error.message}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read JSON file'));
      reader.readAsText(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        let processedData;
        const fileExtension = file.name.split('.').pop().toLowerCase();

        switch (fileExtension) {
          case 'csv':
            processedData = await processCSV(file);
            break;
          case 'xlsx':
          case 'xls':
            processedData = await processExcel(file);
            break;
          case 'json':
            processedData = await processJSON(file);
            break;
          default:
            throw new Error(`Unsupported file type: ${fileExtension}`);
        }

        // Add metadata
        processedData.uploadedAt = new Date().toISOString();
        processedData.fileSize = file.size;
        processedData.id = `${file.name}_${Date.now()}`;

        setUploadedFiles(prev => [...prev, processedData]);
        onDataLoaded(processedData);

      } catch (error) {
        onError(`Error processing ${file.name}: ${error.message}`);
      }
    }
    
    setUploading(false);
  }, [onDataLoaded, onError]);

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'CSV':
        return <TableChart color="primary" />;
      case 'Excel':
        return <InsertDriveFile color="success" />;
      case 'JSON':
        return <DataObject color="secondary" />;
      default:
        return <InsertDriveFile />;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true
  });

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          textAlign: 'center',
          mb: 2,
          transition: 'all 0.3s ease'
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop files here...' : 'Upload Data Files'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Drag and drop CSV, JSON, or Excel files here, or click to browse
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Chip label="CSV" size="small" sx={{ mr: 1 }} />
          <Chip label="JSON" size="small" sx={{ mr: 1 }} />
          <Chip label="Excel" size="small" />
        </Box>
      </Paper>

      {uploading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Processing files...
          </Typography>
        </Box>
      )}

      {uploadedFiles.length > 0 && (
        <Paper sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ p: 2, pb: 0 }}>
            Uploaded Files ({uploadedFiles.length})
          </Typography>
          <List>
            {uploadedFiles.map((file) => (
              <ListItem key={file.id}>
                <Box sx={{ mr: 2 }}>
                  {getFileIcon(file.fileType)}
                </Box>
                <ListItemText
                  primary={file.fileName}
                  secondary={
                    <Box>
                      <Typography variant="body2" component="span">
                        {file.fileType} • {file.rowCount} rows • {file.columns.length} columns
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Size: {(file.fileSize / 1024).toFixed(1)} KB • 
                        Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => removeFile(file.id)}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default FileUploader;