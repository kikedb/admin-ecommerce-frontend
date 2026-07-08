import { ref } from 'vue'

export const locations = ref([
  { id: 'loc_1', name: 'Bodega Colina', type: 'warehouse' },
  { id: 'loc_2', name: 'VENTA VITACURA', type: 'store' },
  { id: 'loc_3', name: 'Falabella Marketplace', type: 'api' },
  { id: 'loc_4', name: 'Ripley Marketplace', type: 'api' },
  { id: 'loc_5', name: 'Walmart Marketplace', type: 'api' }
])

export const inventoryItems = ref([
  {
    id: 'inv_1',
    product: 'Balancín de oveja con asiento',
    sku: 'EAGC0107',
    image: 'https://via.placeholder.com/40',
    devoluciones: 1, // Métrica de devoluciones
    locations: [
      { locationId: 'loc_1', disponible: 15, comprometido: 2, enCamino: 0 },
      { locationId: 'loc_2', disponible: 3, comprometido: 0, enCamino: 0 },
      { locationId: 'loc_3', disponible: 5, comprometido: 1, enCamino: 0 }
    ]
  },
  {
    id: 'inv_2',
    product: 'Balancín unicornio con asiento',
    sku: 'EAGD0110',
    image: 'https://via.placeholder.com/40',
    devoluciones: 0,
    locations: [
      { locationId: 'loc_1', disponible: 8, comprometido: 0, enCamino: 0 },
      { locationId: 'loc_2', disponible: 2, comprometido: 0, enCamino: 0 }
    ]
  },
  {
    id: 'inv_3',
    product: 'Angel con flores',
    sku: 'BANW082',
    image: 'https://via.placeholder.com/40',
    devoluciones: 3,
    locations: [
      { locationId: 'loc_1', disponible: 40, comprometido: 5, enCamino: 0 },
      { locationId: 'loc_2', disponible: 6, comprometido: 0, enCamino: 0 },
      { locationId: 'loc_4', disponible: 10, comprometido: 2, enCamino: 0 }
    ]
  },
  {
    id: 'inv_4',
    product: 'Cierva Clarita Ballerina',
    sku: 'CHKP0004',
    image: 'https://via.placeholder.com/40',
    devoluciones: 0,
    locations: [
      { locationId: 'loc_1', disponible: 0, comprometido: 0, enCamino: 10 }
    ]
  },
  {
    id: 'inv_test_variants',
    product: 'Polera de prueba (Tiene variantes)',
    sku: 'TEST-VAR-001',
    image: 'https://via.placeholder.com/40',
    devoluciones: 0,
    locations: [
      { locationId: 'loc_1', disponible: 100, comprometido: 0, enCamino: 0 }
    ],
    options: [
      { name: 'Talla', values: ['S', 'M', 'L'] },
      { name: 'Color', values: ['Rojo', 'Azul', 'Negro'] }
    ]
  }
])

export const purchaseOrders = ref([
  {
    id: 'PO2',
    distributor: 'Bodega Colina',
    destination: 'VENTA VITACURA',
    status: 'Pedido',
    linkedTransfer: '#T0109',
    received: '58 de 58',
    total: '$0',
    expectedArrival: '11 may 2023',
    items: [
      { sku: 'EAGC0107', name: 'Balancín de oveja con asiento', quantity: 3, cost: '$0', total: '$0' },
      { sku: 'EAGD0110', name: 'Balancín unicornio con asiento', quantity: 2, cost: '$0', total: '$0' },
      { sku: 'BANW082', name: 'Angel con flores', quantity: 6, cost: '$0', total: '$0' },
      { sku: 'CHKP0004', name: 'Cierva Clarita Ballerina', quantity: 10, cost: '$0', total: '$0' }
    ],
    timeline: [
      { date: '12 de mayo de 2023', time: '6:25 p. m.', user: 'ANA MARIA ROJAS', action: 'ha editado esta orden de compra.' },
      { date: '17 de mayo de 2023', time: '4:45 p. m.', user: 'Sistema', action: 'Se ha marcado la orden de compra como solicitada.' },
      { date: '17 de mayo de 2023', time: '4:46 p. m.', user: 'ANA MARIA ROJAS', action: 'ha aceptado 58 productos.' },
      { date: '23 de mayo de 2023', time: '10:16 p. m.', user: 'Bulk Data Import', action: 'ha actualizado las transferencias vinculadas en esta orden de compra de inventario.' }
    ]
  },
  {
    id: 'TO002',
    distributor: 'Proveedor Externo',
    destination: 'VENTA VITACURA',
    status: 'Pedido',
    linkedTransfer: '#T0108',
    received: '5 de 5',
    total: '$0',
    expectedArrival: '15 jun 2023',
    items: [],
    timeline: []
  }
])

export const transfers = ref([
  {
    id: 'T0108',
    origin: 'Bodega Colina',
    destination: 'VENTA VITACURA',
    status: 'Completado',
    expectedArrival: '15 jun 2023',
    itemsCount: 5,
    receivedCount: 5,
    items: [
      { sku: 'EAGC0107', product: 'Balancín de oveja con asiento', transferQuantity: 5, received: 5, rejected: 0 }
    ]
  },
  {
    id: 'T0109',
    origin: 'Bodega Colina',
    destination: 'VENTA VITACURA',
    status: 'Transferido',
    expectedArrival: '11 may 2023',
    itemsCount: 58,
    receivedCount: 0,
    items: [
      { sku: 'BANW082', product: 'Angel con flores', transferQuantity: 40, received: 0, rejected: 0 },
      { sku: 'CHKP0004', product: 'Cierva Clarita Ballerina', transferQuantity: 18, received: 0, rejected: 0 }
    ]
  }
])
