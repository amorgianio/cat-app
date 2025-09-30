import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  IconButton, 
  useMediaQuery, 
  useTheme,
  Typography 
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children,
  maxWidth = 'md',
  title
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          position: 'relative'
        }
      }}
    >
      {title && (
        <DialogTitle sx={{ 
          pr: 6, // Make room for close button
          pb: 1,
          fontSize: '1.5rem',
          fontWeight: 600
        }}>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
        </DialogTitle>
      )}
      
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 1000,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)'
          }
        }}
      >
        <Close />
      </IconButton>
      
      <DialogContent sx={{ p: title ? 0 : 0 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};