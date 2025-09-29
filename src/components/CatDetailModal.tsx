import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  CardMedia
} from '@mui/material';
import { Favorite, FavoriteBorder, Launch } from '@mui/icons-material';
import { Modal } from './Modal';
import { useCatById, useFavorites } from '../hooks/useCats';
import { sxStyles } from './StyledComponents';

interface CatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  catId?: string;
}

export const CatDetailModal: React.FC<CatDetailModalProps> = ({ 
  isOpen, 
  onClose,
  catId: propCatId 
}) => {
  const { catId: paramCatId } = useParams<{ catId: string }>();
  const navigate = useNavigate();
  const catId = propCatId || paramCatId;
  
  const { cat, loading, error } = useCatById(catId || null);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleClose = () => {
    onClose();
    // If we came here via URL, navigate back
    if (paramCatId && !propCatId) {
      navigate(-1);
    }
  };

  const handleFavoriteClick = () => {
    if (!cat) return;
    
    if (isFavorite(cat.id)) {
      removeFromFavorites(cat.id);
    } else {
      addToFavorites(cat);
    }
  };

  const breed = cat?.breeds?.[0];

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <Box sx={{ ...sxStyles.centerBox, p: 5 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading cat details...
          </Typography>
        </Box>
      </Modal>
    );
  }

  if (error || !cat) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <Box sx={sxStyles.modalBox}>
          <Alert severity="error">
            {error || 'Cat not found'}
          </Alert>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="md">
      <Box>
        <CardMedia
          component="img"
          image={cat.url}
          alt={breed?.name || 'Cat'}
          sx={{
            maxHeight: 500,
            width: '100%',
            objectFit: 'contain'
          }}
        />
        
        {breed && (
          <Box sx={sxStyles.modalBox}>
            <Typography variant="h4" component="h3" gutterBottom>
              {breed.name}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Origin:</strong> {breed.origin}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Life Span:</strong> {breed.life_span} years
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Weight:</strong> {breed.weight.metric} kg
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              {breed.description}
            </Typography>
            
            {breed.temperament && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Temperament:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {breed.temperament.split(', ').map((trait: string, index: number) => (
                    <Chip 
                      key={index} 
                      label={trait} 
                      variant="outlined" 
                      size="small" 
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained"
                startIcon={isFavorite(cat.id) ? <Favorite /> : <FavoriteBorder />}
                onClick={handleFavoriteClick}
                color={isFavorite(cat.id) ? "error" : "primary"}
              >
                {isFavorite(cat.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              
              {breed.wikipedia_url && (
                <Button 
                  variant="outlined"
                  startIcon={<Launch />}
                  onClick={() => window.open(breed.wikipedia_url, '_blank')}
                >
                  Learn More
                </Button>
              )}
            </Box>
          </Box>
        )}
        
        {!breed && (
          <Box sx={sxStyles.modalBox}>
            <Typography variant="h4" component="h3" gutterBottom>
              Beautiful Cat
            </Typography>
            <Typography variant="body1" paragraph>
              No breed information available for this adorable cat.
            </Typography>
            
            <Button 
              variant="contained"
              startIcon={isFavorite(cat.id) ? <Favorite /> : <FavoriteBorder />}
              onClick={handleFavoriteClick}
              color={isFavorite(cat.id) ? "error" : "primary"}
            >
              {isFavorite(cat.id) ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};