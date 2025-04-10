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
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import ForumIcon from '@mui/icons-material/Forum';

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
    children: [
      {
        segment: 'crear/whatsapp',
        title: 'Plantilla WhatsApp',
        icon: <WhatsAppIcon />,
      },
      {
        segment: 'crear/email',
        title: 'Plantilla Email',
        icon: <EmailIcon />,
      },
      {
        segment: 'crear/sms',
        title: 'Plantilla SMS',
        icon: <ForumIcon />,
      }
    ]
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

  // Función para aplicar el estilo de color a los iconos
  const applyIconStyles = (item) => {
    if (item.kind === 'divider' || item.kind === 'header') {
      return item;
    }

    const styledIcon = React.cloneElement(item.icon, {
      style: {
        color: isSelected(item.segment) ? theme.palette.primary.main : theme.palette.text.primary,
      },
    });

    const result = {
      ...item,
      icon: styledIcon,
    };

    // Si el elemento tiene hijos, aplicamos el estilo también a ellos
    if (item.children && Array.isArray(item.children)) {
      result.children = item.children.map(child => {
        return {
          ...child,
          icon: React.cloneElement(child.icon, {
            style: {
              color: isSelected(child.segment) ? theme.palette.primary.main : theme.palette.text.primary,
            },
          }),
        };
      });
    }

    return result;
  };

  return (
    <AppProvider
      navigation={NAVIGATION.map(applyIconStyles)}
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
        titleStyle: { color: theme.palette.primary.main }
      }}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}