import api from './api'

export default {
  /**
   * Obtiene todas las direcciones de un cliente
   * @param {number} customerId - ID del cliente
   */
  getAddresses(customerId) {
    return api.get(`/admin/customers/${customerId}/addresses`)
  },

  /**
   * Crea una nueva dirección para el cliente
   * @param {number} customerId - ID del cliente
   * @param {object} data - Datos de la dirección
   */
  createAddress(customerId, data) {
    return api.post(`/admin/customers/${customerId}/addresses`, data)
  },

  /**
   * Actualiza una dirección existente
   * @param {number} customerId - ID del cliente
   * @param {number} addressId - ID de la dirección
   * @param {object} data - Datos a actualizar
   */
  updateAddress(customerId, addressId, data) {
    return api.put(`/admin/customers/${customerId}/addresses/${addressId}`, data)
  },

  /**
   * Elimina una dirección
   * @param {number} customerId - ID del cliente
   * @param {number} addressId - ID de la dirección
   */
  deleteAddress(customerId, addressId) {
    return api.delete(`/admin/customers/${customerId}/addresses/${addressId}`)
  },

  /**
   * Marca una dirección como predeterminada
   * @param {number} customerId - ID del cliente
   * @param {number} addressId - ID de la dirección
   */
  setDefaultAddress(customerId, addressId) {
    return api.post(`/admin/customers/${customerId}/addresses/${addressId}/set-default`)
  }
}
