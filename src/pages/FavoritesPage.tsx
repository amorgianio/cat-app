import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Box, 
  Alert,
  Chip
} from '@mui/material';
import { Delete, Clear } from '@mui/icons-material';
import { CatCard } from '../components/CatCard';
import { CatDetailModal } from '../components/CatDetailModal';
import { useFavorites } from '../hooks/useCats';
import { FavoriteCat } from '../types';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites, removeFromFavorites } = useFavorites();
  const [selectedCat, setSelectedCat] = useState<FavoriteCat | null>(null);

  // Check if we have a cat ID in the URL
  const urlParams = new URLSearchParams(location.search);
  const catIdFromUrl = urlParams.get('imgId');

  const handleCatClick = (cat: FavoriteCat) => {
    setSelectedCat(cat);
    navigate(`/favorites?imgId=${cat.id}`, { replace: true });
  };

  const handleCloseModal = () => {
    setSelectedCat(null);
    navigate('/favorites', { replace: true });
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      favorites.forEach((cat: FavoriteCat) => removeFromFavorites(cat.id));
    }
  };

  // If there's a cat ID in URL but no selected cat, we should show the modal
  const shouldShowModal = selectedCat !== null || catIdFromUrl !== null;

  // Sort favorites by date added (newest first)
  const sortedFavorites = [...favorites].sort((a: FavoriteCat, b: FavoriteCat) => 
    new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h2" component="h1" sx={{ color: 'text.primary' }}>
          ❤️ My Favorite Cats ({favorites.length})
        </Typography>
        {favorites.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<Clear />}
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        )}
      </Box>
      
      {favorites.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" color="text.secondary" gutterBottom>
            No favorite cats yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start browsing cats and click the heart icon to add them to your favorites!
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/')}
          >
            Browse Random Cats
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <Chip 
              label={`${favorites.length} favorite${favorites.length === 1 ? '' : 's'}`}
              color="primary"
              variant="outlined"
            />
          </Box>
          
          <Grid container spacing={3}>
            {sortedFavorites.map((cat: FavoriteCat) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
                <Box sx={{ position: 'relative' }}>
                  <CatCard 
                    cat={cat} 
                    onClick={handleCatClick}
                  />
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Added {new Date(cat.dateAdded).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ 
            textAlign: 'center', 
            mt: 4,
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2
          }}>
            <Typography variant="body2" color="text.secondary">
              💡 Tip: Click on any cat image to see details and share with friends!
            </Typography>
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