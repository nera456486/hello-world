import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Создаем API для работы с постами
export const postsApi = createApi({
  // Уникальный ключ для редюсера в хранилище Redux
  reducerPath: 'postsApi',
  // Настраиваем базовый запрос (базовый URL для всех запросов)
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/' }),
  // Определяем конечные точки 
  endpoints: (builder) => ({
    // Создаем запрос для получения постов
    getPosts: builder.query({
      query: () => 'posts',
      transformResponse: (response) => response.posts // Извлекаем массив постов
    }),
  }),
})

export const { useGetPostsQuery } = postsApi
