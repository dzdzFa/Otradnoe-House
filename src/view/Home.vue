<template>
  <div class="home-view">
    <section id="hero" class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Отдых в Крыму</h1>
        <p class="hero-subtitle">
          Комфортабельные номера, частный пляж и безупречный сервис
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary" @click="scrollTo('booking')">
            Забронировать
          </button>
          <button class="btn btn-secondary" @click="scrollTo('gallery')">
            Галерея
          </button>
        </div>
      </div>
    </section>

    <section id="rooms" class="rooms-section section">
      <Container>
        <h2 class="section-title">Наши номера</h2>
        <p class="section-subtitle">
          Комфортабельные варианты размещения для любого отдыха
        </p>
        <div class="rooms-grid">
          <div class="room-card" v-for="room in rooms" :key="room.id">
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

    <section id="services" class="services-section section">
      <Container>
        <h2 class="section-title">Услуги и развлечения</h2>
        <p class="section-subtitle">Все необходимое для незабываемого отдыха</p>
        <div class="services-grid">
          <div
            class="service-card"
            v-for="service in services"
            :key="service.id"
          >
            <div class="service-icon" :style="{ background: service.color }">
              {{ service.icon }}
            </div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <button
              v-if="service.hasDetails"
              class="service-detail-btn"
              @click="handleService(service.id)"
            >
              Подробнее →
            </button>
          </div>
        </div>
      </Container>
    </section>

    <section id="gallery" class="gallery-section section">
      <Container>
        <h2 class="section-title">Галерея</h2>
        <div class="gallery-filters">
          <button
            v-for="filter in galleryFilters"
            :key="filter"
            :class="['filter-btn', { active: activeFilter === filter }]"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </button>
        </div>
        <div class="gallery-grid">
          <div
            v-for="(img, i) in filteredImages"
            :key="i"
            class="gallery-item"
            :style="{ backgroundImage: 'url(' + img.url + ')' }"
            @click="openGallery(i)"
          >
            <div class="gallery-overlay">{{ img.category }}</div>
            <div v-if="img.category === 'Ресторан'" class="gallery-action">
              <button class="gallery-btn" @click.stop="goToRestaurant">
                Наш ресторан
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <section class="offers-section section">
      <Container>
        <h2 class="section-title">Специальные предложения</h2>
        <p class="section-subtitle">Выгодные условия для вашего отдыха</p>
        <div class="offers-grid">
          <div class="offer-card" v-for="offer in offers" :key="offer.id">
            <div class="offer-header">
              <h3>{{ offer.title }}</h3>
              <span class="offer-badge">{{ offer.discount }}</span>
            </div>
            <p>{{ offer.description }}</p>
            <div class="offer-dates">
              <span>Действует до: </span>
              <span>{{ offer.validUntil }}</span>
            </div>
            <button class="offer-btn" @click="applyOffer(offer.id)">
              Подробнее
            </button>
          </div>
        </div>
      </Container>
    </section>

    <section id="booking" class="booking-section section">
      <Container>
        <div class="booking-wrapper">
          <div class="booking-info">
            <h2>Забронируйте отдых</h2>
            <p>
              Укажите даты заезда и выезда, а также количество гостей. Мы
              свяжемся с вами для подтверждения.
            </p>
            <div class="booking-features">
              <div class="feature">
                <span class="feature-icon">✓</span> Бесплатная отмена за 48
                часов
              </div>
              <div class="feature">
                <span class="feature-icon">✓</span> Лучшая цена гарантирована
              </div>
              <div class="feature">
                <span class="feature-icon">✓</span> Прямое бронирование без
                комиссий
              </div>
            </div>
          </div>

          <form class="booking-form" @submit.prevent="submitBooking" novalidate>
            <h3>Забронировать номер</h3>
            <div class="form-group">
              <label>Даты проживания</label>
              <div class="date-inputs">
                <div class="date-input">
                  <span>Заезд</span>
                  <input
                    type="date"
                    v-model="checkIn"
                    :min="minDate"
                    required
                  />
                </div>
                <div class="date-input">
                  <span>Выезд</span>
                  <input
                    type="date"
                    v-model="checkOut"
                    :min="minCheckOut"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Гости</label>
              <select v-model="guests">
                <option value="1">1 взрослый</option>
                <option value="2">2 взрослых</option>
                <option value="3">2 взрослых + 1 ребенок</option>
                <option value="4">2 взрослых + 2 ребенка</option>
                <option value="5">Большая компания</option>
              </select>
            </div>
            <div class="form-group">
              <label>Тип номера</label>
              <select v-model="roomType">
                <option value="standard">Стандарт</option>
                <option value="family">Семейный</option>
                <option value="luxury">Люкс с видом на море</option>
                <option value="cottage">Коттедж</option>
              </select>
            </div>
            <button type="submit" class="submit-btn">Забронировать</button>
            <p class="form-note">
              После бронирования мы вышлем подтверждение на email
            </p>
          </form>
        </div>
      </Container>
    </section>

    <section id="contact" class="contact-section section">
      <Container>
        <h2 class="section-title">Свяжитесь с нами</h2>
        <p class="section-subtitle">
          Мы всегда на связи и готовы ответить на ваши вопросы
        </p>

        <div class="contact-container">
          <div class="contact-left">
            <div class="contact-card">
              <div class="contact-icon"><i class="fas fa-phone-alt"></i></div>
              <div class="contact-details">
                <h3>Телефон</h3>
                <a href="tel:+79781234567">+7 (978) 123-45-67</a>
                <p class="small">Ежедневно с 8:00 до 22:00</p>
              </div>
            </div>

            <div class="contact-card">
              <div class="contact-icon"><i class="fas fa-envelope"></i></div>
              <div class="contact-details">
                <h3>Email</h3>
                <a href="mailto:info@otradnoe.ru">info@otradnoe.ru</a>
                <a href="mailto:booking@otradnoe.ru">booking@otradnoe.ru</a>
              </div>
            </div>

            <div class="contact-card">
              <div class="contact-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="contact-details">
                <h3>Адрес</h3>
                <p>Крым, п. Оленевка, ул. Морская, 12</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  class="map-link"
                >
                  Построить маршрут →
                </a>
              </div>
            </div>

            <div class="contact-card">
              <div class="contact-icon"><i class="fas fa-clock"></i></div>
              <div class="contact-details">
                <h3>Режим работы</h3>
                <p>Ресепшн: круглосуточно</p>
                <p>Заезд: 14:00 / Выезд: 12:00</p>
              </div>
            </div>
          </div>

          <div class="contact-right">
            <div class="contact-map">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=32.587000%2C45.378000&z=15&pt=32.587000%2C45.378000&l=map"
                width="100%"
                height="280"
                frameborder="0"
                style="border: 0; border-radius: 12px"
                allowfullscreen
              ></iframe>
            </div>

            <div class="contact-cta">
              <p>Остались вопросы? Напишите нам!</p>
              <button class="contact-btn" @click="scrollTo('contact')">
                <i class="fas fa-paper-plane"></i> Задать вопрос
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <TransferModal
      v-if="showTransferModal"
      :is-visible="showTransferModal"
      @close="showTransferModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Container from "../components/shared/Container.vue";
