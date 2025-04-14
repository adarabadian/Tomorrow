import React from 'react';
import { Box, Container, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import logo from '../../assets/logo.png';

const Footer: React.FC = () => {
  const theme = useTheme();
  
  return (
      <Box
          component="footer"
          sx={{
              py: 3,
              px: 2,
              mt: "auto",
              backgroundColor:
                  theme.palette.mode === "light"
                      ? "rgba(0, 0, 0, 0.03)"
                      : "rgba(255, 255, 255, 0.05)",
              borderTop: `1px solid ${theme.palette.divider}`,
          }}
      >
          <Container maxWidth="lg">
              <Box
                  sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: "center",
                  }}
              >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        component="img"
                        src={logo}
                        alt="Tomorrow Weather Logo"
                        sx={{ height: 32, mr: 2 }}
                      />
                      <Box>
                          <Typography
                              variant="body2"
                              color="text.secondary"
                          >
                              Weather Alert System - Adar Abadian Home Assignment
                          </Typography>
                          <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                          >
                              Powered by Tomorrow.io Weather API ☁
                          </Typography>
                      </Box>
                  </Box>

                  <Box sx={{ display: "flex", mt: { xs: 2, sm: 0 } }}>
                      <Tooltip title="LinkedIn">
                          <IconButton
                              size="small"
                              color="inherit"
                              sx={{ mx: 1 }}
                              aria-label="LinkedIn"
                              href="https://www.linkedin.com/in/adar-abadian/"
                              target="_blank"
                              component="a"
                          >
                              <LinkedInIcon fontSize="small" />
                          </IconButton>
                      </Tooltip>
                  </Box>
              </Box>
          </Container>
      </Box>
  );
};

export default Footer; 