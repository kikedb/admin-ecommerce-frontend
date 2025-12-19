import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCustomerStore = defineStore('customer', () => {
  // Estado
  const id = ref(null)
  const customerType = ref('individual') // 'individual' o 'business'
  const status = ref('active')
  const rating = ref(null)
  
  // Persona Natural (B2C)
  const firstName = ref('')
  const lastName = ref('')
  const documentType = ref('rut')
  const documentNumber = ref('')
  const dateOfBirth = ref(null)
  const gender = ref(null)
  
  // Empresa (B2B)
  const businessName = ref('')
  const tradeName = ref('')
  const taxId = ref('')
  const businessActivity = ref('')
  
  // Contacto
  const email = ref('')
  const phone = ref('')
  const mobile = ref('')
  const alternativePhone = ref('')
  
  // Dirección Principal
  const addressLine1 = ref('')
  const addressLine2 = ref('')
  const city = ref('')
  const region = ref('')
  const postalCode = ref('')
  const country = ref('Chile')
  
  // Información Comercial
  const customerSince = ref(null)
  const preferredPaymentMethod = ref('')
  const creditLimit = ref(0)
  const discountPercentage = ref(0)
  
  // Segmentación
  const segment = ref('new')
  const tags = ref([])
  const acquisitionChannel = ref('')
  
  // Notas y Metadata
  const notes = ref('')
  const isWholesale = ref(false)
  const taxExempt = ref(false)
  
  // Email Marketing
  const subscribeNewsletter = ref(false)
  const subscribePromotions = ref(false)
  const subscribeNotifications = ref(false)

  // Computed
  const isB2B = computed(() => customerType.value === 'business')
  const isB2C = computed(() => customerType.value === 'individual')
  
  const fullName = computed(() => {
    if (isB2B.value) {
      return tradeName.value || businessName.value
    }
    return `${firstName.value} ${lastName.value}`.trim()
  })

  // Actions
  function clearForm() {
    id.value = null
    customerType.value = 'individual'
    status.value = 'active'
    rating.value = null
    
    // B2C
    firstName.value = ''
    lastName.value = ''
    documentType.value = 'rut'
    documentNumber.value = ''
    dateOfBirth.value = null
    gender.value = null
    
    // B2B
    businessName.value = ''
    tradeName.value = ''
    taxId.value = ''
    businessActivity.value = ''
    
    // Contacto
    email.value = ''
    phone.value = ''
    mobile.value = ''
    alternativePhone.value = ''
    
    // Dirección
    addressLine1.value = ''
    addressLine2.value = ''
    city.value = ''
    region.value = ''
    postalCode.value = ''
    country.value = 'Chile'
    
    // Comercial
    customerSince.value = null
    preferredPaymentMethod.value = ''
    creditLimit.value = 0
    discountPercentage.value = 0
    
    // Segmentación
    segment.value = 'new'
    tags.value = []
    acquisitionChannel.value = ''
    
    // Notas
    notes.value = ''
    isWholesale.value = false
    taxExempt.value = false
    
    // Marketing
    subscribeNewsletter.value = false
    subscribePromotions.value = false
    subscribeNotifications.value = false
  }

  function loadCustomer(customer) {
    id.value = customer.id
    customerType.value = customer.customer_type
    status.value = customer.status
    rating.value = customer.rating
    
    // B2C
    firstName.value = customer.first_name || ''
    lastName.value = customer.last_name || ''
    documentType.value = customer.document_type || 'rut'
    documentNumber.value = customer.document_number || ''
    dateOfBirth.value = customer.date_of_birth
    gender.value = customer.gender
    
    // B2B
    businessName.value = customer.business_name || ''
    tradeName.value = customer.trade_name || ''
    taxId.value = customer.tax_id || ''
    businessActivity.value = customer.business_activity || ''
    
    // Contacto
    email.value = customer.email || ''
    phone.value = customer.phone || ''
    mobile.value = customer.mobile || ''
    alternativePhone.value = customer.alternative_phone || ''
    
    // Dirección
    addressLine1.value = customer.address_line_1 || ''
    addressLine2.value = customer.address_line_2 || ''
    city.value = customer.city || ''
    region.value = customer.region || ''
    postalCode.value = customer.postal_code || ''
    country.value = customer.country || 'Chile'
    
    // Comercial
    customerSince.value = customer.customer_since
    preferredPaymentMethod.value = customer.preferred_payment_method || ''
    creditLimit.value = customer.credit_limit || 0
    discountPercentage.value = customer.discount_percentage || 0
    
    // Segmentación
    segment.value = customer.segment || 'new'
    tags.value = customer.tags || []
    acquisitionChannel.value = customer.acquisition_channel || ''
    
    // Notas
    notes.value = customer.notes || ''
    isWholesale.value = customer.is_wholesale || false
    taxExempt.value = customer.tax_exempt || false
    
    // Marketing
    subscribeNewsletter.value = customer.subscribe_newsletter || false
    subscribePromotions.value = customer.subscribe_promotions || false
    subscribeNotifications.value = customer.subscribe_notifications || false
  }

  function getFormData() {
    const data = {
      customer_type: customerType.value,
      status: status.value,
      rating: rating.value,
      
      // Contacto
      email: email.value,
      phone: phone.value,
      mobile: mobile.value,
      alternative_phone: alternativePhone.value,
      
      // Dirección
      address_line_1: addressLine1.value,
      address_line_2: addressLine2.value,
      city: city.value,
      region: region.value,
      postal_code: postalCode.value,
      country: country.value,
      
      // Comercial
      customer_since: customerSince.value,
      preferred_payment_method: preferredPaymentMethod.value,
      credit_limit: creditLimit.value,
      discount_percentage: discountPercentage.value,
      
      // Segmentación
      segment: segment.value,
      tags: tags.value,
      acquisition_channel: acquisitionChannel.value,
      
      // Notas
      notes: notes.value,
      is_wholesale: isWholesale.value,
      tax_exempt: taxExempt.value,
      
      // Marketing
      subscribe_newsletter: subscribeNewsletter.value,
      subscribe_promotions: subscribePromotions.value,
      subscribe_notifications: subscribeNotifications.value
    }

    // Agregar campos específicos según tipo
    if (isB2C.value) {
      data.first_name = firstName.value
      data.last_name = lastName.value
      data.document_type = documentType.value
      data.document_number = documentNumber.value
      data.date_of_birth = dateOfBirth.value
      data.gender = gender.value
    } else {
      data.business_name = businessName.value
      data.trade_name = tradeName.value
      data.tax_id = taxId.value
      data.business_activity = businessActivity.value
    }

    return data
  }

  return {
    // State
    id,
    customerType,
    status,
    rating,
    firstName,
    lastName,
    documentType,
    documentNumber,
    dateOfBirth,
    gender,
    businessName,
    tradeName,
    taxId,
    businessActivity,
    email,
    phone,
    mobile,
    alternativePhone,
    addressLine1,
    addressLine2,
    city,
    region,
    postalCode,
    country,
    customerSince,
    preferredPaymentMethod,
    creditLimit,
    discountPercentage,
    segment,
    tags,
    acquisitionChannel,
    notes,
    isWholesale,
    taxExempt,
    subscribeNewsletter,
    subscribePromotions,
    subscribeNotifications,
    
    // Computed
    isB2B,
    isB2C,
    fullName,
    
    // Actions
    clearForm,
    loadCustomer,
    getFormData
  }
})
