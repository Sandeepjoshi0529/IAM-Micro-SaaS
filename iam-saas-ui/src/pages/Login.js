import React, { useState } from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'user' && password === 'pass') {
      login({ username: 'user' });
      navigate('/dashboard', { replace: true });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Container sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: 400, p: 3, boxShadow: 5, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          {error && (
            <Typography variant="body1" align="center" color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 2 }}>
            <TextField label="Username" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              <a href="/forgot-password" style={{ textDecoration: 'none' }}>Forgot Password?</a> |{' '}
              <a href="/register" style={{ textDecoration: 'none' }}>Register</a>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
