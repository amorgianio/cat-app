import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  IconButton 
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { CatImage as CatImageType } from '../types';
import { useFavorites } from '../hooks/useCats';
import { sxStyles } from './StyledComponents';

interface CatCardProps {
  cat: CatImageType;
  onClick: (cat: CatImageType) => void;
  showBreedInfo?: boolean;
}

export const CatCard: React.FC<CatCardProps> = ({ 
  cat, 
  onClick, 
  showBreedInfo = true 
}) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isFavorite(cat.id)) {
      removeFromFavorites(cat.id);
    } else {
      addToFavorites(cat);
    }
  };

  const breed = cat.breeds?.[0];

  return (
    <Card 
      sx={sxStyles.catCard}
      onClick={() => onClick(cat)}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="300"
          image={cat.url}
          alt={breed?.name || 'Cat'}
          loading="lazy"
          sx={sxStyles.catImage}
        />
        <IconButton
          sx={sxStyles.favoriteButton}
          onClick={handleFavoriteClick}
          size="small"
          color={isFavorite(cat.id) ? 'error' : 'default'}
        >
          {isFavorite(cat.id) ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </Box>
      
      {showBreedInfo && breed && (
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            {breed.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {breed.temperament?.split(',')[0]}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};