<template>
  <div class="not-found-view">
    <Container>
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Страница не найдена</h2>
        <p class="error-message">
          К сожалению, страница, которую вы ищете, не существует или была
          перемещена.
        </p>
        <div class="error-actions">
          <router-link :to="{ name: 'home' }" class="btn-home">
            🏠 Вернуться на главную
          </router-link>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup>
import Container from "../components/shared/Container.vue";
</script>

<style scoped>
.not-found-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-cream);
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
}

.error-code {
  font-size: 8rem;
  font-weight: 800;
  color: var(--color-seafoam);
  margin: 0;
  line-height: 1;
  text-shadow: 2px 2px 0 var(--color-sage);
}

.error-title {
  font-size: 2.5rem;
  margin: 1rem 0;
  color: var(--color-text-dark);
}

.error-message {
  font-size: 1.2rem;
  color: var(--color-text-light);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  margin-top: 2rem;
}

.btn-home {
  display: inline-block;
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  color: var(--color-text-dark);
  padding: 1rem 2rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
}

.btn-home:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .error-code {
    font-size: 5rem;
  }
  .error-title {
    font-size: 2rem;
  }
  .error-message {
    font-size: 1rem;
  }
}
</style>
