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
  IconButton
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
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 0, border: '2px solid black', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' } }}>
      <DialogTitle sx={{ borderBottom: '2px solid black', pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AutoAwesome sx={{ color: 'black' }} />
            <Typography variant="h5" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CHOOSE_DASHBOARD_TEMPLATE
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ borderRadius: 0, border: '2px solid black', color: 'black', '&:hover': { backgroundColor: '#f0f0f0' } }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {suggestions.length > 0 && (
          <Box sx={{ mb: 4, pt: 2, pb: 2, px: 3, borderBottom: '2px solid black', backgroundColor: '#F7F7F5', display: 'flex', alignItems: 'center', gap: 2, mx: -3, mt: -1 }}>
            <AutoAwesome sx={{ color: 'black' }} />
            <Typography variant="body2" sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 'bold' }}>
              <strong>SMART_SUGGESTION:</strong> BASED ON YOUR DATA, WE RECOMMEND{' '}
              <strong>{suggestions[0].template.name.toUpperCase()}</strong> (
              {(suggestions[0].score * 100).toFixed(0)}% MATCH)
            </Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          {Object.entries(DASHBOARD_TEMPLATES).map(([id, template]) => {
            const Icon = ICONS[template.icon] || Business;
            const isSelected = selectedTemplate === id;
            const suggestion = suggestions.find(s => s.id === id);

            return (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '2px solid black',
                    borderRadius: 0,
                    backgroundColor: isSelected ? '#F7F7F5' : 'white',
                    boxShadow: isSelected ? '4px 4px 0px 0px rgba(0,0,0,1)' : 'none',
                    '&:hover': {
                      transform: 'translate(-2px, -2px)',
                      boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                      backgroundColor: '#F7F7F5'
                    }
                  }}
                  onClick={() => handleSelectTemplate(id)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 0,
                          border: '2px solid black',
                          backgroundColor: 'black',
                          mr: 2,
                          display: 'flex'
                        }}
                      >
                        <Icon sx={{ fontSize: 32, color: 'white' }} />
                      </Box>
                      {suggestion && (
                        <Chip
                          label={`${(suggestion.score * 100).toFixed(0)}%_MATCH`}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 0, border: '2px solid black', fontWeight: 'bold', color: 'black' }}
                        />
                      )}
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 1 }}>
                      {template.name}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 3, fontFamily: '"IBM Plex Mono", monospace', fontWeight: 'bold' }}>
                      {template.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {template.widgets.slice(0, 3).map((widget, idx) => (
                        <Chip
                          key={idx}
                          label={widget.chartType.toUpperCase()}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', borderRadius: 0, border: '2px solid black', fontWeight: 600, color: 'black' }}
                        />
                      ))}
                      {template.widgets.length > 3 && (
                        <Chip
                          label={`+${template.widgets.length - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', borderRadius: 0, border: '2px solid black', fontWeight: 600, color: 'black' }}
                        />
                      )}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(id);
                      }}
                      sx={{
                        borderRadius: 0,
                        border: '2px solid black',
                        backgroundColor: isSelected ? 'black' : 'white',
                        color: isSelected ? 'white' : 'black',
                        fontWeight: 'bold',
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: isSelected ? 'black' : '#f0f0f0',
                          boxShadow: 'none'
                        }
                      }}
                    >
                      {isSelected ? 'SELECTED' : 'SELECT_TEMPLATE'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '2px solid black' }}>
        <Button onClick={onClose} sx={{ color: 'black', fontWeight: 'bold', borderRadius: 0 }}>
          CANCEL
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          disabled={!selectedTemplate}
          startIcon={<AutoAwesome />}
          sx={{
            borderRadius: 0,
            border: '2px solid black',
            backgroundColor: 'black',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: 'transparent',
              color: 'black',
              boxShadow: 'none',
              border: '2px solid black'
            },
            '&:disabled': {
              border: '2px solid rgba(0,0,0,0.3)'
            }
          }}
        >
          APPLY_TEMPLATE
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
