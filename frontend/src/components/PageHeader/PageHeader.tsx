import React, { ReactNode } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

interface PageHeaderProps {
  title: string;
  action?: {
    label: string;
    onClick: () => void;
    icon: ReactNode;
    loading?: boolean;
    disabled?: boolean;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, action }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 3
    }}>
      <Typography variant="h4">
        {title}
      </Typography>
      
      {action && (
        <Button 
          startIcon={action.loading ? <CircularProgress size={20} /> : action.icon}
          onClick={action.onClick}
          disabled={action.disabled || action.loading}
          variant="outlined"
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader; 