import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { Box } from '@mui/material';
import AppRoutes from './routes';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './utils/LoadingSpinner';
import LoginRequired from './pages/LoginRequired';

function App() {
  const location = useLocation();

  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#00C3FF',
    secondaryColor: '#DBDBDB',
    fontFamily: 'Helvetica',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Primero verificamos si hay un token en la URL
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (token) {
          console.log("Guardando token en localStorage...");
          localStorage.setItem("token", token);
          // Remover el token de la URL para limpiar la barra de direcciones
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Luego verificamos si existe un token en localStorage
        const savedToken = localStorage.getItem("token");
        
        if (savedToken) {
          // Aquí deberías validar el token con tu backend
          // Por ahora solo simularemos que es válido
          setTokenValid(true);
        }
        
        // Completamos la carga independientemente del resultado
        setIsLoading(false);
      } catch (error) {
        console.error("Error al verificar el token:", error);
        setTokenValid(false);
        setIsLoading(false);
      }
    };

    checkToken();
  }, [location.search]); // Solo se ejecuta cuando cambia la búsqueda en la URL, no toda la location

  const theme = useMemo(() =>
    createTheme({
      palette: {
        primary: {
          main: themeSettings.primaryColor,
          contrastText: '#fff'
        },
        secondary: {
          main: themeSettings.secondaryColor,
        },
      },
      typography: {
        fontFamily: themeSettings.fontFamily,
      },
    }),
    [themeSettings]
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!tokenValid) {
    return <LoginRequired />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <AppRoutes />
      </Box>
    </ThemeProvider>
  );
}

export default App;