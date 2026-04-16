<template>
  <div class="description-tab">
    <h3>Подробное описание</h3>
    <p>{{ good?.description }}</p>

    <div class="description-extra">
      <h4>Что включено:</h4>
      <ul>
        <li>Полная поддержка во время использования</li>
        <li>Гарантия качества</li>
        <li>Возможность продления</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  good: {
    type: Object,
    default: null,
  },
});
</script>

<style scoped>
.description-tab h3 {
  margin-bottom: 1rem;
  color: var(--color-text-dark);
}

.description-tab p {
  line-height: 1.7;
  margin-bottom: 2rem;
  color: var(--color-text-light);
}

.description-extra h4 {
  margin-bottom: 1rem;
  color: var(--color-text-dark);
}

.description-extra ul {
  padding-left: 1.5rem;
  color: var(--color-text-light);
}

.description-extra li {
  margin-bottom: 0.5rem;
}
</style>
