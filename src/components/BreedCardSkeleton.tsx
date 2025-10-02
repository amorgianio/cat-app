import React from 'react';
import { 
  Card, 
  CardContent, 
  Skeleton
} from '@mui/material';
import { DIMENSIONS } from './StyledComponents';

export const BreedCardSkeleton: React.FC = () => {
  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Breed name skeleton - Same as h5 Typography with gutterBottom */}
        <Skeleton 
          variant="text" 
          width="70%" 
          height={DIMENSIONS.H5_HEIGHT} 
          sx={{ 
            mb: 2,
            transform: 'scale(1, 0.6)' // Thinner skeleton to match text
          }} 
        />
        
        {/* Origin skeleton - Same as body2 Typography */}
        <Skeleton 
          variant="text" 
          width="50%" 
          height={DIMENSIONS.BODY2_HEIGHT} 
          sx={{ 
            mb: 1,
            transform: 'scale(1, 0.6)' 
          }} 
        />
        
        {/* Life span skeleton - Same as body2 Typography */}
        <Skeleton 
          variant="text" 
          width="40%" 
          height={DIMENSIONS.BODY2_HEIGHT} 
          sx={{ 
            mb: 2,
            transform: 'scale(1, 0.6)'
          }} 
        />
        
        {/* Description skeleton lines - Thinner body2 height */}
        <Skeleton 
          variant="text" 
          width="100%" 
          height={DIMENSIONS.BODY2_HEIGHT} 
          sx={{ 
            mb: 1,
            transform: 'scale(1, 0.4)' // Even thinner for description text
          }} 
        />
        <Skeleton 
          variant="text" 
          width="90%" 
          height={DIMENSIONS.BODY2_HEIGHT} 
          sx={{ 
            mb: 1,
            transform: 'scale(1, 0.4)'
          }} 
        />
        <Skeleton 
          variant="text" 
          width="80%" 
          height={DIMENSIONS.BODY2_HEIGHT}
          sx={{
            transform: 'scale(1, 0.4)'
          }}
        />
      </CardContent>
    </Card>
  );
};

interface BreedGridSkeletonProps {
  count?: number;
}

export const BreedGridSkeleton: React.FC<BreedGridSkeletonProps> = ({ 
  count = 12 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <BreedCardSkeleton key={index} />
      ))}
    </>
  );
};

export default BreedCardSkeleton;