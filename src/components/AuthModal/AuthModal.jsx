import React, { useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert
} from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

// Безопасная работа с localStorage (с обработкой ошибок)
const safeStorage = {
  get: (key, defaultValue = []) => {
    try {
      // Пытаемся получить данные из localStorage
      const item = localStorage.getItem(key);
      // Если получили - преобразуем из JSON, иначе возвращаем значение по умолчанию
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage error:', error);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },
  remove: (key) => {
    localStorage.removeItem(key);
  }
};

// Генерация ID 
const generateId = () => {
   // Создаем уникальный ID из текущего времени и случайных символов
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Компонент модального окна для авторизации и регистрации
export default function AuthModal({ open, onClose, onLoginSuccess }) {
  // Состояния для управления формой
  const [tabValue, setTabValue] = useState(0);// 0 - вход, 1 - регистрация
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');// По умолчанию роль 'user'
  const [error, setError] = useState('');// Для отображения ошибок
// Очистка формы
  const resetForm = () => {
    setEmail('');
    setName('');
    setPassword('');
    setRole('user');
    setError('');
  };
// Проверка валидности email
  const validateEmail = (email) => {
    // Проверяем email на соответствие шаблону (xxx@xxx.xxx)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    // Пароль должен быть не короче 6 символов
    return password.length >= 6;
  };
// Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();// Отменяем стандартное поведение формы
    setError('');// Очищаем предыдущие ошибки

    const users = safeStorage.get('users', []);// Получаем список пользователей
    const normalizedEmail = email.trim().toLowerCase();// Нормализуем email

    if (tabValue === 0) { // Если выбрана вкладка "Вход"
      // Ищем пользователя с таким email и паролем
      const user = users.find(u => 
        u.email.toLowerCase() === normalizedEmail && 
        u.password === password 
      );

      if (!user) {
        setError('Неверные email или пароль');
        return;
      }

      if (user.status === 'blocked') {
        setError('Пользователь заблокирован');
        return;
      }

      // Сохраняем данные пользователя
      if (safeStorage.set('currentUser', user)) {
        onLoginSuccess(user);// Уведомляем родительский компонент
        onClose();
        resetForm();
      } else {
        setError('Ошибка сохранения данных');
      }
    } else {  // Если выбрана вкладка "Регистрация"
      // Проверяем, что все поля заполнены
      if (!name || !email || !password) {
        setError('Все поля обязательны');
        return;
      }

      if (!validateEmail(email)) {
        setError('Введите корректный email');
        return;
      }

      if (!validatePassword(password)) {
        setError('Пароль должен содержать минимум 6 символов');
        return;
      }

      if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
        setError('Пользователь с таким email уже существует');
        return;
      }
// Создаем нового пользователя
      const newUser = {
        id: generateId(), 
        name: name.trim(),
        email: normalizedEmail,
        password, 
        role: role === 'admin' ? 'user' : role, // Запрещаем создавать админов через интерфейс
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Сохраняем нового пользователя
      const updatedUsers = [...users, newUser];
      if (safeStorage.set('users', updatedUsers) && safeStorage.set('currentUser', newUser)) {
        onLoginSuccess(newUser);
        onClose();
        resetForm();
      } else {
        setError('Ошибка сохранения данных');
      }
    }
  };
// Рендер компонента
  return (
    <Modal open={open} onClose={() => {
      onClose();
      resetForm();
    }}>
      <Box sx={modalStyle}>
      {/* Вкладки "Вход" и "Регистрация" */}
        <Tabs 
          value={tabValue} 
          onChange={(e, newVal) => {
            setTabValue(newVal);
            setError('');
          }} 
          centered
        >
          <Tab label="Вход" />
          <Tab label="Регистрация" />
        </Tabs>
{/* Отображение ошибок */}
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}
{/* Форма */}
        <Box component="form" onSubmit={handleSubmit}>
           {/* Поля, которые показываются только при регистрации */}
          {tabValue === 1 && (
            <>
              <TextField
                label="Имя"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                inputProps={{ maxLength: 50 }}
              />
              {/* Выбор роли (заблокирован, можно выбрать только 'user') */}
              <TextField
                select
                label="Роль"
                fullWidth
                margin="normal"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                SelectProps={{ native: true }}
                disabled // Отключаем выбор роли для обычной регистрации
              >
                <option value="user">Пользователь</option>
                {/* Админа можно создавать только через специальный интерфейс */}
              </TextField>
            </>
          )}
{/* Общие поля для входа и регистрации */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            inputProps={{ maxLength: 100 }}
          />

          <TextField
            label="Пароль"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            inputProps={{ minLength: 6, maxLength: 50 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={!email || (tabValue === 1 && !name) || !password}
          >
            {tabValue === 0 ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}