import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import {
  Science as LabIcon,
  Close as CloseIcon,
  AdminPanelSettings as AdminPanelIcon 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const labs = [
  { id: 1, name: 'Лабораторная работа 1', path: '/lab1' },
  { id: 2, name: 'Лабораторная работа 2', path: '/lab2' },
  { id: 3, name: 'Лабораторная работа 3', path: '/lab3' },
  { id: 4, name: 'Лабораторная работа 4', path: '/lab4' },
  { id: 5, name: 'Лабораторная работа 5', path: '/lab5' },
  { id: 6, name: 'Лабораторная работа 6', path: '/lab6' },
  { id: 7, name: 'Лабораторная работа 7', path: '/lab7' },
  { id: 8, name: 'Лабораторная работа 8', path: '/lab8' },
  { id: 9, name: 'Лабораторная работа 9', path: '/lab9' },
];

export default function SideMenu({ open, setOpen, currentUser }) { // Добавляем currentUser в пропсы
  return (
    <Drawer 
      anchor="left" 
      open={open} 
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: 'background.paper'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" color="primary">
          Меню
        </Typography>
        <IconButton onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      <List>
        <ListItem>
          <ListItemText 
            primary="Лабораторные работы" 
            primaryTypographyProps={{ 
              variant: "subtitle1",
              fontWeight: "bold",
              color: "text.secondary"
            }}
          />
        </ListItem>
        
        {labs.map((lab) => (
          <ListItem 
            button 
            key={lab.id}
            component={Link}
            to={lab.path}
            onClick={() => setOpen(false)}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LabIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={lab.name} 
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
        ))}

        {currentUser?.role === 'admin' && (
          <ListItem 
            button 
            component={Link}
            to="/admin"
            onClick={() => setOpen(false)}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AdminPanelIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Админ-панель" 
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
}