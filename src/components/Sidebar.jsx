import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Outlet, useLocation } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useTheme } from '@mui/material/styles';

// Iconos
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreateIcon from '@mui/icons-material/Create';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckIcon from '@mui/icons-material/Check';
import SendIcon from '@mui/icons-material/Send';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const NAVIGATION = [
  {
    segment: 'Dashboard',
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

const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

const MenuItem = styled('div')(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  color: selected ? theme.palette.primary.main : theme.palette.text.primary,
  '& svg': {
    color: selected ? theme.palette.primary.main : theme.palette.text.primary,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function Sidebar(props) {
  const { window } = props;
  const theme = useTheme();
  const location = useLocation();

  // Determina si el menú está seleccionado basado en la ruta actual
  const isSelected = (segment) => {
    return location.pathname.includes(segment);
  };

  return (
    <AppProvider
      navigation={NAVIGATION.map((item) => {
        // Si el elemento no tiene un ícono o no es un elemento de menú, lo devolvemos sin modificar
        if (item.kind === 'divider' || item.kind === 'header') {
          return item;
        }

        // Clonamos el ícono y aplicamos estilos condicionales
        const clonedIcon = React.cloneElement(item.icon, {
          style: {
            color: isSelected(item.segment) ? theme.palette.primary.main : theme.palette.text.primary,
          },
        });

        // Creamos un nuevo objeto sin el ícono original
        const newItem = {
          ...item,
          title: (
            <MenuItem selected={isSelected(item.segment)}>
              {clonedIcon}
              <span style={{ marginLeft: theme.spacing(1) }}>{item.title}</span>
            </MenuItem>
          ),
        };

        // Eliminamos el ícono original para evitar que se renderice dos veces
        delete newItem.icon;

        return newItem;
      })}
      theme={theme}
      branding={{
        title: 'TalkMe',
        logo: (
          <img
            src="https://www.talkme.pro/wp-content/uploads/2019/07/logoidentity.png"
            alt="TalkMe Logo"
            style={{ width: 'auto', height: 'auto' }}
          />
        ),
        titleStyle: { color: theme.palette.primary.main },
      }}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}