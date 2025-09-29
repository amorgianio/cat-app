import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Box, 
  CircularProgress,
  Alert,
  Chip,
  Collapse
} from '@mui/material';
import { Refresh, Speed, Info } from '@mui/icons-material';
import { CatCard } from '../components/CatCard';
import { CatDetailModal } from '../components/CatDetailModal';
import { useRandomCats } from '../hooks/useCats';
import { usePerformanceWarnings } from '../hooks/usePerformance';
import { CatImage } from '../types';
import { sxStyles } from '../components/StyledComponents';

export const RandomCatsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cats, loading, error, loadMore, totalLoaded, hasReachedLimit, canLoadMore } = useRandomCats();
  const [selectedCat, setSelectedCat] = useState<CatImage | null>(null);
  const { 
    showMemoryWarning, 
    showPerformanceInfo, 
    hideMemoryWarning, 
    hidePerformanceInfo 
  } = usePerformanceWarnings(cats.length, totalLoaded);

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
      
      {/* Performance Warnings */}
      <Collapse in={showMemoryWarning}>
        <Alert 
          severity="warning" 
          onClose={hideMemoryWarning}
          sx={{ mb: 2 }}
          icon={<Speed />}
        >
          <Typography variant="subtitle2">Performance Notice</Typography>
          Your browser is using a lot of memory. Consider refreshing the page for optimal performance.
        </Alert>
      </Collapse>
      
      <Collapse in={showPerformanceInfo}>
        <Alert 
          severity="info" 
          onClose={hidePerformanceInfo}
          sx={{ mb: 2 }}
          icon={<Info />}
        >
          <Typography variant="subtitle2">💡 Performance Tip</Typography>
          We automatically manage memory by keeping only recent cats visible. 
          This keeps the page fast even after loading hundreds of cats!
        </Alert>
      </Collapse>
      
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
            {/* Performance Info */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {cats.length} cats • Total loaded: {totalLoaded} cats
              </Typography>
              {cats.length !== totalLoaded && (
                <Typography variant="caption" color="text.secondary">
                  💡 Older cats are automatically removed to keep the page fast
                </Typography>
              )}
            </Box>
            
            {hasReachedLimit ? (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  🎉 You've seen a lot of cats today!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  To keep the app fast, we've reached our loading limit.
                </Typography>
                <Button 
                  variant="outlined"
                  onClick={() => window.location.reload()}
                  startIcon={<Refresh />}
                >
                  Start Fresh
                </Button>
              </Box>
            ) : (
              <Button 
                variant="contained"
                size="large"
                onClick={loadMore}
                disabled={!canLoadMore}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
              >
                {loading ? 'Loading...' : 'Load More Cats'}
              </Button>
            )}
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