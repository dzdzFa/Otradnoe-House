<template>
  <div class="reviews-tab">
    <h3>Отзывы клиентов</h3>

    <div class="add-review-form" v-if="isAuthenticated">
      <h4>Оставить отзыв</h4>
      <form @submit.prevent="submitReview" novalidate>
        <div class="form-group">
          <input
            type="text"
            v-model.trim="newReview.author"
            placeholder="Ваше имя *"
            required
          />
        </div>

        <div class="form-group">
          <div class="rating-select">
            <span
              v-for="s in 5"
              :key="s"
              :class="['star-rating', { active: newReview.rating >= s }]"
              @click="newReview.rating = s"
            >
              ★
            </span>
          </div>
        </div>

        <div class="form-group">
          <textarea
            v-model.trim="newReview.text"
            placeholder="Поделитесь впечатлениями..."
            rows="3"
            required
          ></textarea>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? "Отправка..." : "Отправить отзыв" }}
        </button>
      </form>
    </div>

    <div v-else class="login-prompt">
      <p>
        <router-link :to="{ name: 'auth' }">Войдите</router-link> или
        <router-link :to="{ name: 'register' }">зарегистрируйтесь</router-link>,
        чтобы оставить отзыв
      </p>
    </div>

    <div class="reviews-list" v-if="reviews.length">
      <div class="review-card" v-for="r in reviews" :key="r.id">
        <div class="review-header">
          <span class="review-author">{{ r.author }}</span>
          <span class="review-date">{{ r.date }}</span>
        </div>
        <div class="review-rating">
          <span
            v-for="i in 5"
            :key="i"
            :class="['star', { filled: i <= r.rating }]"
          >
            ★
          </span>
        </div>
        <p class="review-text">{{ r.text }}</p>
      </div>
    </div>
    <div v-else class="no-reviews">
      <p>Отзывов пока нет. Будьте первым!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "../../composables/useAuth";
import { useReviews } from "../../composables/useReviews";
import { useNotification } from "../../composables/useNotification";

const props = defineProps({
  good: {
    type: Object,
    default: null,
  },
});

const { isAuthenticated } = useAuth();
const { getReviewsByGoodId, addReview, loadReviews: loadAll } = useReviews();
const { success, error: showError } = useNotification();

const reviews = ref([]);
const loading = ref(false);

const newReview = ref({
  author: "",
  rating: 5,
  text: "",
});

const loadReviews = () => {
  if (props.good?.id) {
    reviews.value = getReviewsByGoodId(props.good.id);
  }
};

const submitReview = () => {
  if (!newReview.value.author.trim()) {
    showError("Укажите имя");
    return;
  }
  if (!newReview.value.text.trim()) {
    showError("Напишите отзыв");
    return;
  }
  if (newReview.value.text.length < 10) {
    showError("Минимум 10 символов");
    return;
  }

  loading.value = true;

  const result = addReview(props.good.id, {
    author: newReview.value.author,
    rating: newReview.value.rating,
    text: newReview.value.text,
  });

  if (result.success) {
    success(result.message);
    newReview.value = { author: "", rating: 5, text: "" };
    loadReviews(); // Обновление списка
  } else {
    showError(result.message);
  }
  loading.value = false;
};

onMounted(() => {
  loadAll();
  loadReviews();
});
</script>

<style scoped>
.reviews-tab h3 {
  margin-bottom: 1.5rem;
  color: var(--color-text-dark);
}

.add-review-form {
  background: var(--color-cream);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
}

.add-review-form h4 {
  margin-bottom: 1rem;
  color: var(--color-text-dark);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-seafoam);
}

.rating-select {
  display: flex;
  gap: 0.5rem;
}

.star-rating {
  font-size: 2rem;
  color: var(--color-border);
  cursor: pointer;
  transition: var(--transition);
}

.star-rating.active {
  color: var(--color-seafoam);
}

.star-rating:hover {
  transform: scale(1.1);
}

.submit-btn {
  background: var(--color-seafoam);
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: var(--transition);
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-sage);
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-prompt {
  background: var(--color-cream);
  padding: 1.5rem;
  text-align: center;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
}

.login-prompt a {
  color: var(--color-seafoam);
  font-weight: 600;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  background: var(--color-cream);
  padding: 1.5rem;
  border-radius: var(--radius-md);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.review-author {
  font-weight: 600;
  color: var(--color-text-dark);
}

.review-date {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.review-rating {
  margin-bottom: 0.8rem;
}

.star {
  color: var(--color-border);
  font-size: 1.2rem;
}

.star.filled {
  color: var(--color-seafoam);
}

.review-text {
  line-height: 1.6;
  margin: 0;
  color: var(--color-text-light);
}

.no-reviews {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
}
</style>
