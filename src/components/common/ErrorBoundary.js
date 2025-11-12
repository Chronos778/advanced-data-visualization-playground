import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
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
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Something went wrong</AlertTitle>
            <Typography variant="body2" sx={{ mb: 2 }}>
              The application encountered an unexpected error. This might be due to:
            </Typography>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Invalid data format</li>
              <li>Browser compatibility issues</li>
              <li>Network connectivity problems</li>
              <li>Temporary application issues</li>
            </ul>
          </Alert>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button 
              variant="contained" 
              startIcon={<Refresh />}
              onClick={this.handleReload}
            >
              Try Again
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </Box>

          {/* Show error details in development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Error Details (Development Only):
              </Typography>
              <Typography variant="body2" component="pre" sx={{ 
                fontSize: '12px', 
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
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