<template>
  <div class="auth-view">
    <div class="auth-background"></div>
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Вход в систему</h2>
          <p>Войдите в свой аккаунт</p>
        </div>
        <form class="auth-form" @submit.prevent="handleLogin" novalidate>
          <div class="form-group">
            <label>Email</label>
            <input
              type="email"
              v-model.trim="email"
              placeholder="Ваш email"
              required
            />
            <div v-if="errors.email" class="error-message">
              {{ errors.email }}
            </div>
          </div>

          <div class="form-group">
            <label>Пароль</label>
            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model.trim="password"
                placeholder="Ваш пароль"
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

          <div class="form-options">
            <label class="checkbox">
              <input type="checkbox" v-model="remember" />
              <span>Запомнить меня</span>
            </label>
            <a href="#" class="forgot-link" @click.prevent="showForgotPassword"
              >Забыли пароль?</a
            >
          </div>

          <button type="submit" class="auth-btn" :disabled="loading">
            {{ loading ? "Вход..." : "Войти" }}
          </button>

          <div class="auth-divider"><span>или</span></div>

          <div class="auth-footer">
            <p>
              Нет аккаунта?
              <router-link :to="{ name: 'register' }"
                >Зарегистрироваться</router-link
              >
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
const { login } = useAuth();
const { success, error: showError, info } = useNotification();

const email = ref("");
const password = ref("");
const remember = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const errors = ref({});

const handleLogin = async () => {
  errors.value = {};
  let isValid = true;

  if (!email.value.trim()) {
    errors.value.email = "Email обязателен";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = "Введите корректный email";
    isValid = false;
  }

  if (!password.value.trim()) {
    errors.value.password = "Пароль обязателен";
    isValid = false;
  } else if (password.value.length < 6) {
    errors.value.password = "Минимум 6 символов";
    isValid = false;
  }

  if (!isValid) {
    showError("Пожалуйста, исправьте ошибки");
    return;
  }

  loading.value = true;

  const result = await login({ email: email.value, password: password.value });

  if (result.success) {
    success("Успешный вход! Добро пожаловать!");
    router.push({ name: "home" });
  } else {
    showError(result.message || "Ошибка авторизации");
  }

  loading.value = false;
};

const showForgotPassword = () => {
  info("Функция восстановления пароля в разработке");
};
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
  max-width: 420px;
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

.form-group {
  margin-bottom: 1.2rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-text-dark);
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
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
  font-size: 1.1rem;
  color: var(--color-text-light);
  padding: 0;
}

.password-toggle:hover {
  color: var(--color-seafoam);
}

.error-message {
  color: var(--color-coral);
  font-size: 0.7rem;
  margin-top: 0.3rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.8rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--color-text-light);
}

.checkbox input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-seafoam);
  margin: 0;
}

.forgot-link {
  color: var(--color-seafoam);
  text-decoration: none;
  transition: var(--transition);
}

.forgot-link:hover {
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
  margin-bottom: 1rem;
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

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .forgot-link {
    align-self: flex-end;
  }
}
</style>
