import { createTheme } from '@mui/material/styles';

// Modern Material UI v6 theme configuration
export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      dark: '#FF4444',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#4ECDC4',
      light: '#70E1D7',
      dark: '#2BB3AB',
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#DC3545'
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#333333',
      secondary: '#666666'
    }
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '2.125rem',
      fontWeight: 700,
      color: '#FF6B6B'
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#333333'
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#333333'
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#333333'
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          transition: 'all 0.2s ease'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#333333',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500
        }
      }
    }
  }
});

// Common sx prop objects for reusability - Modern Material UI v6 approach
export const sxStyles = {
  // Container styles
  pageContainer: {
    maxWidth: 'xl',
    py: 3
  },
  
  // Grid styles
  catGrid: {
    container: true,
    spacing: 3
  },
  catGridItem: {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3
  },
  
  // Card styles
  catCard: {
    cursor: 'pointer',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 3
    },
    transition: 'all 0.2s ease'
  },
  
  catImage: {
    width: '100%',
    height: 300,
    objectFit: 'cover'
  },
  
  // Button styles
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      transform: 'scale(1.1)'
    }
  },
  
  loadMoreButton: {
    mt: 5,
    size: 'large'
  },
  
  // Layout styles
  centerBox: {
    textAlign: 'center',
    py: 8
  },
  
  modalBox: {
    p: 3
  },
  
  // Typography styles
  pageTitle: {
    textAlign: 'center',
    mb: 4,
    color: 'text.primary'
  },
  
  // Navigation styles
  navTitle: {
    mr: 2,
    fontFamily: 'Roboto',
    fontWeight: 700,
    color: 'primary.main',
    textDecoration: 'none',
    fontSize: '1.8rem'
  },
  
  navButton: (isActive: boolean) => ({
    my: 2,
    mx: 1,
    color: isActive ? 'primary.main' : 'text.primary',
    fontWeight: isActive ? 600 : 400,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'action.hover',
      color: 'primary.main'
    }
  })
};