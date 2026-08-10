<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { MoreVertical } from 'lucide-vue-next';

defineProps({
  items: {
    type: Array,
    required: true,
    // [{ label: 'Edit', action: () => {}, icon: IconComponent, danger: false }]
  }
});
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton
        class="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
      >
        <slot name="button">
          <MoreVertical class="w-5 h-5" aria-hidden="true" />
        </slot>
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700"
      >
        <div class="py-1">
          <MenuItem
            v-for="(item, idx) in items"
            :key="idx"
            v-slot="{ active }"
          >
            <button
              @click="item.action"
              :class="[
                active ? (item.danger ? 'bg-red-50 text-red-700 dark:bg-red-900/20' : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white') : (item.danger ? 'text-red-600 dark:text-red-500' : 'text-gray-700 dark:text-gray-300'),
                'group flex w-full items-center px-4 py-2 text-sm'
              ]"
            >
              <component
                :is="item.icon"
                v-if="item.icon"
                :class="[
                  item.danger ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300',
                  'mr-3 h-5 w-5'
                ]"
                aria-hidden="true"
              />
              {{ item.label }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
