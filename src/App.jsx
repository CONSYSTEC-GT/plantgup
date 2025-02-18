import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode'; // Importación correcta
import AppRoutes from './routes';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './utils/LoadingSpinner';
import LoginRequired from './pages/LoginRequired';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#00C3FF',
    secondaryColor: '#DBDBDB',
    fontFamily: 'Helvetica',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [appName, setAppName] = useState('');

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
              setTokenValid(false);
              setIsLoading(false);
              return;
            }
            
            // El token es válido, extraemos la información
            const { app_id, auth_code, app_name } = decoded;
            
            // Guardamos el token en localStorage
            localStorage.setItem('token', token);
            
            // Actualizamos estados
            setAppName(app_name || '');
            setTokenValid(true);
            
            // Llamada a la función para obtener templates (ajusta esto según tu lógica)
            if (app_id && auth_code) {
              fetchTemplates(app_id, auth_code);
            }
            
            // Limpiamos la URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
          } catch (error) {
            console.error('Token inválido', error);
            setTokenValid(false);
          }
        } else {
          // Intentamos recuperar el token del localStorage
          const storedToken = localStorage.getItem('token');
          
          if (storedToken) {
            try {
              const decoded = jwtDecode(storedToken);
              const currentTime = Date.now() / 1000;
              
              if (decoded.exp < currentTime) {
                console.error('Token almacenado expirado');
                localStorage.removeItem('token'); // Eliminamos el token expirado
                setTokenValid(false);
              } else {
                const { app_id, auth_code, app_name } = decoded;
                setAppName(app_name || '');
                setTokenValid(true);
                
                if (app_id && auth_code) {
                  fetchTemplates(app_id, auth_code);
                }
              }
            } catch (error) {
              console.error('Token almacenado inválido', error);
              localStorage.removeItem('token');
              setTokenValid(false);
            }
          } else {
            console.error('No se encontró token en la URL ni en localStorage');
            setTokenValid(false);
          }
        }
      } catch (error) {
        console.error('Error al procesar el token:', error);
        setTokenValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [location.search]);

  // Función placeholder para fetchTemplates - reemplázala con tu implementación real
  const fetchTemplates = async (appId, authCode) => {
    try {
      // Aquí iría tu lógica para obtener templates
      console.log('Obteniendo templates para:', appId, authCode);
      // Por ejemplo: 
      // const response = await api.getTemplates(appId, authCode);
      // setTemplates(response.data);
    } catch (error) {
      console.error('Error al obtener templates:', error);
    }
  };

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
        <Sidebar appName={appName} />
        <AppRoutes />
      </Box>
    </ThemeProvider>
  );
}

export default App;