import TransferModal from "../components/shared/TransferModal.vue";
import { useNotification } from "../composables/useNotification";
import { useRooms } from "../composables/useRooms";

const router = useRouter();
const { success, info } = useNotification();
const { getAllRooms } = useRooms();

const rooms = ref(getAllRooms());

const services = [
  {
    id: 1,
    icon: "🍽️",
    title: "Ресторан Lavanda",
    description: "Fine-dining с авторской кухней",
    color: "var(--color-lavender)",
    hasDetails: true,
  },
  {
    id: 5,
    icon: "🚗",
    title: "Трансфер",
    description: "Встреча из аэропорта",
    color: "var(--color-seafoam)",
    hasDetails: true,
  },
  {
    id: 4,
    icon: "🚲",
    title: "Прокат велосипедов",
    description: "Горные и прогулочные",
    color: "var(--color-sage)",
    hasDetails: false,
  },
];

const offers = [
  {
    id: 1,
    title: "Раннее бронирование",
    description: "Скидка 20% при бронировании лета 2026",
    discount: "-20%",
    validUntil: "01.05.2026",
  },
  {
    id: 2,
    title: "Семейный отдых",
    description: "Дети до 12 лет бесплатно",
    discount: "Дети free",
    validUntil: "Круглый год",
  },
  {
    id: 3,
    title: "Романтический пакет",
    description: "Ужин при свечах, спа-процедуры",
    discount: "Для пар",
    validUntil: "По запросу",
  },
];

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const goToRoom = (id) => router.push({ name: "room-details", params: { id } });
const goToRestaurant = () => router.push({ name: "restaurant" });

const openGallery = (i) =>
  info(`Открытие изображения ${i + 1} из галереи (в разработке)`);
