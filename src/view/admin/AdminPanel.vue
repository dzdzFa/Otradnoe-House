<template>
  <div class="admin-panel-view">
    <div class="container">
      <div class="breadcrumbs">
        <RouterLink :to="{ name: 'home' }">Главная</RouterLink>
        <span> > </span>
        <span>Панель администратора</span>
      </div>

      <div class="admin-header">
        <h1>Панель администратора</h1>
        <p>Управление товарами и услугами комплекса</p>
      </div>

      <div class="admin-nav">
        <router-link
          v-for="item in navItems"
          :key="item.id"
          :to="{ name: item.route }"
          :class="['nav-item', { active: isActive(item.route) }]"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </div>

      <div class="admin-content">
        <router-view :key="$route.fullPath" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "../../composables/useAuth";
import { useNav } from "../../composables/useNav";

const route = useRoute();
const router = useRouter();
const { isAdmin } = useAuth();
const { adminNavItems } = useNav();

const navItems = adminNavItems.value;

const isActive = (routeName) =>
  route.name === routeName || route.name?.startsWith(routeName);

watch(isAdmin, (newValue) => {
  if (!newValue) {
    router.push({ name: "home" });
  }
});
</script>

<style scoped>
.admin-panel-view {
  background: var(--color-cream);
  min-height: 100vh;
  padding: 2rem 0;
}
.breadcrumbs {
  padding: 1rem 0;
  margin-bottom: 2rem;
  color: var(--color-text-light);
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
}

.admin-header {
  margin-bottom: 3rem;
}
.admin-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.admin-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.5rem;
  background: var(--color-white);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-light);
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
}
.nav-item:hover {
  border-color: var(--color-seafoam);
  color: var(--color-text-dark);
}
.nav-item.active {
  background: var(--color-seafoam);
  border-color: var(--color-seafoam);
  color: var(--color-text-dark);
}
.nav-icon {
  font-size: 1.3rem;
}

.admin-content {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .admin-nav {
    flex-direction: column;
  }
  .nav-item {
    width: 100%;
  }
}
</style>
