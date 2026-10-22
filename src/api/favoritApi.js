const API_URL = import.meta.env.VITE_API_URL || 'https://api.favorit-parts.ru/hs/hsprice/';
// Демо-ключ из документации API. Для своего ключа создайте .env с VITE_API_KEY=...
const API_KEY = import.meta.env.VITE_API_KEY || '00000000-0000-0000-0000-000000000001';

const EMPTY_ID = '00000000-0000-0000-0000-000000000000';

/**
 * Базовый запрос к сервису «Проценка».
 * URLSearchParams сам экранирует спецсимволы (#, &, пробелы) в номере и бренде.
 */
async function request(params, signal) {
  const query = new URLSearchParams({ key: API_KEY, ...params });

  let response;
  try {
    response = await fetch(`${API_URL}?${query}`, { signal });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new Error('Не удалось связаться с сервером. Проверьте подключение к интернету.');
  }

  if (!response.ok) {
    throw new Error(`Сервер вернул ошибку ${response.status}`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Некорректный ответ сервера');
  }

  if (data.error) {
    throw new Error(`Ошибка API: ${data.error}`);
  }

  // Если деталь не найдена, API возвращает массив с одной «пустой» структурой
  return (data.goods || []).filter((g) => g.goodsID && g.goodsID !== EMPTY_ID);
}

/** Этап 1: все детали с данным артикулом (разные производители) */
export const fetchGoodsByNumber = (number, signal) => request({ number }, signal);

/** Этап 2: деталь конкретного производителя + её аналоги */
export const fetchAnalogues = (number, brand, signal) =>
  request({ number, brand, analogues: 'on' }, signal);
