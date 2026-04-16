<template>
  <header class="header">
    <div class="header-top">
      <Container size="large">
        <div class="header-top-inner">
          <div class="header-contacts">
            <a href="tel:+79781234567" class="header-contact"
              >📞 +7 (978) 123-45-67</a
            >
            <a href="mailto:info@otradnoe.ru" class="header-contact"
              >✉️ info@otradnoe.ru</a
            >
            <span class="header-contact">📍 Крым, п. Оленевка</span>
          </div>
          <div class="header-social">
            <a href="#" class="social-link">Instagram</a>
            <a href="#" class="social-link">Telegram</a>
          </div>
        </div>
      </Container>
    </div>

    <div class="header-main">
      <Container size="large">
        <div class="header-main-inner">
          <RouterLink :to="{ name: 'home' }" class="header-logo">
            <span class="logo-brand">OTRADNOE</span>
            <span class="logo-subtitle">гостиничный комплекс</span>
          </RouterLink>

          <nav class="header-nav desktop">
            <RouterLink
              v-for="item in navItems"
              :key="item.id"
              :to="{ name: item.route, hash: item.hash || '' }"
              class="nav-link"
              :active-class="item.hash ? '' : 'active'"
            >
              {{ item.name }}
            </RouterLink>

            <RouterLink
              :to="{ name: 'restaurant' }"
              class="nav-link nav-link-lavanda"
            >
              Lavanda
            </RouterLink>
          </nav>

          <div class="header-auth user-menu">
            <button
              v-if="!isAuthenticated"
              class="auth-btn"
              @click="router.push({ name: 'auth' })"
            >
              Войти
            </button>
            <button
              v-else
              class="auth-btn"
              type="button"
              @click="toggleDropdown"
            >
              <span class="user-initials">{{ userInitials }}</span>
            </button>

            <div v-if="isAuthenticated && isDropdownOpen" class="dropdown-menu">
              <div class="dropdown-user">
                <strong>{{ user?.name }}</strong>
                <span :class="['user-role', isAdmin ? 'admin' : 'user']">
                  {{ isAdmin ? "ADMIN" : "USER" }}
                </span>
              </div>

              <RouterLink
                :to="{ name: 'my-bookings' }"
                class="dropdown-link"
                @click="closeDropdown"
              >
                Мои бронирования
              </RouterLink>

              <RouterLink
                v-if="isAdmin"
                :to="{ name: 'admin-panel' }"
                class="dropdown-link"
                @click="closeDropdown"
              >
                Админ-панель
              </RouterLink>

              <div class="dropdown-divider"></div>
              <div class="role-switcher">
                <button @click.stop="setRole('user')" class="role-btn">
                  Гость
                </button>
                <button @click.stop="setRole('admin')" class="role-btn">
                  Админ
                </button>
              </div>

              <button @click="handleLogout" class="dropdown-link logout">
                Выйти
              </button>
            </div>
          </div>

          <button class="mobile-toggle" @click="toggleMenu" aria-label="Меню">
            ☰
          </button>
        </div>

        <div v-if="isMenuOpen" class="mobile-menu">
          <RouterLink
            v-for="item in navItems"
            :key="item.id"
            :to="{ name: item.route, hash: item.hash || '' }"
            class="mobile-link"
            @click="closeMobileMenu"
          >
            {{ item.name }}
          </RouterLink>

          <RouterLink
            :to="{ name: 'restaurant' }"
            class="mobile-link mobile-link-lavanda"
            @click="closeMobileMenu"
          >
            Lavanda
          </RouterLink>

          <div v-if="!isAuthenticated" class="mobile-auth">
            <RouterLink
              :to="{ name: 'auth' }"
              class="mobile-link"
              @click="closeMobileMenu"
              >Войти</RouterLink
            >
            <RouterLink
              :to="{ name: 'register' }"
              class="mobile-link"
              @click="closeMobileMenu"
              >Регистрация</RouterLink
            >
          </div>
          <div v-else class="mobile-auth">
            <span class="mobile-user"
              >{{ user?.name }} ({{ isAdmin ? "ADMIN" : "USER" }})</span
            >
            <button @click="handleLogoutMobile" class="mobile-link logout">
              Выйти
            </button>
          </div>
        </div>
      </Container>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import Container from "../shared/Container.vue";
import { useAuth } from "../../composables/useAuth";
import { useNav } from "../../composables/useNav";

const router = useRouter();
const { user, isAuthenticated, isAdmin, logout } = useAuth();
const { navItems } = useNav();

const isMenuOpen = ref(false);
const isDropdownOpen = ref(false);

