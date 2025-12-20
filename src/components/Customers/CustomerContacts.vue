<template>
  <div>
    <!-- Lista de contactos -->
    <div v-if="contacts.length > 0" class="space-y-3 mb-4">
      <div
        v-for="contact in contacts"
        :key="contact.id"
        class="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
        :class="{ 'border-green-500 bg-green-50': contact.is_primary }"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <p class="font-medium text-gray-900">{{ contact.contact_name }}</p>
              <span v-if="contact.is_primary" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Principal
              </span>
            </div>
            <p v-if="contact.contact_position" class="text-sm text-gray-600">{{ contact.contact_position }}</p>
            <div class="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
              <span v-if="contact.contact_phone" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                {{ contact.contact_phone }}
              </span>
              <span v-if="contact.contact_email" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                {{ contact.contact_email }}
              </span>
            </div>
            <p v-if="contact.contact_notes" class="text-sm text-gray-500 mt-2 italic">{{ contact.contact_notes }}</p>
          </div>
          
          <div class="flex gap-2">
            <button
              v-if="!contact.is_primary"
              @click="setPrimary(contact.id)"
              class="text-sm text-green-600 hover:text-green-800"
              title="Marcar como principal"
            >
              Principal
            </button>
            <button
              @click="editContact(contact)"
              class="text-sm text-gray-600 hover:text-gray-800"
            >
              Editar
            </button>
            <button
              @click="confirmDelete(contact.id)"
              class="text-sm text-red-600 hover:text-red-800"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      <p class="mt-2">No hay contactos registrados</p>
    </div>

    <!-- Botón agregar -->
    <button
      @click="openModal()"
      class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
    >
      + Agregar Contacto
    </button>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ editingContact ? 'Editar Contacto' : 'Nuevo Contacto' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveContact" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
            <input
              v-model="form.contact_name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nombre del contacto"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cargo / Posición</label>
            <input
              v-model="form.contact_position"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Gerente de Compras"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                v-model="form.contact_phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="form.contact_email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="contacto@empresa.com"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              v-model="form.contact_notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Información adicional sobre el contacto..."
            ></textarea>
          </div>

          <div class="flex items-center">
            <input
              v-model="form.is_primary"
              type="checkbox"
              class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label class="ml-2 text-sm text-gray-700">Marcar como contacto principal</label>
          </div>

          <div v-if="error" class="p-3 bg-red-50 text-red-800 rounded-lg text-sm">
            {{ error }}
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              :disabled="saving"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import customerContactsService from '@/services/customerContacts.service'

const props = defineProps({
  customerId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['updated'])

const contacts = ref([])
const showModal = ref(false)
const editingContact = ref(null)
const saving = ref(false)
const error = ref('')

const form = ref({
  contact_name: '',
  contact_position: '',
  contact_phone: '',
  contact_email: '',
  contact_notes: '',
  is_primary: false
})

onMounted(() => {
  loadContacts()
})

async function loadContacts() {
  try {
    const response = await customerContactsService.getContacts(props.customerId)
    contacts.value = response.data.data
  } catch (err) {
    console.error('Error al cargar contactos:', err)
  }
}

function openModal(contact = null) {
  editingContact.value = contact
  if (contact) {
    form.value = { ...contact }
  } else {
    resetForm()
  }
  showModal.value = true
  error.value = ''
}

function closeModal() {
  showModal.value = false
  editingContact.value = null
  resetForm()
  error.value = ''
}

function resetForm() {
  form.value = {
    contact_name: '',
    contact_position: '',
    contact_phone: '',
    contact_email: '',
    contact_notes: '',
    is_primary: false
  }
}

function editContact(contact) {
  openModal(contact)
}

async function saveContact() {
  saving.value = true
  error.value = ''

  try {
    if (editingContact.value) {
      await customerContactsService.updateContact(props.customerId, editingContact.value.id, form.value)
    } else {
      await customerContactsService.createContact(props.customerId, form.value)
    }
    
    await loadContacts()
    closeModal()
    emit('updated')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar el contacto'
  } finally {
    saving.value = false
  }
}

async function setPrimary(contactId) {
  try {
    await customerContactsService.setPrimaryContact(props.customerId, contactId)
    await loadContacts()
    emit('updated')
  } catch (err) {
    alert('Error al marcar como principal')
  }
}

async function confirmDelete(contactId) {
  if (!confirm('¿Estás seguro de eliminar este contacto?')) return

  try {
    await customerContactsService.deleteContact(props.customerId, contactId)
    await loadContacts()
    emit('updated')
  } catch (err) {
    alert('Error al eliminar el contacto')
  }
}
</script>
