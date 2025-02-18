import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Box } from '@mui/material';
import AppRoutes from './routes';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './utils/LoadingSpinner';
import LoginRequired from './pages/LoginRequired';

function App() {
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#00C3FF',
    secondaryColor: '#DBDBDB',
    fontFamily: 'Helvetica',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');

        if (!storedToken) {
          console.error('⚠️ No hay token almacenado');
          setTokenValid(false);
          return;
        }

        const decoded = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          console.error('⚠️ Token expirado');
          localStorage.removeItem('authToken');
          setTokenValid(false);
          return;
        }

        console.log('✅ Token válido');
        setTokenValid(true);
      } catch (error) {
        console.error('⚠️ Token inválido:', error);
        localStorage.removeItem('authToken');
        setTokenValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

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
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <AppRoutes />
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
