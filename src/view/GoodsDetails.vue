<template>
  <div class="goods-details-view">
    <div class="breadcrumbs">
      <Container>
        <RouterLink :to="{ name: 'home' }">Главная</RouterLink> &gt;
        <RouterLink :to="{ name: 'goods-list' }">Услуги</RouterLink> &gt;
        <span>{{ good?.name || "Товар" }}</span>
      </Container>
    </div>

    <div class="good-header" v-if="good">
      <Container>
        <div
          class="good-main-image"
          :style="{ backgroundImage: 'url(' + good.image + ')' }"
        ></div>
        <div class="good-info">
          <span class="good-category-badge">{{ good.category }}</span>
          <h1>{{ good.name }}</h1>
          <p class="good-description">{{ good.description }}</p>

          <div class="good-price-block">
            <span class="price-label">Стоимость: </span>
            <span class="price-value">{{ good.price }} ₽</span>
          </div>

          <div class="good-status">
            <span
              :class="[
                'status-badge',
                good.available ? 'available' : 'unavailable',
              ]"
            >
              {{ good.available ? "✓ Доступно" : "✕ Недоступно" }}
            </span>
          </div>

          <button
            v-if="good.available && isAdmin"
            class="edit-btn"
            @click="goToEdit"
          >
            ✏️ Редактировать
          </button>
        </div>
      </Container>
    </div>

    <div class="tabs-section" v-if="good">
      <Container>
        <div class="tabs-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="tab-content">
          <DescriptionTab v-if="activeTab === 'description'" :good="good" />
          <SpecificationsTab v-else-if="activeTab === 'specs'" :good="good" />
          <ReviewsTab v-else-if="activeTab === 'reviews'" :good="good" />
        </div>
      </Container>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Container from "../components/shared/Container.vue";
import DescriptionTab from "./goods/Description.vue";
import SpecificationsTab from "./goods/Specifications.vue";
import ReviewsTab from "./goods/Reviews.vue";
import { useGoods } from "../composables/useGoods";
import { useAuth } from "../composables/useAuth";
import { useNotification } from "../composables/useNotification";

const route = useRoute();
const router = useRouter();
const { getGoodById, loadGoods } = useGoods();
const { isAdmin } = useAuth();
const { error } = useNotification();

const good = ref(null);
const activeTab = ref("description");

const tabs = [
  { id: "description", label: "Описание" },
  { id: "specs", label: "Характеристики" },
  { id: "reviews", label: "Отзывы" },
];

const goToEdit = () => {
  router.push({ name: "admin-goods-edit", params: { id: good.value.id } });
};

onMounted(async () => {
  await loadGoods();
  const id = Number(route.params.id);
  good.value = getGoodById(id);

  if (!good.value) {
    error("Товар не найден");
    router.push({ name: "goods-list" });
  }
});
</script>

<style scoped>
.goods-details-view {
  background: var(--color-cream);
  padding: 2rem 0;
  min-height: 100vh;
}

.breadcrumbs {
  padding: 1rem 0;
  margin-bottom: 2rem;
  color: var(--color-text-light);
}

.breadcrumbs a {
  color: var(--color-text-light);
  transition: var(--transition);
}

.breadcrumbs a:hover {
  color: var(--color-seafoam);
}

.breadcrumbs span {
  color: var(--color-text-dark);
  font-weight: 600;
}

.good-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.good-main-image {
  height: 400px;
  border-radius: var(--radius-md);
  background-size: cover;
  background-position: center;
}

.good-info h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.good-description {
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.good-category-badge {
  display: inline-block;
  background: var(--color-seafoam);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.good-price-block {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.price-value {
  color: var(--color-seafoam);
  font-size: 2.5rem;
  font-weight: 800;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
}

.status-badge.available {
  background: rgba(184, 225, 221, 0.3);
  color: var(--color-sage);
}

.status-badge.unavailable {
  background: rgba(255, 182, 185, 0.3);
  color: var(--color-coral);
}

.edit-btn {
  background: var(--color-text-dark);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: var(--transition);
  border: none;
}

.edit-btn:hover {
  background: var(--color-seafoam);
  color: var(--color-text-dark);
}

.tabs-section {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.tabs-nav {
  display: flex;
  gap: 2rem;
  border-bottom: 2px solid var(--color-border);
  margin-bottom: 2rem;
}

.tab-btn {
  padding: 1rem 0;
  background: none;
  border: none;
  color: var(--color-text-light);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: var(--transition);
}

.tab-btn:hover {
  color: var(--color-seafoam);
}

.tab-btn.active {
  color: var(--color-seafoam);
  border-bottom-color: var(--color-seafoam);
}

.tab-content {
  min-height: 200px;
}

@media (max-width: 768px) {
  .good-header {
    grid-template-columns: 1fr;
  }

  .good-main-image {
    height: 300px;
  }

  .tabs-nav {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>
