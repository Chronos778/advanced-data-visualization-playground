import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  IconButton
} from '@mui/material';
import {
  ExpandMore,
  Clear,
  Add,
  Delete,
  TrendingUp,
  Functions
} from '@mui/icons-material';
import _ from 'lodash';

const DataTransformer = ({ data, onTransformedData }) => {
  const [filters, setFilters] = useState([]);
  const [groupBy, setGroupBy] = useState('');
  const [aggregations, setAggregations] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const columns = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];
    return data.columns || Object.keys(data.data[0]);
  }, [data]);

  const numericColumns = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];
    return columns.filter(col => {
      const sampleValue = data.data[0][col];
      return !isNaN(parseFloat(sampleValue)) && isFinite(sampleValue);
    });
  }, [columns, data]);

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
    if (searchTerm.trim()) {
      filtered = filtered.filter(row => 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
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
        searchTerm
      }
    };
  }, [data, filters, groupBy, aggregations, sortBy, sortOrder, searchTerm, columns]);

  const applyTransformations = () => {
    if (transformedData) {
      onTransformedData(transformedData);
    }
  };

  const clearAllTransformations = () => {
    setFilters([]);
    setGroupBy('');
    setAggregations([]);
    setSortBy('');
    setSortOrder('asc');
    setSearchTerm('');
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
          No data available for transformation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload a data file to start applying transformations
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
  );
};

export default DataTransformer;