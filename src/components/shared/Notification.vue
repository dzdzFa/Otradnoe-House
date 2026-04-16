<template>
  <transition name="notification">
    <div v-if="isVisible" :class="['notification', type]" @click="close">
      <div class="notification-icon">
        <span v-if="type === 'success'">✅</span>
        <span v-if="type === 'error'">❌</span>
        <span v-if="type === 'warning'">⚠️</span>
        <span v-if="type === 'info'">ℹ️</span>
      </div>
      <div class="notification-content">
        <h4 v-if="title" class="notification-title">{{ title }}</h4>
        <p class="notification-message">{{ message }}</p>
      </div>
      <button class="notification-close" @click.stop="close">×</button>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  type: { type: String, default: "info" },
  title: String,
  message: { type: String, required: true },
  duration: { type: Number, default: 5000 },
  autoClose: { type: Boolean, default: true },
});

const emit = defineEmits(["close"]);

const isVisible = ref(true);
let timer = null;

const close = () => {
  isVisible.value = false;
  if (timer) clearTimeout(timer);
  setTimeout(() => emit("close"), 300);
};

onMounted(() => {
  if (props.autoClose) {
    timer = setTimeout(close, props.duration);
  }
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 400px;
  background: var(--color-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 1.2rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  z-index: 9999;
  cursor: pointer;
  border-left: 4px solid;
  animation: slideIn 0.3s ease;
}

.notification.success {
  border-left-color: var(--color-seafoam);
}
.notification.error {
  border-left-color: var(--color-coral);
}
.notification.warning {
  border-left-color: var(--color-sage);
}
.notification.info {
  border-left-color: var(--color-lavender);
}

.notification-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.2rem;
}
.notification-content {
  flex: 1;
}
.notification-title {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
}
.notification-message {
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.95rem;
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-light);
  transition: var(--transition);
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  color: var(--color-text-dark);
  transform: scale(1.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .notification {
    min-width: auto;
    max-width: calc(100vw - 40px);
    left: 20px;
    right: 20px;
  }
}
</style>
