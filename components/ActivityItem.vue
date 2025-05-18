<template>
  <div
    class="activity-item"
    :style="{ color: activity.color, borderColor: activity.color }"
  >
    <span class="icon">{{ activity.icon }}</span>
    <span class="name">{{ activity.name }}</span>
    <span class="points">{{ activity.points_per_hour }}pts</span>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from "~/types/activity";

defineProps<{
  activity: Activity;
}>();
</script>

<style scoped>
.activity-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: 1px solid;
  border-radius: 2rem;
  font-size: 0.9rem;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.9);
}

.icon {
  font-size: 1.1em;
}

.points {
  font-size: 0.8em;
  opacity: 0.8;
}
</style>
