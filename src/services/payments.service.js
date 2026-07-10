import api from './api'

export default {
  getProviders() {
    return api.get('/admin/payment-providers')
  },
  
  getProvider(id) {
    return api.get(`/admin/payment-providers/${id}`)
  },
  
  createProvider(data) {
    return api.post('/admin/payment-providers', data)
  },
  
  updateProvider(id, data) {
    return api.put(`/admin/payment-providers/${id}`, data)
  },
  
  deleteProvider(id) {
    return api.delete(`/admin/payment-providers/${id}`)
  }
}
