import React from 'react'
import { createRoot } from 'react-dom/client' 
import { Provider } from 'react-redux'
import App from './App'
import { store } from './app/store'

// Находим корневой элемент
const container = document.getElementById('root')
// Создаем корень
const root = createRoot(container)

// Рендерим приложение
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)