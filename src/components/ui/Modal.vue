<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { X } from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: String,
    default: 'max-w-lg', // sm, md, lg, xl, etc
  }
});

const emit = defineEmits(['close']);
</script>

<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="emit('close')">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              :class="[
                'relative transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 w-full',
                maxWidth
              ]"
            >
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                  {{ title }}
                </DialogTitle>
                <button
                  type="button"
                  class="rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:hover:text-gray-300"
                  @click="emit('close')"
                >
                  <span class="sr-only">Close</span>
                  <X class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div class="px-6 py-4">
                <slot />
              </div>
              <div v-if="$slots.footer" class="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-row-reverse sm:px-6">
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
