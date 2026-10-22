import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchBrands, setNumber } from '../store/searchSlice';

const DEBOUNCE_MS = 500;

export default function SearchForm() {
  const dispatch = useDispatch();
  const number = useSelector((s) => s.search.number);
  const requestRef = useRef(null);

  // Поиск «по факту ввода»: с задержкой, предыдущий запрос отменяется
  useEffect(() => {
    const value = number.trim();
    if (!value) {
      requestRef.current?.abort();
      return undefined;
    }

    const timer = setTimeout(() => {
      requestRef.current?.abort();
      requestRef.current = dispatch(searchBrands(value));
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [number, dispatch]);

  useEffect(() => () => requestRef.current?.abort(), []);

  return (
    <form className="mb-4" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="part-number" className="form-label fw-semibold">
        Артикул детали
      </label>
      <input
        id="part-number"
        type="search"
        className="form-control form-control-lg"
        placeholder="Например: 01089 или 7160500039S"
        value={number}
        onChange={(e) => dispatch(setNumber(e.target.value))}
        autoFocus
        autoComplete="off"
      />
    </form>
  );
}
