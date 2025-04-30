import React, { useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './store';
import { useTheme } from './context/ThemeContext';
import { useLoginState } from './hooks/useLoginState';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Menu from './components/layout/Menu';
import Content from './components/Content';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { FeedbackForm } from './components/feedback/FeedbackForm';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

const App = () => {
  const navigate = useNavigate(); // Для программной навигации
  const location = useLocation(); // Для получения текущего пути
  const [selectedLab, setSelectedLab] = useState(null); // Состояние для выбранной лабораторной работы
  // Redux: получаем массив чисел Фибоначчи и функцию dispatch
  const sequence = useSelector(state => state.counter.sequence);
  const dispatch = useDispatch();
  // Авторизация: получаем состояние и методы из кастомного хука
  const { isLoggedIn, userData, login, register, logout } = useLoginState();
  const { isDarkMode } = useTheme();

  // Обработчик входа пользователя. Обработка промиса при входе
  const handleLogin = async (credentials) => {
    try {
      await login(credentials); // Ждём разрешения промиса
      navigate('/');
    } catch (error) {
      alert(error); // Ловим ошибку, если промис был отклонён
    }
  };

  // Обработчик регистрации пользователя. Обработка промиса при регистрации
  const handleRegister = async (userData) => {
    try {
      await register(userData); // Ждём разрешения промиса
      alert('Регистрация успешна! Теперь вы можете войти.');
      navigate('/login');
    } catch (error) {
      alert(error); // Ловим ошибку
    }
  };

  // Обработчик выбора лабораторной работы
  const handleLabSelect = (labTitle) => {
    setSelectedLab(labTitle);
    navigate('/labs');
  };

  // Если пользователь не авторизован и пытается получить доступ к защищённым страницам
  if (!isLoggedIn && !['/login', '/register'].includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  // Если авторизованный пользователь пытается зайти на страницы входа/регистрации
  if (isLoggedIn && ['/login', '/register'].includes(location.pathname)) {
    return <Navigate to="/" replace />; // Перенаправляем на главную
  }

  // Рендер для неавторизованных пользователей (страницы входа/регистрации)
  if (!isLoggedIn) {
    return (
      <div style={{ 
        padding: '2rem',
        background: isDarkMode ? '#333' : '#fff',
        color: isDarkMode ? '#fff' : '#333',
        minHeight: '100vh'
      }}>
        {/* Условный рендеринг формы регистрации или входа */}
        {location.pathname === '/register' ? (
          <>
            <h2>Регистрация</h2>
            <RegisterForm onRegister={handleRegister} />
            <p style={{ marginTop: '1rem' }}>
              Уже зарегистрированы?{' '}
              <button 
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isDarkMode ? '#646cff' : '#535bf2',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Войти
              </button>
            </p>
          </>
        ) : (
          <>
            <h2>Авторизация</h2>
            <LoginForm onLogin={handleLogin} />
            <p style={{ marginTop: '1rem' }}>
              Нет аккаунта?{' '}
              <button 
                onClick={() => navigate('/register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isDarkMode ? '#646cff' : '#535bf2',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Зарегистрироваться
              </button>
            </p>
          </>
        )}
      </div>
    );
  }

  // Основной рендер для авторизованных пользователей
  return (
    <div style={{
      background: isDarkMode ? '#333' : '#fff',
      color: isDarkMode ? '#fff' : '#333',
      minHeight: '100vh'
    }}>
      <Header user={userData} onLogout={logout} />
      <div style={{ display: 'flex' }}>
        <Menu onSelectLab={handleLabSelect} />
        <div style={{ flex: 1 }}>
          {location.pathname === '/' && <Home />}
          {location.pathname === '/about' && <About />}
          {location.pathname === '/contact' && <Contact />}

          {location.pathname === '/labs' && (
            <>
              {selectedLab && <Content selectedLab={selectedLab} />}
              
              {/* Блок счетчика с кнопками управления */}
              <div style={{ padding: '20px' }}>
                <h3>Счетчик: {counter}</h3>
                <button onClick={() => dispatch(increment())}>+ Увеличить</button>
                <button onClick={() => dispatch(decrement())}>- Уменьшить</button>
              </div>


              <FeedbackForm />
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
