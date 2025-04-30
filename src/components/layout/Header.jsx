import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ onLogout, user }) => {
  const { themeButton, toggleTheme, isDarkMode } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: isDarkMode ? '#222' : '#f0f0f0',
      color: isDarkMode ? '#fff' : '#333',
      position: 'relative', 
    }}>
      <h1 style={{ margin: 0 }}>Лабораторные работы</h1>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* Кнопка профиля */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: isDarkMode ? '#fff' : '#333',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span>{user?.name || 'Профиль'}</span>
            <span>{isProfileOpen ? '▲' : '▼'}</span>
          </button>

          {/* Dropdown меню */}
          {isProfileOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              background: isDarkMode ? '#333' : '#fff',
              border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
              borderRadius: '4px',
              padding: '10px',
              minWidth: '200px',
              zIndex: 100,
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}>
              <div style={{ marginBottom: '10px' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{user?.name}</p>
                <p style={{ margin: 0, color: isDarkMode ? '#aaa' : '#666' }}>{user?.email}</p>
              </div>
              <button 
                onClick={onLogout}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Выйти
              </button>
            </div>
          )}
        </div>

        {/* Кнопка темы */}
        <button 
          onClick={toggleTheme}
          style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            background: isDarkMode ? '#535bf2' : '#646cff',
            color: 'white',
          }}
        >
          {themeButton}
        </button>
      </div>
    </header>
  );
};

export default Header;
