export const useNumberFormat = () => {
  const formatNumber = (value) => {
    if (!value && value !== 0) return ''
    return new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const handleNumberInput = (event, callback) => {
    // Extrae solo números del input
    const inputValue = event.target.value.replace(/[^0-9]/g, '')
    
    // Actualiza el valor mediante el callback
    const numericValue = inputValue ? parseInt(inputValue, 10) : 0
    callback(numericValue)
    
    // Formatea el display
    event.target.value = formatNumber(numericValue)
  }

  return {
    formatNumber,
    handleNumberInput
  }
}
