<template>
  <section class="services-section section">
    <Container>
      <div class="categories-tabs">
        <button
          v-for="cat in categories"
          :key="cat.value"
          :class="['category-tab', { active: activeCategory === cat.value }]"
          @click="activeCategory = cat.value"
        >
          <i :class="cat.icon"></i>
          <span>{{ cat.label }}</span>
        </button>
      </div>

      <div class="services-grid">
        <div
          v-for="service in filteredServices"
          :key="service.id"
          class="service-card"
        >
          <div
            class="service-image"
            :style="{ backgroundImage: 'url(' + service.image + ')' }"
          >
            <div class="service-overlay"></div>
            <div class="service-badge" v-if="service.isNew">Новинка</div>
          </div>
          <div class="service-content">
            <div class="service-category">{{ service.category }}</div>
            <h3>{{ service.name }}</h3>
            <p>{{ service.description }}</p>
            <div class="service-footer">
              <div class="service-price">{{ service.price }} ₽</div>
              <button class="service-btn" @click="goToDetails(service.id)">
                Подробнее →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredServices.length === 0" class="empty-state">
        <i class="fas fa-spa"></i>
        <p>В этой категории пока нет услуг</p>
      </div>
    </Container>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Container from "../components/shared/Container.vue";
import { useGoods } from "../composables/useGoods";

const router = useRouter();
const { getAllGoods, loadGoods } = useGoods();

const goods = ref([]);
const activeCategory = ref("all");

const categories = [
  { value: "all", label: "Все услуги", icon: "fas fa-grid-2" },
  { value: "Питание", label: "Питание", icon: "fas fa-utensils" },
  { value: "Развлечения", label: "Развлечения", icon: "fas fa-bicycle" },
  { value: "Экскурсии", label: "Экскурсии", icon: "fas fa-map-marked-alt" },
  { value: "Трансфер", label: "Трансфер", icon: "fas fa-car" },
];

const filteredServices = computed(() => {
  if (activeCategory.value === "all") return goods.value;
  return goods.value.filter((g) => g.category === activeCategory.value);
});

const goToDetails = (id) => {
  router.push({ name: "goods-details", params: { id } });
};

onMounted(() => {
  loadGoods();
  goods.value = getAllGoods();
});
</script>

<style scoped>
.services-section {
  padding: 6rem 0;
  background: var(--color-cream);
}

.categories-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 3rem;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.5rem;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-light);
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-tab i {
  font-size: 1rem;
}

.category-tab:hover {
  border-color: var(--color-seafoam);
  color: var(--color-text-dark);
  transform: translateY(-2px);
}

.category-tab.active {
  background: var(--color-seafoam);
  border-color: var(--color-seafoam);
  color: var(--color-text-dark);
}

/* Сетка услуг */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.service-card {
  background: var(--color-white);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.service-image {
  height: 220px;
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
}

.service-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
}

.service-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-coral);
  color: var(--color-text-dark);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.service-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.service-category {
  display: inline-block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-seafoam);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.service-content h3 {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: var(--color-text-dark);
}

.service-content p {
  font-size: 0.9rem;
  color: var(--color-text-light);
  line-height: 1.5;
  margin-bottom: 1.2rem;
  flex: 1;
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.service-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-seafoam);
}

.service-btn {
  background: none;
  border: none;
  color: var(--color-text-dark);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  transition: all 0.2s;
}

.service-btn:hover {
  background: var(--color-seafoam);
  color: var(--color-text-dark);
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--color-text-light);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--color-border);
}

@media (max-width: 768px) {
  .categories-tabs {
    gap: 0.5rem;
  }

  .category-tab {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>
