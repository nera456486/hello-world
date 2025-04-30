import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import UserTable from '../../components/UserTable/UserTable';
import FeedbackAdmin from '../../components/FeedbackAdmin';

const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);// Активная вкладка
  const [editOpen, setEditOpen] = useState(false);// Открытие диалога редактирования
  const [currentUser, setCurrentUser] = useState(null);// Текущий редактируемый пользователь
  const [users, setUsers] = useState([]);// Список пользователей
  const [feedback, setFeedback] = useState([]);// Список отзывов
  const [loading, setLoading] = useState(true);// Состояние загрузки
  const [error, setError] = useState(null);// Ошибки

  // Безопасное получение данных
  const getSafeData = (key, defaultValue = []) => {
    try {
      // Пробуем прочитать
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;// Преобразуем из строки
    } catch (error) {
      console.error(`Error parsing ${key}:`, error);
      return defaultValue;
    }
  };

  // Загрузка данных 
  const loadData = useCallback(() => {
    try {
      const storedUsers = getSafeData('users', []);
      const storedFeedback = getSafeData('feedbacks', []);
  
      // Нормализация данных пользователей с сохранением паролей
      const normalizedUsers = storedUsers.map(user => ({
        id: user.id || Date.now(),
        name: user.name || 'Без имени',
        email: user.email || 'нет@email.com',
        password: user.password || '',
        role: user.role || 'user',
        status: user.status || 'active'
      }));
  
      setUsers(normalizedUsers);
      
      // Нормализация отзывов
      const normalizedFeedback = storedFeedback.map(fb => {
        const user = storedUsers.find(u => u.email === fb.userId);
        return {
          ...fb,
          id: fb.id || Date.now(),
          email: user?.email || fb.userId || 'нет@email.com',
          userName: user?.name || 'Аноним',
          text: fb.text || fb.comment || 'Нет текста',
          date: fb.date || new Date().toISOString()
        };
      });
  
      setFeedback(normalizedFeedback);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Ошибка загрузки данных');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Сохранение данных
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('feedbacks', JSON.stringify(feedback));
      } catch (error) {
        console.error('Ошибка сохранения данных:', error);
      }
    }
  }, [users, feedback, loading]);

  // Обработчики действий
  const handleEdit = (user) => {
    // Сохраняем полные данные пользователя, включая пароль
    setCurrentUser({ ...user });
    setEditOpen(true);
  };

  const handleBlock = (id) => {
    const updatedUsers = users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' } 
        : user
    );
    setUsers(updatedUsers);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      const updatedUsers = users.filter(user => user.id !== id);
      setUsers(updatedUsers);
    }
  };

  const handleFeedbackDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      setFeedback(feedback.filter(item => item.id !== id));
    }
  };

  const handleSave = () => {
    if (!currentUser) return;
    
    // Сохраняем пароль из оригинального пользователя
    const originalUser = users.find(u => u.id === currentUser.id);
    const updatedUser = {
      ...currentUser,
      password: originalUser?.password || '' // Сохраняем существующий пароль
    };

    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? updatedUser : user
    );
    
    setUsers(updatedUsers);
    setEditOpen(false);
  };

  // Колонки таблицы пользователей
  const userColumns = [
    { 
      accessorKey: 'id',
      header: 'ID',
      size: 70
    },
    { 
      accessorKey: 'name', 
      header: 'Имя',
      cell: info => info.getValue()
    },
    { 
      accessorKey: 'email', 
      header: 'Email',
      cell: info => info.getValue()
    },
    { 
      accessorKey: 'role', 
      header: 'Роль',
      cell: info => (
        <span style={{ 
          fontWeight: 'bold', 
          color: info.getValue() === 'admin' ? '#1976d2' : 'inherit'
        }}>
          {info.getValue() === 'admin' ? 'Администратор' : 'Пользователь'}
        </span>
      )
    },
    { 
      accessorKey: 'status', 
      header: 'Статус',
      cell: info => (
        <span style={{ 
          color: info.getValue() === 'active' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {info.getValue() === 'active' ? 'Активен' : 'Заблокирован'}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Панель администратора
      </Typography>

      <Tabs 
        value={tabValue} 
        onChange={(e, newVal) => setTabValue(newVal)}
        sx={{ mb: 3 }}
      >
        <Tab label="ПОЛЬЗОВАТЕЛИ" />
        <Tab label="ОБРАТНАЯ СВЯЗЬ" />
      </Tabs>

      {tabValue === 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Управление пользователями
          </Typography>
          <UserTable 
            columns={userColumns} 
            data={users} 
            onEdit={handleEdit}
            onBlock={handleBlock}
            onDelete={handleDeleteUser}
          />
        </Paper>
      )}

      {tabValue === 1 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Управление обратной связью
          </Typography>
          <FeedbackAdmin 
            feedback={feedback} 
            onDelete={handleFeedbackDelete}
          />
        </Paper>
      )}

      {/* Диалог редактирования */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать пользователя</DialogTitle>
        <DialogContent>
          {currentUser && (
            <>
              <TextField
                margin="dense"
                label="Имя"
                fullWidth
                value={currentUser.name}
                onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                value={currentUser.email}
                onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                sx={{ mb: 2 }}
              />
              <TextField
                select
                label="Роль"
                fullWidth
                value={currentUser.role}
                onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;