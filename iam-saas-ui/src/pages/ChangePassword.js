// src/pages/ChangePassword.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
// Removed useNavigate import since it's not used:
// import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirmation do not match');
    } else if (newPassword.trim() === '') {
      setMessage('New password cannot be empty');
    } else {
      setMessage('Password changed successfully!');
      // Optionally, after a real change you could navigate elsewhere
      // e.g., navigate('/profile', { replace: true });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Change Password
      </Typography>
      {message && (
        <Typography
          variant="body1"
          sx={{ mt: 1, mb: 1 }}
          color={message.includes('successfully') ? 'green' : 'red'}
        >
          {message}
        </Typography>
      )}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          label="Old Password"
          type="password"
          fullWidth
          margin="normal"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Change Password
        </Button>
      </Box>
    </Container>
  );
}
