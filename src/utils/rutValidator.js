/**
 * Utilidades para validar y formatear RUT chileno
 */

/**
 * Limpia un RUT dejando solo números y K
 * @param {string} rut - RUT a limpiar
 * @returns {string} RUT limpio
 */
export function cleanRut(rut) {
  if (!rut) return ''
  return rut.toString().replace(/[^0-9kK]/g, '').toUpperCase()
}

/**
 * Formatea un RUT con puntos y guión (12.345.678-9)
 * @param {string} rut - RUT a formatear
 * @returns {string} RUT formateado
 */
export function formatRut(rut) {
  const cleaned = cleanRut(rut)
  
  if (cleaned.length < 2) return cleaned
  
  // Separar número y dígito verificador
  const numero = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)
  
  // Agregar puntos de miles
  const numeroFormateado = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  return `${numeroFormateado}-${dv}`
}

/**
 * Calcula el dígito verificador de un RUT
 * @param {string} numero - Número del RUT sin dígito verificador
 * @returns {string} Dígito verificador calculado
 */
function calcularDV(numero) {
  let suma = 0
  let multiplicador = 2
  
  // Recorrer el número de derecha a izquierda
  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplicador
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2
  }
  
  const resto = suma % 11
  const dv = 11 - resto
  
  // Casos especiales
  if (dv === 11) return '0'
  if (dv === 10) return 'K'
  
  return dv.toString()
}

/**
 * Valida si un RUT es válido
 * @param {string} rut - RUT a validar
 * @returns {boolean} true si el RUT es válido
 */
export function validateRut(rut) {
  if (!rut) return false
  
  const cleaned = cleanRut(rut)
  
  if (cleaned.length < 2) return false
  
  // Separar número y dígito verificador
  const numero = cleaned.slice(0, -1)
  const dv = cleaned.slice(-1)
  
  // Validar que el número sea numérico
  if (!/^\d+$/.test(numero)) return false
  
  // Calcular dígito verificador esperado
  const dvEsperado = calcularDV(numero)
  
  return dv === dvEsperado
}

/**
 * Obtiene el mensaje de error de validación
 * @param {string} rut - RUT a validar
 * @returns {string} Mensaje de error o cadena vacía si es válido
 */
export function getRutErrorMessage(rut) {
  if (!rut) return ''
  
  const cleaned = cleanRut(rut)
  
  if (cleaned.length < 2) {
    return 'RUT demasiado corto'
  }
  
  const numero = cleaned.slice(0, -1)
  
  if (!/^\d+$/.test(numero)) {
    return 'El RUT contiene caracteres inválidos'
  }
  
  if (!validateRut(rut)) {
    return 'El RUT ingresado no es válido'
  }
  
  return ''
}

/**
 * Formatea un RUT mientras el usuario escribe (para usar en @input)
 * @param {string} value - Valor actual del input
 * @returns {string} Valor formateado
 */
export function formatRutOnInput(value) {
  // Limpiar
  const cleaned = cleanRut(value)
  
  // Si está vacío o tiene menos de 2 caracteres, devolver sin formato
  if (cleaned.length < 2) return cleaned
  
  // Formatear
  return formatRut(cleaned)
}
