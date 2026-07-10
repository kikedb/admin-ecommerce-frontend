import api from './api'

export default {
  getLocations() {
    return api.get('/admin/store-locations')
  },

  getLocationById(id) {
    return api.get(`/admin/store-locations/${id}`)
  },

  createLocation(data) {
    return api.post('/admin/store-locations', data)
  },

  updateLocation(id, data) {
    return api.put(`/admin/store-locations/${id}`, data)
  },

  deleteLocation(id) {
    return api.delete(`/admin/store-locations/${id}`)
  }
}
