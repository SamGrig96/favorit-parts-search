import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchOffers } from '../store/searchSlice';
import { formatDate, formatPrice } from '../utils/offers';
import { Empty, ErrorAlert, Loader } from './StatusView';

export default function OffersTable() {
  const dispatch = useDispatch();
  const { number, selectedBrand, offers } = useSelector((s) => s.search);
  const { items, status, error } = offers;
  const [inStockOnly, setInStockOnly] = useState(true);

  const visible = useMemo(() => {
    const list = inStockOnly ? items.filter((o) => o.stock > 0) : items;
    // Сначала искомая деталь, затем аналоги по возрастанию цены
    return [...list].sort(
      (a, b) => Number(b.isOriginal) - Number(a.isOriginal) || (a.price ?? Infinity) - (b.price ?? Infinity),
    );
  }, [items, inStockOnly]);

  if (!selectedBrand) return null;
  if (status === 'loading') return <Loader text="Загружаем аналоги и предложения…" />;
  if (status === 'failed') {
    return (
      <ErrorAlert
        message={error}
        onRetry={() => dispatch(searchOffers({ number: number.trim(), brand: selectedBrand }))}
      />
    );
  }
  if (status !== 'succeeded') return null;

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="h5 mb-0">
          Аналоги и предложения: {selectedBrand} {number.trim()}{' '}
          <span className="badge text-bg-secondary">{visible.length}</span>
        </h2>
        <div className="form-check form-switch">
          <input
            id="in-stock"
            className="form-check-input"
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="in-stock">
            Только в наличии
          </label>
        </div>
      </div>

      {!visible.length ? (
        <Empty text={inStockOnly && items.length ? 'Нет предложений в наличии' : 'Предложения не найдены'} />
      ) : (
        <div className="table-responsive border rounded">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Производитель</th>
                <th>Артикул</th>
                <th>Название</th>
                <th>Склад</th>
                <th className="text-end">Цена</th>
                <th className="text-end">Остаток</th>
                <th className="text-end">Отгрузка</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => (
                <tr key={o.key} className={o.isOriginal ? 'table-primary' : ''}>
                  <td className="fw-semibold text-nowrap">
                    {o.brand}
                    {o.isOriginal && <span className="badge text-bg-primary ms-2">искомая</span>}
                  </td>
                  <td className="text-nowrap">{o.number}</td>
                  <td>{o.name}</td>
                  <td className="text-nowrap">
                    {o.warehouse}
                    {o.own && <span className="badge text-bg-success ms-1">свой</span>}
                  </td>
                  <td className="text-end text-nowrap fw-semibold">{formatPrice(o.price)}</td>
                  <td className={`text-end ${o.stock > 0 ? '' : 'text-secondary'}`}>{o.stock} шт.</td>
                  <td className="text-end text-nowrap">{formatDate(o.shipmentDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
