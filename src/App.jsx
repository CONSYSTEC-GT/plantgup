// App.jsx
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
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
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp < currentTime) {
              console.error('Token expirado');
              localStorage.removeItem('authToken');
              setIsLoading(false);
              navigate('/login-required');
              return;
            }
            
            localStorage.setItem('authToken', token);
            const { app_id, auth_code, app_name } = decoded;
            window.history.replaceState({}, document.title, window.location.pathname);
            
          } catch (error) {
            console.error('Token inválido', error);
            localStorage.removeItem('authToken');
            navigate('/login-required');
          }
        }
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