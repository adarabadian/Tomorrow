import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import Alerts from './pages/Alerts';
import CurrentState from './pages/CurrentState';
import { AlertsProvider } from './contexts/AlertsContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertsProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/current-state" element={<CurrentState />} />
            </Routes>
          </Layout>
        </Router>
      </AlertsProvider>
    </ThemeProvider>
  );
}

export default App; 