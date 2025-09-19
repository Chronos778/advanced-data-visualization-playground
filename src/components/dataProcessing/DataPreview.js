import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Search,
  TableChart,
  Assessment,
  Info,
  TrendingUp,
  TrendingDown,
  Remove
} from '@mui/icons-material';
import _ from 'lodash';

const DataPreview = React.memo(({ data, title = "Data Preview" }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25); // Increased from 10 for better performance
  const [searchTerm, setSearchTerm] = useState('');

  // Limit data processing for very large datasets to improve performance
  const processedData = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) {
      return { data: [], columns: [] };
    }

    // For large datasets, limit initial processing
    const isLargeDataset = data.data.length > 1000;
    const sampleSize = isLargeDataset ? 1000 : data.data.length;
    const sampleData = data.data.slice(0, sampleSize);

    return {
      data: sampleData,
      columns: data.columns || Object.keys(data.data[0]),
      isLimited: isLargeDataset,
      totalRows: data.data.length
    };
  }, [data]);

  const { filteredData, stats } = useMemo(() => {
    if (!processedData.data || processedData.data.length === 0) {
      return { filteredData: [], stats: {} };
    }

    // Filter data based on search term
    let filtered = processedData.data;
    if (searchTerm.trim()) {
      filtered = processedData.data.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Calculate statistics using the processed data
    const columns = processedData.columns;
    const statistics = {};

    columns.forEach(column => {
      const values = processedData.data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
      const numericValues = values.map(val => parseFloat(val)).filter(val => !isNaN(val));
      
      statistics[column] = {
        totalCount: processedData.data.length,
        nonNullCount: values.length,
        nullCount: processedData.data.length - values.length,
        uniqueCount: new Set(values).size,
        isNumeric: numericValues.length > values.length * 0.8, // Consider numeric if 80%+ are numbers
        ...(numericValues.length > 0 && {
          min: _.min(numericValues),
          max: _.max(numericValues),
          mean: _.mean(numericValues),
          median: numericValues.sort((a, b) => a - b)[Math.floor(numericValues.length / 2)],
          std: Math.sqrt(_.mean(numericValues.map(x => Math.pow(x - _.mean(numericValues), 2))))
        })
      };
    });

    return {
      filteredData: filtered,
      stats: statistics
    };
  }, [processedData, searchTerm]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const formatCellValue = useCallback((value, column) => {
    if (value === null || value === undefined) {
      return <Chip label="NULL" size="small" variant="outlined" color="default" />;
    }
    
    if (value === '') {
      return <Chip label="EMPTY" size="small" variant="outlined" color="warning" />;
    }

    // Format numbers with appropriate precision
    if (stats[column]?.isNumeric && !isNaN(parseFloat(value))) {
      const num = parseFloat(value);
      if (Number.isInteger(num)) {
        return num.toLocaleString();
      } else {
        return num.toLocaleString(undefined, { maximumFractionDigits: 3 });
      }
    }

    // Truncate long strings
    const stringValue = String(value);
    if (stringValue.length > 50) {
      return (
        <Tooltip title={stringValue} arrow>
          <span>{stringValue.substring(0, 47)}...</span>
        </Tooltip>
      );
    }

    return stringValue;
  }, [stats]);

  const getColumnIcon = useCallback((column) => {
    if (stats[column]?.isNumeric) {
      return <Assessment sx={{ fontSize: 16, color: 'primary.main' }} />;
    }
    return <TableChart sx={{ fontSize: 16, color: 'secondary.main' }} />;
  }, [stats]);

  const getTrendIcon = useCallback((column) => {
    if (!stats[column]?.isNumeric) return null;
    
    const values = processedData.data.slice(-10).map(row => parseFloat(row[column])).filter(v => !isNaN(v));
    if (values.length < 2) return null;
    
    const trend = values[values.length - 1] - values[0];
    if (Math.abs(trend) < 0.01) return <Remove sx={{ fontSize: 14, color: 'grey.500' }} />;
    return trend > 0 
      ? <TrendingUp sx={{ fontSize: 14, color: 'success.main' }} />
      : <TrendingDown sx={{ fontSize: 14, color: 'error.main' }} />;
  }, [processedData, stats]);

  if (!data || !data.data) {
    return (
      <Paper className="modern-card" sx={{ p: 6, textAlign: 'center' }}>
        <Box sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3
        }}>
          <TableChart sx={{ fontSize: 40, color: '#000000' }} />
        </Box>
        <Typography variant="h5" sx={{ 
          fontWeight: 700, 
          color: 'primary.main',
          mb: 2
        }}>
          No Data Available
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Upload a data file to see its detailed preview and analysis
        </Typography>
        <Box sx={{
          px: 3,
          py: 1.5,
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          display: 'inline-block'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Ready to analyze your data
          </Typography>
        </Box>
      </Paper>
    );
  }

  const columns = processedData.columns;
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {/* Enhanced Performance Warning for Large Datasets */}
      {processedData.isLimited && (
        <Box sx={{ mb: 3 }}>
          <Paper className="modern-card" sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, rgba(237, 137, 54, 0.1) 0%, rgba(221, 107, 32, 0.1) 100%)',
            border: '1px solid rgba(237, 137, 54, 0.2)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Info sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#000000', mb: 0.5 }}>
                  Performance Optimization Active
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Showing first {processedData.data.length.toLocaleString()} of {processedData.totalRows.toLocaleString()} rows for optimal performance
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
      
      {/* Enhanced Data Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="modern-card" sx={{ 
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            transition: 'transform 0.2s ease',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <TableChart sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 800,
                color: '#000000',
                mb: 1
              }}>
                {processedData.totalRows.toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Total Rows
              </Typography>
              {processedData.isLimited && (
                <Typography variant="caption" color="text.secondary">
                  ({processedData.data.length.toLocaleString()} shown)
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="modern-card" sx={{ 
            background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(56, 161, 105, 0.1) 100%)',
            border: '1px solid rgba(72, 187, 120, 0.2)',
            transition: 'transform 0.2s ease',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 32px rgba(72, 187, 120, 0.2)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#333333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Assessment sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 800,
                color: '#333333',
                mb: 1
              }}>
                {columns.length}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Columns
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="modern-card" sx={{ 
            background: 'linear-gradient(135deg, rgba(66, 153, 225, 0.1) 0%, rgba(49, 130, 206, 0.1) 100%)',
            border: '1px solid rgba(66, 153, 225, 0.2)',
            transition: 'transform 0.2s ease',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 32px rgba(66, 153, 225, 0.2)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#666666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 800,
                color: '#666666',
                mb: 1
              }}>
                {columns.filter(col => stats[col]?.isNumeric).length}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Numeric Columns
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="modern-card" sx={{ 
            background: 'linear-gradient(135deg, rgba(237, 137, 54, 0.1) 0%, rgba(221, 107, 32, 0.1) 100%)',
            border: '1px solid rgba(237, 137, 54, 0.2)',
            transition: 'transform 0.2s ease',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 32px rgba(237, 137, 54, 0.2)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <Search sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}>
                {Math.round((filteredData.length / data.data.length) * 100)}%
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Visible Data
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper className="modern-card" sx={{ overflow: 'hidden' }}>
        {/* Enhanced Header */}
        <Box sx={{ 
          p: 4, 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}>
                {title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Explore and analyze your data in detail
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={`${filteredData.length} of ${data.data.length} rows`}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
              {data.fileName && (
                <Chip 
                  label={data.fileName}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    fontWeight: 600
                  }}
                />
              )}
            </Box>
          </Box>
          
          <TextField
            fullWidth
            placeholder="Search across all columns and data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                background: 'white',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.1)'
                },
                '&.Mui-focused': {
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
                  '& fieldset': {
                    borderColor: '#667eea'
                  }
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#667eea' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Enhanced Table */}
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  fontWeight: 'bold', 
                  minWidth: 60,
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    #
                  </Typography>
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    sx={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      fontWeight: 'bold',
                      minWidth: 140,
                      maxWidth: 220,
                      borderBottom: '2px solid #e2e8f0'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 2,
                        background: stats[column]?.isNumeric 
                          ? 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
                          : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getColumnIcon(column)}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }} noWrap>
                          {column}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {stats[column]?.isNumeric ? 'Numeric' : 'Text'} • 
                          {stats[column]?.uniqueCount} unique
                        </Typography>
                      </Box>
                      {getTrendIcon(column)}
                      <Tooltip title={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            Column Statistics:
                          </Typography>
                          <Typography variant="caption">
                            • Total: {stats[column]?.totalCount}<br/>
                            • Non-null: {stats[column]?.nonNullCount}<br/>
                            • Unique: {stats[column]?.uniqueCount}<br/>
                            {stats[column]?.isNumeric && (
                              <>
                                • Min: {stats[column]?.min?.toFixed(2)}<br/>
                                • Max: {stats[column]?.max?.toFixed(2)}<br/>
                                • Mean: {stats[column]?.mean?.toFixed(2)}<br/>
                                • Std: {stats[column]?.std?.toFixed(2)}
                              </>
                            )}
                          </Typography>
                        </Box>
                      }>
                        <IconButton 
                          size="small"
                          sx={{
                            background: 'rgba(102, 126, 234, 0.1)',
                            '&:hover': {
                              background: 'rgba(102, 126, 234, 0.2)',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Info sx={{ fontSize: 16, color: '#667eea' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow 
                  key={page * rowsPerPage + index} 
                  hover
                  sx={{
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)'
                    },
                    '&:nth-of-type(even)': {
                      backgroundColor: 'rgba(102, 126, 234, 0.01)'
                    }
                  }}
                >
                  <TableCell sx={{ 
                    fontWeight: 'bold', 
                    color: 'primary.main',
                    background: 'rgba(102, 126, 234, 0.05)'
                  }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column} sx={{ maxWidth: 220 }}>
                      {formatCellValue(row[column], column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Enhanced Pagination */}
        <Box sx={{ 
          p: 3, 
          borderTop: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontWeight: 600,
                color: 'primary.main'
              },
              '& .MuiTablePagination-select': {
                borderRadius: 2,
                border: '1px solid rgba(102, 126, 234, 0.2)',
                '&:focus': {
                  borderColor: '#667eea'
                }
              },
              '& .MuiIconButton-root': {
                borderRadius: 2,
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.1)'
                }
              }
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
});

export default DataPreview;