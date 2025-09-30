import React, { useState, useCallback, useMemo, memo } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  IconButton,
  Skeleton
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { CatImage as CatImageType } from '../types';
import { useFavorites } from '../hooks/useCats';
import { sxStyles, DIMENSIONS } from './StyledComponents';

interface CatCardProps {
  cat: CatImageType;
  onClick: (cat: CatImageType) => void;
  showBreedInfo?: boolean;
}

export const CatCard: React.FC<CatCardProps> = memo(({ 
  cat, 
  onClick, 
  showBreedInfo = true 
}) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Simple computations - no need for memoization
  const breed = cat.breeds?.[0];
  const isCurrentlyFavorite = isFavorite(cat.id);

  // Keep useCallback only for complex handlers with multiple dependencies
  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isCurrentlyFavorite) {
      removeFromFavorites(cat.id);
    } else {
      addToFavorites(cat);
    }
  }, [isCurrentlyFavorite, removeFromFavorites, addToFavorites, cat]);

  // Simple handlers - no need for useCallback overhead
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Stop showing skeleton even on error
  };

  const handleCardClick = () => {
    onClick(cat);
  };

  return (
    <Card 
      sx={sxStyles.catCard}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Skeleton loader while image loads */}
        {!imageLoaded && (
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={DIMENSIONS.CAT_IMAGE_HEIGHT}
            animation="wave"
            sx={{ 
              position: 'relative',
              zIndex: 1,
              bgcolor: 'grey.100'
            }}
          />
        )}
        
        {/* Actual image */}
        <CardMedia
          component="img"
          height="300"
          image={cat.url}
          alt={breed?.name || 'Cat'}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
          sx={{
            ...sxStyles.catImage,
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
            display: imageError ? 'none' : 'block',
            position: imageLoaded ? 'relative' : 'absolute',
            top: imageLoaded ? 0 : '-300px'
          }}
        />
        
        {/* Error fallback */}
        {imageError && (
          <Box 
            sx={{ 
              height: DIMENSIONS.CAT_IMAGE_HEIGHT, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'grey.100',
              color: 'text.secondary'
            }}
          >
            <Typography variant="body2">
              😿 Image not available
            </Typography>
          </Box>
        )}
        
        {/* Favorite button */}
        <IconButton
          sx={sxStyles.favoriteButton}
          onClick={handleFavoriteClick}
          size="small"
          color={isFavorite(cat.id) ? 'error' : 'default'}
        >
          {isFavorite(cat.id) ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </Box>
      
      {showBreedInfo && (
        <CardContent>
          {!imageLoaded ? (
            /* Always show text skeleton while image is loading */
            <>
              <Skeleton 
                variant="text" 
                width="60%" 
                height={DIMENSIONS.BREED_NAME_HEIGHT}
                sx={{ 
                  transform: 'scale(1, 0.6)',
                  transformOrigin: 'left center' 
                }}
              />
              <Skeleton 
                variant="text" 
                width="40%" 
                height={DIMENSIONS.BREED_INFO_HEIGHT}
                sx={{ 
                  transform: 'scale(1, 0.4)',
                  transformOrigin: 'left center' 
                }}
              />
            </>
          ) : breed ? (
            <>
              <Typography variant="h6" component="h3" gutterBottom>
                {breed.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {breed.temperament?.split(',')[0]}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Mixed breed
            </Typography>
          )}
        </CardContent>
      )}
    </Card>
  );
});

// Add display name for debugging
CatCard.displayName = 'CatCard';