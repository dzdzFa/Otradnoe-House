<template>
  <div class="room-details-view">
    <div class="breadcrumbs">
      <Container>
        <RouterLink :to="{ name: 'home' }">Главная</RouterLink> &gt;
        <RouterLink :to="{ name: 'rooms-list' }">Номера</RouterLink> &gt;
        <span>{{ room?.name || "Номер" }}</span>
      </Container>
    </div>

    <section class="room-gallery">
      <Container>
        <div class="gallery-main">
          <div
            class="main-image"
            :style="{ backgroundImage: 'url(' + mainImage + ')' }"
            @click="openGallery(activeImage)"
          >
            <button class="fullscreen-btn">🔍</button>
          </div>
          <div class="gallery-thumbnails">
            <div
              v-for="(img, idx) in roomImages"
              :key="idx"
              :class="['thumbnail', { active: activeImage === idx }]"
              :style="{ backgroundImage: 'url(' + img + ')' }"
              @click="activeImage = idx"
            ></div>
          </div>
        </div>
      </Container>
    </section>

    <section class="room-info-section section">
      <Container>
        <div class="room-header">
          <div class="room-title-section">
            <h1>{{ room?.name }}</h1>
            <div class="room-meta">
              <span
                class="room-badge"
                :style="{ background: room?.badgeColor }"
                >{{ room?.badge }}</span
              >
              <span class="room-price"
                >{{ room?.price }} ₽ <span>/ ночь</span></span
              >
            </div>
          </div>
          <div class="room-actions">
            <button class="btn-book" @click="scrollToBooking">
              🗓️ Забронировать
            </button>
            <button class="btn-favorite" @click="toggleFavorite">
              {{ isFavorite ? "❤️" : "🤍" }}
              <span>{{ isFavorite ? "В избранном" : "В избранное" }}</span>
            </button>
          </div>
        </div>

        <div class="room-details-grid">
          <div class="room-description">
            <h2>Описание номера</h2>
            <p>{{ room?.description }}</p>

            <div class="amenities">
              <h3>Удобства и оснащение</h3>
              <div class="amenities-grid">
                <div v-for="item in amenities" :key="item.id" class="amenity">
                  <span class="amenity-icon">{{ item.icon }}</span>
                  <span class="amenity-name">{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="booking-details">
            <div class="booking-card">
              <h3>Забронировать номер</h3>

              <div class="booking-form">
                <div class="form-group">
                  <label>Даты проживания</label>
                  <div class="date-inputs">
                    <div class="date-input">
                      <span>Заезд</span>
                      <input type="date" v-model="checkIn" :min="minDate" />
                    </div>
                    <div class="date-input">
                      <span>Выезд</span>
                      <input
                        type="date"
                        v-model="checkOut"
                        :min="minCheckOut"
                      />
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label>Гости</label>
                  <select v-model.number="guests">
                    <option value="1">1 взрослый</option>
                    <option value="2">2 взрослых</option>
                    <option value="3">2 взрослых + 1 ребенок</option>
                    <option value="4">2 взрослых + 2 ребенка</option>
                  </select>
                </div>

                <div class="price-summary">
                  <div class="price-row">
                    <span>{{ nights }} ночей × {{ roomPrice }} ₽</span>
                    <span>{{ nightsPrice }} ₽</span>
                  </div>
                  <div class="price-row">
                    <span>Сервисный сбор</span>
                    <span>500 ₽</span>
                  </div>
                  <div class="price-total">
                    <span>Итого:</span>
                    <span class="total-amount">{{ totalPrice }} ₽</span>
                  </div>
                </div>

                <button
                  class="btn-book-now"
                  @click="bookRoom"
                  :disabled="!isAuthenticated"
                >
                  {{
                    isAuthenticated
                      ? "Забронировать сейчас"
                      : "Войдите для бронирования"
                  }}
                </button>
                <p v-if="!isAuthenticated" class="auth-hint">
                  <RouterLink :to="{ name: 'auth' }">Войдите</RouterLink> или
                  <RouterLink :to="{ name: 'register' }"
                    >зарегистрируйтесь</RouterLink
                  >
                  для бронирования
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <section class="similar-rooms section">
      <Container>
        <h2>Похожие номера</h2>
        <div class="similar-grid">
          <div
            v-for="similar in similarRooms"
            :key="similar.id"
            class="similar-card"
            @click="goToRoom(similar.id)"
          >
            <div
              class="similar-image"
              :style="{ backgroundImage: 'url(' + similar.image + ')' }"
            ></div>
            <div class="similar-content">
              <h3>{{ similar.name }}</h3>
              <p>{{ similar.description.slice(0, 100) }}...</p>
              <div class="similar-price">{{ similar.price }} ₽ / ночь</div>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <Modal
      :is-visible="showGallery"
      title="Галерея номера"
      @close="showGallery = false"
    >
      <div class="gallery-modal">
        <div
          class="modal-main-image"
          :style="{
            backgroundImage: 'url(' + roomImages[galleryIndex] + ')',
          }"
        ></div>
        <div class="modal-controls">
          <button @click="prevImage" :disabled="galleryIndex === 0">←</button>
          <span>{{ galleryIndex + 1 }} / {{ roomImages.length }}</span>
          <button
            @click="nextImage"
            :disabled="galleryIndex === roomImages.length - 1"
          >
            →
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Container from "../components/shared/Container.vue";
import Modal from "../components/shared/Modal.vue";
import { useAuth } from "../composables/useAuth";
import { useRooms } from "../composables/useRooms";
import { useActions } from "../composables/useActions";
import { useNotification } from "../composables/useNotification";

