import React, { useState, useMemo } from 'react';
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
  Grid,
  Button,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Search,
  TableChart,
  Assessment,
  Info,
  TrendingUp,
  TrendingDown,
  Remove,
  Transform,
  ExpandMore,
  Clear,
  Add,
  Delete,
  Functions
} from '@mui/icons-material';
import _ from 'lodash';

const DataPreviewWithTransform = ({ data, title = "Data Preview", onTransformedData }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [transformOpen, setTransformOpen] = useState(false);
  
  // Transform states
  const [filters, setFilters] = useState([]);
  const [groupBy, setGroupBy] = useState('');
  const [aggregations, setAggregations] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [transformSearchTerm, setTransformSearchTerm] = useState('');

  const { filteredData, stats } = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) {
      return { filteredData: [], stats: {} };
    }

    // Filter data based on search term
    let filtered = data.data;
    if (searchTerm.trim()) {
      filtered = data.data.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Calculate statistics
    const columns = data.columns || Object.keys(data.data[0]);
    const statistics = {};

    columns.forEach(column => {
      const values = data.data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
      const numericValues = values.map(val => parseFloat(val)).filter(val => !isNaN(val));
      
      statistics[column] = {
        totalCount: data.data.length,
        nonNullCount: values.length,
        nullCount: data.data.length - values.length,
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
  }, [data, searchTerm]);

  const columns = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];
    return data.columns || Object.keys(data.data[0]);
  }, [data]);

  const numericColumns = useMemo(() => {
    return columns.filter(col => stats[col]?.isNumeric);
  }, [columns, stats]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatCellValue = (value, column) => {
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
  };

  const getColumnIcon = (column) => {
    if (stats[column]?.isNumeric) {
      return <Assessment sx={{ fontSize: 16, color: 'primary.main' }} />;
    }
    return <TableChart sx={{ fontSize: 16, color: 'secondary.main' }} />;
  };

  const getTrendIcon = (column) => {
    if (!stats[column]?.isNumeric) return null;
    
    const values = data.data.slice(-10).map(row => parseFloat(row[column])).filter(v => !isNaN(v));
    if (values.length < 2) return null;
    
    const trend = values[values.length - 1] - values[0];
    if (Math.abs(trend) < 0.01) return <Remove sx={{ fontSize: 14, color: 'grey.500' }} />;
    return trend > 0 
      ? <TrendingUp sx={{ fontSize: 14, color: 'success.main' }} />
      : <TrendingDown sx={{ fontSize: 14, color: 'error.main' }} />;
  };

  // Transform functions
  const addFilter = () => {
    setFilters([...filters, {
      id: Date.now(),
      column: '',
      operator: 'equals',
      value: '',
      enabled: true
    }]);
  };

  const updateFilter = (id, field, value) => {
    setFilters(filters.map(filter => 
      filter.id === id ? { ...filter, [field]: value } : filter
    ));
  };

  const removeFilter = (id) => {
    setFilters(filters.filter(filter => filter.id !== id));
  };

  const addAggregation = () => {
    setAggregations([...aggregations, {
      id: Date.now(),
      column: '',
      function: 'sum',
      alias: ''
    }]);
  };

  const updateAggregation = (id, field, value) => {
    setAggregations(aggregations.map(agg => 
      agg.id === id ? { ...agg, [field]: value } : agg
    ));
  };

  const removeAggregation = (id) => {
    setAggregations(aggregations.filter(agg => agg.id !== id));
  };

  const applyFilters = (dataset) => {
    let filtered = [...dataset];

    // Apply text search
    if (transformSearchTerm.trim()) {
      filtered = filtered.filter(row => 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(transformSearchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    filters.forEach(filter => {
      if (!filter.enabled || !filter.column || !filter.value) return;

      filtered = filtered.filter(row => {
        const cellValue = row[filter.column];
        const filterValue = filter.value;

        switch (filter.operator) {
          case 'equals':
            return String(cellValue) === String(filterValue);
          case 'not_equals':
            return String(cellValue) !== String(filterValue);
          case 'contains':
            return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'not_contains':
            return !String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'greater_than':
            return parseFloat(cellValue) > parseFloat(filterValue);
          case 'less_than':
            return parseFloat(cellValue) < parseFloat(filterValue);
          case 'greater_equal':
            return parseFloat(cellValue) >= parseFloat(filterValue);
          case 'less_equal':
            return parseFloat(cellValue) <= parseFloat(filterValue);
          case 'starts_with':
            return String(cellValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
          case 'ends_with':
            return String(cellValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
          default:
            return true;
        }
      });
    });

    return filtered;
  };

  const applyGrouping = (dataset) => {
    if (!groupBy) return dataset;

    const grouped = _.groupBy(dataset, groupBy);
    const result = [];

    Object.keys(grouped).forEach(groupValue => {
      const groupData = grouped[groupValue];
      const groupRow = { [groupBy]: groupValue };

      // Apply aggregations
      aggregations.forEach(agg => {
        if (!agg.column || !agg.function) return;

        const values = groupData.map(row => parseFloat(row[agg.column])).filter(v => !isNaN(v));
        const alias = agg.alias || `${agg.function}_${agg.column}`;

        switch (agg.function) {
          case 'sum':
            groupRow[alias] = _.sum(values);
            break;
          case 'average':
            groupRow[alias] = _.mean(values);
            break;
          case 'count':
            groupRow[alias] = groupData.length;
            break;
          case 'min':
            groupRow[alias] = _.min(values);
            break;
          case 'max':
            groupRow[alias] = _.max(values);
            break;
          case 'median':
            groupRow[alias] = values.length > 0 ? values.sort((a, b) => a - b)[Math.floor(values.length / 2)] : 0;
            break;
          default:
            groupRow[alias] = values.length;
        }
      });

      result.push(groupRow);
    });

    return result;
  };

  const applySorting = (dataset) => {
    if (!sortBy) return dataset;
    return _.orderBy(dataset, [sortBy], [sortOrder]);
  };

  const transformedData = useMemo(() => {
    if (!data || !data.data) return null;

    let result = applyFilters(data.data);
    result = applyGrouping(result);
    result = applySorting(result);

    const newColumns = result.length > 0 ? Object.keys(result[0]) : columns;

    return {
      ...data,
      data: result,
      columns: newColumns,
      originalRowCount: data.data.length,
      filteredRowCount: result.length,
      transformations: {
        filters: filters.filter(f => f.enabled),
        groupBy,
        aggregations,
        sortBy,
        sortOrder,
        searchTerm: transformSearchTerm
      }
    };
  }, [data, filters, groupBy, aggregations, sortBy, sortOrder, transformSearchTerm, columns]);

  const applyTransformations = () => {
    if (transformedData) {
      onTransformedData(transformedData);
      setTransformOpen(false);
    }
  };

  const clearAllTransformations = () => {
    setFilters([]);
    setGroupBy('');
    setAggregations([]);
    setSortBy('');
    setSortOrder('asc');
    setTransformSearchTerm('');
  };

  const filterOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'greater_equal', label: 'Greater Than or Equal' },
    { value: 'less_equal', label: 'Less Than or Equal' }
  ];

  const aggregationFunctions = [
    { value: 'sum', label: 'Sum' },
    { value: 'average', label: 'Average' },
    { value: 'count', label: 'Count' },
    { value: 'min', label: 'Minimum' },
    { value: 'max', label: 'Maximum' },
    { value: 'median', label: 'Median' }
  ];

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

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {/* Data Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {data.data.length.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Rows
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

      {/* Transform Button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Transform />}
          onClick={() => setTransformOpen(!transformOpen)}
          sx={{ minWidth: 200 }}
        >
          {transformOpen ? 'Hide Transformations' : 'Transform Data'}
        </Button>
      </Box>

      {/* Transform Panel */}
      <Collapse in={transformOpen}>
        <Paper sx={{ mt: 2, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Functions sx={{ mr: 1 }} />
            <Typography variant="h6">Data Transformation</Typography>
            <Box sx={{ ml: 'auto' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={clearAllTransformations}
                startIcon={<Clear />}
                sx={{ mr: 1 }}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={applyTransformations}
                startIcon={<TrendingUp />}
              >
                Apply
              </Button>
            </Box>
          </Box>

          {transformedData && (
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={`${transformedData.filteredRowCount} of ${transformedData.originalRowCount} rows`}
                color="primary"
                size="small"
              />
            </Box>
          )}

          {/* Global Search */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Search & Filter</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Search all columns"
                value={transformSearchTerm}
                onChange={(e) => setTransformSearchTerm(e.target.value)}
                placeholder="Enter search term..."
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">Column Filters</Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={addFilter}
                >
                  Add Filter
                </Button>
              </Box>

              {filters.map((filter) => (
                <Box key={filter.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Column</InputLabel>
                        <Select
                          value={filter.column}
                          label="Column"
                          onChange={(e) => updateFilter(filter.id, 'column', e.target.value)}
                        >
                          {columns.map(col => (
                            <MenuItem key={col} value={col}>{col}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Operator</InputLabel>
                        <Select
                          value={filter.operator}
                          label="Operator"
                          onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                        >
                          {filterOperators.map(op => (
                            <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Value"
                        value={filter.value}
                        onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={filter.enabled}
                              onChange={(e) => updateFilter(filter.id, 'enabled', e.target.checked)}
                              size="small"
                            />
                          }
                          label="Enabled"
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeFilter(filter.id)}
                          sx={{ ml: 1 }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Grouping & Aggregation */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Grouping & Aggregation</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Group By Column</InputLabel>
                    <Select
                      value={groupBy}
                      label="Group By Column"
                      onChange={(e) => setGroupBy(e.target.value)}
                    >
                      <MenuItem value="">None</MenuItem>
                      {columns.map(col => (
                        <MenuItem key={col} value={col}>{col}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addAggregation}
                    disabled={!groupBy}
                  >
                    Add Aggregation
                  </Button>
                </Grid>
              </Grid>

              {aggregations.map((agg) => (
                <Box key={agg.id} sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Column</InputLabel>
                        <Select
                          value={agg.column}
                          label="Column"
                          onChange={(e) => updateAggregation(agg.id, 'column', e.target.value)}
                        >
                          {numericColumns.map(col => (
                            <MenuItem key={col} value={col}>{col}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Function</InputLabel>
                        <Select
                          value={agg.function}
                          label="Function"
                          onChange={(e) => updateAggregation(agg.id, 'function', e.target.value)}
                        >
                          {aggregationFunctions.map(func => (
                            <MenuItem key={func.value} value={func.value}>{func.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Alias (optional)"
                        value={agg.alias}
                        onChange={(e) => updateAggregation(agg.id, 'alias', e.target.value)}
                        placeholder={`${agg.function}_${agg.column}`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <IconButton
                        size="small"
                        onClick={() => removeAggregation(agg.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>

          {/* Sorting */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Sorting</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By Column</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By Column"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="">None</MenuItem>
                      {transformedData && transformedData.columns.map(col => (
                        <MenuItem key={col} value={col}>{col}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Sort Order</InputLabel>
                    <Select
                      value={sortOrder}
                      label="Sort Order"
                      onChange={(e) => setSortOrder(e.target.value)}
                      disabled={!sortBy}
                    >
                      <MenuItem value="asc">Ascending</MenuItem>
                      <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default DataPreviewWithTransform;