import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card,
  CardContent,
  CardMedia,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Modal } from '../components/Modal';
import { CatCard } from '../components/CatCard';
import { CatDetailModal } from '../components/CatDetailModal';
import { useBreeds, useBreedImages } from '../hooks/useCats';
import { Breed, CatImage } from '../types';

export const BreedsPage: React.FC = () => {
  const navigate = useNavigate();
  const { breeds, loading: breedsLoading, error: breedsError } = useBreeds();
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [selectedCat, setSelectedCat] = useState<CatImage | null>(null);
  
  const { 
    images: breedImages, 
    loading: imagesLoading 
  } = useBreedImages(selectedBreed?.id || null);

  const handleBreedClick = (breed: Breed) => {
    setSelectedBreed(breed);
  };

  const handleBreedModalClose = () => {
    setSelectedBreed(null);
  };

  const handleCatClick = (cat: CatImage) => {
    setSelectedCat(cat);
    navigate(`?cat=${cat.id}`, { replace: true });
  };

  const handleCatModalClose = () => {
    setSelectedCat(null);
    navigate('/breeds', { replace: true });
  };

  if (breedsError) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error">
          {breedsError}
        </Alert>
      </Container>
    );
  }

  if (breedsLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading cat breeds...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h2" component="h1" sx={{ textAlign: 'center', mb: 4, color: 'text.primary' }}>
        🐾 Cat Breeds
      </Typography>
      
      {breeds.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" color="text.secondary" gutterBottom>
            No breeds found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Unable to load cat breeds. Please try again later.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {breeds.map((breed: Breed) => (
            <Grid item xs={12} sm={6} md={4} key={breed.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  },
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleBreedClick(breed)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {breed.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Origin:</strong> {breed.origin}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Life Span:</strong> {breed.life_span} years
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {breed.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Breed Images Modal */}
      <Modal isOpen={selectedBreed !== null} onClose={handleBreedModalClose} maxWidth="lg">
        {selectedBreed && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 3 }}>
              {selectedBreed.name}
            </Typography>
            
            {imagesLoading ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Loading {selectedBreed.name} images...
                </Typography>
              </Box>
            ) : breedImages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary">
                  No images found for {selectedBreed.name}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {breedImages.map((cat: CatImage) => (
                  <Grid item xs={12} sm={6} md={4} key={cat.id}>
                    <Card 
                      sx={{ cursor: 'pointer' }} 
                      onClick={() => handleCatClick(cat)}
                    >
                      <CardMedia
                        component="img"
                        height="250"
                        image={cat.url}
                        alt={selectedBreed.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Modal>

      {/* Cat Detail Modal */}
      <CatDetailModal 
        isOpen={selectedCat !== null}
        onClose={handleCatModalClose}
        catId={selectedCat?.id}
      />
    </Container>
  );
};