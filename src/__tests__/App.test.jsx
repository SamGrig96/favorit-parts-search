import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import searchReducer from '../store/searchSlice';
import { analoguesResponse, brandsResponse, notFoundResponse } from './fixtures';

const renderApp = () => {
  const store = configureStore({ reducer: { search: searchReducer } });
  render(<Provider store={store}><App /></Provider>);
};

const mockFetch = (handler) => {
  globalThis.fetch = vi.fn(async (url) => {
    const params = new URL(url).searchParams;
    const body = handler(params);
    if (body instanceof Error) throw body;
    return { ok: true, status: 200, json: async () => body };
  });
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Подбор автозапчастей', () => {
  it('этап 1 → этап 2: производители, затем аналоги с ценой и остатком', async () => {
    mockFetch((p) => (p.get('analogues') === 'on' ? analoguesResponse : brandsResponse));
    renderApp();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Артикул детали'), '7160500039S');
    expect(await screen.findByText('MEYLE')).toBeInTheDocument();
    expect(screen.getByText('OSSCA')).toBeInTheDocument();

    await user.click(screen.getByText('MEYLE'));
    const table = await screen.findByRole('table');

    const lastCall = new URL(fetch.mock.calls.at(-1)[0]).searchParams;
    expect(lastCall.get('brand')).toBe('MEYLE');
    expect(lastCall.get('number')).toBe('7160500039S');

    // искомая деталь первой, затем аналог
    const rows = within(table).getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('MEYLE');
    expect(rows.at(-1)).toHaveTextContent('NAKAYAMA');
    expect(rows.at(-1)).toHaveTextContent('6 шт.');
    expect(rows.at(-1)).toHaveTextContent(/812,4/);
    // без наличия — скрыт по умолчанию
    expect(within(table).queryByText('BSG')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Только в наличии'));
    expect(within(table).getByText('BSG')).toBeInTheDocument();
  });

  it('не дергает API на каждый символ (debounce)', async () => {
    mockFetch(() => brandsResponse);
    renderApp();
    await userEvent.setup().type(screen.getByLabelText('Артикул детали'), '01089');
    await screen.findByText('MEYLE');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('пустой ответ — «ничего не найдено»', async () => {
    mockFetch(() => notFoundResponse);
    renderApp();
    await userEvent.setup().type(screen.getByLabelText('Артикул детали'), '7260500039S');
    expect(await screen.findByText(/ничего не найдено/)).toBeInTheDocument();
  });

  it('ошибка API и сбой сети с повтором', async () => {
    let fail = true;
    mockFetch(() => (fail ? new TypeError('Failed to fetch') : brandsResponse));
    renderApp();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Артикул детали'), '01089');
    expect(await screen.findByText(/Не удалось связаться с сервером/)).toBeInTheDocument();

    fail = false;
    await user.click(screen.getByText('Повторить'));
    expect(await screen.findByText('MEYLE')).toBeInTheDocument();
  });

  it('показывает текст ошибки от API', async () => {
    mockFetch(() => ({ error: 'Invalid key client!' }));
    renderApp();
    await userEvent.setup().type(screen.getByLabelText('Артикул детали'), '01089');
    expect(await screen.findByText('Ошибка API: Invalid key client!')).toBeInTheDocument();
  });
});
