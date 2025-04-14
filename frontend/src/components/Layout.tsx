import React, { useState } from 'react';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Navigation/Navbar';
import Sidebar from './Navigation/Sidebar';
import Footer from './Navigation/Footer';
import { useLocation } from 'react-router-dom';

// Navigation items definition
export const navItems = [
  { name: 'Home', path: '/', icon: 'HomeIcon' },
  { name: 'Alerts', path: '/alerts', icon: 'NotificationsIcon' },
  { name: 'Current State', path: '/current-state', icon: 'WarningIcon' }
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Toggle drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar 
        isMobile={isMobile} 
        toggleDrawer={toggleDrawer} 
        navItems={navItems} 
        isActive={isActive} 
      />
      
      {/* Mobile drawer */}
      <Sidebar
        open={drawerOpen}
        onClose={toggleDrawer}
        navItems={navItems}
        isActive={isActive}
      />
      
      {/* Main content */}
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Layout; 