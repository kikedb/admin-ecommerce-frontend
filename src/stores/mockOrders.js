import { ref } from 'vue'

export const globalOrders = ref([
  { id: '5888', date: 'Hoy a las 7:35 p. m.', client: 'Sin cliente', canal: 'Point of Sale', total: '$12.990', paymentStatus: 'Pagado', fulfillmentStatus: 'Preparado', deliveryStatus: '', items: '1 artículo', deliveryMethod: 'En tienda', status: 'active' },
  { id: '5887', date: 'Hoy a las 7:34 p. m.', client: 'Sin cliente', canal: 'Point of Sale', total: '$20.990', paymentStatus: 'Pagado', fulfillmentStatus: 'Preparado', deliveryStatus: '', items: '1 artículo', deliveryMethod: 'En tienda', status: 'active' },
  { id: '5886', date: 'sábado a las 2:21 p. m.', client: 'Sin cliente', canal: 'Point of Sale', total: '$44.990', paymentStatus: 'Pagado', fulfillmentStatus: 'Preparado', deliveryStatus: '', items: '1 artículo', deliveryMethod: 'En tienda', status: 'active' },
  { id: '5885', date: 'jueves a las 7:51 p. m.', client: 'Sin cliente', canal: 'Point of Sale', total: '$22.490', paymentStatus: 'Pagado', fulfillmentStatus: 'Preparado', deliveryStatus: '', items: '1 artículo', deliveryMethod: 'En tienda', status: 'active' }
])
