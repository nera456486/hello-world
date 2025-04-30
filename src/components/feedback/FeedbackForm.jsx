import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTheme } from '../../context/ThemeContext'; // Хук для доступа к текущей теме
export const FeedbackForm = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const { isDarkMode } = useTheme(); // Получаем текущую тему
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm();

  const onSubmit = useCallback((data) => {
     // Создаем новый отзыв с уникальным ID и текущей датой
    const newFeedback = {
      id: Date.now(),
      message: data.message,
      date: new Date().toLocaleString()
    };
    // Добавляем новый отзыв в список
    setFeedbacks(prev => [...prev, newFeedback]);
    reset();
  }, [reset]);

  // Стили, адаптирующиеся под тему
  const styles = {
    container: {
      backgroundColor: isDarkMode ? '#333' : '#fff',
      color: isDarkMode ? '#f0f0f0' : '#333',
      padding: '20px',
      borderRadius: '8px',
      margin: '20px 0'
    },
    textarea: {
      backgroundColor: isDarkMode ? '#444' : '#f9f9f9',
      color: isDarkMode ? '#fff' : '#333',
      border: `1px solid ${isDarkMode ? '#555' : '#ddd'}`,
      width: '100%',
      minHeight: '100px',
      padding: '10px',
      marginBottom: '10px'
    },
    error: {
      color: isDarkMode ? '#ff6b6b' : '#ff4444'
    },
    feedbackItem: {
      borderBottom: `1px solid ${isDarkMode ? '#555' : '#eee'}`,
      padding: '10px 0'
    }
  };

  // Рендер компонента
  return (
    <div style={styles.container}>
      {/* Форма для отправки отзывов */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Текстовое поле для ввода отзыва */}
        <textarea
          style={styles.textarea}
          {...register('message', { 
            required: 'Поле не может быть пустым',
            minLength: {
              value: 5,
              message: 'Минимум 5 символов'
            }
          })}
          placeholder="Ваш отзыв"
        />
        {errors.message && (
          <p style={styles.error}>{errors.message.message}</p>
        )}
        <button 
          type="submit"
          style={{
            padding: '8px 16px',
            background: isDarkMode ? '#646cff' : '#535bf2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Отправить
        </button>
      </form>

{/* Секция с отображением всех отзывов */}
      <div style={{ marginTop: '20px' }}>
        <h3>Отзывы ({feedbacks.length}):</h3>
        {/* Отображение списка отзывов */}
        {feedbacks.map((fb) => (
          <div key={fb.id} style={styles.feedbackItem}>
            <p>{fb.message}</p>
            <small style={{ color: isDarkMode ? '#aaa' : '#666' }}>{fb.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
};
