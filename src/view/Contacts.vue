<template>
  <div class="contacts-view">
    <section class="page-header section">
      <Container>
        <h1 class="page-title">Контакты</h1>
        <p class="page-subtitle">Свяжитесь с нами любым удобным способом</p>
      </Container>
    </section>

    <section class="contacts-section section">
      <Container>
        <div class="contacts-grid">
          <div class="contact-card" v-for="c in contacts" :key="c.title">
            <div class="contact-icon">{{ c.icon }}</div>
            <h3>{{ c.title }}</h3>
            <p v-for="line in c.lines" :key="line">{{ line }}</p>
            <a v-if="c.link" :href="c.link.href" class="contact-link">
              {{ c.link.text }} →
            </a>
          </div>
        </div>
      </Container>
    </section>

    <section class="map-form-section section">
      <Container>
        <div class="map-form-grid">
          <div class="map-container">
            <h3>Как нас найти</h3>
            <div class="map-wrapper">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=32.587000%2C45.378000&z=15&pt=32.587000%2C45.378000&l=map"
                width="100%"
                height="400"
                frameborder="0"
                allowfullscreen
              ></iframe>
              <p class="map-note">
                п. Оленевка, ул. Морская, 12
                <a
                  href="https://yandex.ru/maps/?pt=32.587000,45.378000&z=17"
                  target="_blank"
                  class="map-link"
                >
                  Открыть в Яндекс.Картах →
                </a>
              </p>
            </div>
          </div>

          <div class="feedback-form-container">
            <h3>Написать нам</h3>
            <form
              class="feedback-form"
              @submit.prevent="submitFeedback"
              novalidate
            >
              <input
                type="text"
                v-model.trim="form.name"
                placeholder="Ваше имя *"
                required
              />

              <input
                type="email"
                v-model.trim="form.email"
                placeholder="Ваш email *"
                required
              />

              <input
                type="tel"
                v-model.trim="form.phone"
                placeholder="Телефон"
              />

              <select v-model="form.subject" required>
                <option value="" disabled>Тема обращения *</option>
                <option value="booking">Бронирование</option>
                <option value="question">Вопрос о номерах</option>
                <option value="restaurant">Ресторан Lavanda</option>
                <option value="other">Другое</option>
              </select>

              <textarea
                v-model.trim="form.message"
                placeholder="Ваше сообщение *"
                rows="5"
                required
              ></textarea>

              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? "Отправка..." : "Отправить сообщение" }}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Container from "../components/shared/Container.vue";
import { useNotification } from "../composables/useNotification";

const { success, error: showError } = useNotification();
const loading = ref(false);

const form = reactive({
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

const contacts = [
  {
    icon: "📍",
    title: "Адрес",
    lines: ["Крым, п. Оленевка, ул. Морская, 12"],
    link: { href: "https://maps.google.com", text: "Посмотреть на карте" },
  },
  {
    icon: "📞",
    title: "Телефон",
    lines: ["+7 (978) 123-45-67", "Ежедневно с 8:00 до 22:00"],
    link: { href: "tel:+79781234567", text: "Позвонить сейчас" },
  },
  {
    icon: "✉️",
    title: "Email",
    lines: ["info@otradnoe.ru", "booking@otradnoe.ru"],
    link: { href: "mailto:info@otradnoe.ru", text: "Написать письмо" },
  },
  {
    icon: "⏰",
    title: "Ресепшн",
    lines: ["Круглосуточно", "Заезд: с 14:00", "Выезд: до 12:00"],
  },
];

const submitFeedback = () => {
  if (!form.name || !form.email || !form.subject || !form.message) {
    showError("Пожалуйста, заполните все обязательные поля");
    return;
  }

  loading.value = true;

  setTimeout(() => {
    success(
      `Спасибо, ${form.name}! Ваше сообщение отправлено. Мы ответим в течение 24 часов.`,
    );

    form.name = "";
    form.email = "";
    form.phone = "";
    form.subject = "";
    form.message = "";

    loading.value = false;
  }, 500);
};
</script>

<style scoped>
.contacts-view {
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

.contacts-section {
  padding: 2rem 0;
}
.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.contact-card {
  background: var(--color-white);
  padding: 2rem;
  border-radius: var(--radius-md);
  text-align: center;
  transition: var(--transition);
}
.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}
.contact-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.contact-card h3 {
  margin-bottom: 1rem;
}
.contact-card p {
  margin-bottom: 0.5rem;
  color: var(--color-text-light);
}
.contact-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--color-seafoam);
  font-weight: 600;
  text-decoration: none;
}

.map-form-section {
  padding: 4rem 0;
  background: var(--color-white);
}
.map-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}
.map-container h3,
.feedback-form-container h3 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}
.map-wrapper {
  background: var(--color-cream);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
}
.map-note {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-top: 0.5rem;
  text-align: center;
}
.map-link {
  color: var(--color-seafoam);
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.feedback-form input,
.feedback-form select,
.feedback-form textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  transition: var(--transition);
  font-family: inherit;
}
.feedback-form input:focus,
.feedback-form select:focus,
.feedback-form textarea:focus {
  outline: none;
  border-color: var(--color-seafoam);
}
.submit-btn {
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .map-form-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
@media (max-width: 768px) {
  .contacts-grid {
    grid-template-columns: 1fr;
  }
  .page-title {
    font-size: 2.5rem;
  }
}
</style>
