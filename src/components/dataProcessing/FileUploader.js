import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import readXlsxFile from 'read-excel-file';
import {
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Button
} from '@mui/material';
import {
  Delete,
  InsertDriveFile,
  TableChart,
  DataObject,
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
      readXlsxFile(file).then((rows) => {
        try {
          if (!rows || rows.length === 0) {
            reject(new Error('Excel file contains no data'));
            return;
          }

          // First row contains headers
          const headers = rows[0];
          const dataRows = rows.slice(1);

          // Convert to objects
          const jsonData = dataRows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });

          const columns = headers.map(h => String(h));
          resolve({
            data: jsonData,
            columns: columns,
            fileName: file.name,
            fileType: 'Excel',
            rowCount: jsonData.length,
            sheetName: 'Sheet1'
          });
        } catch (error) {
          reject(new Error(`Excel parsing error: ${error.message}`));
        }
      }).catch(error => {
        reject(new Error(`Failed to read Excel file: ${error.message}`));
      });
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

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'CSV': return <TableChart sx={{ fontSize: 24 }} />;
      case 'Excel': return <InsertDriveFile sx={{ fontSize: 24 }} />;
      case 'JSON': return <DataObject sx={{ fontSize: 24 }} />;
      default: return <InsertDriveFile sx={{ fontSize: 24 }} />;
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
    <Box sx={{ width: '100%' }}>
      {/* Swiss Grid Upload Zone */}
      <Box
        {...getRootProps()}
        sx={{
          p: 6,
          border: '2px dashed black',
          backgroundColor: isDragActive ? 'black' : 'white',
          color: isDragActive ? 'white' : 'black',
          cursor: 'pointer',
          textAlign: 'center',
          mb: 4,
          transition: 'none',
          minHeight: 240,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          '&:hover': {
            backgroundColor: 'black',
            color: 'white',
            '& .upload-icon': {
              color: 'white'
            },
            '& .supported-types': {
              borderColor: 'white',
              color: 'white'
            }
          }
        }}
      >
        <input {...getInputProps()} />

        <FileUpload className="upload-icon" sx={{ fontSize: 64, mb: 2, color: isDragActive ? 'white' : 'black' }} />

        <Typography
          variant="h3"
          sx={{
            mb: 2,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {isDragActive ? 'DROP_TO_INGEST' : 'UPLOAD_DATA'}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{
            mb: 4,
            maxWidth: 400,
            lineHeight: 1.6
          }}
        >
          {isDragActive
            ? 'INITIATE TRANSFER SEQUENCE'
            : 'Select or drop files to begin processing. Strict format requirements enforced.'
          }
        </Typography>

        {/* Supported Types */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 4 }}>
          {['CSV', 'JSON', 'XLSX'].map((type) => (
            <Box
              key={type}
              className="supported-types"
              sx={{
                px: 2,
                py: 0.5,
                border: '1px solid black',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                borderColor: isDragActive ? 'white' : 'black',
              }}
            >
              .{type}
            </Box>
          ))}
        </Box>

        <Button
          variant="outlined"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            border: '2px solid',
            borderColor: isDragActive ? 'white' : 'black',
            color: isDragActive ? 'black' : 'white',
            backgroundColor: isDragActive ? 'white' : 'black',
            '&:hover': {
              backgroundColor: isDragActive ? 'black' : 'white',
              color: isDragActive ? 'white' : 'black',
              borderColor: isDragActive ? 'white' : 'black',
            }
          }}
        >
          SELECT_FILES
        </Button>
      </Box>

      {/* Loading State */}
      {uploading && (
        <Box sx={{ p: 3, mb: 4, border: '2px solid black', backgroundColor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1, letterSpacing: '0.1em' }}>
              PROCESSING_DATA...
            </Typography>
          </Box>
          <LinearProgress
            sx={{
              height: 2,
              backgroundColor: 'divider',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'black',
              }
            }}
          />
        </Box>
      )}

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <Box sx={{ border: '2px solid black', backgroundColor: 'background.paper' }}>
          <Box sx={{ p: 2, borderBottom: '2px solid black', backgroundColor: 'black', color: 'white' }}>
            <Typography variant="subtitle2" sx={{ letterSpacing: '0.1em' }}>
              INGESTED_VOLUMES [{uploadedFiles.length}]
            </Typography>
          </Box>

          <Box>
            {uploadedFiles.map((file, index) => (
              <Box
                key={file.id}
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: index < uploadedFiles.length - 1 ? '1px solid black' : 'none',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <Box sx={{
                  width: 48,
                  height: 48,
                  border: '1px solid black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 3,
                  backgroundColor: 'white'
                }}>
                  {getFileTypeIcon(file.fileType)}
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h6" sx={{ letterSpacing: '0.05em' }}>
                    {file.fileName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="caption" sx={{ border: '1px solid black', px: 1, py: 0.5 }}>
                      TYPE: {file.fileType}
                    </Typography>
                    <Typography variant="caption" sx={{ border: '1px solid black', px: 1, py: 0.5 }}>
                      ROWS: {file.rowCount.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ border: '1px solid black', px: 1, py: 0.5 }}>
                      COLS: {file.columns.length}
                    </Typography>
                  </Box>
                </Box>

                <IconButton
                  onClick={() => removeFile(file.id)}
                  sx={{
                    border: '1px solid black',
                    borderRadius: 0,
                    ml: 2,
                    '&:hover': {
                      backgroundColor: 'black',
                      color: 'white'
                    }
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Empty State
      {uploadedFiles.length === 0 && !uploading && (
        <Box sx={{ p: 3, textAlign: 'center', border: '1px solid black' }}>
          <Typography variant="caption" sx={{ letterSpacing: '0.1em' }}>
            SYSTEM_READY // WAITING_FOR_INPUT
          </Typography>
        </Box>
      )} */}
    </Box>
  );
};

FileUploader.propTypes = {
  onDataLoaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
};

export default React.memo(FileUploader);
