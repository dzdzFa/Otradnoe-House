<template>
  <div class="container" :class="[sizeClass, className]" :style="style">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  size: { type: String, default: "default" },
  padding: String,
  background: String,
  className: String,
});

const sizeClass = computed(() => {
  if (props.size === "small") return "container-small";
  if (props.size === "large") return "container-large";
  if (props.size === "full") return "container-full";
  return "";
});

const style = computed(() => ({
  padding: props.padding,
  background: props.background,
}));
</script>

<style scoped>
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
}

.container-small {
  max-width: 1000px;
}
.container-default {
  max-width: 1400px;
}
.container-large {
  max-width: 1600px;
}
.container-full {
  max-width: 100%;
  padding: 0;
}

@media (max-width: 768px) {
  .container:not(.container-full) {
    padding: 0 1rem;
  }
}
@media (max-width: 480px) {
  .container:not(.container-full) {
    padding: 0 0.75rem;
  }
}
</style>
