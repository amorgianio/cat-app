import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  Divider,
  Stack
} from '@mui/material';
import { Favorite, Pets } from '@mui/icons-material';

export const Footer: React.FC = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        py: 4,
        px: 2,
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'flex-start' },
          gap: 3
        }}>
          {/* Left section - App info */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Pets sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main" fontWeight={700}>
                Cat Lover App
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Discover and collect your favorite cats from around the world
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Made with <Favorite sx={{ fontSize: 14, color: 'error.main', mx: 0.5 }} /> using The Cat API
            </Typography>
          </Box>

          {/* Center section - Quick links */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link href="/" color="text.secondary" underline="hover">
                Random Cats
              </Link>
              <Link href="/breeds" color="text.secondary" underline="hover">
                Cat Breeds
              </Link>
              <Link href="/favorites" color="text.secondary" underline="hover">
                My Favorites
              </Link>
            </Stack>
          </Box>

          {/* Right section - API attribution */}
          <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="subtitle2" color="text.primary" gutterBottom>
              Powered By
            </Typography>
            <Link 
              href="https://thecatapi.com" 
              target="_blank" 
              rel="noopener noreferrer"
              color="text.secondary" 
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              The Cat API
            </Link>
            <Typography variant="caption" color="text.secondary">
              © 2025 Cat Lover App
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />
        
        {/* Bottom section - Copyright */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: { xs: 'center', md: 'space-between' },
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2
        }}>
          <Typography variant="caption" color="text.secondary">
            All cat images and breed information provided by The Cat API
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Built with React & Material UI
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;