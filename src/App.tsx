import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Navigation } from './components/Navigation';
import { RandomCatsPage } from './pages/RandomCatsPage';
import { BreedsPage } from './pages/BreedsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { theme } from './components/StyledComponents';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Navigation />
          <Routes>
            <Route path="/" element={<RandomCatsPage />} />
            <Route path="/breeds" element={<BreedsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/cat/:catId" element={<RandomCatsPage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;