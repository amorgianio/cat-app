import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { CatCard } from '../components/CatCard';
import { CatDetailModal } from '../components/CatDetailModal';
import { useRandomCats } from '../hooks/useCats';
import { CatImage } from '../types';
import { sxStyles } from '../components/StyledComponents';

export const RandomCatsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cats, loading, error, loadMore } = useRandomCats();
  const [selectedCat, setSelectedCat] = useState<CatImage | null>(null);

  // Check if we have a cat ID in the URL - using imgId parameter as specified
  const urlParams = new URLSearchParams(location.search);
  const catIdFromUrl = urlParams.get('imgId');

  const handleCatClick = (cat: CatImage) => {
    setSelectedCat(cat);
    // Update URL to allow sharing - using imgId parameter as specified
    navigate(`?imgId=${cat.id}`, { replace: true });
  };

  const handleCloseModal = () => {
    setSelectedCat(null);
    navigate('/', { replace: true });
  };

  // If there's a cat ID in URL but no selected cat, we should show the modal
  const shouldShowModal = selectedCat !== null || catIdFromUrl !== null;

  if (error) {
    return (
      <Container sx={sxStyles.pageContainer}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={sxStyles.pageContainer}>
      <Typography variant="h2" component="h1" sx={sxStyles.pageTitle}>
        🐱 Random Cats
      </Typography>
      
      {cats.length === 0 && !loading ? (
        <Box sx={sxStyles.centerBox}>
          <Typography variant="h4" color="text.secondary" gutterBottom>
            No cats found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try refreshing the page or check your internet connection.
          </Typography>
          <Button variant="contained" startIcon={<Refresh />} onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {cats.map((cat: CatImage) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
                <CatCard 
                  cat={cat} 
                  onClick={handleCatClick}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button 
              variant="contained"
              size="large"
              onClick={loadMore}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
            >
              {loading ? 'Loading...' : 'Load More Cats'}
            </Button>
          </Box>
        </>
      )}

      <CatDetailModal 
        isOpen={shouldShowModal}
        onClose={handleCloseModal}
        catId={selectedCat?.id || catIdFromUrl || undefined}
      />
    </Container>
  );
};