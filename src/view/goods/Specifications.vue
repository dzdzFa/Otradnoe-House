<template>
  <div class="specs-tab">
    <h3>Характеристики</h3>
    <div class="specs-grid">
      <div class="spec-item">
        <span class="spec-label">Категория:</span>
        <span class="spec-value">{{ good?.category }}</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Цена:</span>
        <span class="spec-value">{{ good?.price }} ₽</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">Статус:</span>
        <span class="spec-value">
          {{ good?.available ? "Доступно" : "Недоступно" }}
        </span>
      </div>
      <div class="spec-item">
        <span class="spec-label">ID:</span>
        <span class="spec-value">{{ good?.id }}</span>
      </div>
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
.specs-tab h3 {
  margin-bottom: 1.5rem;
  color: var(--color-text-dark);
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.spec-item {
  background: var(--color-cream);
  padding: 1rem;
  border-radius: var(--radius-sm);
}

.spec-label {
  display: block;
  color: var(--color-text-light);
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.spec-value {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-text-dark);
}
</style>
