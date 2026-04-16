<template>
  <div class="app-wrapper">
    <Header v-if="!isAuthPage" />

    <main class="main-content" :class="{ 'full-screen': isAuthPage }">
      <RouterView />
    </main>

    <Footer v-if="!isAuthPage" />
    <Notification
      v-for="n in notifications"
      :key="n.id"
      :type="n.type"
      :title="n.title"
      :message="n.message"
      :duration="n.duration"
      :auto-close="n.autoClose"
      @close="closeNotification(n.id)"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/layout/Header.vue";
import Footer from "./components/layout/Footer.vue";
import Notification from "./components/shared/Notification.vue";
import { useNotification } from "./composables/useNotification";

const route = useRoute();
const { notifications, closeNotification } = useNotification();

const isAuthPage = computed(() => {
  return route.name === "auth" || route.name === "register";
});
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  width: 100%;
  padding-top: 80px;
}
.main-content.full-screen {
  padding-top: 0;
  height: 100vh;
}
@media (max-width: 768px) {
  .main-content {
    padding-top: 140px;
  }
  .main-content.full-screen {
    padding-top: 0;
    height: 100vh;
  }
}
</style>
