<template>
  <div
    class="stamp-item"
    :style="{
      backgroundColor: stampColor + '20',
      borderColor: stampColor,
    }"
  >
    <span class="icon">{{ activityIcon }}</span>
    <span class="label">{{ typeLabel }} — {{ activityName }}</span>
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
      return props.stamp;
  }
});

const activityIcon = computed(() => {
  return props.stamp.activity?.icon ?? "⏹️";
});

const activityName = computed(() => {
  return props.stamp.activity?.name ?? "No activity";
});

const stampColor = computed(() => {
  const defaultColor = props.stamp.type === "start" ? "#48bb78" : "#737373";
  return props.stamp.activity?.color ?? defaultColor;
});

const formattedDateTime = computed(() => {
  const date = new Date(props.stamp.timestamp);
  return date.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
});
</script>

<style scoped>
.stamp-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  margin-right: 0.5rem;
  border: 1px solid;
  border-radius: 4px;
  font-size: 0.85rem;
  white-space: nowrap;
  height: 28px;
}

.icon {
  font-size: 1em;
}

.label {
  font-weight: 500;
}

.timestamp {
  font-size: 0.75em;
  opacity: 0.8;
}
</style>
