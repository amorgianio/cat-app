import React, { useState, useCallback, useMemo, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Box, 
  CircularProgress,
  Alert,
  Collapse,
  LinearProgress
} from '@mui/material';
import { Refresh, Speed, Info } from '@mui/icons-material';
import { CatCard } from '../components/CatCard';
import { CatDetailModal } from '../components/CatDetailModal';
import { CatGridSkeleton } from '../components/CatCardSkeleton';
import { useRandomCats } from '../hooks/useCats';
import { usePerformanceWarnings } from '../hooks/usePerformance';
import { PERFORMANCE_CONFIG } from '../config/performance';
import { CatImage } from '../types';
import { sxStyles } from '../components/StyledComponents';

export const RandomCatsPage: React.FC = memo(() => {
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

  // Simple URL parsing - URLSearchParams is already fast
  const urlParams = new URLSearchParams(location.search);
  const catIdFromUrl = urlParams.get('imgId');

  // 🚀 Memoize event handlers
  const handleCatClick = useCallback((cat: CatImage) => {
    setSelectedCat(cat);
    // Update URL to allow sharing - using imgId parameter as specified
    navigate(`?imgId=${cat.id}`, { replace: true });
  }, [navigate]);

  const handleCloseModal = useCallback(() => {
    setSelectedCat(null);
    navigate('/', { replace: true });
  }, [navigate]);

  // Simple handlers and computed values - no memoization needed
  const handleRefresh = () => {
    window.location.reload();
  };

  const shouldShowModal = selectedCat !== null || catIdFromUrl !== null;
  const hasNoCats = cats.length === 0 && !loading;

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
      
      {hasNoCats ? (
        <Box sx={sxStyles.centerBox}>
          <Typography variant="h4" color="text.secondary" gutterBottom>
            No cats found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try refreshing the page or check your internet connection.
          </Typography>
          <Button variant="contained" startIcon={<Refresh />} onClick={handleRefresh}>
            Refresh
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {/* Actual cat cards */}
            {cats.map((cat: CatImage) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
                <CatCard 
                  cat={cat} 
                  onClick={handleCatClick}
                />
              </Grid>
            ))}
            
            {/* Loading skeletons for initial load or "Load More" */}
            {loading && (
              <>
                {Array.from({ length: cats.length === 0 ? 10 : 10 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
                    <CatGridSkeleton count={1} />
                  </Grid>
                ))}
              </>
            )}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            {/* Enhanced Performance Info Card */}
            <Box sx={{ 
              mb: 3,
              p: 3,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              maxWidth: 500,
              mx: 'auto',
              boxShadow: 1
            }}>
              {/* Main Stats */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 3,
                mb: 2,
                flexWrap: 'wrap'
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                    <Typography variant="h4" color="primary.main" fontWeight={700}>
                      {cats.length}
                    </Typography>
                    <Typography variant="h6" color="primary.main">🐱</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Currently Visible
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  width: 2, 
                  height: 50, 
                  backgroundColor: 'divider',
                  display: { xs: 'none', sm: 'block' }
                }} />
                
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                    <Typography variant="h4" color="secondary.main" fontWeight={700}>
                      {totalLoaded}
                    </Typography>
                    <Typography variant="h6" color="secondary.main">📈</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Total Loaded
                  </Typography>
                </Box>
              </Box>

              {/* Memory Management Info */}
              {cats.length !== totalLoaded && (
                <Box sx={{
                  p: 2,
                  backgroundColor: 'warning.light',
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'warning.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 1
                }}>
                  <Speed sx={{ color: 'warning.dark', fontSize: 20 }} />
                  <Typography variant="body2" color="warning.dark" fontWeight={600}>
                    Smart Memory Management Active
                  </Typography>
                </Box>
              )}

              {/* Progress to Limit */}
              {!hasReachedLimit && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Progress to Performance Limit
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      {Math.round((totalLoaded / PERFORMANCE_CONFIG.SOFT_LIMIT_TOTAL) * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(totalLoaded / PERFORMANCE_CONFIG.SOFT_LIMIT_TOTAL) * 100}
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: totalLoaded > (PERFORMANCE_CONFIG.SOFT_LIMIT_TOTAL * 0.8) ? 'warning.main' : 'primary.main'
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {PERFORMANCE_CONFIG.SOFT_LIMIT_TOTAL - totalLoaded} more cats until limit reached
                  </Typography>
                </Box>
              )}

              {/* Explanation */}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                {cats.length !== totalLoaded 
                  ? `${totalLoaded - cats.length} older cats removed to optimize performance`
                  : 'All loaded cats are currently visible'
                }
              </Typography>
            </Box>
            
            {hasReachedLimit ? (
              <Box sx={{ 
                p: 3,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                border: 1,
                borderColor: 'success.light',
                maxWidth: 400,
                mx: 'auto',
                textAlign: 'center',
                boxShadow: 1
              }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  🎉 Wow, that's a lot of cats!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  You've reached our performance limit of <strong>{totalLoaded} cats</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Ready to start fresh with a new batch of adorable cats?
                </Typography>
                <Button 
                  variant="contained"
                  size="large"
                  onClick={() => window.location.reload()}
                  startIcon={<Refresh />}
                  sx={{ minWidth: 160 }}
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
        existingCats={cats}
      />
    </Container>
  );
});

// Add display name for debugging
RandomCatsPage.displayName = 'RandomCatsPage';