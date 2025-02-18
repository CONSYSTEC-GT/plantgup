import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';


//iconos
import TemplateList from '../pages/TemplateList';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import CreateIcon from '@mui/icons-material/Create';
import CheckIcon from '@mui/icons-material/Check';
import SendIcon from '@mui/icons-material/Send';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';


const NAVIGATION = [
  {
    segment: 'TemplateList',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'CreateTemplatePage',
    title: 'Crear Plantillas',
    icon: <CreateIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Plantillas',
  },
  {
    segment: 'plantillas/todas',
    title: 'Todas',
    icon: <DescriptionIcon />,
  },
  {
    segment: 'plantillas/aprovadas',
    title: 'Aprovadas',
    icon: <CheckIcon />,
  },
  {
    segment: 'plantillas/enviadas',
    title: 'Enviadas',
    icon: <SendIcon />,
  },
  {
    segment: 'plantillas/fallidas',
    title: 'Fallidas',
    icon: <SmsFailedIcon />,
  },
  {
    segment: 'plantillas/rechazadas',
    title: 'Rechazadas',
    icon: <ThumbDownIcon />,
  },
];

const demoTheme = extendTheme({
  primaryColor: '#00C3FF',
  secondaryColor: '#DBDBDB',
  fontFamily: 'Helvetica',
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function Sidebar(props) {
  const { window } = props;

  return (
    <AppProvider navigation={NAVIGATION} theme={demoTheme}  branding={{ title: 'TalkMe', logo: (
      <img
        src="https://www.talkme.pro/wp-content/uploads/2019/07/logoidentity.png" // Aquí coloca la URL del logo en la nube
        alt="TalkMe Logo"
        style={{ width: 'auto', height: 'auto' }}
      />
    ),
  }}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}