const userInitials = computed(() => {
  if (!user.value?.name) return "";
  return user.value.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    isDropdownOpen.value = false;
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

const closeMobileMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = "";
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) isMenuOpen.value = false;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const handleClickOutside = (e) => {
  const dropdown = document.querySelector(".user-menu");
  if (dropdown && !dropdown.contains(e.target)) {
    isDropdownOpen.value = false;
  }
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (
    isMenuOpen.value &&
    mobileMenu &&
    !mobileMenu.contains(e.target) &&
    (!mobileToggle || !mobileToggle.contains(e.target))
  ) {
    closeMobileMenu();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.body.style.overflow = "";
});

const handleLogout = () => {
  logout();
  closeDropdown();
  router.push({ name: "home" });
};

const handleLogoutMobile = () => {
  logout();
  closeMobileMenu();
  router.push({ name: "home" });
};

const setRole = (role) => {
  if (!isAuthenticated.value) {
    user.value = {
      id: Date.now(),
      name: "Тестовый",
      email: "test@test.ru",
      role: role === "admin" ? "admin" : "user",
    };
  } else {
    user.value.role = role === "admin" ? "admin" : "user";
  }
  closeDropdown();
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}
.header-top {
  background: var(--color-sand);
  padding: 0.5rem 0;
  font-size: 0.85rem;
}
.header-top-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.header-contacts {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.header-contact,
.social-link {
  color: var(--color-text-light);
  transition: var(--transition);
}
.header-contact:hover,
.social-link:hover {
  color: var(--color-seafoam);
}
.header-social {
  display: flex;
  gap: 1rem;
}

.header-main {
  padding: 1rem 0;
}
.header-main-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-logo {
  display: flex;
  flex-direction: column;
  text-decoration: none;
}
.logo-brand {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text-dark);
  letter-spacing: 0.1em;
}
.logo-subtitle {
  font-size: 0.75rem;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.header-nav.desktop {
  display: flex;
  gap: 2rem;
}
.nav-link {
  color: var(--color-text-light);
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: var(--transition);
}
.nav-link:hover,
.nav-link.active {
  color: var(--color-seafoam);
  border-bottom-color: var(--color-seafoam);
}

.nav-link-lavanda {
  color: var(--color-lavender);
  font-weight: 700;
  border-bottom-color: var(--color-lavender);
}
.nav-link-lavanda:hover,
.nav-link-lavanda.active {
  color: var(--color-text-dark);
  border-bottom-color: var(--color-lavender);
}

.header-auth {
  position: relative;
}
.auth-btn {
  background: var(--color-seafoam);
  color: var(--color-text-dark);
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  border: none;
}
.auth-btn:hover {
  background: var(--color-sage);
  transform: translateY(-2px);
}
.user-initials {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-seafoam);
  border-radius: 50%;
  font-weight: 700;
  color: var(--color-text-dark);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 220px;
  padding: 1rem 0;
  z-index: 1001;
  border: 1px solid var(--color-border);
}
.dropdown-user {
  padding: 0 1rem 1rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 0.5rem;
}
.dropdown-user strong {
  display: block;
  color: var(--color-text-dark);
  margin-bottom: 0.25rem;
}
.user-role {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}
.user-role.admin {
  background: rgba(184, 225, 221, 0.3);
  color: var(--color-sage);
}
.user-role.user {
  background: var(--color-cream);
  color: var(--color-text-light);
}
.dropdown-link {
  display: block;
  padding: 0.6rem 1rem;
  color: var(--color-text-light);
  text-decoration: none;
  transition: var(--transition);
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 0.95rem;
}
.dropdown-link:hover {
  background: var(--color-cream);
  color: var(--color-text-dark);
}
.dropdown-link.logout {
  color: var(--color-coral);
  border-top: 1px solid var(--color-border);
  margin-top: 0.5rem;
  padding-top: 1rem;
}
.dropdown-divider {
  height: 1px;
  background: var(--color-border);
  margin: 0.5rem 0;
}
.role-switcher {
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem 0.5rem;
}
.role-btn {
  flex: 1;
  padding: 0.4rem 0.6rem;
  font-size: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-cream);
  cursor: pointer;
  transition: var(--transition);
}
.role-btn:hover {
  background: var(--color-seafoam);
  border-color: var(--color-seafoam);
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: var(--color-text-dark);
  padding: 0.5rem;
  transition: var(--transition);
}
.mobile-toggle:hover {
  color: var(--color-seafoam);
  transform: scale(1.1);
}
.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
  background: var(--color-cream);
  border-radius: var(--radius-md);
  margin-top: 1rem;
  border: 1px solid var(--color-border);
}
.mobile-link {
  display: block;
  padding: 0.8rem 1.5rem;
  color: var(--color-text-dark);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  border-left: 3px solid transparent;
}
.mobile-link:hover,
.mobile-link.active {
  background: var(--color-white);
  border-left-color: var(--color-seafoam);
  color: var(--color-seafoam);
}
.mobile-link.logout {
  color: var(--color-coral);
}
.mobile-auth {
  padding: 0.5rem 1.5rem;
  border-top: 1px solid var(--color-border);
  margin-top: 0.5rem;
}
.mobile-user {
  display: block;
  padding: 0.5rem 0;
  color: var(--color-text-light);
  font-size: 0.9rem;
}
.mobile-link-lavanda {
  color: var(--color-lavender);
  font-weight: 700;
  border-left-color: var(--color-lavender);
}

@media (max-width: 1024px) {
  .header-nav.desktop {
    display: none;
  }
  .mobile-toggle {
    display: block;
  }
  .mobile-menu {
    display: flex;
  }
}
@media (max-width: 480px) {
  .header-top-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .header-contacts {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .logo-brand {
    font-size: 1.3rem;
  }
  .logo-subtitle {
    font-size: 0.7rem;
  }
}
</style>
