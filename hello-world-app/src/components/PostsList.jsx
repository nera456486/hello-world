// Импортируем React и специальный "хук" для получения постов
import React from 'react'
import { useGetPostsQuery } from '../services/postsApi'
import './PostsList.css';
import Spinner from './Spinner';
const PostsList = () => {
  // Получаем данные о постах и статусы загрузки
  const { data: posts, isLoading, isError, isFetching } = useGetPostsQuery()

  // Показываем спиннер, если данные грузятся в первый раз
  if (isLoading) {
    return <Spinner />;
  }
  
  // Показываем ошибку, если что-то пошло не так
  if (isError) {
    return <div className="error">Error loading posts</div>
  }

  // Если всё загрузилось успешно, показываем посты
  return (
    <div>
      {isFetching && <div className="fetching">Updating...</div>}
      <h1>Posts List</h1>
      <ul>
      {posts?.map((post) => (
          <li key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <div>Likes: {post.reactions.likes}</div>
            <div>Tags: {post.tags.join(', ')}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PostsList