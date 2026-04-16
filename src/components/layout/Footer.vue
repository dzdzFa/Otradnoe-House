<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="container footer-content">
        <div class="footer-section footer-logo">
          <h3>Otradnoe</h3>
          <p>Гостиничный комплекс</p>
          <p class="footer-description">
            Премиум-отдых на берегу Чёрного моря в поселке Оленевка, Крым.
          </p>
          <div class="social-links">
            <a href="#" class="social-link">Instagram</a>
            <a href="#" class="social-link">Facebook</a>
            <a href="#" class="social-link">Telegram</a>
          </div>
        </div>

        <div class="footer-section">
          <h4>Навигация</h4>
          <nav class="footer-nav">
            <RouterLink
              v-for="item in navItems"
              :key="item.id"
              :to="{ name: item.route }"
              class="footer-link"
            >
              {{ item.name }}
            </RouterLink>
          </nav>
        </div>

        <div class="footer-section">
          <h4>Контакты</h4>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon">📍</span>
              <div>
                <p>Крым, п. Оленевка, ул. Морская, 12</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  class="map-link"
                >
                  Посмотреть на карте →
                </a>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📞</span>
              <div>
                <a href="tel:+79781234567" class="phone-link"
                  >+7 (978) 123-45-67</a
                >
                <p>Ежедневно с 8:00 до 22:00</p>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">✉️</span>
              <div>
                <a href="mailto:info@otradnoe.ru" class="email-link"
                  >info@otradnoe.ru</a
                >
              </div>
            </div>
          </div>
        </div>

        <div class="footer-section">
          <h4>Спецпредложения</h4>
          <p>Подпишитесь на рассылку, чтобы получать информацию о скидках</p>
          <form class="newsletter-form" @submit.prevent="subscribe" novalidate>
            <input
              type="email"
              v-model.trim="email"
              placeholder="Ваш email"
              required
              class="newsletter-input"
            />
            <button type="submit" class="newsletter-btn">Подписаться</button>
          </form>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-inner">
          <p>© 2026 Гостиничный комплекс «Otradnoe». Все права защищены.</p>
          <div class="legal-links">
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Пользовательское соглашение</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useNotification } from "../../composables/useNotification";

const { success, error } = useNotification();

const email = ref("");

const navItems = [
  { id: 1, name: "Главная", route: "home" },
  { id: 2, name: "Номера", route: "rooms-list" },
  { id: 3, name: "Услуги", route: "goods-list" },
  { id: 4, name: "Контакты", route: "contacts" },
];

const subscribe = () => {
  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error("Введите корректный email");
    return;
  }

  const subscribers = JSON.parse(
    localStorage.getItem("otradnoe_subscribers") || "[]",
  );

  if (subscribers.includes(email.value)) {
    error("Вы уже подписаны на рассылку");
    return;
  }

  subscribers.push(email.value);
  localStorage.setItem("otradnoe_subscribers", JSON.stringify(subscribers));

  success(
    `Спасибо за подписку! На ${email.value} будут приходить спецпредложения.`,
  );
  email.value = "";
};
</script>

<style scoped>
.footer {
  width: 100%;
  margin-top: auto;
}

.footer-top {
  width: 100%;
  background: var(--color-cream);
  border-top: 1px solid var(--color-border);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  padding: 4rem 0;
}

.footer-section h4 {
  color: var(--color-text-dark);
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.footer-logo h3 {
  font-size: 1.5rem;
  margin: 0;
}

.footer-logo p {
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.footer-description {
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: var(--color-text-light);
  font-weight: 500;
  transition: var(--transition);
}

.social-link:hover {
  color: var(--color-seafoam);
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.footer-link {
  color: var(--color-text-light);
  transition: var(--transition);
  text-decoration: none;
}

.footer-link:hover {
  color: var(--color-text-dark);
  transform: translateX(5px);
}

.footer-link.router-link-active {
  color: var(--color-seafoam);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
}

.contact-icon {
  font-size: 1.2rem;
  color: var(--color-seafoam);
  flex-shrink: 0;
}

.contact-item p {
  margin: 0;
  color: var(--color-text-light);
  line-height: 1.4;
}

.map-link,
.phone-link,
.email-link {
  color: var(--color-seafoam);
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
}

.map-link:hover,
.phone-link:hover,
.email-link:hover {
  color: var(--color-sage);
  text-decoration: underline;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.newsletter-input {
  padding: 0.9rem 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  background: var(--color-white);
  transition: var(--transition);
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--color-seafoam);
}

.newsletter-btn {
  padding: 0.9rem 1.2rem;
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  color: var(--color-text-dark);
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.newsletter-btn:hover {
  transform: translateY(-2px);
}

.footer-bottom {
  width: 100%;
  background: var(--color-sand);
  border-top: 1px solid var(--color-border);
}

.footer-bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 2rem 0;
}

.footer-bottom-inner p {
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.legal-links {
  display: flex;
  gap: 1.5rem;
}

.legal-links a {
  color: var(--color-text-light);
  font-size: 0.9rem;
  transition: var(--transition);
}

.legal-links a:hover {
  color: var(--color-text-dark);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 3rem 0;
  }

  .footer-bottom-inner {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .legal-links {
    flex-direction: column;
    gap: 0.8rem;
  }
}
</style>
