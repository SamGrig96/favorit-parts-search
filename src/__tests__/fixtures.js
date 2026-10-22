// Реальные ответы API (сокращены)
export const brandsResponse = {
  goods: [
    { brand: 'MEYLE', count: 166, goodsID: '1FAFD8CA-F73E-11DC-A83E-000E0CE9B9AA', name: 'Рычаги задней подвески ( ком кт на 2 е стороны)', number: '7160500039/S', price: 23720.58, rate: 1,
      warehouses: [{ code: 'МСК РС', id: '9FBAEA6E', own: false, price: 23720.58, shipmentDate: '2026-10-23T14:30:00+03:00', stock: 3 }] },
    { brand: 'OSSCA', count: 0, goodsID: '84DF819C-9220-11E2-8716-0015179B1A7D', name: 'Стеклоподъемник задний левый', number: '7160500039S', price: 577.74, rate: 1, warehouses: [] },
  ],
};

export const analoguesResponse = {
  goods: [{
    brand: 'MEYLE', count: 166, goodsID: '1FAFD8CA-F73E-11DC-A83E-000E0CE9B9AA', name: 'Рычаги задней подвески ( ком кт на 2 е стороны)', number: '7160500039/S', price: 23720.58, rate: 1,
    warehouses: [
      { code: 'МСК РС', id: '076D9436', own: false, price: 23720.58, shipmentDate: '2026-10-24T13:30:00+03:00', stock: 30 },
      { code: 'ДМД', id: 'FE3BFF6B', own: true, price: 23006.11, shipmentDate: '2026-10-24T15:40:00+03:00', stock: 25 },
    ],
    analogues: [
      { brand: 'NAKAYAMA', count: 18, goodsID: '1675BFB4-0E31-456A-871B-939A4BEF6B12', name: 'Рычаг задний прямой Ford Focus, C-Max, Mazda-3, -5', number: 'Z4364', price: 901.82, rate: 1,
        warehouses: [{ code: 'МСК РС', id: 'DD44FDD1', own: false, price: 812.4, shipmentDate: '2026-10-24T13:20:00+03:00', stock: 6 }] },
      { brand: 'BSG', count: 0, goodsID: '4DF394FC-1F05-433C-BDB7-A7677576FB96', name: 'Рычаг задней подвески верхний поперечный', number: 'BSG30-310-033', price: 2188.51, rate: 1, warehouses: [] },
    ],
  }],
};

export const notFoundResponse = {
  goods: [{ brand: '', count: 0, goodsID: '00000000-0000-0000-0000-000000000000', name: '', number: '', price: 0, rate: 0, warehouses: [] }],
};