const route = useRoute();
const router = useRouter();
const { getRoomById, getAllRooms } = useRooms();
const { isAuthenticated, user } = useAuth();
const { handleBooking } = useActions();
const { success, info } = useNotification();

const room = ref(null);
const roomImages = ref([
  "/src/assets/img/stand_num.jpg",
  "/src/assets/img/stand_num.jpg",
  "/src/assets/img/bashroom1.jpg",
  "/src/assets/img/bashroom.jpg",
]);

const activeImage = ref(0);
const showGallery = ref(false);
const galleryIndex = ref(0);

const amenities = [
  { id: 1, name: "Бесплатный Wi-Fi", icon: "📶" },
  { id: 2, name: "Кондиционер", icon: "❄️" },
  { id: 3, name: "Телевизор", icon: "📺" },
  { id: 4, name: "Мини-бар", icon: "🥤" },
  { id: 5, name: "Сейф", icon: "🔒" },
  { id: 6, name: "Фен", icon: "💨" },
];

const checkIn = ref("");
const checkOut = ref("");
const guests = ref(2);
const minDate = ref("");

const roomPrice = computed(() => {
  if (!room.value) return 0;
  return Number(room.value.price.replace(/\s/g, ""));
});

const nights = computed(() => {
  if (!checkIn.value || !checkOut.value) return 0;
  const start = new Date(checkIn.value);
  const end = new Date(checkOut.value);
  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
});

const nightsPrice = computed(() => roomPrice.value * nights.value);
const totalPrice = computed(() => nightsPrice.value + 500);

const mainImage = computed(() => roomImages.value[activeImage.value]);

const minCheckOut = computed(() => {
  if (!checkIn.value) return "";
  const d = new Date(checkIn.value);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
});

const similarRooms = computed(() => {
  const all = getAllRooms();
  return all.filter((r) => r.id !== room.value?.id).slice(0, 3);
});

const isFavorite = ref(false);

const loadRoom = () => {
  const id = Number(route.params.id);
  room.value = getRoomById(id);
  if (!room.value) {
    router.push({ name: "rooms-list" });
  }
};

const openGallery = (idx) => {
  galleryIndex.value = idx;
  showGallery.value = true;
};

const prevImage = () => {
  if (galleryIndex.value > 0) galleryIndex.value--;
};

const nextImage = () => {
  if (galleryIndex.value < roomImages.value.length - 1) galleryIndex.value++;
};

const toggleFavorite = () => {
  if (!isAuthenticated.value) {
    info("Войдите в систему, чтобы добавлять в избранное");
    return;
  }
  isFavorite.value = !isFavorite.value;
  info(isFavorite.value ? "Добавлено в избранное" : "Удалено из избранного");
};

