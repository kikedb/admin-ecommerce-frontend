import { computed } from 'vue';

export function usePublicationRequirements(entity, type = 'product') {
  const requirements = computed(() => {
    if (!entity.value) return [];

    if (type === 'product') {
      return [
        {
          id: 'title',
          label: 'Tiene nombre',
          met: !!entity.value.name && entity.value.name.length > 0,
        },
        {
          id: 'price',
          label: 'Tiene precio base',
          met: !!entity.value.price && entity.value.price > 0,
        },
        {
          id: 'images',
          label: 'Tiene al menos una imagen',
          met: !!entity.value.images && entity.value.images.length > 0,
        },
        {
          id: 'category',
          label: 'Categoría asignada',
          met: !!entity.value.category_id,
        }
      ];
    }

    return [];
  });

  const canPublish = computed(() => {
    return requirements.value.length > 0 && requirements.value.every(req => req.met);
  });

  return {
    requirements,
    canPublish
  };
}
