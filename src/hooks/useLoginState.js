import { useState, useEffect, useCallback } from 'react';
// Кастомный хук для управления состоянием авторизации
export const useLoginState = () => {
    // Состояние хранит:
  // - статус входа (isLoggedIn)
  // - данные текущего пользователя (userData)
  // - список всех зарегистрированных пользователей (users)
  const [state, setState] = useState({
    isLoggedIn: false, // Флаг авторизации
    userData: null, // Данные текущего пользователя
    users: [] // Храним зарегистрированных пользователей
  });

// Эффект для загрузки данных при монтировании компонента
  useEffect(() => {
    const storedData = localStorage.getItem('authData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData) {
          // Восстанавливаем состояние из localStorage
          setState(prev => ({
            ...prev,
            ...parsedData
          }));
        }
      } catch (e) {
        console.error('Ошибка загрузки данных', e);
      }
    }
  }, []);

  // Эффект для сохранения данных при изменении состояния
  useEffect(() => {
    localStorage.setItem('authData', JSON.stringify({
      isLoggedIn: state.isLoggedIn,
      userData: state.userData,
      users: state.users
    }));
  }, [state]);
// Функция регистрации возвращает промис
  const register = useCallback((user) => {
    return new Promise((resolve, reject) => {
      setState(prev => {
        // Проверяем, есть ли уже пользователь с таким email
        const userExists = prev.users.some(u => u.email === user.email);
        if (userExists) {
          reject('Пользователь с таким email уже существует'); // Отклоняем промис при ошибке
          return prev;
        }
        // Создание нового пользователя с дополнительными полями
        const newUser = {
          ...user,
          id: Date.now(),
          registeredAt: new Date().toISOString()
        };
        
        resolve(true);
        return {
          ...prev,
          users: [...prev.users, newUser] // Добавляем нового пользователя
        };
      });
    });
  }, []);
  //Функция авторизации пользователя (возвращает промис)
  const login = useCallback(({ email, password }) => {
    return new Promise((resolve, reject) => {
      setState(prev => {
         // Поиск пользователя по email и паролю
        const user = prev.users.find(u => 
          u.email === email && u.password === password
        );
        
        if (!user) {
          reject('Неверные учетные данные');
          return prev;
        }
        
        resolve(user); // Возвращаем данные пользователя
        return {
          ...prev,
          isLoggedIn: true,// Устанавливаем флаг авторизации
          userData: user // Сохраняем данные пользователя
        };
      });
    });
  }, []);
//Функция выхода из системы. Сбрасывает isLoggedIn и userData
  const logout = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoggedIn: false,
      userData: null
    }));
  }, []);
// Возвращаемые значения хука
  return {
    isLoggedIn: state.isLoggedIn,// Текущий статус авторизации
    userData: state.userData,// Данные авторизованного пользователя
    register,
    login,
    logout
  };
};
