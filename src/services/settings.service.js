import api from './api'

export default {
  /**
   * Get all settings
   */
  getSettings() {
    return api.get('/admin/settings')
  },

  /**
   * Update settings
   * @param {Array} settings Array of setting objects: { key, value, type, group }
   */
  updateSettings(settings) {
    return api.post('/admin/settings', { settings })
  }
}
