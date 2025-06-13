// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Switch } from '@mui/material';

export default function Navbar({ darkMode, setDarkMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav
      style={{
        padding: '1rem',
        background: darkMode ? '#333' : '#f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: darkMode ? 'white' : 'black',
      }}
    >
      <div style={{ fontWeight: 'bold' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          My App
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Switch checked={darkMode} onChange={toggleDarkMode} color="default" />
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>Welcome, {user.username}</span>
            <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginRight: '1rem' }}>
              Logout
            </Button>
            <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
          </>
        ) : (
          <>
            <Link style={{ marginRight: '1rem' }} to="/login">
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