const applyOffer = (id) => info(`Применение предложения ${id} (в разработке)`);

const handleService = (id) => {
  if (id === 1) router.push({ name: "restaurant" });
  if (id === 5) showTransferModal.value = true;
};

const submitBooking = () => {
  success(
    `Запрос на бронирование отправлен!\nДаты: ${checkIn.value} - ${checkOut.value}\nМы свяжемся с вами для подтверждения.`,
  );
  checkIn.value = "";
  checkOut.value = "";
  guests.value = "2";
  roomType.value = "standard";
};

const galleryFilters = [
  "Все",
  "Номера",
  "Территория",
  "Ресторан",
  "Бассейн",
  "Трансфер",
];
const activeFilter = ref("Все");
const galleryImages = [
  { url: "/src/assets/img/stand_num.JPG", category: "Номера" },
  { url: "/src/assets/img/ter2.JPG", category: "Территория" },
  { url: "/src/assets/img/lavanda-preview.JPG", category: "Ресторан" },
  { url: "/src/assets/img/bass2.JPG", category: "Бассейн" },
  { url: "/src/assets/img/transf.jpg", category: "Трансфер" },
];

const filteredImages = computed(() => {
  if (activeFilter.value === "Все") return galleryImages;
  return galleryImages.filter((img) => img.category === activeFilter.value);
});

const checkIn = ref("");
const checkOut = ref("");
const guests = ref("2");
const roomType = ref("standard");
const showTransferModal = ref(false);

const minDate = computed(() => new Date().toISOString().split("T")[0]);
const minCheckOut = computed(() => {
  if (!checkIn.value) return "";
  const d = new Date(checkIn.value);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
});

onMounted(() => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 3);
  checkIn.value = today.toISOString().split("T")[0];
  checkOut.value = tomorrow.toISOString().split("T")[0];
});
</script>

<style scoped>
.section {
  padding: 6rem 0;
}

.hero-section {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("/src/assets/img/preview-glav.JPG") center/cover;
  color: white;
  text-align: center;
}

.hero-title {
  font-size: 5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: 1.6rem;
  margin-bottom: 3rem;
  opacity: 0.95;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.btn {
  padding: 1.2rem 2.8rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  transition: all 0.3s;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  color: var(--color-text-dark);
}
.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid white;
  color: white;
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

/* ROOMS */
.rooms-section {
  background: var(--color-white);
}
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}
.room-card {
  background: var(--color-cream);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  height: 100%;
}
.room-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-md);
}
.room-image {
  height: 250px;
  background-size: cover;
  position: relative;
  flex-shrink: 0;
}
.room-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
}
.room-content {
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.room-content h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
.room-content p {
  margin-bottom: 1.5rem;
  line-height: 1.5;
  flex: 1;
}
.room-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}
.feature {
  background: var(--color-white);
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
  margin-top: auto;
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
  border: none;
}
.room-btn:hover {
  background: var(--color-sage);
  transform: translateY(-2px);
}

/* SERVICES */
.services-section {
  background: var(--color-cream);
}
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
.service-card {
  text-align: center;
  padding: 2.5rem;
  background: var(--color-white);
  border-radius: var(--radius-md);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  height: 100%;
}
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}
.service-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2.5rem;
}
.service-card h3 {
  margin-bottom: 1rem;
}
.service-card p {
  flex: 1;
}
.service-detail-btn {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: 1px solid var(--color-seafoam);
  color: var(--color-seafoam);
  border-radius: var(--radius-sm);
  cursor: pointer;
}
.service-detail-btn:hover {
  background: var(--color-seafoam);
  color: var(--color-text-dark);
}

/* GALLERY */
.gallery-section {
  background: var(--color-white);
}
.gallery-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}
.filter-btn {
  background: var(--color-cream);
  border: 2px solid var(--color-border);
  padding: 0.8rem 1.8rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}
