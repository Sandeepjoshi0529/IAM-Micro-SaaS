// src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CircularProgress 
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  // State to store the chart data and a loading indicator
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // A function that simulates fetching chart data (here with a 2-second delay).
  // It generates new random data for the chart.
  const fetchChartData = () => {
    setLoading(true);
    setTimeout(() => {
      const newData = {
        labels: ['2023-06-01', '2023-07-01', '2023-08-01', '2023-09-01'],
        datasets: [
          {
            label: 'User Activity',
            data: [
              Math.floor(Math.random() * 1000) + 500,
              Math.floor(Math.random() * 1000) + 500,
              Math.floor(Math.random() * 1000) + 500,
              Math.floor(Math.random() * 1000) + 500,
            ],
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            tension: 0.4,
          },
        ],
      };
      setChartData(newData);
      setLoading(false);
    }, 2000);
  };

  // Fetch the initial chart data when the component mounts
  useEffect(() => {
    fetchChartData();
  }, []);

  // Configure chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'User Activity Trends' },
    },
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
     
      <Grid container spacing={3}>
        {/* Metric Card: Total Users */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#1E88E5', color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">1,245</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Metric Card: Active Sessions */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#43A047', color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Active Sessions</Typography>
              <Typography variant="h4">342</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Metric Card: Pending Approvals */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#F4511E', color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Pending Approvals</Typography>
              <Typography variant="h4">76</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Chart Section */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 3, p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Activity Trends
              </Typography>
              {/* If loading or chartData is not yet set, show a spinner.
                  Otherwise, render the Line chart. */}
              {loading || !chartData ? (
                <CircularProgress />
              ) : (
                <Line data={chartData} options={options} />
              )}
              {/* Button to refresh chart data */}
              <Button 
                variant="contained" 
                sx={{ mt: 2 }} 
                onClick={fetchChartData}
              >
                Refresh Data
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
