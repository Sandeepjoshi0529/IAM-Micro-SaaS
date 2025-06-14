import React, { Suspense, useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Component imports
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute'; // ✅ NEW
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AutoLogout from './components/AutoLogout';

// Lazy-loaded pages
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const ChangePassword = React.lazy(() => import('./pages/ChangePassword'));
const Settings = React.lazy(() => import('./pages/Settings'));
const TwoFactorAuth = React.lazy(() => import('./pages/TwoFactorAuth'));

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(
    () => createTheme({ palette: { mode: darkMode ? 'dark' : 'light' } }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AutoLogout />
            <Sidebar />
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <ErrorBoundary>
              <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>}>
                <Routes>
                  {/* ✅ Public pages use PublicRoute to block access for already-logged-in users */}
                  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                  <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

                  {/* ✅ Auth-protected pages */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <ThemeProvider theme={theme}>
                          <Dashboard />
                        </ThemeProvider>
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/two-factor-auth" element={<ProtectedRoute><TwoFactorAuth /></ProtectedRoute>} />
                  
                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
