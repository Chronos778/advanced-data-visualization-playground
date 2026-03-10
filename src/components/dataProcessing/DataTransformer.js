import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
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
  Speed,
  CheckCircle,
  AutoFixHigh,
  Refresh
} from '@mui/icons-material';
import _ from 'lodash';

// --- Swiss Grid Styles ---
const accordionStyle = {
  border: '2px solid black',
  borderBottom: 0,
  '&:last-of-type': { borderBottom: '2px solid black' },
  '&:before': { display: 'none' },
  borderRadius: 0,
  boxShadow: 'none',
  backgroundColor: 'white',
  '&.Mui-expanded': { margin: 0 }
};

const accordionSummaryStyle = {
  backgroundColor: 'white',
  borderBottom: '2px solid black',
  minHeight: 48,
  '&.Mui-expanded': {
    minHeight: 48,
    borderBottom: '2px solid black',
    margin: 0
  },
  '& .MuiAccordionSummary-content.Mui-expanded': {
    margin: '12px 0'
  }
};

const accordionDetailsStyle = {
  p: 3,
  backgroundColor: '#F7F7F5'
};

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 0,
    backgroundColor: 'white',
    '& fieldset': { border: '1px solid black' },
    '&:hover fieldset': { borderColor: 'black', borderWidth: '2px' },
    '&.Mui-focused fieldset': { borderColor: 'black', borderWidth: '2px' }
  },
  '& .MuiInputLabel-root': {
    color: 'black',
    fontFamily: '"IBM Plex Mono", monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    background: 'white',
    padding: '0 4px'
  }
};

const starkButtonStyle = {
  borderRadius: 0,
  border: '2px solid black',
  color: 'black',
  backgroundColor: 'transparent',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'black',
    color: 'white',
    boxShadow: 'none',
    border: '2px solid black'
  }
};

const actionButtonStyle = {
  borderRadius: 0,
  border: '2px solid black',
  backgroundColor: 'black',
  color: 'white',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'transparent',
    color: 'black',
    boxShadow: 'none',
    border: '2px solid black'
  }
};

