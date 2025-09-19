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

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
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
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No data to preview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload a data file to see its contents here
        </Typography>
      </Paper>
    );
  }

  const columns = processedData.columns;
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {/* Performance Warning for Large Datasets */}
      {processedData.isLimited && (
        <Box sx={{ mb: 2 }}>
          <Chip 
            label={`Showing first ${processedData.data.length.toLocaleString()} of ${processedData.totalRows.toLocaleString()} rows (optimized for performance)`}
            color="warning" 
            variant="outlined"
            icon={<Info />}
            sx={{ mb: 1 }}
          />
        </Box>
      )}
      
      {/* Data Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {processedData.totalRows.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Rows {processedData.isLimited && `(${processedData.data.length.toLocaleString()} shown)`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">
                {columns.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Columns
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {columns.filter(col => stats[col]?.isNumeric).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Numeric Columns
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {Math.round((filteredData.length / data.data.length) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visible Data
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={`${filteredData.length} of ${data.data.length} rows`}
                size="small"
                color="primary"
              />
              {data.fileName && (
                <Chip 
                  label={data.fileName}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
          
          <TextField
            fullWidth
            size="small"
            placeholder="Search in all columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Table */}
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: 'background.paper', fontWeight: 'bold', minWidth: 50 }}>
                  #
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    sx={{
                      backgroundColor: 'background.paper',
                      fontWeight: 'bold',
                      minWidth: 120,
                      maxWidth: 200
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getColumnIcon(column)}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" noWrap>
                          {column}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stats[column]?.isNumeric ? 'Numeric' : 'Text'} • 
                          {stats[column]?.uniqueCount} unique
                        </Typography>
                      </Box>
                      {getTrendIcon(column)}
                      <Tooltip title={
                        <Box>
                          <Typography variant="body2">Column Statistics:</Typography>
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
                        <IconButton size="small">
                          <Info sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={page * rowsPerPage + index} hover>
                  <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column} sx={{ maxWidth: 200 }}>
                      {formatCellValue(row[column], column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
});

export default DataPreview;