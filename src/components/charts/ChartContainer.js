import React, { memo, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Switch,
  FormControlLabel,
  Grid,
  Chip,
  Divider,
  TextField,
  Alert
} from '@mui/material';
import {
  Settings,
  Download,
  MoreVert,
  Fullscreen,
  Refresh,
  ContentCopy,
  Delete,
  ColorLens,
  TrendingUp,
  Warning
} from '@mui/icons-material';
import { useChartConfig } from '../../hooks/useDashboard';

const EnhancedChartHeader = memo(({ 
  title, 
  chartType, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onExport, 
  onFullscreen,
  status = 'ready' // ready, loading, error
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const statusColor = useMemo(() => {
    switch (status) {
      case 'loading': return 'warning';
      case 'error': return 'error';
      default: return 'success';
    }
  }, [status]);

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      p: 1,
      borderBottom: '1px solid #e0e0e0',
      minHeight: 48
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box 
          sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: `${statusColor}.main` 
          }} 
        />
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Chip 
          label={chartType.toUpperCase()} 
          size="small" 
          variant="outlined"
          sx={{ height: 20, fontSize: '0.7rem' }}
        />
      </Box>
      
      <Box>
        <Tooltip title="Fullscreen">
          <IconButton size="small" onClick={onFullscreen}>
            <Fullscreen fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="More options">
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{ sx: { minWidth: 150 } }}
        >
          <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>
            <Settings fontSize="small" sx={{ mr: 1 }} />
            Configure
          </MenuItem>
          <MenuItem onClick={() => { onDuplicate(); handleMenuClose(); }}>
            <ContentCopy fontSize="small" sx={{ mr: 1 }} />
            Duplicate
          </MenuItem>
          <MenuItem onClick={() => { onExport('png'); handleMenuClose(); }}>
            <Download fontSize="small" sx={{ mr: 1 }} />
            Export PNG
          </MenuItem>
          <MenuItem onClick={() => { onExport('pdf'); handleMenuClose(); }}>
            <Download fontSize="small" sx={{ mr: 1 }} />
            Export PDF
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { onDelete(); handleMenuClose(); }} sx={{ color: 'error.main' }}>
            <Delete fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
});

const ChartConfigDialog = memo(({ 
  open, 
  onClose, 
  config, 
  onConfigChange, 
  chartType 
}) => {
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = useCallback(() => {
    onConfigChange(localConfig);
    onClose();
  }, [localConfig, onConfigChange, onClose]);

  const handleReset = useCallback(() => {
    setLocalConfig(config);
  }, [config]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chart Configuration</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          {/* Visual Settings */}
          <Box>
            <Typography variant="h6" gutterBottom>Visual Settings</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={localConfig.showGrid}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, showGrid: e.target.checked }))}
                    />
                  }
                  label="Show Grid"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={localConfig.showLegend}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, showLegend: e.target.checked }))}
                    />
                  }
                  label="Show Legend"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={localConfig.showTooltip}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, showTooltip: e.target.checked }))}
                    />
                  }
                  label="Show Tooltips"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={localConfig.animated}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, animated: e.target.checked }))}
                    />
                  }
                  label="Animations"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Style Settings */}
          <Box>
            <Typography variant="h6" gutterBottom>Style Settings</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Border Width</Typography>
                <Slider
                  value={localConfig.borderWidth}
                  onChange={(e, value) => setLocalConfig(prev => ({ ...prev, borderWidth: value }))}
                  min={1}
                  max={10}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Point Size</Typography>
                <Slider
                  value={localConfig.pointRadius}
                  onChange={(e, value) => setLocalConfig(prev => ({ ...prev, pointRadius: value }))}
                  min={2}
                  max={15}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              {(chartType === 'line' || chartType === 'area') && (
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Line Tension</Typography>
                  <Slider
                    value={localConfig.tension}
                    onChange={(e, value) => setLocalConfig(prev => ({ ...prev, tension: value }))}
                    min={0}
                    max={1}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Opacity</Typography>
                <Slider
                  value={localConfig.opacity}
                  onChange={(e, value) => setLocalConfig(prev => ({ ...prev, opacity: value }))}
                  min={0.1}
                  max={1}
                  step={0.1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Color Settings */}
          <Box>
            <Typography variant="h6" gutterBottom>Color Settings</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Background Color"
                  value={localConfig.backgroundColor}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Border Color"
                  value={localConfig.borderColor}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, borderColor: e.target.value }))}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset}>Reset</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
});

const ChartContainer = memo(({ 
  children, 
  title,
  chartType,
  status = 'ready',
  error = '',
  onEdit,
  onDelete,
  onDuplicate,
  onExport,
  config,
  onConfigChange 
}) => {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const handleEdit = useCallback(() => {
    setConfigDialogOpen(true);
  }, []);

  const handleFullscreen = useCallback(() => {
    setFullscreen(true);
  }, []);

  const chartContent = useMemo(() => {
    if (status === 'error') {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 300,
          flexDirection: 'column',
          gap: 2
        }}>
          <Warning color="error" sx={{ fontSize: 48 }} />
          <Typography variant="h6" color="error">Chart Error</Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {error || 'Unable to render chart with current configuration'}
          </Typography>
        </Box>
      );
    }

    if (status === 'loading') {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 300 
        }}>
          <Typography variant="body2" color="text.secondary">
            Loading chart data...
          </Typography>
        </Box>
      );
    }

    return children;
  }, [status, error, children]);

  return (
    <>
      <Paper 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
        elevation={1}
      >
        <EnhancedChartHeader
          title={title}
          chartType={chartType}
          status={status}
          onEdit={handleEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onExport={onExport}
          onFullscreen={handleFullscreen}
        />
        
        <Box sx={{ flex: 1, p: 2 }}>
          {chartContent}
        </Box>
      </Paper>

      <ChartConfigDialog
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        config={config}
        onConfigChange={onConfigChange}
        chartType={chartType}
      />

      {/* Fullscreen Dialog */}
      <Dialog
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{ sx: { height: '90vh' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={() => setFullscreen(false)}>
            <Fullscreen />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ height: '100%' }}>
            {children}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
});

ChartContainer.propTypes = {
  title: PropTypes.string.isRequired,
  chartType: PropTypes.string.isRequired,
  data: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
    columns: PropTypes.arrayOf(PropTypes.string)
  }),
  config: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func,
  onExport: PropTypes.func,
  onFullscreen: PropTypes.func,
  onError: PropTypes.func,
  children: PropTypes.node
};

export default ChartContainer;