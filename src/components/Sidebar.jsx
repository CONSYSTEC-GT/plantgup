import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useTheme } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

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

// Definición original de la navegación
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

// Opciones del menú desplegable para Crear Plantillas
const CREATE_TEMPLATE_OPTIONS = [
  {
    title: 'Plantilla WhatsApp',
    icon: <WhatsAppIcon />,
    path: 'crear/whatsapp'
  },
  {
    title: 'Plantilla Email',
    icon: <EmailIcon />,
    path: 'crear/email'
  },
  {
    title: 'Plantilla SMS',
    icon: <ForumIcon />,
    path: 'crear/sms'
  }
];

const StyledMenuItem = styled('div')(({ theme, selected }) => ({
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
  cursor: 'pointer',
}));

export default function Sidebar(props) {
  const { window } = props;
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Estado para controlar el menú desplegable
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  // Determina si el menú está seleccionado basado en la ruta actual
  const isSelected = (segment) => {
    return location.pathname.includes(segment);
  };
  
  const handleMenuOpen = (event) => {
    // Evitar la navegación al hacer clic en el elemento Crear Plantillas
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  // Método personalizado para modificar el menú de navegación
  const customizeNavigation = () => {
    return NAVIGATION.map((item) => {
      if (item.kind === 'divider' || item.kind === 'header') {
        return item;
      }

      // Clonar el icono con el estilo adecuado
      const clonedIcon = React.cloneElement(item.icon, {
        style: {
          color: isSelected(item.segment) ? theme.palette.primary.main : theme.palette.text.primary,
        },
      });

      // Agregar un manejador especial para el botón Crear Plantillas
      if (item.segment === 'CreateTemplatePage') {
        return {
          ...item,
          icon: clonedIcon,
          onClick: handleMenuOpen
        };
      }

      return {
        ...item,
        icon: clonedIcon,
      };
    });
  };

  return (
    <AppProvider
      navigation={customizeNavigation()}
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
        {/* Menú desplegable para Crear Plantillas */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { width: 220 }
          }}
        >
          {CREATE_TEMPLATE_OPTIONS.map((option, index) => (
            <MenuItem 
              key={index} 
              onClick={() => handleMenuItemClick(option.path)}
            >
              <ListItemIcon>
                {option.icon}
              </ListItemIcon>
              <ListItemText primary={option.title} />
            </MenuItem>
          ))}
        </Menu>
        
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}