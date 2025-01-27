import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Box } from '@mui/material';

import AppRoutes from './routes';
import Sidebar from './components/Sidebar';

function App() {
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#00C3FF',
    secondaryColor: '#DBDBDB',
    fontFamily: 'Helvetica',
  });

  const theme = useMemo(() => 
    createTheme({
      palette: {
        primary: {
          main: themeSettings.primaryColor,
          light: themeSettings.primaryColor, 
          dark: themeSettings.primaryColor,  
          contrastText: '#fff' 
        },
        secondary: {
          main: themeSettings.secondaryColor,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            containedPrimary: {
              backgroundColor: themeSettings.primaryColor,
              '&:hover': {
                backgroundColor: themeSettings.primaryColor,
              },
            },
          },
        },
      },
      typography: {
        fontFamily: themeSettings.fontFamily,
      },
    }),
    [themeSettings]
  );

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
          <AppRoutes />
        </Box>
      </ThemeProvider>
      </BrowserRouter>
    
  );
}

export default App;