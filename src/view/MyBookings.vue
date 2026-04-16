<template>
  <div class="my-bookings-view">
    <section class="page-header section">
      <Container>
        <h1 class="page-title">Мои бронирования</h1>
        <p class="page-subtitle">Просмотр и управление вашими бронированиями</p>
      </Container>
    </section>

    <section class="bookings-section section">
      <Container>
        <div v-if="bookings.length" class="bookings-list">
          <div
            v-for="booking in bookings"
            :key="booking.id"
            class="booking-card"
            :class="{ cancelled: booking.status === 'Отменено' }"
          >
            <div class="booking-header">
              <div class="booking-info">
                <h3>{{ booking.roomName }}</h3>
                <span
                  :class="[
                    'status-badge',
                    booking.status === 'Подтверждено'
                      ? 'confirmed'
                      : 'cancelled',
                  ]"
                >
                  {{ booking.status }}
                </span>
              </div>
              <div class="booking-date">{{ booking.createdAt }}</div>
            </div>
            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Даты: </span>
                <span class="detail-value"
                  >{{ formatDate(booking.checkIn) }} —
                  {{ formatDate(booking.checkOut) }}</span
                >
              </div>
              <div class="detail-row">
                <span class="detail-label">Ночей: </span>
                <span class="detail-value">{{ booking.nights }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Гости: </span>
                <span class="detail-value">{{
                  getGuestsText(booking.guests)
                }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Стоимость: </span>
                <span class="detail-value price"
                  >{{ booking.totalPrice.toLocaleString() }} ₽</span
                >
              </div>
            </div>
            <div class="booking-actions" v-if="booking.status !== 'Отменено'">
              <button class="btn-cancel" @click="cancel(booking.id)">
                Отменить бронирование
              </button>
            </div>
          </div>
        </div>
        <div v-else class="no-bookings">
          <div class="empty-state">
            <span class="empty-icon">📅</span>
            <h3>У вас пока нет бронирований</h3>
            <p>Перейдите в каталог номеров и забронируйте номер</p>
            <router-link :to="{ name: 'rooms-list' }" class="btn-book-now">
              Забронировать номер
            </router-link>
          </div>
        </div>
      </Container>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Container from "../components/shared/Container.vue";
import { useAuth } from "../composables/useAuth";
import { useBookings } from "../composables/useBookings";
import { useNotification } from "../composables/useNotification";

const router = useRouter();
const { user, isAuthenticated } = useAuth();
const { getUserBookings, cancelBooking, loadBookings } = useBookings();
const { success, error: showError } = useNotification();

const bookings = ref([]);

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getGuestsText = (guests) => {
  const map = {
    1: "1 взрослый",
    2: "2 взрослых",
    3: "2 взрослых + 1 ребенок",
    4: "2 взрослых + 2 ребенка",
    5: "Большая компания",
  };
  return map[guests] || `${guests} гостей`;
};

const load = () => {
  if (!isAuthenticated.value) return router.push({ name: "auth" });

  loadBookings();
  bookings.value = getUserBookings(user.value?.id);
  bookings.value.sort((a, b) => b.id - a.id);
};

const cancel = (id) => {
  if (confirm("Вы уверены, что хотите отменить бронирование?")) {
    const result = cancelBooking(id, user.value?.id);
    if (result.success) {
      success(result.message);
      load();
    } else showError(result.message);
  }
};

onMounted(load);
</script>

<style scoped>
.my-bookings-view {
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

.bookings-section {
  padding: 2rem 0 4rem;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.booking-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--color-seafoam);
}

.booking-card.cancelled {
  border-left-color: var(--color-coral);
  opacity: 0.7;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.booking-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.booking-info h3 {
  margin: 0;
  font-size: 1.3rem;
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.confirmed {
  background: rgba(184, 225, 221, 0.3);
  color: var(--color-sage);
}

.status-badge.cancelled {
  background: rgba(255, 182, 185, 0.3);
  color: var(--color-coral);
}

.booking-date {
  color: var(--color-text-light);
  font-size: 0.85rem;
}

.booking-details {
  margin: 1rem 0;
  padding: 1rem;
  background: var(--color-cream);
  border-radius: var(--radius-sm);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px dashed var(--color-border);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-value.price {
  color: var(--color-seafoam);
  font-size: 1.2rem;
}

.booking-actions {
  margin-top: 1rem;
  text-align: right;
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--color-coral);
  color: var(--color-coral);
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
}

.btn-cancel:hover {
  background: var(--color-coral);
  color: var(--color-text-dark);
}

.no-bookings {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.btn-book-now {
  display: inline-block;
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  padding: 1rem 2rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
}

.btn-book-now:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .booking-header {
    flex-direction: column;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.3rem;
  }

  .booking-actions {
    text-align: center;
  }

  .btn-cancel {
    width: 100%;
  }
}
</style>
