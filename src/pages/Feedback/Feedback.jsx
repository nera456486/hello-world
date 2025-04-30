import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key}:`, error);
    return defaultValue;
  }
};

export default function FeedbackPage() {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const user = getFromStorage('currentUser');
    if (user && user.email) {
      setCurrentUser(user);
    }
    
    // Загружаем существующие отзывы при монтировании
    const loadedFeedbacks = getFromStorage('feedbacks', []);
    setFeedbacks(loadedFeedbacks);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!comment.trim()) {
      setError('Пожалуйста, введите ваш отзыв');
      return;
    }

    if (!currentUser?.email) {
      setError('Ошибка авторизации');
      return;
    }

    try {
      const newFeedback = {
        id: Date.now(),
        userId: currentUser.email,
        userName: currentUser.name || 'Аноним',
        comment: comment.trim(),
        date: new Date().toISOString()
      };

      const updatedFeedbacks = [...feedbacks, newFeedback];
      
      localStorage.setItem('feedbacks', JSON.stringify(updatedFeedbacks));
      setFeedbacks(updatedFeedbacks); // Обновляем состояние
      setComment('');
      setSuccess(true);
    } catch (err) {
      console.error('Error saving feedback:', err);
      setError('Произошла ошибка при сохранении отзыва');
    }
  };

  if (!currentUser) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Чтобы оставить отзыв, пожалуйста, авторизуйтесь
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Здравствуйте, {currentUser.name}!
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mt: 2, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Спасибо за ваш отзыв!</Alert>}

          <TextField
            label="Ваш отзыв"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 2 }}
          >
            Отправить отзыв
          </Button>
        </Box>
      </Paper>

      {/* Секция с отображением отзывов */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Ваши отзывы
      </Typography>
      
      {feedbacks.length > 0 ? (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {feedbacks
            .filter(fb => fb.userId === currentUser.email) // Показываем только отзывы текущего пользователя
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Сортируем по дате (новые сначала)
            .map((feedback) => (
              <React.Fragment key={feedback.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={feedback.userName}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          display="block"
                          sx={{ mb: 1 }}
                        >
                          {feedback.comment}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {new Date(feedback.date).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
        </List>
      ) : (
        <Typography variant="body1" color="text.secondary">
          У вас пока нет отправленных отзывов
        </Typography>
      )}
    </Container>
  );
}