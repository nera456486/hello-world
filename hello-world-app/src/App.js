import React from 'react';
import PostsList from './components/PostsList'; // Компонент списка постов
import Button from './Button';
import './components/PostsList.css';

function App() {
  return (
    <div className="App">
      <Button 
        onClick={() => alert('Кнопка работает!')}
        style={{ margin: '20px auto', display: 'block' }}
      >
        Обновить данные
      </Button>
      <PostsList />
    </div>
  );
}

export default App;