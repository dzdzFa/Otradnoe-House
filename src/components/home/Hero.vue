<template>
  <div class="hero" :id="heroId">
    <div class="hero-background" :style="backgroundStyle"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="container">
        <div class="hero-inner">
          <h1 class="hero-title">{{ title }}</h1>
          <p v-if="subtitle" class="hero-subtitle">{{ subtitle }}</p>

          <div v-if="buttons.length" class="hero-actions">
            <button
              v-for="(btn, idx) in buttons"
              :key="idx"
              :class="['btn', btn.type]"
              type="button"
              @click="handleClick(btn.action)"
            >
              {{ btn.text }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  heroId: { type: String, default: "hero" },
  title: { type: String, default: "Отдых в Крыму" },
  subtitle: {
    type: String,
    default: "Комфортабельные номера, частный пляж и безупречный сервис",
  },
  backgroundImage: {
    type: String,
    default: "/src/assets/img/preview-glav.jpg",
  },
  buttons: { type: Array, default: () => [] },
});

const emit = defineEmits(["booking-click", "gallery-click", "button-click"]);

const backgroundStyle = computed(() => ({
  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url(${props.backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
}));

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const handleClick = (action) => {
  emit("button-click", action);

  if (action === "booking") {
    emit("booking-click");
    scrollTo("booking");
  } else if (action === "gallery") {
    emit("gallery-click");
    scrollTo("gallery");
  }
};
</script>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-attachment: fixed;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  width: 100%;
  text-align: center;
  color: white;
}

.hero-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-title {
  font-size: 4.5rem;
  margin-bottom: 1.5rem;
  font-weight: 800;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: 1.6rem;
  margin-bottom: 3rem;
  opacity: 0.95;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-actions .btn {
  padding: 1.2rem 2.8rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  transition: all 0.3s;
  min-width: 220px;
}

.hero-actions .btn-primary {
  background: linear-gradient(135deg, var(--color-seafoam), var(--color-sage));
  color: var(--color-text-dark);
  border: 2px solid transparent;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.hero-actions .btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.hero-actions .btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 2px solid white;
  color: white;
}

.hero-actions .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 3.5rem;
  }
  .hero-subtitle {
    font-size: 1.4rem;
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: 600px;
    height: 90vh;
  }
  .hero-title {
    font-size: 2.8rem;
  }
  .hero-subtitle {
    font-size: 1.2rem;
  }
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  .hero-actions .btn {
    width: 100%;
    max-width: 300px;
  }
  .hero-background {
    background-attachment: scroll;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>
