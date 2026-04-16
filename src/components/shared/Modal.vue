<template>
  <transition name="modal">
    <div class="modal-overlay" v-if="isVisible" @click.self="close">
      <div class="modal-container" :class="modalType">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="modal-close" @click="close">×</button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer" v-if="hasFooter">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  title: { type: String, default: "" },
  modalType: { type: String, default: "default" },
  hasFooter: { type: Boolean, default: false },
});

const emit = defineEmits(["close"]);

const close = () => emit("close");

watch(
  () => props.isVisible,
  (val) => {
    document.body.style.overflow = val ? "hidden" : "";
  },
);

const handleEscape = (e) => {
  if (e.key === "Escape" && props.isVisible) close();
};

onMounted(() => window.addEventListener("keydown", handleEscape));
onUnmounted(() => {
  window.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "";
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

.modal-container {
  background: var(--color-cream);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-text-dark);
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--color-text-light);
  transition: var(--transition);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--color-text-dark);
  transform: scale(1.1);
}

.modal-body {
  padding: 2rem;
}
.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-container.success {
  border-top: 4px solid var(--color-seafoam);
}
.modal-container.error {
  border-top: 4px solid var(--color-coral);
}
.modal-container.warning {
  border-top: 4px solid var(--color-sage);
}

@media (max-width: 768px) {
  .modal-container {
    max-width: 95%;
    max-height: 95vh;
  }
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1.5rem;
  }
}
</style>
