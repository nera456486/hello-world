import React from 'react';
import { 
  BottomNavigation, 
  BottomNavigationAction,
  Paper,
  Box
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  Email as ContactIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Обратная связь"
          icon={<FeedbackIcon />}
          onClick={() => navigate('/feedback')}
        />

        
      </BottomNavigation>
    </Paper>
  );
}