const filterBlockStyle = {
  mb: 2,
  p: 2,
  border: '2px solid black',
  backgroundColor: 'white'
};
// ------------------------

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
        // Logic for deduplication could be added
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
          let formula = calc.formula;
          columns.forEach(col => {
            const value = parseFloat(row[col]) || 0;
            formula = formula.replace(new RegExp(`\\b${col}\\b`, 'g'), value);
          });

          // eslint-disable-next-line no-new-func
          const evalResult = Function(`"use strict"; return (${formula})`)();
          newRow[calc.name] = evalResult;
        } catch (e) {
          newRow[calc.name] = 'Error';
        }
        return newRow;
      });
    });

    // Apply validation rules
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

    result = applyFilters(result);
    result = applyGrouping(result);
    result = applySorting(result);

    if (sampleSize && sampleSize > 0 && result.length > sampleSize) {
      if (sortBy) {
        result = result.slice(0, sampleSize);
      } else {
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
          <Functions sx={{ fontSize: 40, color: 'black' }} />
        </Box>
        <Typography variant="h3" sx={{ mb: 2, letterSpacing: '0.05em' }}>
          NO_DATA_AVAILABLE
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Upload a data file to start applying transformations.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, backgroundColor: 'transparent' }}>

      <Box sx={{ display: 'flex', alignItems: 'center', p: 3, border: '2px solid black', backgroundColor: 'white', mb: 4 }}>
        <Functions sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h3" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Data Transformation
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={clearAllTransformations}
            startIcon={<Clear />}
            sx={starkButtonStyle}
          >
            Clear All
          </Button>
          <Button
            variant="contained"
            onClick={applyTransformations}
            startIcon={<TrendingUp />}
            sx={actionButtonStyle}
          >
            Apply Transform
          </Button>
        </Box>
      </Box>

      {transformedData && (
        <Box sx={{ mb: 4 }}>
          <Chip
            label={`PREVIEW: ${transformedData.filteredRowCount} OF ${transformedData.originalRowCount} ROWS`}
            sx={{ borderRadius: 0, border: '2px solid black', backgroundColor: 'black', color: 'white', fontWeight: 'bold' }}
          />
        </Box>
      )}

      {/* Accordions Wrapper */}
      <Box sx={{ borderBottom: '2px solid black', mb: 6 }}>
        {/* Quick Presets */}
        <Accordion sx={accordionStyle} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'black' }} />} sx={accordionSummaryStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoFixHigh />
              <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Quick Transformations</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={accordionDetailsStyle}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Button size="small" variant="outlined" startIcon={<Clear />} onClick={() => applyPreset('remove_empty')} sx={starkButtonStyle}>
                Remove Empty Rows
              </Button>
              <Button size="small" variant="outlined" startIcon={<TrendingUp />} onClick={() => applyPreset('top_10')} sx={starkButtonStyle}>
                Top 10 Rows
              </Button>
              <Button size="small" variant="outlined" startIcon={<Speed />} onClick={() => applyPreset('bottom_10')} sx={starkButtonStyle}>
                Bottom 10 Rows
              </Button>
              <Button size="small" variant="outlined" startIcon={<Refresh />} onClick={() => applyPreset('deduplicate')} sx={starkButtonStyle}>
                Remove Duplicates
              </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'uppercase', fontWeight: 'bold' }}>Data Sampling</Typography>
              <TextField
                type="number"
                label="Sample Size"
                value={sampleSize || ''}
                onChange={(e) => setSampleSize(e.target.value ? parseInt(e.target.value) : null)}
                size="small"
                sx={{ width: 200, ...inputStyle }}
                inputProps={{ min: 1 }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Global Search & Filters */}
        <Accordion sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'black' }} />} sx={accordionSummaryStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIconPlaceholder />
              <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Search & Filter</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={accordionDetailsStyle}>
            <TextField
              fullWidth
              label="Global Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ENTER SEARCH TERM..."
              sx={{ mb: 4, ...inputStyle }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Column Filters</Typography>
              <Button size="small" startIcon={<Add />} onClick={addFilter} sx={starkButtonStyle}>
                Add Filter
              </Button>
            </Box>

            {filters.map((filter) => (
              <Box key={filter.id} sx={filterBlockStyle}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small" sx={inputStyle}>
                      <InputLabel>Column</InputLabel>
                      <Select
                        value={filter.column}
                        label="Column"
                        onChange={(e) => updateFilter(filter.id, 'column', e.target.value)}
                      >
                        {columns.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small" sx={inputStyle}>
                      <InputLabel>Operator</InputLabel>
                      <Select
                        value={filter.operator}
                        label="Operator"
                        onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                      >
                        {filterOperators.map(op => <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>)}
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
                      sx={inputStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={filter.enabled}
                            onChange={(e) => updateFilter(filter.id, 'enabled', e.target.checked)}
                            color="default"
                          />
                        }
                        label={<Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 'bold' }}>ACT</Typography>}
                      />
                      <IconButton size="small" onClick={() => removeFilter(filter.id)} sx={{ border: '2px solid black', borderRadius: 0, '&:hover': { backgroundColor: 'black', color: 'white' } }}>
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
        <Accordion sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'black' }} />} sx={accordionSummaryStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Functions />
              <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Grouping & Aggregation</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={accordionDetailsStyle}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <InputLabel>Group By Column</InputLabel>
                  <Select
                    value={groupBy}
                    label="Group By Column"
                    onChange={(e) => setGroupBy(e.target.value)}
                  >
                    <MenuItem value="">NONE</MenuItem>
                    {columns.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button fullWidth variant="outlined" startIcon={<Add />} onClick={addAggregation} disabled={!groupBy} sx={{ ...starkButtonStyle, height: '100%' }}>
                  Add Aggregation
                </Button>
              </Grid>
            </Grid>

            {aggregations.map((agg) => (
              <Box key={agg.id} sx={filterBlockStyle}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small" sx={inputStyle}>
                      <InputLabel>Column</InputLabel>
                      <Select
                        value={agg.column}
                        label="Column"
                        onChange={(e) => updateAggregation(agg.id, 'column', e.target.value)}
                      >
                        {numericColumns.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small" sx={inputStyle}>
                      <InputLabel>Function</InputLabel>
                      <Select
                        value={agg.function}
                        label="Function"
                        onChange={(e) => updateAggregation(agg.id, 'function', e.target.value)}
                      >
                        {aggregationFunctions.map(func => <MenuItem key={func.value} value={func.value}>{func.label}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Alias (Optional)"
                      value={agg.alias}
                      onChange={(e) => updateAggregation(agg.id, 'alias', e.target.value)}
                      placeholder={`${agg.function}_${agg.column}`}
                      sx={inputStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton size="small" onClick={() => removeAggregation(agg.id)} sx={{ border: '2px solid black', borderRadius: 0, '&:hover': { backgroundColor: 'black', color: 'white' } }}>
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Sorting */}
        <Accordion sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'black' }} />} sx={accordionSummaryStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp />
              <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Sorting</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={accordionDetailsStyle}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <InputLabel>Sort By Column</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By Column"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="">NONE</MenuItem>
                    {transformedData && transformedData.columns.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={inputStyle}>
                  <InputLabel>Sort Order</InputLabel>
                  <Select
                    value={sortOrder}
                    label="Sort Order"
                    onChange={(e) => setSortOrder(e.target.value)}
                    disabled={!sortBy}
                  >
                    <MenuItem value="asc">ASCENDING</MenuItem>
                    <MenuItem value="desc">DESCENDING</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Data Type Conversion */}
        <Accordion sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'black' }} />} sx={accordionSummaryStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Transform />
              <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Data Type Conversion</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={accordionDetailsStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Type Conversions</Typography>
              <Button size="small" startIcon={<Add />} onClick={addDataTypeConversion} sx={starkButtonStyle}>
                Add Conversion
              </Button>
            </Box>

            {dataTypeConversions.map((conv) => (
              <Box key={conv.id} sx={filterBlockStyle}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small" sx={inputStyle}>
                      <InputLabel>Column</InputLabel>
                      <Select value={conv.column} label="Column" onChange={(e) => updateDataTypeConversion(conv.id, 'column', e.target.value)}>
                        {columns.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small" sx={inputStyle}>
                      <InputLabel>To Type</InputLabel>
                      <Select value={conv.toType} label="To Type" onChange={(e) => updateDataTypeConversion(conv.id, 'toType', e.target.value)}>
                        <MenuItem value="number">NUMBER</MenuItem>
                        <MenuItem value="string">STRING</MenuItem>
                        <MenuItem value="date">DATE</MenuItem>
                        <MenuItem value="boolean">BOOLEAN</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                      <FormControlLabel
                        control={<Switch checked={conv.enabled} onChange={(e) => updateDataTypeConversion(conv.id, 'enabled', e.target.checked)} color="default" />}
                        label={<Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 'bold' }}>ACT</Typography>}
                      />
                      <IconButton size="small" onClick={() => removeDataTypeConversion(conv.id)} sx={{ border: '2px solid black', borderRadius: 0, '&:hover': { backgroundColor: 'black', color: 'white' } }}>
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
        <Accordion sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'black' }} />} sx={accordionSummaryStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calculate />
              <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Calculated Columns</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={accordionDetailsStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Formula Columns</Typography>
              <Button size="small" startIcon={<Add />} onClick={addCalculatedColumn} sx={starkButtonStyle}>
                Add Column
              </Button>
            </Box>

            {calculatedColumns.map((calc) => (
              <Box key={calc.id} sx={filterBlockStyle}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="COL NAME" value={calc.name} onChange={(e) => updateCalculatedColumn(calc.id, 'name', e.target.value)} sx={inputStyle} />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField fullWidth size="small" label="FORMULA (E.G. COL1 + COL2)" value={calc.formula} onChange={(e) => updateCalculatedColumn(calc.id, 'formula', e.target.value)} sx={inputStyle} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                      <FormControlLabel
                        control={<Switch checked={calc.enabled} onChange={(e) => updateCalculatedColumn(calc.id, 'enabled', e.target.checked)} color="default" />}
                        label={<Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 'bold' }}>ACT</Typography>}
                      />
                      <IconButton size="small" onClick={() => removeCalculatedColumn(calc.id)} sx={{ border: '2px solid black', borderRadius: 0, '&:hover': { backgroundColor: 'black', color: 'white' } }}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
                <Typography variant="caption" sx={{ mt: 1, display: 'block', fontWeight: 'bold', fontFamily: '"IBM Plex Mono", monospace' }}>
                  * Use column names exactly. Supported: +, -, *, /, ().
                </Typography>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Data Validation */}
        <Accordion sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'black' }} />} sx={accordionSummaryStyle}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle />
              <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>Data Validation</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={accordionDetailsStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Validation Rules</Typography>
              <Button size="small" startIcon={<Add />} onClick={addValidationRule} sx={starkButtonStyle}>
                Add Rule
              </Button>
            </Box>

            {validationRules.map((rule) => (
              <Box key={rule.id} sx={filterBlockStyle}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small" sx={inputStyle}>
                      <InputLabel>Column</InputLabel>
                      <Select value={rule.column} label="Column" onChange={(e) => updateValidationRule(rule.id, 'column', e.target.value)}>
                        {columns.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small" sx={inputStyle}>
                      <InputLabel>Rule</InputLabel>
                      <Select value={rule.rule} label="Rule" onChange={(e) => updateValidationRule(rule.id, 'rule', e.target.value)}>
                        <MenuItem value="not_empty">NOT EMPTY</MenuItem>
                        <MenuItem value="is_number">IS NUMBER</MenuItem>
                        <MenuItem value="min_length">MIN LENGTH</MenuItem>
                        <MenuItem value="max_length">MAX LENGTH</MenuItem>
                        <MenuItem value="regex">REGEX MATCH</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField fullWidth size="small" label="VAL" value={rule.value} onChange={(e) => updateValidationRule(rule.id, 'value', e.target.value)} sx={inputStyle} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth size="small" sx={inputStyle}>
                      <InputLabel>Action</InputLabel>
                      <Select value={rule.action} label="Action" onChange={(e) => updateValidationRule(rule.id, 'action', e.target.value)}>
                        <MenuItem value="flag">FLAG INVALID</MenuItem>
                        <MenuItem value="remove">DROP ROW</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                      <FormControlLabel
                        control={<Switch checked={rule.enabled} onChange={(e) => updateValidationRule(rule.id, 'enabled', e.target.checked)} color="default" />}
                        label={<Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 'bold' }}>ACT</Typography>}
                      />
                      <IconButton size="small" onClick={() => removeValidationRule(rule.id)} sx={{ border: '2px solid black', borderRadius: 0, '&:hover': { backgroundColor: 'black', color: 'white' } }}>
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
});

// Simple placeholder icon if Search is missing
const SearchIconPlaceholder = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

DataTransformer.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.arrayOf(PropTypes.string),
    originalRowCount: PropTypes.number
  }).isRequired,
  onTransformedData: PropTypes.func.isRequired
};

export default DataTransformer;