import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear JWT
    logout(); // Clear context
    navigate('/login', { replace: true });
  };

  return (
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  );
}
