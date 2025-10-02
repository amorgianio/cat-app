import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container 
} from '@mui/material';
import { Pets } from '@mui/icons-material';
import { sxStyles } from './StyledComponents';

// Memoize static navigation items outside component to prevent recreation
const NAV_ITEMS = [
  { path: '/', label: 'Random Cats' },
  { path: '/breeds', label: 'Breeds' },
  { path: '/favorites', label: 'Favorites' }
] as const;

export const Navigation: React.FC = memo(() => {
  const location = useLocation();

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={2} 
      sx={{ 
        mb: 4,
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Pets sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h1"
            noWrap
            component={Link}
            to="/"
            sx={{
              ...sxStyles.navTitle,
              display: { xs: 'none', md: 'flex' }
            }}
          >
            Cat Lover
          </Typography>

          <Pets sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              ...sxStyles.navTitle,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontSize: '1.5rem'
            }}
          >
            Cat Lover
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={sxStyles.navButton(location.pathname === item.path)}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
});

// Add display name for debugging
Navigation.displayName = 'Navigation';