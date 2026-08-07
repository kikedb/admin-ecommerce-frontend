import api from './api';

export const ordersService = {
  getOrders(params) {
    return api.get('/admin/orders', { params });
  },
  getOrder(id) {
    return api.get(`/admin/orders/${id}`);
  },
  createOrder(data) {
    return api.post('/admin/orders', data);
  },
  updateOrder(id, data) {
    return api.put(`/admin/orders/${id}`, data);
  },
  deleteOrder(id) {
    return api.delete(`/admin/orders/${id}`);
  }
};
