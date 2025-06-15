<template>
  <div
    class="stamp-item"
    :style="{ borderColor: stamp.activity.color, color: stamp.activity.color }"
  >
    <span class="icon">{{ stamp.activity.icon }}</span>
    <span class="label">{{ typeLabel }} — {{ stamp.activity.name }}</span>
    <span class="timestamp">{{ formattedDateTime }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Stamp } from "~/types/stamp";

const props = defineProps<{
  stamp: Stamp;
}>();

const typeLabel = computed(() => {
  switch (props.stamp.type) {
    case "start":
      return "Start";
    case "stop":
      return "Stop";
    default:
      return props.stamp.type;
  }
});

const formattedDateTime = computed(() => {
  const date = new Date(props.stamp.timestamp);
  return date.toLocaleString(undefined, {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });
});
</script>

<style scoped>
.stamp-item {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: 1px solid;
  border-radius: 2rem;
  font-size: 0.9rem;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.95);
}

.icon {
  font-size: 1.1em;
}

.timestamp {
  font-size: 0.8em;
  opacity: 0.75;
}
</style>
