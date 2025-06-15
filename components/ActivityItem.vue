<template>
  <div
    class="activity-item"
    :style="{ color: activity.color, borderColor: activity.color }"
  >
    <span class="icon">{{ activity.icon }}</span>
    <span class="name">{{ activity.name }}</span>
    <span class="points">{{ activity.points_per_hour }}pts</span>
    <button class="stamp-button" @click="handleStamp" :disabled="isLoading">
      {{ isLoading ? "..." : "Stamp" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from "~/types/activity";
import { useStampsStore } from "~/stores/stamps";
import { ref } from "vue";

const props = defineProps<{
  activity: Activity;
}>();

const stampStore = useStampsStore();
const isLoading = ref(false);
const error = ref<string | null>(null);

async function handleStamp() {
  try {
    isLoading.value = true;
    error.value = null;

    await stampStore.createStamp({
      type: "start",
      activity_id: props.activity.id,
    });

    // Optional success notification
    console.log("Stamp created successfully!");
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

.stamp-button {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.5rem;
  background: #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.stamp-button:hover {
  background: #e0e0e0;
}

.stamp-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
