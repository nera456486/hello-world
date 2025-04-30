import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Схема валидации формы с проверкой домена email
const schema = yup.object({
  name: yup.string()
    .required('Обязательное поле')
    .min(2, 'Минимум 2 символа'),
  email: yup.string()
    .email('Некорректный email')
    .required('Обязательное поле')
    .test('domain', 'Email должен принадлежать домену example.com', (value) => {
      return value?.endsWith('@example.com');
    }),
  password: yup.string()
    .min(6, 'Минимум 6 символов')
    .required('Обязательное поле')
});

// Компонент формы регистрации
export const RegisterForm = ({ onRegister }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset,
    setError 
  } = useForm({
    resolver: yupResolver(schema)
  });

  // Обработчик отправки формы
  const onSubmit = useCallback(async (data) => {
    try {
      const allowedDomains = ['example.com']; // Массив разрешённых доменов
      const emailDomain = data.email.split('@')[1];

      if (!allowedDomains.includes(emailDomain)) {
        setError('email', {
          type: 'manual',
          message: `Email должен принадлежать домену ${allowedDomains.join(', ')}`
        });
        return;
      }

      const success = await onRegister(data);
      if (success) {
        reset();
        alert('Регистрация успешна! Теперь вы можете войти.');
      } else {
        setError('email', {
          type: 'manual',
          message: 'Пользователь с таким email уже существует'
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Ошибка при регистрации'
      });
    }
  }, [onRegister, reset, setError]);

  // Рендер формы
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('name')} placeholder="Имя" />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <input {...register('email')} placeholder="Email" type="email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <input type="password" {...register('password')} placeholder="Пароль" />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      {errors.root && <p>{errors.root.message}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </form>
  );
};
