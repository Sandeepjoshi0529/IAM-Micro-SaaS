import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, 
  Button, CircularProgress 
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { fetchUsers } from '../services/api';

import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [chartData, setChartData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchChartData = () => {
    setLoading(true);
    setTimeout(() => {
      setChartData({
        labels: ['2023-06-01', '2023-07-01', '2023-08-01', '2023-09-01'],
        datasets: [{
          label: 'User Activity',
          data: Array(4).fill().map(() => Math.floor(Math.random() * 1000) + 500),
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          tension: 0.4,
        }],
      });
      setLoading(false);
    }, 2000);
  };

  const fetchUserData = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users: " + err.message);
    }
  };

  useEffect(() => {
    fetchChartData();
    fetchUserData();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#1E88E5', color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{users.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#43A047', color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Active Sessions</Typography>
              <Typography variant="h4">342</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#F4511E', color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Pending Approvals</Typography>
              <Typography variant="h4">76</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3, p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>User Activity Trends</Typography>
              {loading || !chartData ? (
                <CircularProgress />
              ) : (
                <Line data={chartData} options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'User Activity Trends' },
                  },
                }} />
              )}
              <Button variant="contained" sx={{ mt: 2 }} onClick={fetchChartData}>
                Refresh Data
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3, p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Registered Users</Typography>
              {error ? (
                <Typography color="error">{error}</Typography>
              ) : users.length ? (
                <ul>
                  {users.map((user) => (
                    <li key={user.id}>
                      {user.name} ({user.email})
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No users found.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
