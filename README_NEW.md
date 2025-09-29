# Cat Lover App 🐱

A modern React application for cat lovers built with **Node.js 22**, **TypeScript**, **React Router**, and **Material UI v6+**. This app integrates with The Cat API to provide an engaging cat browsing experience with a cutting-edge, responsive design.

## ✨ Latest Updates

- **🚀 Upgraded to Material UI v6+** - Latest Material UI with improved performance and modern APIs
- **🎨 Modern `sx` Prop Architecture** - Eliminated deprecated styled-components, using Material UI's modern sx prop system
- **📱 Enhanced Performance** - Better runtime performance with Material UI v6's optimizations
- **🌟 Cleaner Codebase** - Removed deprecated dependencies, using only modern Material UI patterns
- **♿ Better Accessibility** - Latest Material UI accessibility improvements built-in

## Why Material UI v6+ and No Styled-Components?

### ❌ **What We Removed (Deprecated/Outdated)**
- **Styled-Components** - Deprecated approach, adds runtime overhead
- **Custom styled()** functions - Replaced with built-in Material UI styling
- **Theme props drilling** - Replaced with sx prop and theme access
- **Multiple styling systems** - Unified under Material UI's system

### ✅ **What We Use Now (Modern/Recommended)**
- **Material UI v6+ `sx` prop** - Modern, performant, type-safe styling
- **Built-in theme system** - Direct theme access without wrappers
- **Material UI components** - Latest optimized components with built-in styling
- **CSS-in-JS optimization** - Material UI's optimized emotion integration
- **Zero runtime style calculation** - Better performance than styled-components

## Features

### 🎯 **Random Cats View**
- Displays a responsive grid of 10 random cat images with breed information
- "Load More" button with loading indicator to fetch additional cats
- Click any cat image to open detailed modal view
- Add cats to favorites with animated heart button
- Shareable URLs for individual cat details

### 🐾 **Cat Breeds View**
- Browse comprehensive list of cat breeds in beautiful cards
- Click breeds to see gallery of breed-specific images in a modal
- Each breed image links to detailed cat view
- Rich breed information including origin, temperament, and descriptions

### ❤️ **Favorites View**
- View all your favorited cats in a clean grid layout
- Sort by date added (newest first)
- Remove individual cats or clear all favorites with confirmation
- Track when each cat was added to favorites
- Direct links to cat details from favorites

### 🎨 **Material UI Design System**
- **Modern Interface**: Clean, professional design with Material UI v6+ components
- **sx prop styling**: Modern, performant approach replacing styled-components
- **Responsive Layout**: Perfect on desktop, tablet, and mobile devices  
- **Accessibility**: Built-in keyboard navigation and screen reader support
- **Dark/Light Theme Ready**: Material UI theming system integrated
- **Smooth Animations**: Beautiful transitions and hover effects
- **Loading States**: Elegant loading spinners and progress indicators
- **Performance Optimized**: No styled-components overhead, pure sx prop system

## 🆕 Modern Material UI v6+ Features

### 🚀 **Performance & Architecture**
- **No styled-components**: Eliminated for better performance
- **sx prop system**: Modern, performant CSS-in-JS approach
- **Shared style objects**: Reusable `sxStyles` patterns
- **Tree-shaking optimized**: Only import used components
- **CSS baseline**: Consistent cross-browser styling

### 🎨 **Theme & Design System**
```typescript
// Modern Material UI v6+ theming
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  },
  typography: {
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 }
  }
});

// Shared sx style objects for consistency
export const sxStyles = {
  card: {
    maxWidth: 345,
    margin: 2,
    transition: 'transform 0.2s',
    '&:hover': { transform: 'scale(1.02)' }
  },
  // ... more reusable styles
};
```

### 🔧 **Modern Styling Patterns**
```jsx
// Before: styled-components (deprecated approach)
const StyledCard = styled(Card)({
  maxWidth: 345,
  margin: 16
});

// After: sx prop (modern approach)
<Card sx={sxStyles.card}>
  <CardContent sx={{ textAlign: 'center' }}>
    {/* Content */}
  </CardContent>
</Card>
```

## Technology Stack

