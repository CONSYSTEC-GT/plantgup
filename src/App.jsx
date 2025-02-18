import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';
import AppRoutes from './routes';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner'; // Asegúrate de crear este componente

function App() {
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#00C3FF',
    secondaryColor: '#DBDBDB',
    fontFamily: 'Helvetica',
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula la validación del token
    const validateToken = async () => {
      // Aquí puedes agregar la lógica para validar el token
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula una validación de 1 segundo
      setIsLoading(false);
    };

    validateToken();
  }, []);

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

  if (isLoading) {
    return <LoadingSpinner />; // Muestra un spinner de carga mientras se valida el token
  }

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