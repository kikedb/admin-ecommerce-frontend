import { ref, computed } from 'vue'

const notifications = ref([])
let notificationId = 0

export function useNotification() {
  /**
   * Añade una nueva notificación
   * @param {string} message - Mensaje de la notificación
   * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duración en ms (0 = manual)
   */
  function addNotification(message, type = 'info', duration = 4000) {
    const id = ++notificationId
    const notification = {
      id,
      message,
      type,
      duration,
      createdAt: Date.now()
    }

    notifications.value.push(notification)

    // Auto-remover después del tiempo especificado
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  function success(message, duration = 4000) {
    return addNotification(message, 'success', duration)
  }

  function error(message, duration = 5000) {
    return addNotification(message, 'error', duration)
  }

  function warning(message, duration = 4000) {
    return addNotification(message, 'warning', duration)
  }

  function info(message, duration = 4000) {
    return addNotification(message, 'info', duration)
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
  }

  return {
    notifications: computed(() => notifications.value),
    addNotification,
    success,
    error,
    warning,
    info,
    removeNotification,
    clearAll
  }
}
