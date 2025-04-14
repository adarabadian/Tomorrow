import React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CloudIcon from '@mui/icons-material/Cloud';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications'; 
import WarningIcon from '@mui/icons-material/Warning';

// Map icon strings to actual components
const iconMap = {
  'HomeIcon': HomeIcon,
  'NotificationsIcon': NotificationsIcon,
  'WarningIcon': WarningIcon
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  navItems: Array<{
    name: string;
    path: string;
    icon: string;
  }>;
  isActive: (path: string) => boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, navItems, isActive }) => {
  // Drawer content
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={onClose}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <CloudIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold">
          Weather Alerts
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap];
          
          return (
            <ListItem 
              button 
              key={item.name} 
              component={RouterLink} 
              to={item.path}
              selected={isActive(item.path)}
              sx={{ 
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main'
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              <ListItemIcon>
                <IconComponent />
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar; 