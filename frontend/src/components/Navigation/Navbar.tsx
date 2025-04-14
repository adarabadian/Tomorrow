import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications'; 
import WarningIcon from '@mui/icons-material/Warning';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link } from '@mui/material';
import logo from '../../assets/logo.png';
import './Navbar.css';

// Map icon strings to actual components
const iconMap = {
  'HomeIcon': HomeIcon,
  'NotificationsIcon': NotificationsIcon,
  'WarningIcon': WarningIcon
};

interface NavbarProps {
  isMobile: boolean;
  toggleDrawer: () => void;
  navItems: Array<{
    name: string;
    path: string;
    icon: string;
  }>;
  isActive: (path: string) => boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isMobile, 
  toggleDrawer, 
  navItems,
  isActive 
}) => {
  return (
      <AppBar
          position="sticky"
          elevation={0}
          color="primary"
          sx={{
              borderBottom: (t) => `1px solid ${t.palette.divider}`,
              backgroundImage:
                  "linear-gradient(90deg, #1e88e5 0%, #42a5f5 100%)",
          }}
      >
          <Toolbar>
              {isMobile ? (
                  <>
                      <IconButton
                          aria-label="open drawer"
                          edge="start"
                          onClick={toggleDrawer}
                          className="navbar-menu-button"
                      >
                          <MenuIcon />
                      </IconButton>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            component="img"
                            src={logo}
                            alt="Tomorrow Weather Logo"
                            className="navbar-logo"
                            sx={{ height: 32 }}
                          />
                          <Typography variant="h6" fontWeight="bold">
                              Weather Alerts
                          </Typography>
                      </Box>
                  </>
              ) : (
                  <>
                      <Box
                          sx={{ display: "flex", alignItems: "center", mr: 4 }}
                      >
                          <Box
                            component="img"
                            src={logo}
                            alt="Tomorrow Weather Logo"
                            className="navbar-logo"
                          />
                          <Typography variant="h6" fontWeight="bold">
                              Weather Alert System
                          </Typography>
                      </Box>
                      <Box className="navbar-title">
                          {navItems.map((item) => {
                              const IconComponent =
                                  iconMap[item.icon as keyof typeof iconMap];

                              return (
                                  <Button
                                      key={item.name}
                                      component={RouterLink}
                                      to={item.path}
                                      color="inherit"
                                      sx={{
                                          mx: 1,
                                          fontWeight: isActive(item.path)
                                              ? "bold"
                                              : "normal",
                                          borderBottom: isActive(item.path)
                                              ? "3px solid white"
                                              : "none",
                                          borderRadius: 0,
                                          py: 2,
                                          "&:hover": {
                                              backgroundColor:
                                                  "rgba(255, 255, 255, 0.1)",
                                          },
                                      }}
                                      startIcon={<IconComponent />}
                                  >
                                      {item.name}
                                  </Button>
                              );
                          })}
                      </Box>

                      <Tooltip title="View source code">
                          <IconButton
                              color="inherit"
                              aria-label="github"
                              component={Link}
                              href="https://github.com/adarabadian/Tomorrow"
                              target="_blank"
                          >
                              <GitHubIcon />
                          </IconButton>
                      </Tooltip>
                  </>
              )}
          </Toolbar>
      </AppBar>
  );
};

export default Navbar; 