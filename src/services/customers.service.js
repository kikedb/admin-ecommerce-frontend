import api from './api'

export default {
  /**
   * Obtiene lista de clientes con paginación y filtros
   * @param {number} page - Número de página
   * @param {object} filters - Filtros opcionales
   */
  getCustomers(page = 1, filters = {}) {
    return api.get('/admin/customers', {
      params: {
        page,
        per_page: filters.per_page || 15,
        ...filters
      }
    })
  },

  /**
   * Obtiene un cliente por ID
   * @param {number} id - ID del cliente
   */
  getCustomerById(id) {
    return api.get(`/admin/customers/${id}`)
  },

  /**
   * Crea un nuevo cliente
   * @param {object} data - Datos del cliente
   */
  createCustomer(data) {
    return api.post('/admin/customers', data)
  },

  /**
   * Actualiza un cliente existente
   * @param {number} id - ID del cliente
   * @param {object} data - Datos a actualizar
   */
  updateCustomer(id, data) {
    return api.put(`/admin/customers/${id}`, data)
  },

  /**
   * Elimina un cliente (soft delete)
   * @param {number} id - ID del cliente
   */
  deleteCustomer(id) {
    return api.delete(`/admin/customers/${id}`)
  },

  /**
   * Suspende un cliente
   * @param {number} id - ID del cliente
   */
  suspendCustomer(id) {
    return api.post(`/admin/customers/${id}/suspend`)
  },

  /**
   * Activa un cliente
   * @param {number} id - ID del cliente
   */
  activateCustomer(id) {
    return api.post(`/admin/customers/${id}/activate`)
  },

  /**
   * Obtiene estadísticas de un cliente
   * @param {number} id - ID del cliente
   */
  getCustomerStats(id) {
    return api.get(`/admin/customers/${id}/stats`)
  },

  /**
   * Obtiene estadísticas de segmentos
   */
  getSegments() {
    return api.get('/admin/customers/segments')
  },

  /**
   * Busca clientes
   * @param {string} term - Término de búsqueda
   */
  searchCustomers(term, page = 1) {
    return api.get('/admin/customers', {
      params: {
        search: term,
        page
      }
    })
  },

  /**
   * Exporta clientes a Excel
   * @returns {Promise<Blob>} Archivo Excel
   */
  exportCustomers() {
    return api.get('/admin/customers/export', {
      responseType: 'blob'
    })
  },

  /**
   * Importa clientes desde Excel/CSV
   * @param {File} file - Archivo Excel o CSV
   * @returns {Promise<object>} Resultado de la importación
   */
  importCustomers(file) {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/admin/customers/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * Obtiene la plantilla de importación
   * @returns {Promise<object>} Estructura de columnas y ejemplos
   */
  getImportTemplate() {
    return api.get('/admin/customers/template')
  }
}
