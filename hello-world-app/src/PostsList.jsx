import React from 'react';
import { useGetPostsQuery } from './postsApi';// Хук для получения постов
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';

const PostsList = () => {
  // Получаем данные и состояния загрузки из хука
  const { 
    data: posts, 
    isLoading, 
    isError, 
    isFetching,
    error 
  } = useGetPostsQuery();// Автоматически делает запрос при монтировании

  // Показываем спиннер при первой загрузке
  if (isLoading) {
    return <Spinner />;
  }

  // Показываем ошибку, если запрос не удался
  if (isError) {
    return <ErrorMessage error={error} />;
  }
// Основной рендер списка постов
  return (
    <div>
      <h1>Posts</h1>
      {isFetching && <Spinner small />}
      <ul>
         {/* Перебираем все посты и выводим их */}
        {posts?.map((post) => (
          <li key={post.id}>{/* Ключ для оптимизации рендеринга */}
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;