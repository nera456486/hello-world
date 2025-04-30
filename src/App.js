import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Компоненты
import Header from './components/Header/Header';
import SideMenu from './components/SideMenu/SideMenu';
import Footer from './components/Footer/Footer';
import AuthModal from './components/AuthModal/AuthModal';

// Страницы
import HomePage from './pages/Home/Home';
import AboutPage from './pages/About/About';
import FeedbackPage from './pages/Feedback/Feedback';
import Lab1Page from './pages/Labs/Lab1.jsx';
import Lab2Page from './pages/Labs/Lab2.jsx';
import Lab3Page from './pages/Labs/Lab3.jsx';
import Lab4Page from './pages/Labs/Lab4.jsx';
import Lab5Page from './pages/Labs/Lab5.jsx';
import Lab6Page from './pages/Labs/Lab6.jsx';
import Lab7Page from './pages/Labs/Lab7.jsx';
import Lab8Page from './pages/Labs/Lab8.jsx';
import Lab9Page from './pages/Labs/Lab9.jsx';
import AdminPanel from './pages/Admin/AdminPanel';

// Вспомогательная функция для безопасной работы с localStorage
const safeStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === 'undefined') return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage:`, error);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }
};

// Компонент защищенного маршрута для администратора(Перенаправляет на главную страницу, если пользователь не администратор.)
const AdminRoute = ({ children, currentUser }) => {
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);// Тема (светлая/темная)
  const [menuOpen, setMenuOpen] = useState(false);// Открыто ли боковое меню
  const [authModalOpen, setAuthModalOpen] = useState(false);// Открыто ли модальное окно авторизации
  const [currentUser, setCurrentUser] = useState(null);// Текущий авторизованный пользователь

  useEffect(() => {
    // Инициализация хранилища
    safeStorage.remove('tempUserData');
    
    // Проверяем наличие администратора по умолчанию
    const users = safeStorage.get('users', []);
    const hasAdmin = users.some(user => user.role === 'admin');
    
    if (!hasAdmin) {
      const adminUser = {
        id: Date.now().toString(),
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      safeStorage.set('users', [...users, adminUser]);
    }

    // Загрузка текущего пользователя
    const user = safeStorage.get('currentUser');
    if (user) {
      // Проверяем актуальность данных пользователя
      const freshUser = users.find(u => u.id === user.id);
      if (freshUser) {
        setCurrentUser(freshUser);
      } else {
        safeStorage.remove('currentUser');
      }
    }
  }, []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h5: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  }), [darkMode]);
  // Обрабатывает успешный вход пользователя
  // Проверяет, не заблокирован ли аккаунт
  // Сохраняет пользователя в состоянии и localStorage

  const handleLoginSuccess = (user) => {
    if (!user || typeof user !== 'object') {
      console.error('Invalid user data received:', user);
      return;
    }

    // Получаем свежие данные пользователя
    const freshUsers = safeStorage.get('users', []);
    const freshUser = freshUsers.find(u => 
      u.id === user.id || 
      (u.email.toLowerCase() === user.email.toLowerCase() && u.password === user.password)
    );
    
    if (!freshUser) {
      console.error('Пользователь не найден');
      return;
    }

    if (freshUser.status === 'blocked') {
      alert('Этот аккаунт заблокирован');
      return;
    }

    // Добавляем роль по умолчанию если её нет
    const userWithRole = {
      ...freshUser,
      role: freshUser.role || 'user'
    };
    
    if (safeStorage.set('currentUser', userWithRole)) {
      setCurrentUser(userWithRole);
      setAuthModalOpen(false);
    } else {
      console.error('Ошибка сохранения данных пользователя');
    }
  };
  
  const handleLogout = () => {// Выход пользователя - очистка данных
    safeStorage.remove('currentUser');
    setCurrentUser(null);
    window.location.href = '/';
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header 
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setMenuOpen={setMenuOpen}
              currentUser={currentUser}
              onLoginClick={() => setAuthModalOpen(true)}
              onLogoutClick={handleLogout}
            />
            
            <SideMenu 
              open={menuOpen} 
              setOpen={setMenuOpen}
              currentUser={currentUser}
            />
            
            <Box component="main" sx={{ flexGrow: 1, p: 3, pb: 10 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route 
                  path="/feedback" 
                  element={
                    currentUser ? (
                      <FeedbackPage />
                    ) : (
                      <Navigate to="/" state={{ from: '/feedback' }} />
                    )
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute currentUser={currentUser}>
                      <AdminPanel />
                    </AdminRoute>
                  } 
                />
                <Route path="/lab1" element={<Lab1Page />} />
                <Route path="/lab2" element={<Lab2Page />} />
                <Route path="/lab3" element={<Lab3Page />} />
                <Route path="/lab4" element={<Lab4Page />} />
                <Route path="/lab5" element={<Lab5Page />} />
                <Route path="/lab6" element={<Lab6Page />} />
                <Route path="/lab7" element={<Lab7Page />} />
                <Route path="/lab8" element={<Lab8Page />} />
                <Route path="/lab9" element={<Lab9Page />} />
              </Routes>
            </Box>
            
            <Footer 
              currentUser={currentUser}
              onLoginClick={() => setAuthModalOpen(true)}
            />
          </Box>
      
          <AuthModal
            open={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </Router>
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;