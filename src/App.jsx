import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useState, useMemo } from 'react';
import { HashRouter } from 'react-router-dom';  // Solo importamos HashRouter
import ThemeCustomizer from './components/ThemeCustomizer';
import Dashboard from './components/Dashboard';
import AppTabs from './components/AppTabs'
import TemplateList from './components/TemplateList'
import AppRoutes from './routes';

function App() {
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#00C3FF',
    secondaryColor: '#DBDBDB',
    fontFamily: 'Roboto',
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
    <HashRouter>  {/* Solo usamos HashRouter */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ padding: '20px' }}>
          {/*<ThemeCustomizer settings={themeSettings} onSettingsChange={setThemeSettings} />*/}
          <AppTabs />
          <AppRoutes />
        </div>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;