/**
 * Превращает товар в список предложений по складам.
 * Цену берём со склада (поле price у товара по документации не использовать).
 */
export function toOffers(good, isOriginal = false) {
  const base = {
    goodsID: good.goodsID,
    brand: good.brand,
    number: good.number,
    name: good.name,
    rate: good.rate,
    isOriginal,
  };

  if (!good.warehouses?.length) {
    return [{ ...base, key: `${good.goodsID}-none`, warehouse: '—', price: null, stock: 0, shipmentDate: null }];
  }

  return good.warehouses.map((w, i) => ({
    ...base,
    key: `${good.goodsID}-${w.id}-${i}`,
    warehouse: w.code || 'Склад поставщика',
    own: w.own,
    price: w.price,
    stock: w.stock,
    shipmentDate: w.shipmentDate,
  }));
}

/** Уникальные производители из ответа этапа 1 */
export function uniqueBrands(goods) {
  const map = new Map();
  goods.forEach((g) => {
    if (!map.has(g.brand)) {
      map.set(g.brand, { brand: g.brand, name: g.name, count: g.count });
    } else {
      map.get(g.brand).count += g.count;
    }
  });
  return [...map.values()];
}

export const formatPrice = (value) =>
  value == null
    ? '—'
    : new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 }).format(value);

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
    : '—';