const scrollToBooking = () => {
  const el = document.querySelector(".booking-card");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const bookRoom = () => {
  if (!isAuthenticated.value) {
    router.push({ name: "auth" });
    return;
  }

  const bookingData = {
    roomId: room.value.id,
    roomName: room.value.name,
    roomPrice: room.value.price,
    checkIn: checkIn.value,
    checkOut: checkOut.value,
    guests: guests.value,
    nights: nights.value,
    totalPrice: totalPrice.value,
    userName: user.value?.name,
    userEmail: user.value?.email,
    userPhone: user.value?.phone,
  };

  const result = handleBooking(bookingData, user.value?.id);
  if (result.success) {
    success("Бронирование подтверждено!");
  }
};

const goToRoom = (id) => {
  router.push({ name: "room-details", params: { id } });
};

onMounted(() => {
  loadRoom();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  minDate.value = today.toISOString().split("T")[0];
  checkIn.value = minDate.value;
  checkOut.value = tomorrow.toISOString().split("T")[0];

  const favorites = JSON.parse(
    localStorage.getItem("otradnoe_favorites") || "[]",
  );
  isFavorite.value = favorites.includes(Number(route.params.id));
});
</script>

<style scoped>
.room-details-view {
  background: var(--color-cream);
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

/* Галерея */
.room-gallery {
  margin-bottom: 3rem;
}

.gallery-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  height: 500px;
  border-radius: var(--radius-lg);
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: pointer;
}

.fullscreen-btn {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
}

.fullscreen-btn:hover {
  background: white;
  transform: scale(1.1);
}

.gallery-thumbnails {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.thumbnail {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: var(--radius-sm);
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: var(--transition);
}

.thumbnail:hover,
.thumbnail.active {
  border-color: var(--color-seafoam);
  transform: scale(1.05);
}

/* Заголовок номера */
.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 2rem;
}

.room-title-section h1 {
  font-size: 2.8rem;
  margin-bottom: 1rem;
}

.room-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.room-badge {
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-weight: 700;
}

.room-price {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--color-seafoam);
}

.room-price span {
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-text-light);
}

.room-actions {
  display: flex;
  gap: 1rem;
}

.btn-book {
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  padding: 1rem 2rem;
  border-radius: var(--radius-sm);
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}

.btn-book:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.btn-favorite {
  background: var(--color-white);
  border: 2px solid var(--color-border);
  padding: 1rem 1.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);
}

.btn-favorite:hover {
  border-color: var(--color-coral);
}

/* Сетка деталей */
.room-details-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
}

.room-description h2 {
  margin-bottom: 1.5rem;
}

.room-description p {
  line-height: 1.7;
  margin-bottom: 2.5rem;
}

.amenities h3 {
  margin-bottom: 1.5rem;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.amenity {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background: var(--color-white);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.amenity-icon {
  font-size: 1.5rem;
}

/* Карточка бронирования */
.booking-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 100px;
}

.booking-card h3 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.date-input {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.date-input span {
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.date-inputs input,
.booking-form select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
}

.price-summary {
  background: var(--color-cream);
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-top: 0.5rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: var(--color-text-light);
}

.price-total {
  display: flex;
  justify-content: space-between;
  padding-top: 0.8rem;
  border-top: 2px solid var(--color-border);
  font-weight: 700;
  font-size: 1.1rem;
}

.total-amount {
  color: var(--color-seafoam);
  font-size: 1.3rem;
}

.btn-book-now {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}

.btn-book-now:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.btn-book-now:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-hint {
  text-align: center;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: var(--color-text-light);
}

.auth-hint a {
  color: var(--color-seafoam);
  font-weight: 600;
}

/* Похожие номера */
.similar-rooms {
  background: var(--color-white);
}

.similar-rooms h2 {
  text-align: center;
  margin-bottom: 3rem;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.similar-card {
  background: var(--color-cream);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
}

.similar-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-md);
}

.similar-image {
  height: 200px;
  background-size: cover;
  background-position: center;
}

.similar-content {
  padding: 1.5rem;
}

.similar-content h3 {
  margin-bottom: 0.5rem;
}

.similar-content p {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.similar-price {
  color: var(--color-seafoam);
  font-weight: 700;
}

/* Модальное окно галереи */
.gallery-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.modal-main-image {
  width: 100%;
  height: 500px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.modal-controls {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.modal-controls button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--color-seafoam);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
}

.modal-controls button:hover:not(:disabled) {
  background: var(--color-sage);
  transform: scale(1.1);
}

.modal-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-controls span {
  font-weight: 600;
}

@media (max-width: 1024px) {
  .room-details-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .booking-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .room-header {
    flex-direction: column;
  }
  .room-actions {
    width: 100%;
  }
  .btn-book,
  .btn-favorite {
    flex: 1;
    justify-content: center;
  }
  .main-image {
    height: 300px;
  }
  .date-inputs {
    grid-template-columns: 1fr;
  }
  .similar-grid {
    grid-template-columns: 1fr;
  }
  .modal-main-image {
    height: 300px;
  }
}
</style>
