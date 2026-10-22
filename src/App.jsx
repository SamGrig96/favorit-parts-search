import BrandList from './components/BrandList';
import OffersTable from './components/OffersTable';
import SearchForm from './components/SearchForm';

export default function App() {
  return (
    <div className="container py-4 py-md-5" style={{ maxWidth: 1100 }}>
      <header className="mb-4">
        <h1 className="h3 mb-1">Подбор автозапчастей</h1>
        <p className="text-secondary mb-0">
          Введите артикул, выберите производителя — и получите аналоги с ценами и остатками.
        </p>
      </header>

      <SearchForm />
      <BrandList />
      <OffersTable />
    </div>
  );
}
