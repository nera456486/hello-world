import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Инициализация темы из localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        }
    }, []);

    // Применение темы
    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // Функция переключения
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Полный объект темы для использования
    const theme = {
        isDarkMode,
        toggleTheme,
        themeIcon: isDarkMode ? '🌞' : '🌙',
        
        themeButton: isDarkMode ? '🌞' : '🌙'
    };
 // Передаем данные темы через контекст
    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};