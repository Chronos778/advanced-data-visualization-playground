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
  Button
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
        return <TableChart sx={{ color: '#000000' }} />;
      case 'Excel':
        return <InsertDriveFile color="success" />;
      case 'JSON':
        return <DataObject sx={{ color: '#000000' }} />;
      default:
        return <InsertDriveFile />;
    }
  };

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'CSV': return <TableChart sx={{ fontSize: 20, color: 'white' }} />;
      case 'Excel': return <InsertDriveFile sx={{ fontSize: 20, color: 'white' }} />;
      case 'JSON': return <DataObject sx={{ fontSize: 20, color: 'white' }} />;
      default: return <InsertDriveFile sx={{ fontSize: 20, color: 'white' }} />;
    }
  };

  const getFileTypeColor = (fileType) => {
    switch (fileType) {
      case 'CSV': return '#000000';
      case 'Excel': return '#000000';
      case 'JSON': return '#000000';
      default: return '#000000';
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
      {/* Modern Upload Zone */}
      <Paper
        {...getRootProps()}
        className="modern-card"
        sx={{
          p: 6,
          border: isDragActive ? '3px solid #000000' : '2px dashed #e0e0e0',
          cursor: 'pointer',
          textAlign: 'center',
          mb: 4,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isDragActive ? 'scale(1.02)' : 'scale(1)',
          minHeight: 240,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: isDragActive 
            ? '#f5f5f5'
            : '#ffffff',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <input {...getInputProps()} />
        
        {/* Enhanced Upload Icon */}
        <Box sx={{ 
          position: 'relative',
          mb: 3,
        }}>
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            border: '2px solid #ffffff',
          }}>
            <CloudUpload sx={{ fontSize: 36, color: 'white' }} />
          </Box>
        </Box>

        <Typography 
          variant="h4" 
          sx={{ 
            mb: 2, 
            fontWeight: 800,
            color: '#000000',
            letterSpacing: '-0.025em'
          }}
        >
          {isDragActive ? 'Drop Files Here!' : 'Upload Your Data'}
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ 
            mb: 4, 
            maxWidth: 400,
            fontWeight: 400,
            lineHeight: 1.6
          }}
        >
          {isDragActive 
            ? 'Release to upload your data files and start exploring'
            : 'Drag and drop your files or click to browse. We support multiple formats for maximum flexibility.'
          }
        </Typography>

        {/* Enhanced File Type Indicators */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 3 }}>
          {[
            { label: 'CSV Files', icon: <TableChart />, color: '#000000' },
            { label: 'JSON Data', icon: <DataObject />, color: '#000000' },
            { label: 'Excel Files', icon: <InsertDriveFile />, color: '#000000' }
          ].map((type) => (
            <Box
              key={type.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 2,
                background: type.color,
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {type.icon}
              {type.label}
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<FileUpload />}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            background: '#000000',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: '#000000',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          Choose Files
        </Button>
      </Paper>

      {/* Enhanced Loading State */}
      {uploading && (
        <Paper className="modern-card" sx={{ p: 4, mb: 4, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}>
              <CloudUpload sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Processing Your Data
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analyzing file structure and preparing preview...
              </Typography>
            </Box>
          </Box>
          <LinearProgress 
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#f5f5f5',
              '& .MuiLinearProgress-bar': {
                background: '#000000',
                borderRadius: 4,
              }
            }}
          />
        </Paper>
      )}

      {/* Enhanced File List */}
      {uploadedFiles.length > 0 && (
        <Paper className="modern-card" sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CheckCircle sx={{ color: 'success.main', mr: 2, fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Uploaded Files ({uploadedFiles.length})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Successfully processed and ready for analysis
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            {uploadedFiles.map((file) => (
              <Box 
                key={file.id}
                className="modern-card"
                sx={{ 
                  p: 3, 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  background: '#ffffff',
                  border: '1px solid #e0e0e0',
                  '&:hover': { 
                    transform: 'translateX(4px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: getFileTypeColor(file.fileType),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 3
                }}>
                  {getFileTypeIcon(file.fileType)}
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                    {file.fileName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={file.fileType}
                      size="small"
                      sx={{ 
                        background: getFileTypeColor(file.fileType),
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                    <Chip
                      label={`${file.rowCount.toLocaleString()} rows`}
                      size="small"
                      sx={{ 
                        backgroundColor: '#f5f5f5',
                        color: '#000000',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                    <Chip
                      label={`${file.columns.length} columns`}
                      size="small"
                      sx={{ 
                        backgroundColor: '#f5f5f5',
                        color: '#000000',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                </Box>
                
                <IconButton
                  onClick={() => removeFile(file.id)}
                  sx={{ 
                    color: '#000000',
                    background: '#f5f5f5',
                    '&:hover': {
                      background: '#e0e0e0',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Enhanced Empty State */}
      {uploadedFiles.length === 0 && !uploading && (
        <Paper className="modern-card" sx={{ p: 6, textAlign: 'center', background: '#ffffff' }}>
          <Box sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2
          }}>
            <CheckCircle sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
            System Ready
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload your data files to unlock powerful visualizations and AI insights
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default React.memo(FileUploader);
