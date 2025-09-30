import { useEffect } from 'react';

/**
 * Lightweight hook to update document title (Zero memory overhead when not used)
 * No external dependencies, uses native DOM API directly
 */
export const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    if (title) {
      // Store original title for cleanup (minimal memory)
      const originalTitle = document.title;
      document.title = title;
      
      // Cleanup function
      return () => {
        document.title = originalTitle;
      };
    }
  }, [title]);
};

/**
 * Utility to generate SEO-friendly titles with consistent branding
 * Pure function - no memory overhead
 */
export const createTitle = (pageTitle?: string): string => {
  const baseTitle = 'Cat Lover App';
  return pageTitle ? `${pageTitle} - ${baseTitle}` : baseTitle;
};

/**
 * Predefined page titles (constants - zero runtime memory allocation)
 */
export const PAGE_TITLES = {
  HOME: 'Browse Random Cat Photos',
  FAVORITES: 'My Favorite Cats',
  BREEDS: 'Cat Breeds Gallery',
  CAT_DETAIL: (breedName?: string) => 
    breedName ? `${breedName} Cat Photos` : 'Cat Photo Details'
} as const;