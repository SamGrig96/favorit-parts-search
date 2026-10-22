import { useDispatch, useSelector } from 'react-redux';
import { searchBrands, searchOffers, selectBrand } from '../store/searchSlice';
import { Empty, ErrorAlert, Loader } from './StatusView';

export default function BrandList() {
  const dispatch = useDispatch();
  const { number, brands, selectedBrand } = useSelector((s) => s.search);
  const { items, status, error } = brands;

  if (!number.trim() || status === 'idle') return null;
  if (status === 'loading') return <Loader text="Ищем производителей…" />;
  if (status === 'failed') {
    return <ErrorAlert message={error} onRetry={() => dispatch(searchBrands(number.trim()))} />;
  }
  if (!items.length) return <Empty text={`По артикулу «${number.trim()}» ничего не найдено`} />;

  const handleSelect = (brand) => {
    dispatch(selectBrand(brand));
    dispatch(searchOffers({ number: number.trim(), brand }));
  };

  return (
    <section className="mb-4">
      <h2 className="h5 mb-3">
        Производители <span className="badge text-bg-secondary">{items.length}</span>
      </h2>
      <div className="list-group">
        {items.map((b) => (
          <button
            key={b.brand}
            type="button"
            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
              selectedBrand === b.brand ? 'active' : ''
            }`}
            onClick={() => handleSelect(b.brand)}
          >
            <span>
              <strong>{b.brand}</strong>
              <span className={selectedBrand === b.brand ? 'ms-2' : 'ms-2 text-secondary'}>{b.name}</span>
            </span>
            <span className={`badge rounded-pill ${b.count > 0 ? 'text-bg-success' : 'text-bg-light border'}`}>
              {b.count > 0 ? `${b.count} шт.` : 'нет в наличии'}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
