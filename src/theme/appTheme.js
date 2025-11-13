import { createTheme } from '@mui/material/styles';

const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#667eea',
      light: '#8b9eff',
      dark: '#5061d3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#764ba2',
      light: '#9666c4',
      dark: '#5c3a81',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f0f23',
      paper: 'rgba(255, 255, 255, 0.03)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b4b4c6',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
    error: {
      main: '#f5576c',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#fee140',
      contrastText: '#000000',
    },
    info: {
      main: '#4facfe',
      contrastText: '#ffffff',
    },
    success: {
      main: '#00f2fe',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 900,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #ffffff 0%, #b4b4c6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: '#ffffff',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: '#ffffff',
    },
    h4: {
      fontWeight: 700,
      color: '#ffffff',
    },
    h5: {
      fontWeight: 600,
      color: '#ffffff',
    },
    h6: {
      fontWeight: 600,
      color: '#ffffff',
    },
    body1: {
      color: '#b4b4c6',
      fontWeight: 400,
      lineHeight: 1.7,
    },
    body2: {
      color: '#8e8ea9',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 8px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.3)',
    '0 8px 32px rgba(0, 0, 0, 0.4)',
    '0 12px 48px rgba(0, 0, 0, 0.5)',
    '0 16px 64px rgba(0, 0, 0, 0.6)',
    '0 20px 80px rgba(0, 0, 0, 0.7)',
    '0 0 20px rgba(102, 126, 234, 0.3)',
    '0 0 40px rgba(102, 126, 234, 0.4)',
    ...Array(16).fill('0 0 0 0 rgba(0, 0, 0, 0)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'radial-gradient(at 47% 33%, hsl(235, 54%, 15%) 0, transparent 59%), radial-gradient(at 82% 65%, hsl(254, 49%, 17%) 0, transparent 55%), radial-gradient(at 15% 75%, hsl(240, 43%, 12%) 0, transparent 50%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          fontWeight: 600,
          padding: '10px 24px',
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'none',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7c93ff 0%, #8b5dba 100%)',
            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
          },
        },
        outlined: {
          borderColor: 'rgba(102, 126, 234, 0.5)',
          color: '#667eea',
          '&:hover': {
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderColor: '#667eea',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 48px rgba(102, 126, 234, 0.2)',
            borderColor: 'rgba(102, 126, 234, 0.4)',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          color: '#8e8ea9',
          transition: 'all 0.3s ease',
          '&.Mui-selected': {
            color: '#ffffff',
            fontWeight: 600,
          },
          '&:hover': {
            color: '#b4b4c6',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
          color: '#ffffff',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          fontWeight: 500,
        },
        filled: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#b4b4c6',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: '#ffffff',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(102, 126, 234, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#667eea',
              boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#8e8ea9',
            '&.Mui-focused': {
              color: '#667eea',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 16,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.875rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          borderRadius: 12,
        },
        standardSuccess: {
          background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%)',
          borderColor: 'rgba(79, 172, 254, 0.3)',
        },
        standardError: {
          background: 'linear-gradient(135deg, rgba(245, 87, 108, 0.2) 0%, rgba(240, 147, 251, 0.2) 100%)',
          borderColor: 'rgba(245, 87, 108, 0.3)',
        },
      },
    },
  },
});

export default appTheme;