.filter-btn.active,
.filter-btn:hover {
  background: var(--color-seafoam);
  border-color: var(--color-seafoam);
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.gallery-item {
  height: 250px;
  border-radius: var(--radius-md);
  background-size: cover;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}
.gallery-item::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
  opacity: 0;
  transition: var(--transition);
}
.gallery-item:hover::before {
  opacity: 1;
}
.gallery-overlay {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  color: white;
  font-weight: 600;
  transform: translateY(20px);
  opacity: 0;
  transition: var(--transition);
}
.gallery-item:hover .gallery-overlay {
  transform: translateY(0);
  opacity: 1;
}
.gallery-action {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: var(--transition);
}
.gallery-item:hover .gallery-action {
  opacity: 1;
  transform: translateY(0);
}
.gallery-btn {
  background: var(--color-seafoam);
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

/* OFFERS */
.offers-section {
  background: var(--color-cream);
}
.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
.offer-card {
  background: var(--color-white);
  padding: 2rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.offer-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-seafoam);
}
.offer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}
.offer-header h3 {
  margin: 0;
  font-size: 1.5rem;
  flex: 1;
}
.offer-badge {
  display: inline-block;
  background: var(--color-coral);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  white-space: nowrap;
  flex-shrink: 0;
}
.offer-card p {
  flex: 1;
  margin-bottom: 1rem;
  line-height: 1.5;
}
.offer-dates {
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  padding: 0.8rem;
  background: var(--color-cream);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}
.offer-btn {
  width: 100%;
  background: var(--color-seafoam);
  padding: 0.8rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 0.5rem;
  border: none;
}
.offer-btn:hover {
  background: var(--color-sage);
}

/* BOOKING */
.booking-section {
  background: var(--color-white);
}
.booking-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
}
.booking-info h2 {
  font-size: 2.8rem;
  margin-bottom: 1rem;
}
.booking-info p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
.booking-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.feature {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.feature-icon {
  color: var(--color-seafoam);
  font-size: 1.2rem;
}
.booking-form {
  background: var(--color-cream);
  padding: 2rem;
  border-radius: var(--radius-lg);
}
.booking-form h3 {
  text-align: center;
  margin-bottom: 1.5rem;
}
.form-group {
  margin-bottom: 1.5rem;
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
input,
select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-white);
}
.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  font-weight: 700;
  border-radius: var(--radius-sm);
  cursor: pointer;
  margin-top: 1rem;
  border: none;
}
.submit-btn:hover {
  transform: translateY(-2px);
}
.form-note {
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
  color: var(--color-text-light);
}

/* CONTACTS */
.contact-section {
  background: var(--color-white);
}
.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1100px;
  margin: 3rem auto 0;
}
.contact-left {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.contact-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.2rem;
  background: var(--color-cream);
  border-radius: 16px;
  transition: all 0.3s ease;
}
.contact-card:hover {
  transform: translateX(8px);
  box-shadow: var(--shadow-sm);
}
.contact-icon {
  width: 54px;
  height: 54px;
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.contact-icon i {
  font-size: 1.3rem;
  color: var(--color-text-dark);
}
.contact-details {
  flex: 1;
}
.contact-details h3 {
  font-size: 1rem;
  margin-bottom: 0.4rem;
  color: var(--color-text-light);
  font-weight: 500;
  letter-spacing: 0.5px;
}
.contact-details a {
  display: block;
  color: var(--color-text-dark);
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}
.contact-details a:hover {
  color: var(--color-seafoam);
}
.contact-details p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-light);
  line-height: 1.4;
}
.contact-details .small {
  font-size: 0.8rem;
  color: var(--color-text-light);
}
.map-link {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-seafoam);
  font-weight: 500;
  text-decoration: none;
}
.map-link:hover {
  text-decoration: underline;
}
.contact-right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.contact-map {
  background: var(--color-cream);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.contact-cta {
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  border-radius: 16px;
  padding: 1.8rem;
  text-align: center;
}
.contact-cta p {
  margin: 0 0 1rem 0;
  color: var(--color-text-dark);
  font-size: 1.1rem;
  font-weight: 500;
}
.contact-btn {
  background: var(--color-text-dark);
  color: var(--color-white);
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 40px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.3s ease;
}
.contact-btn i {
  font-size: 1rem;
}
.contact-btn:hover {
  transform: translateY(-3px);
  background: var(--color-white);
  color: var(--color-text-dark);
  box-shadow: var(--shadow-md);
}

@media (max-width: 992px) {
  .contact-container {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}
@media (max-width: 1024px) {
  .booking-wrapper {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}
@media (max-width: 768px) {
  .section {
    padding: 4rem 0;
  }
  .rooms-grid,
  .services-grid,
  .offers-grid {
    grid-template-columns: 1fr;
  }
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  .date-inputs {
    grid-template-columns: 1fr;
  }
  .offer-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .offer-badge {
    white-space: normal;
  }
  .hero-title {
    font-size: 3rem;
  }
  .hero-subtitle {
    font-size: 1.2rem;
  }
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>
