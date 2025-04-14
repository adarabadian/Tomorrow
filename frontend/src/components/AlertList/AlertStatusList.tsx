import React from 'react';
import {
  Paper,
  Typography,
  List,
  Card,
  CardContent,
  Box,
  Avatar
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { Alert } from '../../types/alert';
import { getParameterIcon, formatCondition, getParameterName, getParameterUnit } from '../../utils/alertUtils';

interface AlertStatusListProps {
  alerts: Alert[];
  title: string;
  icon?: React.ReactElement;
  borderColor?: string;
  backgroundColor?: string;
  emptyMessage?: string;
}

const AlertStatusList: React.FC<AlertStatusListProps> = ({
  alerts,
  title,
  icon = <WarningIcon />,
  borderColor = '#f44336',
  backgroundColor = 'rgba(244, 67, 54, 0.05)',
  emptyMessage = 'No alerts in this category'
}) => {
  if (alerts.length === 0) return null;

  return (
      <Paper
          elevation={3}
          sx={{ p: 2, mb: 3, borderLeft: `4px solid ${borderColor}` }}
      >
          <Typography
              variant="h6"
              sx={{
                  mb: 2,
                  color: borderColor,
                  display: "flex",
                  alignItems: "center",
              }}
          >
              {React.cloneElement(icon, { sx: { mr: 1 } })}
              {title} ({alerts.length})
          </Typography>

          <List>
              {alerts.map((alert: Alert) => (
                  <Card
                      key={alert.id || alert._id}
                      sx={{
                          mb: 2,
                          backgroundColor,
                      }}
                  >
                      <CardContent>
                          <Box
                              sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                              }}
                          >
                              <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                              >
                                  <Avatar
                                      sx={{
                                          bgcolor: borderColor,
                                          mr: 2,
                                      }}
                                  >
                                      {getParameterIcon(alert.parameter)}
                                  </Avatar>
                                  <Box>
                                      <Typography variant="h6">
                                          {alert.name}
                                      </Typography>
                                      <Typography
                                          variant="body2"
                                          color="text.secondary"
                                      >
                                          {getParameterName(alert.parameter)}{" "}
                                          {formatCondition(
                                              alert.parameter,
                                              alert.condition,
                                              alert.threshold
                                          )}
                                      </Typography>
                                      {alert.location && (
                                          <Typography
                                              variant="body2"
                                              color="text.secondary"
                                          >
                                              Location:{" "}
                                              {alert.resolvedLocation ||
                                                  (alert.location.city
                                                      ? alert.location.city
                                                      : alert.location
                                                            .coordinates
                                                      ? `${alert.location.coordinates.lat.toFixed(
                                                            2
                                                        )}, ${alert.location.coordinates.lon.toFixed(
                                                            2
                                                        )}`
                                                      : "Unknown")}
                                          </Typography>
                                      )}
                                      {alert.lastValue && (
                                          <>
                                              <Typography
                                                  variant="body2"
                                                  color="text.secondary"
                                              >
                                                  Current value:{" "}
                                                  {typeof alert.lastValue ===
                                                  "number"
                                                      ? alert.lastValue.toFixed(
                                                            2
                                                        )
                                                      : alert.lastValue}{" "}
                                                  {getParameterUnit(
                                                      alert.parameter
                                                  )}
                                              </Typography>
                                              <Typography
                                                  variant="body2"
                                                  color="text.secondary"
                                              >
                                                  Last checked:{" "}
                                                  {alert.lastChecked
                                                      ? new Date(
                                                            alert.lastChecked
                                                        ).toLocaleString()
                                                      : "Never"}
                                              </Typography>
                                          </>
                                      )}
                                  </Box>
                              </Box>
                          </Box>
                      </CardContent>
                  </Card>
              ))}
          </List>
      </Paper>
  );
};

export default AlertStatusList; 