- **Node.js 22** - Latest Node.js runtime for optimal performance
- **React 18** with TypeScript for type safety
- **Material UI (MUI) 6+** - Latest Material UI with modern sx prop system
- **Emotion** - Optimized CSS-in-JS (Material UI's recommended engine)
- **React Router 6** for navigation and URL handling
- **Axios** for API requests
- **The Cat API** (thecatapi.com) for cat data
- **Local Storage** for favorites persistence
- **Roboto Font** for consistent typography

## Modern Styling Architecture

### 🎨 **sx Prop System (Material UI v6+)**
Instead of deprecated styled-components, we use Material UI's modern `sx` prop:

```tsx
// ❌ Old styled-components approach (deprecated)
const StyledCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': { transform: 'translateY(-4px)' }
}));

// ✅ Modern sx prop approach (recommended)
<Card sx={{ 
  cursor: 'pointer',
  '&:hover': { transform: 'translateY(-4px)' }
}}>
```

### 🔧 **Shared Style Objects**
Reusable style objects for consistency:

```tsx
export const sxStyles = {
  catCard: {
    cursor: 'pointer',
    '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
  },
  pageTitle: {
    textAlign: 'center', mb: 4, color: 'text.primary'
  }
};
```

### ⚡ **Performance Benefits**
- **Zero runtime overhead** for static styles
- **Optimized bundle size** - no styled-components dependency
- **Better tree-shaking** - only used Material UI components included
- **Type-safe styling** - TypeScript integration with theme

## Getting Started

### Prerequisites
- **Node.js 22** (recommended) or Node.js 18+
- npm 10+ or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd cat-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Get API Key (Optional but Recommended)**
   - Visit [The Cat API](https://thecatapi.com/signup)
   - Sign up for a free API key
   - Replace `YOUR_API_KEY_HERE` in `src/services/catApi.ts` with your actual API key
   - **Note**: The app works without an API key but may have rate limits

4. **Start the development server**
```bash
npm start
```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Start browsing cats! 🐱

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App (not recommended)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── CatCard.tsx      # Material UI cat card with sx props
│   ├── CatDetailModal.tsx # Modal with Material UI dialogs
│   ├── Modal.tsx        # Base Material UI modal component
│   ├── Navigation.tsx   # App bar with modern sx styling
│   └── StyledComponents.tsx # Theme + shared sx style objects
├── hooks/               # Custom React hooks
│   └── useCats.ts      # Hooks for cat data management
├── pages/               # Main page components
│   ├── RandomCatsPage.tsx # Modern Material UI Grid + sx props
│   ├── BreedsPage.tsx    # Material UI Cards with sx styling
│   └── FavoritesPage.tsx # Material UI components + sx props
├── services/            # API and data services
│   └── catApi.ts       # Cat API integration
├── types/               # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app with Material UI theme
├── index.tsx           # App entry point with fonts
└── index.css           # Minimal global styles
```

## Material UI v6+ Components Used

### 🎨 **Layout & Structure**
- **Container, Grid, Box** - Responsive layouts with sx props
- **Stack** - Flexible spacing and alignment
- **Paper** - Elevated surfaces

### 🧭 **Navigation**
- **AppBar, Toolbar** - Modern app header
- **Button** - Material Design buttons with variants
- **Typography** - Consistent text hierarchy

### 🎴 **Content Display**
- **Card, CardContent, CardMedia** - Beautiful content cards
- **Chip** - Tags and labels
- **Avatar, Badge** - User interface elements

### 💬 **Feedback & Communication**
- **CircularProgress, LinearProgress** - Loading indicators
- **Alert, Snackbar** - User notifications
- **Dialog, Modal** - Overlay content

### 🎛️ **Input Controls**
- **IconButton, Fab** - Action buttons
- **Switch, Checkbox** - Form controls

### 🎨 **Styling System**
- **sx prop** - Modern styling approach
- **useTheme()** - Theme access in components
- **styled()** - When sx prop isn't sufficient

## API Integration

This app uses [The Cat API](https://thecatapi.com/) which provides:

- Random cat images with breed information
- Comprehensive breed database
- High-quality cat photos
- Detailed breed characteristics

## Key Implementation Details

### Material UI Integration
- **Theme System**: Custom theme with cat-friendly colors and typography
- **Responsive Breakpoints**: Mobile-first design with Material UI grid
- **Component Library**: Leverages MUI's extensive component ecosystem
- **Accessibility**: Built-in ARIA labels and keyboard navigation

### URL Handling & Sharing
- Cat details are accessible via URL parameters (`?cat=IMAGE_ID`)
- Direct navigation to cat details works from any page
- URLs are shareable and bookmarkable

### State Management
- Custom hooks for data fetching and state management
- Local storage integration for favorites persistence
- Optimistic UI updates for smooth user experience

### Performance Optimizations
- Lazy loading for cat images
- Efficient re-renders with proper React patterns
- Material UI's built-in optimization features

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)  
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Notes

- **Node.js 22**: Utilizes the latest Node.js features and performance improvements
- **TypeScript**: Full type safety throughout the application
- **Material UI**: Professional design system with consistent UX patterns
- **Mobile-First**: Responsive design that works beautifully on all devices

## Future Enhancements

- Dark mode toggle using Material UI's theme switching
- Search functionality for breeds with Material UI Autocomplete
- Advanced filtering with Material UI form components
- User accounts with Material UI authentication components
- Progressive Web App features
- Cat comparison tool with Material UI data tables

## License

This project is created as part of the GlobalWebIndex Engineering Challenge.

---

**Happy cat browsing with Material UI! 🐱✨**

---

## Original Challenge Requirements

### Exercise: CatLover

Create a React application for cat lovers which is going to build upon thecatapi.com and will have 3 views.
The **first** view displays a list of 10 random cat images and a button to load more. Clicking on any of those images opens a modal view with the image and the information about the cat's breed if available. This would be a link to the second view below - the breed detail. The modal should also contain a form to mark the image as your favourite (a part of the third view as well). Make sure you can copy-paste the URL of the modal and send it to your friends - they should see the same image as you can see.

The **second** view displays a list of cat breeds. Each breed opens a modal again with a list of cat images of that breed. Each of those images must be a link to the image detail from the previous point.

The **third** view allows you do the following things:

- Display your favourite cats
- Remove an image from your favourites (use any UX option you like)

You can find the API documentation here: https://developers.thecatapi.com/
We give you a lot of freedom in technologies and ways of doing things. We only insist on you using React.js. Get creative as much as you want, we WILL appreciate it. You will not be evaluated based on how well you follow these instructions, but based on how sensible your solution will be. In case you are not able to implement something you would normally implement for time reasons, make it clear with a comment.

### Submission

Once you have built your app, share your code in the mean suits you best
Good luck, potential colleague!