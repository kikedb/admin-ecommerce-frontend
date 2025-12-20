import api from './api'

export default {
  /**
   * Obtiene todos los contactos de un cliente
   * @param {number} customerId - ID del cliente
   */
  getContacts(customerId) {
    return api.get(`/admin/customers/${customerId}/contacts`)
  },

  /**
   * Crea un nuevo contacto para el cliente
   * @param {number} customerId - ID del cliente
   * @param {object} data - Datos del contacto
   */
  createContact(customerId, data) {
    return api.post(`/admin/customers/${customerId}/contacts`, data)
  },

  /**
   * Actualiza un contacto existente
   * @param {number} customerId - ID del cliente
   * @param {number} contactId - ID del contacto
   * @param {object} data - Datos a actualizar
   */
  updateContact(customerId, contactId, data) {
    return api.put(`/admin/customers/${customerId}/contacts/${contactId}`, data)
  },

  /**
   * Elimina un contacto
   * @param {number} customerId - ID del cliente
   * @param {number} contactId - ID del contacto
   */
  deleteContact(customerId, contactId) {
    return api.delete(`/admin/customers/${customerId}/contacts/${contactId}`)
  },

  /**
   * Marca un contacto como principal
   * @param {number} customerId - ID del cliente
   * @param {number} contactId - ID del contacto
   */
  setPrimaryContact(customerId, contactId) {
    return api.post(`/admin/customers/${customerId}/contacts/${contactId}/set-primary`)
  }
}
