<template>
  <div class="auth-view">
    <div class="auth-background"></div>
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Регистрация</h2>
          <p>Создайте новый аккаунт</p>
        </div>
        <form class="auth-form" @submit.prevent="handleRegister" novalidate>
          <div class="form-group">
            <label>Имя</label>
            <input
              type="text"
              v-model.trim="form.name"
              placeholder="Ваше имя"
              required
            />
            <div v-if="errors.name" class="error-message">
              {{ errors.name }}
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              v-model.trim="form.email"
              placeholder="Ваш email"
              required
            />
            <div v-if="errors.email" class="error-message">
              {{ errors.email }}
            </div>
          </div>

          <div class="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              v-model.trim="form.phone"
              placeholder="+7 (999) 123-45-67"
              maxlength="18"
              pattern="^[0-9+\-\s()]{10,18}$"
              @input="filterPhoneInput"
              required
            />
            <div v-if="errors.phone" class="error-message">
              {{ errors.phone }}
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Пароль</label>
              <div class="password-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model.trim="form.password"
                  placeholder="Придумайте пароль"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? "🙈" : "👁️" }}
                </button>
              </div>
              <div v-if="errors.password" class="error-message">
                {{ errors.password }}
              </div>
            </div>
            <div class="form-group">
              <label>Подтвердите пароль</label>
              <div class="password-wrapper">
                <input
                  :type="showConfirm ? 'text' : 'password'"
                  v-model.trim="form.confirmPassword"
                  placeholder="Повторите пароль"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showConfirm = !showConfirm"
                >
                  {{ showConfirm ? "🙈" : "👁️" }}
                </button>
              </div>
              <div v-if="errors.confirmPassword" class="error-message">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox">
              <input type="checkbox" v-model="form.agreeTerms" required />
              <span>
                Я согласен с
                <a href="#" @click.prevent="showTerms"
                  >правилами бронирования</a
                >
                и
                <a href="#" @click.prevent="showPrivacy"
                  >политикой конфиденциальности</a
                >
              </span>
            </label>
            <div v-if="errors.agreeTerms" class="error-message">
              {{ errors.agreeTerms }}
            </div>

            <label class="checkbox">
              <input type="checkbox" v-model="form.subscribe" />
              <span>Подписаться на рассылку спецпредложений</span>
            </label>
          </div>

          <button type="submit" class="auth-btn" :disabled="loading">
            {{ loading ? "Регистрация..." : "Зарегистрироваться" }}
          </button>

          <div class="auth-divider"><span>или</span></div>

          <div class="auth-footer">
            <p>
              Уже есть аккаунт?
              <router-link :to="{ name: 'auth' }">Войти</router-link>
            </p>
            <router-link :to="{ name: 'home' }" class="back-link"
              >← Вернуться на главную</router-link
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { useNotification } from "../composables/useNotification";

const router = useRouter();
const { register } = useAuth();
const { success, error: showError, info } = useNotification();

const loading = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);

const form = ref({
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
  subscribe: true,
});

const errors = ref({});

const filterPhoneInput = (e) => {
  const cleaned = e.target.value.replace(/[^\d+\-\s()]/g, "");
  form.value.phone = cleaned.length > 18 ? cleaned.slice(0, 18) : cleaned;
};

const validate = () => {
  errors.value = {};
  let isValid = true;

  if (!form.value.name.trim() || form.value.name.length < 2) {
    errors.value.name = "Имя обязательно (мин. 2 символа)";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email.trim()) {
    errors.value.email = "Email обязателен";
    isValid = false;
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = "Введите корректный email";
    isValid = false;
  }

  const phoneRegex = /^[0-9+\-\s()]{10,18}$/;
  if (!form.value.phone.trim()) {
    errors.value.phone = "Телефон обязателен";
    isValid = false;
  } else if (!phoneRegex.test(form.value.phone)) {
    errors.value.phone = "Введите корректный номер (10-18 символов)";
    isValid = false;
  }

  if (!form.value.password.trim()) {
    errors.value.password = "Пароль обязателен";
    isValid = false;
  } else if (form.value.password.length < 6) {
    errors.value.password = "Минимум 6 символов";
    isValid = false;
  }

  if (!form.value.confirmPassword.trim()) {
    errors.value.confirmPassword = "Подтвердите пароль";
    isValid = false;
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = "Пароли не совпадают";
    isValid = false;
  }

  if (!form.value.agreeTerms) {
    errors.value.agreeTerms = "Примите условия использования";
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validate()) {
    showError("Пожалуйста, исправьте ошибки");
    return;
  }

  loading.value = true;

  const result = await register({
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    password: form.value.password,
    subscribe: form.value.subscribe,
  });

  if (result.success) {
    success("Регистрация успешна! Добро пожаловать!");
    router.push({ name: "home" });
  } else {
    showError(result.message || "Ошибка регистрации");
  }

  loading.value = false;
};

const showTerms = () => info("Страница правил бронирования в разработке");
const showPrivacy = () =>
  info("Страница политики конфиденциальности в разработке");
</script>

<style scoped>
.auth-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-sand), var(--color-cream));
  padding: 2rem;
}

.auth-background {
  position: fixed;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  z-index: 0;
}

.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
}

.auth-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.auth-header {
  padding: 2rem 2rem 1.5rem;
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  text-align: center;
}

.auth-header h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-dark);
  font-weight: 600;
}

.auth-header p {
  color: var(--color-text-light);
  margin: 0;
  font-size: 0.9rem;
}

.auth-form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0;
}

.form-group {
  margin-bottom: 1rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-text-dark);
}

.form-group input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  transition: var(--transition);
  background: var(--color-white);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-seafoam);
  box-shadow: 0 0 0 2px rgba(184, 225, 221, 0.2);
}

.password-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--color-text-light);
  padding: 0;
}

.password-toggle:hover {
  color: var(--color-seafoam);
}

.error-message {
  color: var(--color-coral);
  font-size: 0.7rem;
  margin-top: 0.25rem;
}

.form-options {
  margin: 1.2rem 0;
}

.checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--color-text-light);
  line-height: 1.4;
}

.checkbox input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-seafoam);
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.checkbox a {
  color: var(--color-seafoam);
  text-decoration: none;
}

.checkbox a:hover {
  text-decoration: underline;
}

.auth-btn {
  width: 100%;
  padding: 0.85rem;
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-dark);
  cursor: pointer;
  margin: 1rem 0;
  transition: var(--transition);
}

.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: 1rem 0;
  color: var(--color-text-light);
  font-size: 0.8rem;
}

.auth-divider::before,
.auth-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.auth-divider span {
  padding: 0 1rem;
}

.auth-footer {
  text-align: center;
  font-size: 0.85rem;
}

.auth-footer p {
  margin-bottom: 0.5rem;
  color: var(--color-text-light);
}

.auth-footer a {
  color: var(--color-seafoam);
  font-weight: 600;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.back-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--color-text-light) !important;
  font-weight: 500 !important;
  font-size: 0.8rem;
}

.back-link:hover {
  color: var(--color-seafoam) !important;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-view {
    padding: 1rem;
  }
  .auth-container {
    max-width: 100%;
  }
  .auth-header {
    padding: 1.5rem;
  }
  .auth-header h2 {
    font-size: 1.5rem;
  }
  .auth-form {
    padding: 1.5rem;
  }
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .form-group {
    margin-bottom: 1rem;
  }
  .checkbox {
    font-size: 0.8rem;
  }
}
</style>
