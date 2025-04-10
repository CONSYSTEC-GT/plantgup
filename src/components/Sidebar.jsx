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
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Iconos
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreateIcon from '@mui/icons-material/Create';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckIcon from '@mui/icons-material/Check';
import SendIcon from '@mui/icons-material/Send';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import TemplateIcon from '@mui/icons-material/Description';
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
    hasDropdown: true,
    dropdownItems: [
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

const DropdownButton = styled(Button)(({ theme }) => ({
  textAlign: 'left',
  justifyContent: 'flex-start',
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  width: '100%',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function Sidebar(props) {
  const { window } = props;
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Estado para controlar el menú desplegable
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeItem, setActiveItem] = React.useState(null);
  
  // Determina si el menú está seleccionado basado en la ruta actual
  const isSelected = (segment) => {
    return location.pathname.includes(segment);
  };
  
  // Funciones para manejar el menú desplegable
  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setActiveItem(item);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };
  
  // Componente personalizado para los elementos de navegación
  const NavigationItem = ({ item }) => {
    if (item.hasDropdown) {
      return (
        <DropdownButton
          startIcon={React.cloneElement(item.icon, {
            style: {
              color: isSelected(item.segment) ? theme.palette.primary.main : theme.palette.text.primary,
            },
          })}
          endIcon={<ExpandMoreIcon />}
          onClick={(e) => handleMenuOpen(e, item)}
          color={isSelected(item.segment) ? "primary" : "inherit"}
        >
          {item.title}
        </DropdownButton>
      );
    }
    
    return (
      <StyledMenuItem
        selected={isSelected(item.segment)}
        onClick={() => navigate(`/${item.segment}`)}
      >
        {React.cloneElement(item.icon, {
          style: {
            marginRight: theme.spacing(1),
            color: isSelected(item.segment) ? theme.palette.primary.main : theme.palette.text.primary,
          },
        })}
        {item.title}
      </StyledMenuItem>
    );
  };

  const renderNavigationItems = () => {
    return NAVIGATION.map((item, index) => {
      if (item.kind === 'divider') {
        return <hr key={`divider-${index}`} style={{ margin: theme.spacing(1, 0) }} />;
      }
      
      if (item.kind === 'header') {
        return (
          <div key={`header-${index}`} style={{ padding: theme.spacing(1, 2), opacity: 0.7 }}>
            {item.title}
          </div>
        );
      }
      
      return <NavigationItem key={item.segment} item={item} />;
    });
  };

  return (
    <AppProvider
      navigation={NAVIGATION.filter(item => !item.hasDropdown || item.kind).map((item) => {
        if (item.kind === 'divider' || item.kind === 'header') {
          return item;
        }

        return {
          ...item,
          icon: React.cloneElement(item.icon, {
            style: {
              color: isSelected(item.segment) ? theme.palette.primary.main : theme.palette.text.primary,
            },
          }),
        };
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
        titleStyle: { color: theme.palette.primary.main }
      }}
    >
      <DashboardLayout>
        {/* Menú desplegable */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {activeItem?.dropdownItems?.map((dropdownItem, index) => (
            <MenuItem 
              key={index} 
              onClick={() => handleMenuItemClick(dropdownItem.path)}
            >
              <ListItemIcon>
                {dropdownItem.icon}
              </ListItemIcon>
              <ListItemText primary={dropdownItem.title} />
            </MenuItem>
          ))}
        </Menu>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
}