import React, { useState, useMemo, useCallback } from 'react';
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
  Functions,
  Calculate,
  Transform,
  Visibility,
  DataUsage,
  TableChart,
  Speed,
  CheckCircle,
  Warning,
  AutoFixHigh,
  Refresh
} from '@mui/icons-material';
import _ from 'lodash';

const DataTransformer = React.memo(({ data, onTransformedData }) => {
  const [filters, setFilters] = useState([]);
  const [groupBy, setGroupBy] = useState('');
  const [aggregations, setAggregations] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New enhanced features
  const [calculatedColumns, setCalculatedColumns] = useState([]);
  const [dataTypeConversions, setDataTypeConversions] = useState([]);
  const [validationRules, setValidationRules] = useState([]);
  const [sampleSize, setSampleSize] = useState(null);
  const [pivotConfig, setPivotConfig] = useState({
    enabled: false,
    rows: '',
    columns: '',
    values: '',
    aggregateFunction: 'sum'
  });
  const [presets, setPresets] = useState({});
  const [showPreview, setShowPreview] = useState(false);

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

  // New helper functions for enhanced features
  const addCalculatedColumn = () => {
    setCalculatedColumns([...calculatedColumns, {
      id: Date.now(),
      name: '',
      formula: '',
      enabled: true
    }]);
  };

  const updateCalculatedColumn = (id, field, value) => {
    setCalculatedColumns(calculatedColumns.map(col => 
      col.id === id ? { ...col, [field]: value } : col
    ));
  };

  const removeCalculatedColumn = (id) => {
    setCalculatedColumns(calculatedColumns.filter(col => col.id !== id));
  };

  const addDataTypeConversion = () => {
    setDataTypeConversions([...dataTypeConversions, {
      id: Date.now(),
      column: '',
      fromType: 'auto',
      toType: 'number',
      enabled: true
    }]);
  };

  const updateDataTypeConversion = (id, field, value) => {
    setDataTypeConversions(dataTypeConversions.map(conv => 
      conv.id === id ? { ...conv, [field]: value } : conv
    ));
  };

  const removeDataTypeConversion = (id) => {
    setDataTypeConversions(dataTypeConversions.filter(conv => conv.id !== id));
  };

  const addValidationRule = () => {
    setValidationRules([...validationRules, {
      id: Date.now(),
      column: '',
      rule: 'not_empty',
      value: '',
      action: 'flag',
      enabled: true
    }]);
  };

  const updateValidationRule = (id, field, value) => {
    setValidationRules(validationRules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const removeValidationRule = (id) => {
    setValidationRules(validationRules.filter(rule => rule.id !== id));
  };

  const applyPreset = (presetType) => {
    switch (presetType) {
      case 'remove_empty':
        setFilters([{
          id: Date.now(),
          column: columns[0] || '',
          operator: 'not_equals',
          value: '',
          enabled: true
        }]);
        break;
      case 'top_10':
        setSampleSize(10);
        setSortOrder('desc');
        break;
      case 'bottom_10':
        setSampleSize(10);
        setSortOrder('asc');
        break;
      case 'deduplicate':
        // Add logic for removing duplicates
        break;
      default:
        break;
    }
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

    let result = [...data.data];

    // Apply data type conversions first
    dataTypeConversions.forEach(conv => {
      if (!conv.enabled || !conv.column) return;
      
      result = result.map(row => {
        const newRow = { ...row };
        const value = row[conv.column];
        
        try {
          switch (conv.toType) {
            case 'number':
              newRow[conv.column] = parseFloat(value) || 0;
              break;
            case 'string':
              newRow[conv.column] = String(value);
              break;
            case 'date':
              newRow[conv.column] = new Date(value).toISOString().split('T')[0];
              break;
            case 'boolean':
              newRow[conv.column] = Boolean(value && value !== 'false' && value !== '0');
              break;
            default:
              break;
          }
        } catch (e) {
          // Keep original value if conversion fails
        }
        return newRow;
      });
    });

    // Add calculated columns
    calculatedColumns.forEach(calc => {
      if (!calc.enabled || !calc.name || !calc.formula) return;
      
      result = result.map(row => {
        const newRow = { ...row };
        try {
          // Simple formula evaluation (basic math operations)
          let formula = calc.formula;
          columns.forEach(col => {
            const value = parseFloat(row[col]) || 0;
            formula = formula.replace(new RegExp(`\\b${col}\\b`, 'g'), value);
          });
          
          // Evaluate simple mathematical expressions
          const evalResult = Function(`"use strict"; return (${formula})`)();
          newRow[calc.name] = evalResult;
        } catch (e) {
          newRow[calc.name] = 'Error';
        }
        return newRow;
      });
    });

    // Apply validation rules and flag/remove invalid data
    validationRules.forEach(rule => {
      if (!rule.enabled || !rule.column) return;
      
      result = result.filter(row => {
        const value = row[rule.column];
        let isValid = true;
        
        switch (rule.rule) {
          case 'not_empty':
            isValid = value !== null && value !== undefined && value !== '';
            break;
          case 'is_number':
            isValid = !isNaN(parseFloat(value)) && isFinite(value);
            break;
          case 'min_length':
            isValid = String(value).length >= parseInt(rule.value);
            break;
          case 'max_length':
            isValid = String(value).length <= parseInt(rule.value);
            break;
          case 'regex':
            try {
              isValid = new RegExp(rule.value).test(String(value));
            } catch (e) {
              isValid = true;
            }
            break;
          default:
            break;
        }
        
        if (!isValid && rule.action === 'remove') {
          return false;
        }
        
        if (!isValid && rule.action === 'flag') {
          row[`${rule.column}_valid`] = false;
        }
        
        return true;
      });
    });

    // Apply filters
    result = applyFilters(result);
    
    // Apply grouping
    result = applyGrouping(result);
    
    // Apply sorting
    result = applySorting(result);

    // Apply sampling if specified
    if (sampleSize && sampleSize > 0 && result.length > sampleSize) {
      if (sortBy) {
        // Take top/bottom N if sorted
        result = result.slice(0, sampleSize);
      } else {
        // Random sampling
        result = _.sampleSize(result, sampleSize);
      }
    }

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
        searchTerm,
        calculatedColumns: calculatedColumns.filter(c => c.enabled),
        dataTypeConversions: dataTypeConversions.filter(c => c.enabled),
        validationRules: validationRules.filter(r => r.enabled),
        sampleSize
      }
    };
  }, [data, filters, groupBy, aggregations, sortBy, sortOrder, searchTerm, columns, 
      calculatedColumns, dataTypeConversions, validationRules, sampleSize]);

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
    setCalculatedColumns([]);
    setDataTypeConversions([]);
    setValidationRules([]);
    setSampleSize(null);
    setPivotConfig({
      enabled: false,
      rows: '',
      columns: '',
      values: '',
      aggregateFunction: 'sum'
    });
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

      {/* Quick Presets */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AutoFixHigh sx={{ mr: 1 }} />
            <Typography>Quick Transformations</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Clear />}
              onClick={() => applyPreset('remove_empty')}
            >
              Remove Empty Rows
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<TrendingUp />}
              onClick={() => applyPreset('top_10')}
            >
              Top 10 Rows
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Speed />}
              onClick={() => applyPreset('bottom_10')}
            >
              Bottom 10 Rows
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => applyPreset('deduplicate')}
            >
              Remove Duplicates
            </Button>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Data Sampling</Typography>
            <TextField
              type="number"
              label="Sample Size"
              value={sampleSize || ''}
              onChange={(e) => setSampleSize(e.target.value ? parseInt(e.target.value) : null)}
              size="small"
              sx={{ width: 150 }}
              inputProps={{ min: 1 }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

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

      {/* Data Type Conversion */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Transform sx={{ mr: 1 }} />
            <Typography>Data Type Conversion</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Type Conversions</Typography>
            <Button
              size="small"
              startIcon={<Add />}
              onClick={addDataTypeConversion}
            >
              Add Conversion
            </Button>
          </Box>

          {dataTypeConversions.map((conv) => (
            <Box key={conv.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Column</InputLabel>
                    <Select
                      value={conv.column}
                      label="Column"
                      onChange={(e) => updateDataTypeConversion(conv.id, 'column', e.target.value)}
                    >
                      {columns.map(col => (
                        <MenuItem key={col} value={col}>{col}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>To Type</InputLabel>
                    <Select
                      value={conv.toType}
                      label="To Type"
                      onChange={(e) => updateDataTypeConversion(conv.id, 'toType', e.target.value)}
                    >
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="string">String</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                      <MenuItem value="boolean">Boolean</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={conv.enabled}
                          onChange={(e) => updateDataTypeConversion(conv.id, 'enabled', e.target.checked)}
                          size="small"
                        />
                      }
                      label="Enabled"
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeDataTypeConversion(conv.id)}
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

      {/* Calculated Columns */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Calculate sx={{ mr: 1 }} />
            <Typography>Calculated Columns</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Formula Columns</Typography>
            <Button
              size="small"
              startIcon={<Add />}
              onClick={addCalculatedColumn}
            >
              Add Column
            </Button>
          </Box>

          {calculatedColumns.map((calc) => (
            <Box key={calc.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Column Name"
                    value={calc.name}
                    onChange={(e) => updateCalculatedColumn(calc.id, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Formula (e.g., column1 + column2 * 2)"
                    value={calc.formula}
                    onChange={(e) => updateCalculatedColumn(calc.id, 'formula', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={calc.enabled}
                          onChange={(e) => updateCalculatedColumn(calc.id, 'enabled', e.target.checked)}
                          size="small"
                        />
                      }
                      label="Enabled"
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeCalculatedColumn(calc.id)}
                      sx={{ ml: 1 }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Use column names in formulas. Supports +, -, *, /, (), and basic math functions.
              </Typography>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Data Validation */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle sx={{ mr: 1 }} />
            <Typography>Data Validation</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Validation Rules</Typography>
            <Button
              size="small"
              startIcon={<Add />}
              onClick={addValidationRule}
            >
              Add Rule
            </Button>
          </Box>

          {validationRules.map((rule) => (
            <Box key={rule.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Column</InputLabel>
                    <Select
                      value={rule.column}
                      label="Column"
                      onChange={(e) => updateValidationRule(rule.id, 'column', e.target.value)}
                    >
                      {columns.map(col => (
                        <MenuItem key={col} value={col}>{col}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Rule</InputLabel>
                    <Select
                      value={rule.rule}
                      label="Rule"
                      onChange={(e) => updateValidationRule(rule.id, 'rule', e.target.value)}
                    >
                      <MenuItem value="not_empty">Not Empty</MenuItem>
                      <MenuItem value="is_number">Is Number</MenuItem>
                      <MenuItem value="min_length">Min Length</MenuItem>
                      <MenuItem value="max_length">Max Length</MenuItem>
                      <MenuItem value="regex">Regex Pattern</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Value"
                    value={rule.value}
                    onChange={(e) => updateValidationRule(rule.id, 'value', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Action</InputLabel>
                    <Select
                      value={rule.action}
                      label="Action"
                      onChange={(e) => updateValidationRule(rule.id, 'action', e.target.value)}
                    >
                      <MenuItem value="flag">Flag Invalid</MenuItem>
                      <MenuItem value="remove">Remove Row</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={rule.enabled}
                          onChange={(e) => updateValidationRule(rule.id, 'enabled', e.target.checked)}
                          size="small"
                        />
                      }
                      label=""
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeValidationRule(rule.id)}
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
    </Paper>
  );
});

export default DataTransformer;