import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode'; // Nota: algunos paquetes usan la importación con llaves
import AppRoutes from './routes';
import LoadingSpinner from './utils/LoadingSpinner';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#00C3FF',
    secondaryColor: '#DBDBDB',
    fontFamily: 'Helvetica',
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        
        if (token) {
          try {
            // Decodificación del token
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp < currentTime) {
              console.error('Token expirado');
              localStorage.removeItem('authToken'); // Aseguramos consistencia
              setIsLoading(false);
              navigate('/login-required');
              return;
            }
            
            // El token es válido, lo guardamos con el nombre correcto para ProtectedRoute
            localStorage.setItem('authToken', token);
            
            // Extraemos información del token si es necesario
            const { app_id, auth_code, app_name } = decoded;
            
            // Limpiamos la URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
          } catch (error) {
            console.error('Token inválido', error);
            localStorage.removeItem('authToken');
            navigate('/login-required');
          }
        }
        
        // No redirigimos aquí, porque ProtectedRoute se encargará de la validación
        // en cada ruta protegida
      } catch (error) {
        console.error('Error al procesar el token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [location.search, navigate]);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppRoutes />
      </Box>
    </ThemeProvider>
  );
}

export default App;