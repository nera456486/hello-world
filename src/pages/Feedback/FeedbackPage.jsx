import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';

// Улучшенная функция для работы с localStorage
const getLocalStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined') return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    localStorage.removeItem(key); // Удаляем поврежденные данные
    return defaultValue;
  }
};

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Загрузка отзывов при монтировании
  useEffect(() => {
    const savedFeedbacks = getLocalStorageItem('feedbacks', []);
    if (Array.isArray(savedFeedbacks)) {
      setFeedbacks(savedFeedbacks);
    } else {
      localStorage.setItem('feedbacks', JSON.stringify([]));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Валидация ввода
    if (!feedback.trim()) {
      setError('Пожалуйста, введите текст отзыва');
      return;
    }

    // Получаем пользователя с дополнительными проверками
    const currentUser = getLocalStorageItem('currentUser');
    console.log('Current user data:', currentUser); // Отладочная информация

    if (!currentUser || typeof currentUser !== 'object' || !currentUser.email) {
      setError('Необходимо авторизоваться');
      return;
    }

    try {
      // Получаем существующие отзывы с проверкой
      const existingFeedbacks = getLocalStorageItem('feedbacks', []);
      const updatedFeedbacks = Array.isArray(existingFeedbacks) ? existingFeedbacks : [];

      // Создаем новый отзыв
      const newFeedback = {
        id: Date.now(),
        userId: currentUser.email,
        userName: currentUser.name || 'Аноним',
        text: feedback.trim(),
        date: new Date().toISOString() // Используем ISO формат для даты
      };

      // Сохраняем обновленные отзывы
      const newFeedbacks = [...updatedFeedbacks, newFeedback];
      localStorage.setItem('feedbacks', JSON.stringify(newFeedbacks));
      
      // Обновляем состояние
      setFeedbacks(newFeedbacks);
      setFeedback('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Ошибка сохранения отзыва:', err);
      setError('Произошла ошибка при сохранении отзыва');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Оставить отзыв</Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Спасибо за ваш отзыв!</Alert>}
          
          <TextField
            label="Ваш отзыв"
            fullWidth
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Отправить
          </Button>
        </Box>
      </Paper>

      {feedbacks.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom>Все отзывы</Typography>
          <List>
            {feedbacks.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={item.userName || 'Анонимный пользователь'}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {item.text}
                        </Typography>
                        <br />
                        <Typography variant="caption">
                          {new Date(item.date).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </>
      )}
    </Container>
  );
}