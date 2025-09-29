import React from 'react';
import { 
  Card, 
  CardContent, 
  Box, 
  Skeleton
} from '@mui/material';
import { sxStyles, DIMENSIONS } from './StyledComponents';

interface CatCardSkeletonProps {
  showBreedInfo?: boolean;
}

export const CatCardSkeleton: React.FC<CatCardSkeletonProps> = ({ 
  showBreedInfo = true 
}) => {
  return (
    <Card sx={sxStyles.catCard}>
      <Box sx={{ position: 'relative' }}>
        {/* Image Skeleton - Exact same height as actual cat images */}
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={DIMENSIONS.CAT_IMAGE_HEIGHT}
          animation="wave"
          sx={{ bgcolor: 'grey.100' }}
        />
        
        {/* Favorite Button Skeleton - Exact same size as actual button */}
        <Skeleton
          variant="circular"
          width={DIMENSIONS.FAVORITE_BUTTON_SIZE}
          height={DIMENSIONS.FAVORITE_BUTTON_SIZE}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.9)'
          }}
        />
      </Box>
      
      {showBreedInfo && (
        <CardContent>
          {/* Breed name - Same height as h6 Typography with gutterBottom */}
          <Skeleton 
            variant="text" 
            width="60%" 
            height={DIMENSIONS.H6_HEIGHT} 
            sx={{ 
              mb: `${DIMENSIONS.TEXT_MARGIN_BOTTOM}px`,
              transform: 'scale(1, 0.6)' // Make skeleton thinner to match text better
            }} 
          />
          {/* Temperament - Same height as body2 Typography */}
          <Skeleton 
            variant="text" 
            width="40%" 
            height={DIMENSIONS.BODY2_HEIGHT}
            sx={{
              transform: 'scale(1, 0.6)' // Make skeleton thinner to match text better
            }}
          />
        </CardContent>
      )}
    </Card>
  );
};

interface CatGridSkeletonProps {
  count?: number;
  showBreedInfo?: boolean;
}

export const CatGridSkeleton: React.FC<CatGridSkeletonProps> = ({ 
  count = 8, 
  showBreedInfo = true 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <CatCardSkeleton key={index} showBreedInfo={showBreedInfo} />
      ))}
    </>
  );
};

export default CatCardSkeleton;