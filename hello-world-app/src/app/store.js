// Импортируем функцию для создания хранилища Redux и наш API для постов
import { configureStore } from '@reduxjs/toolkit'
import { postsApi } from '../services/postsApi'

// Создаём и настраиваем хранилище Redux
export const store = configureStore({
  reducer: {
    // Добавляем редюсер для работы с API постов
  
    [postsApi.reducerPath]: postsApi.reducer,
  },
  // Настраиваем промежуточное ПО (middleware)
  middleware: (getDefaultMiddleware) =>
    // Берём стандартные middleware Redux Toolkit
    // и добавляем специальное middleware для работы API
    getDefaultMiddleware().concat(postsApi.middleware),
})