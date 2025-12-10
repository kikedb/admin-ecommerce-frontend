import api from './api'

export default {
  /**
   * Obtiene lista de productos con paginación opcional
   * @param {number} page - Número de página (default: 1)
   * @param {number} limit - Items por página (default: 10)
   * @param {object} filters - Filtros opcionales {search, category, brand, priceMin, priceMax}
   */
  getProducts(page = 1, limit = 10, filters = {}) {
    return api.get('/admin/products', {
      params: {
        page,
        limit,
        ...filters
      }
    })
  },

  /**
   * Obtiene un producto por ID
   * @param {number} id - ID del producto
   */
  getProductById(id) {
    return api.get(`/admin/products/${id}`)
  },

  /**
   * Crea un nuevo producto
   * @param {object} data - Datos del producto
   */
  createProduct(data) {
    return api.post('/admin/products', data)
  },

  /**
   * Actualiza un producto existente
   * @param {number} id - ID del producto
   * @param {object} data - Datos a actualizar
   */
  updateProduct(id, data) {
    return api.put(`/admin/products/${id}`, data)
  },

  /**
   * Elimina un producto (soft delete)
   * @param {number} id - ID del producto
   */
  deleteProduct(id) {
    return api.delete(`/admin/products/${id}`)
  },

  /**
   * Deshabilita un producto
   * @param {number} id - ID del producto
   */
  disableProduct(id) {
    return api.post(`/admin/products/${id}/disable`)
  },

  /**
   * Elimina múltiples productos
   * @param {array} ids - Array de IDs a eliminar
   */
  deleteProducts(ids) {
    return api.post('/admin/products/bulk-delete', { ids })
  },

  /**
   * Obtiene categorías activas
   */
  getCategories() {
    return api.get('/admin/categories/active/all')
  },

  /**
   * Obtiene marcas activas
   */
  getBrands() {
    return api.get('/admin/brands/active/all')
  },

  /**
   * Obtiene series activas
   */
  getSeries() {
    return api.get('/admin/series/active/all')
  },

  /**
   * Obtiene colores activos
   */
  getColors() {
    return api.get('/admin/colors/active/all')
  },

  /**
   * Obtiene materiales activos
   */
  getMaterials() {
    return api.get('/admin/materials/active/all')
  },

  /**
   * Genera SKU automáticamente basado en códigos de atributos
   * @param {object} codes - Objeto con los códigos
   * @param {string} codes.category_code - Código de categoría
   * @param {string} codes.serie_code - Código de serie
   * @param {string} codes.material_code - Código de material
   * @param {string} codes.color_code - Código de color
   */
  generateSku(codes) {
    return api.post('/admin/products/sku', codes)
  }
}
