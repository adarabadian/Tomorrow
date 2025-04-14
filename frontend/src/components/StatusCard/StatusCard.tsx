import React, { ReactNode } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Badge,
  Box
} from '@mui/material';

interface StatusCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  badgeCount?: number;
  badgeColor?: 'error' | 'success' | 'primary' | 'secondary' | 'warning' | 'info';
  content?: ReactNode;
  iconColor?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  icon,
  value,
  label,
  badgeCount,
  badgeColor = 'error',
  content,
  iconColor
}) => {
  return (
    <Card elevation={3}>
      <CardContent sx={{ textAlign: 'center' }}>
        {badgeCount !== undefined ? (
          <Badge 
            badgeContent={badgeCount} 
            color={badgeColor}
            max={99}
            sx={{ '& .MuiBadge-badge': { fontSize: 18, height: 28, width: 28, borderRadius: 14 } }}
          >
            {React.cloneElement(icon as React.ReactElement, { 
              fontSize: "large", 
              color: badgeCount > 0 ? badgeColor : "disabled",
              sx: iconColor ? { color: iconColor } : undefined
            })}
          </Badge>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {React.cloneElement(icon as React.ReactElement, { 
              fontSize: "large",
              sx: iconColor ? { color: iconColor } : undefined
            })}
          </Box>
        )}
        
        <Typography variant="h5" sx={{ mt: 1 }}>
          {value}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        
        {content && (
          <Box sx={{ mt: 1 }}>
            {content}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard; 