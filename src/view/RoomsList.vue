<template>
  <div class="rooms-list-view">
    <section class="page-header section">
      <Container>
        <h1 class="page-title">Наши номера</h1>
        <p class="page-subtitle">
          Выберите идеальный вариант для вашего отдыха
        </p>
      </Container>
    </section>

    <section class="rooms-section section">
      <Container>
        <div class="rooms-grid">
          <div v-for="room in rooms" :key="room.id" class="room-card">
            <div
              class="room-image"
              :style="{ backgroundImage: 'url(' + room.image + ')' }"
            >
              <span
                class="room-badge"
                :style="{ background: room.badgeColor }"
                >{{ room.badge }}</span
              >
            </div>
            <div class="room-content">
              <h3>{{ room.name }}</h3>
              <p>{{ room.description }}</p>
              <div class="room-features">
                <span
                  v-for="f in room.features.slice(0, 4)"
                  :key="f"
                  class="feature"
                  >{{ f }}</span
                >
              </div>
              <div class="room-footer">
                <div class="room-price">
                  {{ room.price }} ₽ <span>/ ночь</span>
                </div>
                <button class="room-btn" @click="goToRoom(room.id)">
                  Подробнее →
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Container from "../components/shared/Container.vue";
import { useRooms } from "../composables/useRooms";

const router = useRouter();
const { getAllRooms } = useRooms();
const rooms = ref(getAllRooms());

const goToRoom = (id) => router.push({ name: "room-details", params: { id } });
</script>

<style scoped>
.rooms-list-view {
  background: var(--color-cream);
  min-height: 100vh;
  padding-top: 2rem;
}
.breadcrumbs {
  background: var(--color-white);
  padding: 1rem 0;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
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
  margin-left: 0.5rem;
}
.page-header {
  text-align: center;
  padding: 2rem 0;
}
.page-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.page-subtitle {
  font-size: 1.2rem;
  color: var(--color-text-light);
}
.rooms-section {
  padding: 2rem 0 4rem;
}
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}
.room-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
.room-card:hover {
  box-shadow: var(--shadow-md);
}
.room-image {
  height: 250px;
  background-size: cover;
  position: relative;
}
.room-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-weight: 700;
}
.room-content {
  padding: 2rem;
}
.room-content h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
.room-content p {
  margin-bottom: 1.5rem;
  line-height: 1.5;
  min-height: 4.5rem;
}
.room-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}
.feature {
  background: var(--color-cream);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid var(--color-border);
}
.room-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}
.room-price {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-seafoam);
}
.room-price span {
  font-size: 1rem;
  color: var(--color-text-light);
  font-weight: 400;
}
.room-btn {
  background: var(--color-seafoam);
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}
.room-btn:hover {
  background: var(--color-sage);
  transform: translateY(-2px);
}
@media (max-width: 768px) {
  .rooms-grid {
    grid-template-columns: 1fr;
  }
  .page-title {
    font-size: 2.5rem;
  }
}
</style>
