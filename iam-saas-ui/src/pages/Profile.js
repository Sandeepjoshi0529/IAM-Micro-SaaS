// src/pages/Profile.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user ? user.username : '');

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Updated username:", username);
    // In a real application, update the profile via an API call.
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1" gutterBottom>
        Manage your profile details below.
      </Typography>
      <Box component="form" onSubmit={handleUpdate} noValidate sx={{ mt: 2 }}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Update Profile
        </Button>
      </Box>
    </Container>
  );
}
