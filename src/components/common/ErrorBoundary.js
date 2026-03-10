import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error in development mode only
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Optionally reload the entire page
    // window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;

      // If a custom fallback component is provided, use it
      if (Fallback) {
        return <Fallback error={this.state.error} retry={this.handleReload} />;
      }

      // Default error UI
      return (
        <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 10, border: '4px solid black', backgroundColor: '#fff', boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}>
          <Box sx={{ borderBottom: '4px solid black', pb: 2, mb: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'black' }}>
              SYSTEM_FAILURE
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 3, fontWeight: 'bold', fontFamily: '"IBM Plex Mono", monospace' }}>
            THE APPLICATION ENCOUNTERED AN UNEXPECTED EXCEPTION. POTENTIAL CAUSES:
          </Typography>

          <Box sx={{
            mb: 4,
            p: 3,
            border: '2px solid black',
            backgroundColor: '#F7F7F5',
            fontFamily: '"IBM Plex Mono", monospace'
          }}>
            <ul style={{ margin: 0, paddingLeft: '20px', fontWeight: 600 }}>
              <li style={{ marginBottom: '8px' }}>INVALID_DATA_FORMAT</li>
              <li style={{ marginBottom: '8px' }}>BROWSER_COMPATIBILITY_ISSUE</li>
              <li style={{ marginBottom: '8px' }}>NETWORK_CONNECTIVITY_DROPPED</li>
              <li>RUNTIME_EXECUTION_ERROR</li>
            </ul>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={this.handleReload}
              sx={{
                flex: 1,
                py: 2,
                borderRadius: 0,
                backgroundColor: 'black',
                color: 'white',
                fontWeight: 800,
                border: '2px solid black',
                boxShadow: 'none',
                textTransform: 'uppercase',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black',
                  boxShadow: 'none'
                }
              }}
            >
              REINITIALIZE_STATE
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{
                flex: 1,
                py: 2,
                borderRadius: 0,
                color: 'black',
                fontWeight: 800,
                border: '2px solid black',
                background: 'white',
                textTransform: 'uppercase',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  border: '2px solid black'
                }
              }}
            >
              HARD_RELOAD
            </Button>
          </Box>

          {/* Show error details in development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Box sx={{ mt: 4, p: 3, border: '2px dashed black', backgroundColor: '#fafafa' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 2 }}>
                DEBUG_TRACE:
              </Typography>
              <Typography variant="body2" component="pre" sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '0.85rem',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                m: 0
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node
};

export default ErrorBoundary;