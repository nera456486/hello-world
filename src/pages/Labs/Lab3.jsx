import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import labImage from '../../images/image3.jpg'; 
export default function Lab3Page() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Лабораторная работа №3
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" paragraph>
            Описание лабораторной работы:
          </Typography>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <img 
              src={labImage} 
              alt="Лабораторная работа 3"
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}