import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  Campaign,
  Settings,
  Analytics,
  Business,
  Close,
  AutoAwesome
} from '@mui/icons-material';
import { DASHBOARD_TEMPLATES, getTemplateSuggestions, applyTemplate } from '../../constants/dashboardTemplates';

const ICONS = {
  TrendingUp,
  AccountBalance,
  Campaign,
  Settings,
  Analytics,
  Business
};

/**
 * Dashboard Template Selector Component
 * Allows users to choose from pre-built dashboard templates
 */
const DashboardTemplateSelector = ({ open, onClose, onSelectTemplate, data }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Get template suggestions based on data
  const suggestions = useMemo(() => {
    if (data) {
      return getTemplateSuggestions(data);
    }
    return [];
  }, [data]);

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleApply = () => {
    if (selectedTemplate && data) {
      const template = applyTemplate(selectedTemplate, data);
      onSelectTemplate(template);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AutoAwesome sx={{ color: 'primary.main' }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Choose Dashboard Template
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {suggestions.length > 0 && (
          <Alert severity="info" icon={<AutoAwesome />} sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Smart Suggestions:</strong> Based on your data, we recommend{' '}
              <strong>{suggestions[0].template.name}</strong> (
              {(suggestions[0].score * 100).toFixed(0)}% match)
            </Typography>
          </Alert>
        )}

        <Grid container spacing={3}>
          {Object.entries(DASHBOARD_TEMPLATES).map(([id, template]) => {
            const Icon = ICONS[template.icon] || Business;
            const isSelected = selectedTemplate === id;
            const suggestion = suggestions.find(s => s.id === id);

            return (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                    background: 'background.paper',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => handleSelectTemplate(id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          background: 'background.paper',
                          mr: 2
                        }}
                      >
                        <Icon sx={{ fontSize: 32, color: template.color }} />
                      </Box>
                      {suggestion && (
                        <Chip
                          label={`${(suggestion.score * 100).toFixed(0)}% Match`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {template.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {template.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {template.widgets.slice(0, 3).map((widget, idx) => (
                        <Chip
                          key={idx}
                          label={widget.chartType}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {template.widgets.length > 3 && (
                        <Chip
                          label={`+${template.widgets.length - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button
                      fullWidth
                      variant={isSelected ? 'contained' : 'outlined'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(id);
                      }}
                    >
                      {isSelected ? 'Selected' : 'Select Template'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          disabled={!selectedTemplate}
          startIcon={<AutoAwesome />}
        >
          Apply Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DashboardTemplateSelector.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectTemplate: PropTypes.func.isRequired,
  data: PropTypes.object
};

export default React.memo(DashboardTemplateSelector);
