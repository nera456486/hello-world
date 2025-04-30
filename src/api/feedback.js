// Функция для отправки отзыва на сервер
export const submitFeedback = async (feedbackData) => {
    try {
      // Создаем контроллер для возможности отмены запроса
      const controller = new AbortController();
      // Устанавливаем таймаут 5 секунд - если запрос длится дольше, он отменится
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Таймаут 5 секунд

      // Отправляем POST-запрос на сервер
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',// Указываем, что отправляем JSON
        },
        body: JSON.stringify(feedbackData),// Данные отзыва преобразуем в JSON
        signal: controller.signal// Передаем сигнал для возможной отмены
      });
// Очищаем таймаут, так как запрос выполнился
      clearTimeout(timeoutId);
// Если сервер ответил с ошибкой (не 200-299 статус)
      if (!response.ok) {
        // Пробуем прочитать тело ошибки, если не получится - вернем null
        const errorData = await response.json().catch(() => null);
        // Выбрасываем ошибку с сообщением от сервера или стандартным текстом
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }
      // Если все хорошо - возвращаем ответ сервера в формате JSON
      return await response.json();
    } catch (error) {
      // Ловим любые ошибки (сетевые, от сервера, таймаут и др.)
      console.error('Error submitting feedback:', error);
      // Выбрасываем новую ошибку с оригинальным сообщением или стандартным текстом
      throw new Error(error.message || 'Failed to submit feedback');
    }
};