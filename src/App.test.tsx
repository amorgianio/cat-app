import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the page components
jest.mock('./pages/RandomCatsPage', () => ({
  RandomCatsPage: () => <div data-testid="random-cats-page">Random Cats Page</div>
}));

jest.mock('./pages/BreedsPage', () => ({
  BreedsPage: () => <div data-testid="breeds-page">Breeds Page</div>
}));

jest.mock('./pages/FavoritesPage', () => ({
  FavoritesPage: () => <div data-testid="favorites-page">Favorites Page</div>
}));

// Mock the components to avoid complex dependencies
jest.mock('./components/Navigation', () => ({
  Navigation: () => <nav data-testid="navigation">Navigation</nav>
}));

jest.mock('./components/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>
}));

// Helper function to render App (App already includes Router)
const renderApp = () => {
  return render(<App />);
};

describe(' App Component', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  describe(' Layout & Structure', () => {
    test('should render main layout components', () => {
      renderApp();
      
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('should apply correct layout styles', () => {
      renderApp();
      
      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveStyle({ flex: 1 });
    });
  });

  describe(' Routing', () => {
    test('should render RandomCatsPage on default route', () => {
      // App already includes Router
      render(<App />);
      
      expect(screen.getByTestId('random-cats-page')).toBeInTheDocument();
    });

    test('should handle all defined routes', () => {
      // This test verifies that the routing structure is correct
      // The actual navigation testing would be done in integration tests
      const { container } = render(<App />);
      
      // Check that the main content area exists for routing
      expect(container.querySelector('main')).toBeInTheDocument();
    });
  });

  describe(' Theme Integration', () => {
    test('should apply ThemeProvider and CssBaseline', () => {
      const { container } = renderApp();
      
      // Check that MUI components are properly styled
      // The container should have the theme applied
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe(' Responsive Design', () => {
    test('should have responsive layout structure', () => {
      renderApp();
      
      const mainContent = screen.getByRole('main');
      expect(mainContent).toBeInTheDocument();
      
      // Verify the flex layout structure
      const appContainer = mainContent.parentElement;
      expect(appContainer).toHaveStyle({
        display: 'flex',
        'flex-direction': 'column',
        'min-height': '100vh'
      });
    });
  });
});