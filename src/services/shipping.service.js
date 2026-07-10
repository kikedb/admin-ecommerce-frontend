import api from './api'

export default {
  // Zones
  getZones() {
    return api.get('/admin/shipping-zones')
  },
  
  getZoneById(id) {
    return api.get(`/admin/shipping-zones/${id}`)
  },
  
  createZone(data) {
    return api.post('/admin/shipping-zones', data)
  },
  
  updateZone(id, data) {
    return api.put(`/admin/shipping-zones/${id}`, data)
  },
  
  deleteZone(id) {
    return api.delete(`/admin/shipping-zones/${id}`)
  },

  // Rates
  createRate(data) {
    return api.post('/admin/shipping-rates', data)
  },
  
  updateRate(id, data) {
    return api.put(`/admin/shipping-rates/${id}`, data)
  },
  
  deleteRate(id) {
    return api.delete(`/admin/shipping-rates/${id}`)
  }
}
