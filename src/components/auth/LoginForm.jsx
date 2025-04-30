import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// Схема валидации формы с помощью Yup
const schema = yup.object({
  email: yup.string()
    .email('Некорректный email')
    .required('Обязательное поле'),
  password: yup.string()
    .min(6, 'Минимум 6 символов')
    .required('Обязательное поле')
});
// Компонент формы входа
export const LoginForm = ({ onLogin }) => {
  // Использование хука useForm с настройками:
  const { 
    register, // Функция для регистрации полей формы
    handleSubmit, // Обработчик отправки формы
    formState: { errors, isSubmitting },// Состояние формы: ошибки и статус отправки
    setError // Функция для установки ошибок вручную
  } = useForm({
    resolver: yupResolver(schema) // Подключение Yup-валидации
  });
// Обработчик отправки формы
  const onSubmit = useCallback(async (data) => {
    try {
       // Вызов функции входа из пропсов
      await onLogin(data);
    } catch (error) {
      // Установка общей ошибки при неудачной попытке входа
      setError('root', {
        type: 'manual',
        message: 'Неверные учетные данные'
      });
    }
  }, [onLogin, setError]); // Зависимости для useCallback

 // Рендер формы
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Поле для ввода email */}
      <div>
        <input {...register('email')} placeholder="Email" type="email" />
        {/* Отображение ошибок валидации для email */}
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      {/* Поле для ввода пароля */}
      <div>
        <input type="password" {...register('password')} placeholder="Пароль" />
        {/* Отображение ошибок валидации для пароля */}
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      {/* Отображение общей ошибки формы*/}
      {errors.root && <p>{errors.root.message}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
};