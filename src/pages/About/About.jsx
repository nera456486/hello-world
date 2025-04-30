import React from 'react';
import { Container, Typography, Card, CardContent } from '@mui/material';

const About = () => {
  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1">
            About Me
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Information about yourself goes here.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default About;