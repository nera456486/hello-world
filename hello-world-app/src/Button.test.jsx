import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

// Группируем тесты для компонента Button
describe('Button component', () => {
  // Тест 1: Проверяем отображение текста на кнопке
  it('renders button with children', () => {
    // Рендерим кнопку с текстом "Click me"
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByTestId('button')).toHaveTextContent('Click me'); // Проверяем, что кнопка содержит этот текст
  });
    // Тест 2: Проверяем реакцию на клик
  it('calls onClick when clicked', () => {
    // Создаём "фальшивую" функцию для отслеживания вызовов
    const handleClick = jest.fn(); 
     // Рендерим кнопку с этой функцией
    render(<Button onClick={handleClick}>Click me</Button>);
    // Кликаем
    fireEvent.click(screen.getByTestId('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);// Проверяем, что функция вызвалась 1 раз
  });

  // Тест 3: Проверяем блокировку кнопки
  it('is disabled when disabled prop is true', () => {
    // Рендерим заблокированную кнопку
    render(<Button onClick={() => {}} disabled>Click me</Button>);
    expect(screen.getByTestId('button')).toBeDisabled();// Проверяем, что кнопка неактивна
  });
});
