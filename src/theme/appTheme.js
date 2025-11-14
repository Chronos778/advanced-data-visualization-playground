import { createTheme } from '@mui/material/styles';

/**
 * TradingView-Inspired Professional Theme
 * Clean, minimal, data-focused design
 */
const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2962FF', // TradingView blue
      light: '#5E8CFF',
      dark: '#1948CC',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#787B86', // TradingView gray
      light: '#9598A1',
      dark: '#5D606B',
      contrastText: '#ffffff',
    },
    background: {
      default: '#131722', // TradingView dark background
      paper: '#1E222D', // TradingView panel background
    },
    text: {
      primary: '#D1D4DC', // TradingView text
      secondary: '#787B86', // TradingView secondary text
    },
    error: {
      main: '#F23645', // TradingView red
    },
    warning: {
      main: '#FF9800',
    },
    success: {
      main: '#089981', // TradingView green
    },
    info: {
      main: '#2962FF',
    },
    divider: '#2A2E39', // TradingView border
  },
  typography: {
    fontFamily: '"Trebuchet MS", "Helvetica", "Arial", sans-serif',
    fontSize: 13,
    h1: {
      fontSize: '2rem',
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '13px',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '12px',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '13px',
    },
    caption: {
      fontSize: '11px',
      color: '#787B86',
    },
  },
  shape: {
    borderRadius: 4, // TradingView uses minimal border radius
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0,0,0,0.3)',
    '0 1px 3px 0 rgba(0,0,0,0.4)',
    '0 2px 4px 0 rgba(0,0,0,0.4)',
    '0 2px 6px 0 rgba(0,0,0,0.4)',
    '0 3px 8px 0 rgba(0,0,0,0.4)',
    '0 4px 10px 0 rgba(0,0,0,0.4)',
    '0 5px 12px 0 rgba(0,0,0,0.4)',
    '0 6px 14px 0 rgba(0,0,0,0.4)',
    '0 7px 16px 0 rgba(0,0,0,0.4)',
    '0 8px 18px 0 rgba(0,0,0,0.4)',
    '0 9px 20px 0 rgba(0,0,0,0.4)',
    '0 10px 22px 0 rgba(0,0,0,0.4)',
    '0 11px 24px 0 rgba(0,0,0,0.4)',
    '0 12px 26px 0 rgba(0,0,0,0.4)',
    '0 13px 28px 0 rgba(0,0,0,0.4)',
    '0 14px 30px 0 rgba(0,0,0,0.4)',
    '0 15px 32px 0 rgba(0,0,0,0.4)',
    '0 16px 34px 0 rgba(0,0,0,0.4)',
    '0 17px 36px 0 rgba(0,0,0,0.4)',
    '0 18px 38px 0 rgba(0,0,0,0.4)',
    '0 19px 40px 0 rgba(0,0,0,0.4)',
    '0 20px 42px 0 rgba(0,0,0,0.4)',
    '0 21px 44px 0 rgba(0,0,0,0.4)',
    '0 22px 46px 0 rgba(0,0,0,0.4)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#2A2E39 #131722',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#131722',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#2A2E39',
            borderRadius: '3px',
            '&:hover': {
              background: '#363A45',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#1E222D',
          border: '1px solid #2A2E39',
        },
        elevation1: {
          boxShadow: 'none',
        },
        elevation2: {
          boxShadow: '0 2px 4px 0 rgba(0,0,0,0.4)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#1E222D',
          border: '1px solid #2A2E39',
          boxShadow: 'none',
          transition: 'border-color 0.2s ease',
          '&:hover': {
            borderColor: '#363A45',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '6px 16px',
          fontWeight: 500,
          fontSize: '13px',
        },
        contained: {
          background: '#2962FF',
          boxShadow: 'none',
          '&:hover': {
            background: '#1948CC',
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: '#2A2E39',
          color: '#D1D4DC',
          '&:hover': {
            borderColor: '#363A45',
            background: 'rgba(255, 255, 255, 0.02)',
          },
        },
        text: {
          color: '#787B86',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.02)',
            color: '#D1D4DC',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#1E222D',
          borderBottom: '1px solid #2A2E39',
          boxShadow: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 400,
          fontSize: '13px',
          minHeight: 48,
          color: '#787B86',
          '&.Mui-selected': {
            fontWeight: 500,
            color: '#D1D4DC',
          },
          '&:hover': {
            color: '#D1D4DC',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
        indicator: {
          backgroundColor: '#2962FF',
          height: 2,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          fontSize: '12px',
          height: 24,
        },
        filled: {
          background: 'rgba(41, 98, 255, 0.1)',
          color: '#2962FF',
          border: '1px solid rgba(41, 98, 255, 0.2)',
        },
        outlined: {
          borderColor: '#2A2E39',
          color: '#787B86',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: '#131722',
            fontSize: '13px',
            '& fieldset': {
              borderColor: '#2A2E39',
            },
            '&:hover fieldset': {
              borderColor: '#363A45',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2962FF',
              borderWidth: '1px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '13px',
            color: '#787B86',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '13px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '13px',
          '&:hover': {
            background: 'rgba(41, 98, 255, 0.05)',
          },
          '&.Mui-selected': {
            background: 'rgba(41, 98, 255, 0.1)',
            '&:hover': {
              background: 'rgba(41, 98, 255, 0.15)',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#2A2E39',
          fontSize: '13px',
          padding: '12px 16px',
        },
        head: {
          fontWeight: 500,
          background: '#131722',
          color: '#787B86',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: '13px',
          border: '1px solid',
        },
        standardSuccess: {
          background: 'rgba(8, 153, 129, 0.1)',
          borderColor: 'rgba(8, 153, 129, 0.3)',
          color: '#089981',
        },
        standardError: {
          background: 'rgba(242, 54, 69, 0.1)',
          borderColor: 'rgba(242, 54, 69, 0.3)',
          color: '#F23645',
        },
        standardWarning: {
          background: 'rgba(255, 152, 0, 0.1)',
          borderColor: 'rgba(255, 152, 0, 0.3)',
          color: '#FF9800',
        },
        standardInfo: {
          background: 'rgba(41, 98, 255, 0.1)',
          borderColor: 'rgba(41, 98, 255, 0.3)',
          color: '#2962FF',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#787B86',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.02)',
            color: '#D1D4DC',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#2A2E39',
          fontSize: '12px',
          border: '1px solid #363A45',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          background: '#2A2E39',
        },
        bar: {
          background: '#2962FF',
        },
      },
    },
  },
});

export default appTheme;