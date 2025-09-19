import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Typography,
  Divider
} from '@mui/material';
import { getChartConfig } from './ChartConfigurations';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const DynamicChartConfig = ({ 
  chartType, 
  config, 
  onConfigChange, 
  availableColumns, 
  numericColumns,
  dateColumns = [] 
}) => {
  const chartConfig = getChartConfig(chartType);
  
  const updateConfig = (field, value) => {
    onConfigChange({ ...config, [field]: value });
  };

  const getColumnsForType = (type) => {
    switch (type) {
      case 'numeric':
        return numericColumns;
      case 'date':
        return dateColumns.length > 0 ? dateColumns : availableColumns; // fallback to all if no date columns detected
      case 'any':
      default:
        return availableColumns;
    }
  };

  const renderMultiSelect = (field, label, columns, required = false) => (
    <FormControl fullWidth required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={config[field.name] || []}
        onChange={(e) => updateConfig(field.name, e.target.value)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} size="small" />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {columns.map((col) => (
          <MenuItem key={col} value={col}>
            {col}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderSingleSelect = (field, label, columns, required = false) => (
    <FormControl fullWidth required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={config[field.name] || ''}
        label={label}
        onChange={(e) => updateConfig(field.name, e.target.value)}
      >
        {!required && <MenuItem value="">None</MenuItem>}
        {columns.map((col) => (
          <MenuItem key={col} value={col}>{col}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderAdditionalField = (field) => {
    const columns = field.name === 'dimensions' && field.label.includes('Numeric') 
      ? numericColumns 
      : availableColumns;

    switch (field.type) {
      case 'multiselect':
        return renderMultiSelect(field, field.label, columns, field.required);
      case 'select':
        return renderSingleSelect(field, field.label, columns, field.required);
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
      {/* Chart Title - Always required */}
      <TextField
        fullWidth
        required
        label="Chart Title"
        value={config.title || ''}
        onChange={(e) => updateConfig('title', e.target.value)}
        placeholder="Enter a descriptive title for your chart"
      />

      {/* Main Axes Configuration */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {/* X-Axis */}
        {chartConfig.requiresXAxis && (
          <FormControl fullWidth required>
            <InputLabel>{chartConfig.xAxisLabel}</InputLabel>
            <Select
              value={config.xAxis || ''}
              label={chartConfig.xAxisLabel}
              onChange={(e) => updateConfig('xAxis', e.target.value)}
            >
              {getColumnsForType(chartConfig.xAxisType).map(col => (
                <MenuItem key={col} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Y-Axis */}
        {chartConfig.requiresYAxis && (
          <FormControl fullWidth required>
            <InputLabel>{chartConfig.yAxisLabel}</InputLabel>
            <Select
              value={config.yAxis || ''}
              label={chartConfig.yAxisLabel}
              onChange={(e) => updateConfig('yAxis', e.target.value)}
            >
              {getColumnsForType(chartConfig.yAxisType).map(col => (
                <MenuItem key={col} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Z-Axis for 3D charts */}
      {chartConfig.supportsZAxis && (
        <FormControl fullWidth>
          <InputLabel>{chartConfig.zAxisLabel || 'Z-Axis'}</InputLabel>
          <Select
            value={config.zAxis || ''}
            label={chartConfig.zAxisLabel || 'Z-Axis'}
            onChange={(e) => updateConfig('zAxis', e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            {numericColumns.map(col => (
              <MenuItem key={col} value={col}>{col}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Additional chart-specific fields */}
      {chartConfig.additionalFields.length > 0 && (
        <>
          <Divider sx={{ my: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Chart-specific Configuration
            </Typography>
          </Divider>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {chartConfig.additionalFields.map((field, index) => (
              <Box key={`${field.name}-${index}`}>
                {renderAdditionalField(field)}
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* Optional styling fields */}
      {(chartConfig.supportsColorBy || chartConfig.supportsSizeBy) && (
        <>
          <Divider sx={{ my: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Visual Encoding (Optional)
            </Typography>
          </Divider>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {/* Color By */}
            {chartConfig.supportsColorBy && (
              <FormControl fullWidth>
                <InputLabel>Color By (Optional)</InputLabel>
                <Select
                  value={config.colorBy || ''}
                  label="Color By (Optional)"
                  onChange={(e) => updateConfig('colorBy', e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  {availableColumns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Size By */}
            {chartConfig.supportsSizeBy && (
              <FormControl fullWidth>
                <InputLabel>{chartConfig.sizeByLabel || 'Size By (Optional)'}</InputLabel>
                <Select
                  value={config.sizeBy || ''}
                  label={chartConfig.sizeByLabel || 'Size By (Optional)'}
                  onChange={(e) => updateConfig('sizeBy', e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  {numericColumns.map(col => (
                    <MenuItem key={col} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default DynamicChartConfig;