import { createTheme } from '@mui/material/styles';

/**
 * Swiss Grid Magazine Theme
 * Rigid, structural, high-contrast editorial design
 */
const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000', // Absolute black
      light: '#333333',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#555555', // Charcoal
      light: '#888888',
      dark: '#222222',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F7F7F5', // Warm archival paper
      paper: '#FFFFFF', // Pure white surfacing
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
    error: {
      main: '#FF3300', // International Orange
    },
    warning: {
      main: '#FF9900',
    },
    success: {
      main: '#00CC44',
    },
    info: {
      main: '#0066FF',
    },
    divider: '#000000', // Hard black borders everywhere
  },
  typography: {
    fontFamily: '"Helvetica Neue", "Helvetica", Arial, sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    body1: {
      fontSize: '14px',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '13px',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      fontWeight: 600,
      fontSize: '12px',
    },
    caption: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '11px',
      color: '#555555',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 0, // Absolute sharp corners
  },
  shadows: Array(25).fill('none'), // No drop shadows in Swiss Grid
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#000000 #F7F7F5',
          fontFamily: '"Helvetica Neue", "Helvetica", Arial, sans-serif',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#F7F7F5',
            borderLeft: '1px solid #000000',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#000000',
            '&:hover': {
              background: '#333333',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#FFFFFF',
          border: '1px solid #000000',
          boxShadow: 'none',
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#FFFFFF',
          border: '1px solid #000000',
          boxShadow: 'none',
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '8px 20px',
          border: '1px solid transparent',
          transition: 'all 0s', // Immediate, high-contrast state changes
        },
        contained: {
          background: '#000000',
          color: '#FFFFFF',
          '&:hover': {
            background: '#FF3300', // Snap to accent color
            color: '#FFFFFF',
          },
        },
        outlined: {
          borderColor: '#000000',
          color: '#000000',
          '&:hover': {
            background: '#000000',
            color: '#FFFFFF',
          },
        },
        text: {
          color: '#000000',
          '&:hover': {
            background: 'transparent',
            color: '#FF3300',
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#FFFFFF',
          borderBottom: '1px solid #000000',
          boxShadow: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 600,
          fontSize: '12px',
          letterSpacing: '0.05em',
          minHeight: 48,
          color: '#555555',
          opacity: 1,
          borderBottom: '2px solid transparent', // Use border for active state visually
          '&.Mui-selected': {
            color: '#000000',
            backgroundColor: '#F7F7F5',
          },
          '&:hover': {
            color: '#000000',
            backgroundColor: 'rgba(0,0,0,0.03)',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderBottom: '1px solid #000000',
        },
        indicator: {
          backgroundColor: '#000000',
          height: 3,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontWeight: 600,
          fontFamily: '"IBM Plex Mono", monospace',
          textTransform: 'uppercase',
          fontSize: '11px',
          height: 24,
          border: '1px solid #000000',
        },
        filled: {
          background: '#000000',
          color: '#FFFFFF',
        },
        outlined: {
          background: '#FFFFFF',
          color: '#000000',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: '#FFFFFF',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '13px',
            borderRadius: 0,
            '& fieldset': {
              borderColor: '#000000',
              borderWidth: '1px',
              borderRadius: 0,
            },
            '&:hover fieldset': {
              borderColor: '#000000',
              borderWidth: '2px',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: '"Helvetica Neue", "Helvetica", Arial, sans-serif',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#000000',
            '&.Mui-focused': {
              color: '#000000',
              fontWeight: 600,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '13px',
          borderRadius: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '13px',
          '&:hover': {
            background: '#000000',
            color: '#FFFFFF',
          },
          '&.Mui-selected': {
            background: '#000000',
            color: '#FFFFFF',
            '&:hover': {
              background: '#333333',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#000000',
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '13px',
          padding: '12px 16px',
        },
        head: {
          fontFamily: '"Helvetica Neue", "Helvetica", Arial, sans-serif',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          background: '#F7F7F5',
          color: '#000000',
          borderTop: '2px solid #000000',
          borderBottom: '2px solid #000000',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: '13px',
          borderRadius: 0,
          border: '1px solid #000000',
          fontFamily: '"IBM Plex Mono", monospace',
          alignItems: 'center',
        },
        icon: {
          color: '#000000 !important',
        },
        standardSuccess: {
          background: '#00CC44',
          color: '#000000',
        },
        standardError: {
          background: '#FF3300',
          color: '#FFFFFF',
          '& .MuiAlert-icon': {
            color: '#FFFFFF !important',
          },
        },
        standardWarning: {
          background: '#FF9900',
          color: '#000000',
        },
        standardInfo: {
          background: '#FFFFFF',
          color: '#000000',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#000000',
          borderRadius: 0,
          transition: 'none',
          '&:hover': {
            background: '#000000',
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#000000',
          color: '#FFFFFF',
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '11px',
          borderRadius: 0,
          padding: '6px 10px',
        },
        arrow: {
          color: '#000000',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          background: '#F7F7F5',
          height: 8,
          border: '1px solid #000000',
        },
        bar: {
          background: '#000000',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #000000',
          background: '#FFFFFF',
        }
      }
    }
  },
});

export default appTheme;