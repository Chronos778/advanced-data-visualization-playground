import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
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
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');

  const processedData = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) {
      return { data: [], columns: [] };
    }

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

    let filtered = processedData.data;
    if (searchTerm.trim()) {
      filtered = processedData.data.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

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
        isNumeric: numericValues.length > values.length * 0.8,
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
      return <Chip label="NULL" size="small" variant="outlined" sx={{ borderRadius: 0, borderColor: 'black' }} />;
    }

    if (value === '') {
      return <Chip label="EMPTY" size="small" variant="outlined" sx={{ borderRadius: 0, borderColor: 'black' }} />;
    }

    if (stats[column]?.isNumeric && !isNaN(parseFloat(value))) {
      const num = parseFloat(value);
      if (Number.isInteger(num)) {
        return num.toLocaleString();
      } else {
        return num.toLocaleString(undefined, { maximumFractionDigits: 3 });
      }
    }

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
      return <Assessment sx={{ fontSize: 16, color: 'black' }} />;
    }
    return <TableChart sx={{ fontSize: 16, color: 'black' }} />;
  }, [stats]);

  const getTrendIcon = useCallback((column) => {
    if (!stats[column]?.isNumeric) return null;

    const values = processedData.data.slice(-10).map(row => parseFloat(row[column])).filter(v => !isNaN(v));
    if (values.length < 2) return null;

    const trend = values[values.length - 1] - values[0];
    if (Math.abs(trend) < 0.01) return <Remove sx={{ fontSize: 14, color: 'black' }} />;
    return trend > 0
      ? <TrendingUp sx={{ fontSize: 14, color: 'black' }} />
      : <TrendingDown sx={{ fontSize: 14, color: 'black' }} />;
  }, [processedData, stats]);

  if (!data || !data.data) {
    return (
      <Box sx={{ p: 6, textAlign: 'center', border: '2px solid black', backgroundColor: 'white' }}>
        <Box sx={{
          width: 80,
          height: 80,
          border: '2px solid black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3
        }}>
          <TableChart sx={{ fontSize: 40, color: 'black' }} />
        </Box>
        <Typography variant="h3" sx={{
          mb: 2,
          letterSpacing: '0.05em'
        }}>
          NO_DATA_AVAILABLE
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Upload a data file to generate matrices.
        </Typography>
      </Box>
    );
  }

  const columns = processedData.columns;
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {processedData.isLimited && (
        <Box sx={{ mb: 3, p: 2, border: '2px solid black', backgroundColor: 'black', color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Info sx={{ color: 'white' }} />
          <Box>
            <Typography variant="subtitle2" sx={{ letterSpacing: '0.1em' }}>
              PERFORMANCE_OPTIMIZATION_ACTIVE
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Showing first {processedData.data.length.toLocaleString()} of {processedData.totalRows.toLocaleString()} rows to maintain strict real-time rendering limits.
            </Typography>
          </Box>
        </Box>
      )}

      {/* Swiss Grid Stat Cards */}
      <Grid container spacing={0} sx={{ mb: 4, borderTop: '2px solid black', borderLeft: '2px solid black' }}>
        <Grid item xs={12} sm={6} md={3} sx={{ borderRight: '2px solid black', borderBottom: '2px solid black', p: 3, backgroundColor: 'white' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ letterSpacing: '0.1em' }}>01 / TOTAL_ROWS</Typography>
              <TableChart fontSize="small" />
            </Box>
            <Typography variant="h2" sx={{ letterSpacing: '-0.02em' }}>
              {processedData.totalRows.toLocaleString()}
            </Typography>
            {processedData.isLimited && (
              <Typography variant="caption" sx={{ mt: 1 }}>
                ({processedData.data.length.toLocaleString()} SHOWN)
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ borderRight: '2px solid black', borderBottom: '2px solid black', p: 3, backgroundColor: 'white' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ letterSpacing: '0.1em' }}>02 / COLUMNS</Typography>
              <Assessment fontSize="small" />
            </Box>
            <Typography variant="h2" sx={{ letterSpacing: '-0.02em' }}>
              {columns.length}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ borderRight: '2px solid black', borderBottom: '2px solid black', p: 3, backgroundColor: 'white' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ letterSpacing: '0.1em' }}>03 / NUMERIC_COLS</Typography>
              <TrendingUp fontSize="small" />
            </Box>
            <Typography variant="h2" sx={{ letterSpacing: '-0.02em' }}>
              {columns.filter(col => stats[col]?.isNumeric).length}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ borderRight: '2px solid black', borderBottom: '2px solid black', p: 3, backgroundColor: 'white' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="caption" sx={{ letterSpacing: '0.1em' }}>04 / VISIBLE_DATA</Typography>
              <Search fontSize="small" />
            </Box>
            <Typography variant="h2" sx={{ letterSpacing: '-0.02em' }}>
              {Math.round((filteredData.length / data.data.length) * 100)}%
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ border: '2px solid black', backgroundColor: 'white' }}>
        {/* Header Banner */}
        <Box sx={{ p: 3, borderBottom: '2px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ width: '40%' }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="SEARCH_MATRIX"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  '& fieldset': {
                    border: '1px solid black',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black',
                    borderWidth: '2px'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                    borderWidth: '2px'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'black' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {/* The Matrix Table */}
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 60, borderBottom: '2px solid black', backgroundColor: 'white' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>#</Typography>
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    sx={{
                      minWidth: 140,
                      maxWidth: 220,
                      borderBottom: '2px solid black',
                      backgroundColor: 'white'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'space-between' }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                          {column}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          {getColumnIcon(column)}
                          <Typography variant="caption" sx={{ letterSpacing: '0.1em' }}>
                            {stats[column]?.isNumeric ? 'NUM' : 'STR'} [{stats[column]?.uniqueCount}]
                          </Typography>
                        </Box>
                      </Box>
                      {getTrendIcon(column)}
                      <Tooltip title={
                        <Box sx={{ p: 1 }}>
                          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 'bold' }}>STATS_BLOCK:</Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>• TOT: {stats[column]?.totalCount}</Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>• N/N: {stats[column]?.nonNullCount}</Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>• UNQ: {stats[column]?.uniqueCount}</Typography>
                          {stats[column]?.isNumeric && (
                            <>
                              <Typography variant="caption" sx={{ display: 'block' }}>• MIN: {stats[column]?.min?.toFixed(2)}</Typography>
                              <Typography variant="caption" sx={{ display: 'block' }}>• MAX: {stats[column]?.max?.toFixed(2)}</Typography>
                              <Typography variant="caption" sx={{ display: 'block' }}>• AVG: {stats[column]?.mean?.toFixed(2)}</Typography>
                              <Typography variant="caption" sx={{ display: 'block' }}>• STD: {stats[column]?.std?.toFixed(2)}</Typography>
                            </>
                          )}
                        </Box>
                      }>
                        <IconButton size="small" sx={{ borderRadius: 0, border: '1px solid black', '&:hover': { backgroundColor: 'black', color: 'white' } }}>
                          <Info sx={{ fontSize: 16 }} />
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
                      backgroundColor: 'rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <TableCell sx={{ borderBottom: '1px solid black' }}>
                    <Typography variant="caption">{page * rowsPerPage + index + 1}</Typography>
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column} sx={{ maxWidth: 220, borderBottom: '1px solid black' }}>
                      <Typography variant="body2" sx={{ fontFamily: stats[column]?.isNumeric ? '"IBM Plex Mono", monospace' : 'inherit' }}>
                        {formatCellValue(row[column], column)}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Strip */}
        <Box sx={{ borderTop: '2px solid black', backgroundColor: 'white' }}>
          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-select': {
                borderRadius: 0,
                border: '1px solid black',
              },
              '& .MuiIconButton-root': {
                borderRadius: 0,
                border: '1px solid black',
                ml: 1,
                '&:hover': {
                  backgroundColor: 'black',
                  color: 'white'
                }
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
});

DataPreview.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
    columns: PropTypes.arrayOf(PropTypes.string),
    fileName: PropTypes.string,
    rowCount: PropTypes.number
  }),
  title: PropTypes.string
};

DataPreview.defaultProps = {
  title: "DATA_MATRIX"
};

export default DataPreview;
