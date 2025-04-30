import React from 'react';
import { Container, Typography, Card, CardContent, Avatar } from '@mui/material';

const Home = () => {
  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Card>
        <CardContent>
          <Avatar 
            alt="User Profile" 
            src="/path/to/image.jpg" 
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h4" component="h1">
            Welcome to the Home Page
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            This is the main page of the application.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;