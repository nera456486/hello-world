import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Button, 
  Typography, 
  Switch,
  Box,
  Avatar,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as AboutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ 
  darkMode, 
  setDarkMode, 
  setMenuOpen, 
  currentUser, 
  onLoginClick, 
  onLogoutClick 
}) => {
  const location = useLocation();

  return (
    <AppBar position="sticky" elevation={1} sx={{ 
      bgcolor: 'background.paper',
      color: 'text.primary',
      py: 1
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Левая часть */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Button 
            component={Link} 
            to="/"
            startIcon={<HomeIcon />}
            sx={{ 
              mr: 2,
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
              color: location.pathname === '/' ? 'primary.main' : 'text.primary'
            }}
          >
            Главная
          </Button>
          
          <Button 
            component={Link} 
            to="/about"
            startIcon={<AboutIcon />}
            sx={{
              fontWeight: location.pathname === '/about' ? 'bold' : 'normal',
              color: location.pathname === '/about' ? 'primary.main' : 'text.primary'
            }}
          >
            О себе
          </Button>
        </Box>

        {/* Центральная часть */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            letterSpacing: 1,
            display: { xs: 'none', md: 'block' }
          }}
        >
          Web-Программирование
        </Typography>

        {/* Правая часть */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {currentUser ? (
            <>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent=" "
                color="success"
                variant="dot"
                sx={{ mr: 2 }}
              >
                <Avatar 
                  alt={currentUser.name} 
                  sx={{ 
                    width: 36, 
                    height: 36,
                    bgcolor: 'primary.main',
                    cursor: 'pointer'
                  }}
                >
                  {currentUser.name.charAt(0)}
                </Avatar>
              </Badge>
              <Button 
                variant="outlined" 
                onClick={onLogoutClick}
                size="small"
              >
                Выйти
              </Button>
            </>
          ) : (
            <Button 
              variant="contained" 
              onClick={onLoginClick}
              size="small"
              sx={{ ml: 2 }}
            >
              Войти
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;