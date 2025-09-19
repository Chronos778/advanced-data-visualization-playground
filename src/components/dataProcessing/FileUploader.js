import React, { useCallback, useState, useMemo } from 'react';
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
  ListItemSecondaryAction,
  Button,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  InsertDriveFile,
  TableChart,
  DataObject,
  CheckCircle,
  FileUpload
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
    <Box sx={{ p: 3 }}>
      {/* Clean Upload Zone */}
      <Card
        {...getRootProps()}
        className="clean-card"
        sx={{
          p: 4,
          border: isDragActive ? '2px solid #3b82f6' : '2px dashed #cbd5e1',
          cursor: 'pointer',
          textAlign: 'center',
          mb: 3,
          transition: 'all 0.2s ease',
          transform: isDragActive ? 'scale(1.01)' : 'scale(1)',
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDragActive ? '#f0f9ff' : '#ffffff',
        }}
      >
        <input {...getInputProps()} />
        
        {/* Upload Icon */}
        <Avatar
          sx={{
            width: 64,
            height: 64,
            backgroundColor: '#3b82f6',
            mb: 2,
          }}
        >
          <FileUpload sx={{ fontSize: 32, color: 'white' }} />
        </Avatar>

        <Typography 
          variant="h6" 
          className="text-primary"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          {isDragActive ? '📁 Drop Your Files Here' : '📊 Upload Data Files'}
        </Typography>
        
        <Typography 
          variant="body2" 
          className="text-secondary"
          sx={{ mb: 2, maxWidth: 350 }}
        >
          {isDragActive 
            ? 'Release to upload your data files'
            : 'Drag and drop CSV, JSON, or Excel files, or click to browse'
          }
        </Typography>

        {/* File Type Indicators */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'CSV', color: '#10b981' },
            { label: 'JSON', color: '#f59e0b' },
            { label: 'Excel', color: '#3b82f6' }
          ].map((type) => (
            <Chip
              key={type.label}
              label={type.label}
              size="small"
              sx={{ 
                backgroundColor: type.color,
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 500
              }}
            />
          ))}
        </Box>
      </Card>

      {/* Loading State */}
      {uploading && (
        <Card className="clean-card" sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CloudUpload sx={{ mr: 2, color: '#3b82f6', fontSize: 20 }} />
            <Typography variant="subtitle1" className="text-primary">
              Processing Files...
            </Typography>
          </Box>
          <LinearProgress 
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#f1f5f9',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#3b82f6',
                borderRadius: 3,
              }
            }}
          />
        </Card>
      )}

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <Card className="clean-card">
          <CardContent>
            <Typography variant="h6" className="text-primary" sx={{ mb: 2, fontWeight: 600 }}>
              📁 Files ({uploadedFiles.length})
            </Typography>
            
            {uploadedFiles.map((file) => (
              <Box 
                key={file.id}
                className="clean-card"
                sx={{ 
                  p: 2, 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    transform: 'translateX(4px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    mr: 2,
                    width: 40,
                    height: 40,
                  }}
                >
                  {getFileIcon(file.fileType)}
                </Avatar>
                
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" className="text-primary" sx={{ fontWeight: 600 }}>
                    {file.fileName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                    <Chip
                      label={file.fileType}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem',
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                    <Chip
                      label={`${file.rowCount.toLocaleString()} rows`}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem',
                        backgroundColor: '#f1f5f9',
                        color: '#64748b',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                  </Box>
                </Box>
                
                <IconButton
                  onClick={() => removeFile(file.id)}
                  size="small"
                  sx={{ 
                    color: '#94a3b8',
                    '&:hover': {
                      color: '#ef4444',
                      backgroundColor: '#fef2f2',
                    }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {uploadedFiles.length === 0 && !uploading && (
        <Card className="clean-card" sx={{ p: 3, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
          <Typography variant="subtitle1" className="text-primary" sx={{ mb: 0.5 }}>
            Ready for Data
          </Typography>
          <Typography variant="body2" className="text-secondary">
            Upload your first file to begin visualization
          </Typography>
        </Card>
      )}
    </Box>
  );
};

export default React.memo(FileUploader);