<script setup>
import { computed } from 'vue';
import { CheckCircle, Circle, AlertCircle } from 'lucide-vue-next';

const props = defineProps({
  requirements: {
    type: Array,
    required: true,
    // [{ id: 'req1', label: 'Tiene nombre', met: true }]
  },
  canPublish: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['publish', 'unpublish']);

const progress = computed(() => {
  if (!props.requirements.length) return 0;
  const metCount = props.requirements.filter(r => r.met).length;
  return Math.round((metCount / props.requirements.length) * 100);
});
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Estado de Publicación</h3>
      <span
        :class="[
          'px-2.5 py-0.5 rounded-full text-xs font-medium',
          isPublished ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
        ]"
      >
        {{ isPublished ? 'Publicado' : 'Borrador' }}
      </span>
    </div>

    <!-- Progress Bar -->
    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
      <div class="bg-primary-600 h-2.5 rounded-full transition-all duration-300" :style="{ width: `${progress}%` }"></div>
    </div>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">{{ progress }}% completado</p>

    <!-- Requirements List -->
    <ul class="space-y-3 mb-6">
      <li v-for="req in requirements" :key="req.id" class="flex items-center text-sm">
        <CheckCircle v-if="req.met" class="w-5 h-5 text-green-500 mr-2" />
        <Circle v-else class="w-5 h-5 text-gray-300 dark:text-gray-600 mr-2" />
        <span :class="req.met ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'">
          {{ req.label }}
        </span>
      </li>
    </ul>

    <div v-if="!canPublish && !isPublished" class="flex items-start p-3 mb-4 text-sm text-amber-800 bg-amber-50 rounded-lg dark:bg-amber-900/30 dark:text-amber-400" role="alert">
      <AlertCircle class="inline flex-shrink-0 mr-3 w-5 h-5" />
      <div>
        Faltan requisitos para poder publicar.
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 mt-4">
      <button
        v-if="!isPublished"
        @click="emit('publish')"
        :disabled="!canPublish"
        :class="[
          'flex-1 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-4 focus:outline-none transition-colors',
          canPublish 
            ? 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800' 
            : 'bg-primary-300 cursor-not-allowed dark:bg-primary-800'
        ]"
      >
        Publicar
      </button>
      <button
        v-else
        @click="emit('unpublish')"
        class="flex-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      >
        Despublicar
      </button>
    </div>
  </div>
</template>
