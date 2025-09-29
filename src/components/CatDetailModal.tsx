import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  CardMedia,
  Divider
} from '@mui/material';
import { Favorite, FavoriteBorder, Launch, Category, Share } from '@mui/icons-material';
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
      // Optional: Show success message with link to favorites
      setTimeout(() => {
        if (window.confirm('Cat added to favorites! Would you like to view all your favorites?')) {
          handleClose();
          navigate('/favorites');
        }
      }, 500);
    }
  };

  const handleShareClick = async () => {
    const shareUrl = `${window.location.origin}?imgId=${cat?.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this ${breed?.name || 'cute cat'}!`,
          text: `Look at this adorable ${breed?.name || 'cat'} I found!`,
          url: shareUrl,
        });
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    });
  };

  const handleViewBreed = () => {
    if (breed) {
      handleClose();
      navigate(`/breeds?breedId=${breed.id}`);
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
            
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              💡 Share this URL with friends to show them this exact cat!
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
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              What would you like to do?
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained"
                startIcon={isFavorite(cat.id) ? <Favorite /> : <FavoriteBorder />}
                onClick={handleFavoriteClick}
                color={isFavorite(cat.id) ? "error" : "primary"}
              >
                {isFavorite(cat.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              
              <Button 
                variant="outlined"
                startIcon={<Category />}
                onClick={handleViewBreed}
                color="secondary"
              >
                View All {breed.name}s
              </Button>
              
              <Button 
                variant="outlined"
                startIcon={<Share />}
                onClick={handleShareClick}
                color="primary"
              >
                Share Cat
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
            
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              💡 Share this URL with friends to show them this exact cat!
            </Typography>
            
            <Typography variant="body1" paragraph>
              No breed information available for this adorable cat.
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              What would you like to do?
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained"
                startIcon={isFavorite(cat.id) ? <Favorite /> : <FavoriteBorder />}
                onClick={handleFavoriteClick}
                color={isFavorite(cat.id) ? "error" : "primary"}
              >
                {isFavorite(cat.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              
              <Button 
                variant="outlined"
                startIcon={<Share />}
                onClick={handleShareClick}
                color="primary"
              >
                Share Cat
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  );
};