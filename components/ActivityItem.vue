<template>
  <div
    class="activity-item"
    :style="{
      backgroundColor: activity.color + '20',
      borderColor: activity.color,
    }"
  >
    <span class="icon">{{ activity.icon }}</span>
    <span class="name">{{ activity.name }}</span>
    <span class="points">{{ activity.points_per_hour }}pts</span>
    <button
      class="stamp-button"
      @click="handleStamp"
      :disabled="isLoading"
      :style="{ color: activity.color }"
    >
      {{ isLoading ? "..." : "▶" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from "~/types/activity";
import { useTimeSectionsStore } from "~/stores/timeSections";
import { ref } from "vue";

const props = defineProps<{
  activity: Activity;
}>();

const timeSectionsStore = useTimeSectionsStore();
const isLoading = ref(false);
const error = ref<string | null>(null);

async function handleStamp() {
  try {
    isLoading.value = true;
    error.value = null;
    await timeSectionsStore.createStamp({
      type: "start",
      activity_id: props.activity.id,
    });
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to create stamp";
    console.error("Stamp error:", error.value);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.activity-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  margin-right: 0.5rem;
  border: 1px solid;
  border-radius: 4px; /* Sharp corners */
  font-size: 0.85rem;
  white-space: nowrap;
  background-color: rgba(255, 255, 255, 0.2);
  height: 28px; /* Thinner height */
}

.icon {
  font-size: 1em;
}

.name {
  font-weight: 500;
}

.points {
  font-size: 0.75em;
  opacity: 0.8;
}

.stamp-button {
  margin-left: 0.5rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9em;
  line-height: 1;
  min-width: 20px;
}

.stamp-button:hover {
  opacity: 0.8;
}

.stamp-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
