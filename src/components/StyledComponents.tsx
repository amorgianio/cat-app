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

// Consistent dimensions for content and skeletons
// Based on Material UI Typography default line heights and spacing
export const DIMENSIONS = {
  // Image dimensions (fixed heights)
  CAT_IMAGE_HEIGHT: 300,
  BREED_MODAL_IMAGE_HEIGHT: 250,
  MODAL_IMAGE_MAX_HEIGHT: 500,
  
  // Typography dimensions (calculated from Material UI defaults + line-height)
  // h4 (1.25rem * 1.235 line-height ≈ 24px) + margin
  H4_HEIGHT: 40,
  // h5 (1.5rem * 1.334 line-height ≈ 32px) but appears smaller in cards
  H5_HEIGHT: 28,
  // h6 (1.25rem * 1.6 line-height ≈ 32px) but tighter in cards  
  H6_HEIGHT: 24,
  // body1 (1rem * 1.5 line-height = 24px)
  BODY1_HEIGHT: 24,
  // body2 (0.875rem * 1.43 line-height ≈ 20px)
  BODY2_HEIGHT: 20,
  // caption (0.75rem * 1.66 line-height ≈ 20px)
  CAPTION_HEIGHT: 20,
  
  // Legacy component heights (for backward compatibility)
  BREED_NAME_HEIGHT: 28,      // Same as H5_HEIGHT
  BREED_INFO_HEIGHT: 20,      // Same as BODY2_HEIGHT
  
  // Component dimensions
  BUTTON_HEIGHT: 36,           // Material UI Button default
  CHIP_HEIGHT: 32,            // Material UI Chip default
  FAVORITE_BUTTON_SIZE: 40,   // IconButton with small size
  
  // Spacing dimensions
  TEXT_MARGIN_BOTTOM: 8,      // Standard gutterBottom spacing
  PARAGRAPH_SPACING: 16,      // Paragraph spacing
} as const;

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
    height: DIMENSIONS.CAT_IMAGE_HEIGHT,
    objectFit: 'cover'
  },
  
  // Button styles
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: DIMENSIONS.FAVORITE_BUTTON_SIZE,
    height: DIMENSIONS.FAVORITE_BUTTON_SIZE,
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