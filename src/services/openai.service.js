const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export default {
  /**
   * Genera descripciones mejoradas usando OpenAI
   * @param {object} productData - Datos del producto
   * @param {string} productData.name - Nombre del producto
   * @param {string} productData.model - Modelo
   * @param {number} productData.price - Precio
   * @param {string} productData.category - Categoría
   * @param {string} productData.brand - Marca
   * @param {string} productData.color - Color
   * @param {string} productData.serie - Serie
   * @param {string} productData.material - Material
   * @param {string} productData.condition - Condición
   * @param {string} productData.conditionDetail - Detalle de condición
   * @param {string} productData.userDescription - Descripción escrita por el usuario
   * @returns {Promise<{fullDescription: string, shortDescription: string}>}
   */
  async generateDescriptions(productData) {
    const {
      name,
      model,
      price,
      category,
      brand,
      color,
      serie,
      material,
      condition,
      conditionDetail,
      userDescription
    } = productData

    const productContext = `
Nombre: ${name || 'N/A'}
Modelo: ${model || 'N/A'}
Precio: ${price ? `$${price}` : 'N/A'}
Categoría: ${category || 'N/A'}
Marca: ${brand || 'N/A'}
Color: ${color || 'N/A'}
Serie: ${serie || 'N/A'}
Material: ${material || 'N/A'}
Condición: ${condition || 'N/A'}
Detalle: ${conditionDetail || 'N/A'}
Descripción inicial del usuario: ${userDescription || 'Sin descripción previa'}
    `.trim()

    const prompt = `Eres un experto en redacción de descripciones de productos para e-commerce. Tu tarea es generar dos descripciones persuasivas que impulsen la captación de clientes.

CONTEXTO DEL PRODUCTO:
${productContext}

INSTRUCCIONES CRÍTICAS:
1. Genera una descripción completa EXACTAMENTE de máximo 400 caracteres (cuenta cada carácter, espacio incluido). NO EXCEDAS BAJO NINGUNA CIRCUNSTANCIA.
2. Genera una descripción corta EXACTAMENTE de máximo 140 caracteres (cuenta cada carácter, espacio incluido). NO EXCEDAS BAJO NINGUNA CIRCUNSTANCIA.
3. Si alguna descripción excede el límite, acórtala eliminando lo menos importante.
4. Las descripciones deben terminar ANTES de alcanzar el límite, dejando espacio de 10 caracteres de margen.

Ambas descripciones deben:
- Ser en español neutro
- Enfocarse en beneficios y características que atraigan clientes
- Ser claras y profesionales
- Evitar clichés y jerga innecesaria
- SER COMPLETAS (no cortadas a mitad de palabra)

RESPONDE EN ESTE FORMATO EXACTO (sin explicaciones adicionales, sin excepciones):
DESCRIPCION_COMPLETA: [aquí la descripción máximo 400 caracteres]
DESCRIPCION_CORTA: [aquí la descripción máximo 140 caracteres]`

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Eres un experto en marketing y e-commerce especializado en generar descripciones de productos persuasivas.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error al generar descripciones')
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      // Parsear la respuesta
      const fullDescMatch = content.match(/DESCRIPCION_COMPLETA:\s*(.+?)(?=DESCRIPCION_CORTA:|$)/s)
      const shortDescMatch = content.match(/DESCRIPCION_CORTA:\s*(.+?)$/s)

      const fullDescription = fullDescMatch ? fullDescMatch[1].trim() : ''
      const shortDescription = shortDescMatch ? shortDescMatch[1].trim() : ''

      // Validar límites de caracteres
      return {
        fullDescription: fullDescription.substring(0, 400),
        shortDescription: shortDescription.substring(0, 140)
      }
    } catch (error) {
      console.error('Error generando descripciones con OpenAI:', error)
      throw error
    }
  }
}
