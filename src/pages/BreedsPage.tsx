import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card,
  CardContent,
  CardMedia,
  Box,
  Alert,
  Skeleton
} from '@mui/material';
import { Modal } from '../components/Modal';
import { CatDetailModal } from '../components/CatDetailModal';
import { BreedGridSkeleton } from '../components/BreedCardSkeleton';
import { useDocumentTitle, createTitle, PAGE_TITLES } from '../hooks/useDocumentTitle';
import { DIMENSIONS } from '../components/StyledComponents';
import { useBreeds, useBreedImages } from '../hooks/useCats';
import { Breed, CatImage } from '../types';

export const BreedsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { breeds, loading: breedsLoading, error: breedsError } = useBreeds();
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [selectedCat, setSelectedCat] = useState<CatImage | null>(null);
  const breedRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  // Dynamic title based on selected breed
  const pageTitle = selectedBreed 
    ? `${selectedBreed.name} Cat Breed - ${PAGE_TITLES.BREEDS}`
    : PAGE_TITLES.BREEDS;
  useDocumentTitle(createTitle(pageTitle));
  
  const { 
    images: breedImages, 
    loading: imagesLoading 
  } = useBreedImages(selectedBreed?.id || null);

  // Check if we need to focus on a specific breed from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const breedId = urlParams.get('breedId');
    
    if (breedId && breeds.length > 0) {
      const breed = breeds.find(b => b.id === breedId);
      if (breed) {
        // Scroll to the breed card
        const breedElement = breedRefs.current[breedId];
        if (breedElement) {
          breedElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          // Optional: Add a highlight effect
          breedElement.style.boxShadow = '0 0 20px rgba(25, 118, 210, 0.5)';
          setTimeout(() => {
            breedElement.style.boxShadow = '';
          }, 3000);
        }
      }
    }
  }, [breeds, location.search]);

  const setBreedRef = (breedId: string) => (el: HTMLElement | null) => {
    breedRefs.current[breedId] = el;
  };

  const handleBreedClick = (breed: Breed) => {
    setSelectedBreed(breed);
  };

  const handleBreedModalClose = () => {
    setSelectedBreed(null);
  };

  const handleCatClick = (cat: CatImage) => {
    setSelectedCat(cat);
    navigate(`/breeds?imgId=${cat.id}`, { replace: true });
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
        <Typography variant="h2" component="h1" sx={{ textAlign: 'center', mb: 4, color: 'text.primary' }}>
          🐾 Cat Breeds
        </Typography>
        
        <Grid container spacing={3}>
          {Array.from({ length: 12 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
              <BreedGridSkeleton count={1} />
            </Grid>
          ))}
        </Grid>
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
                ref={setBreedRef(breed.id)}
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
              <Grid container spacing={2}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                    <Card sx={{ cursor: 'pointer' }}>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={DIMENSIONS.BREED_MODAL_IMAGE_HEIGHT}
                        animation="wave"
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
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
                        height={DIMENSIONS.BREED_MODAL_IMAGE_HEIGHT}
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