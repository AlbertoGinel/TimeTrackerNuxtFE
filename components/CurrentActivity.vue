<template>
  <div class="current-activity-wrapper">
    <div v-if="timeSectionsStore.loading" class="stamp-item loading">
      Loading...
    </div>
    <div v-else-if="timeSectionsStore.error" class="stamp-item error">
      Error loading activity
    </div>
    <div v-else>
      <div
        v-if="lastStamp"
        class="stamp-item"
        :style="{
          borderColor: lastStamp.activity?.color || '#d1d5db',
          color: lastStamp.activity?.color || '#6b7280',
        }"
      >
        <span class="icon">{{ lastStamp.activity?.icon || "⏹️" }}</span>
        <span class="label">{{ typeLabel }} — {{ activityName }}</span>
        <span class="timestamp">{{ formattedDateTime }}</span>
        <button
          v-if="lastStamp.type === 'start'"
          class="stop-button"
          @click="handleStop"
          :disabled="isLoading"
          :style="{ backgroundColor: lastStamp.activity?.color || '#e53e3e' }"
        >
          <span v-if="!isLoading">Stop</span>
          <span v-else class="loader"></span>
        </button>
      </div>
      <div v-else class="stamp-item no-activity">
        <span class="icon">⏸️</span>
        <span class="label">No activity</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useTimeSectionsStore } from "~/stores/timeSections";

const timeSectionsStore = useTimeSectionsStore();
const isLoading = ref(false);

// Get the most recent stamp (regardless of type)
const lastStamp = computed(() => {
  return timeSectionsStore.stamps[0]; // Assuming stamps are ordered newest first
});

// Compute display values with fallbacks
const typeLabel = computed(() => {
  if (!lastStamp.value) return "";
  return lastStamp.value.type === "start" ? "Start" : "Stop";
});

const activityName = computed(() => {
  return lastStamp.value?.activity?.name || "No activity";
});

// Format date for display
const formattedDateTime = computed(() => {
  if (!lastStamp.value) return "";
  const date = new Date(lastStamp.value.timestamp);
  return date.toLocaleString(undefined, {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });
});

// Handle stop action
async function handleStop() {
  try {
    isLoading.value = true;
    await timeSectionsStore.createStamp({
      type: "stop",
      activity_id: null,
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Your existing styles remain unchanged */
.current-activity-wrapper {
  margin-bottom: 1.5rem;
}

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
  position: relative;
}

.loading {
  border-color: #d1d5db;
  color: #6b7280;
}

.error {
  border-color: #ef4444;
  color: #ef4444;
}

.no-activity {
  border-color: #d1d5db;
  color: #6b7280;
}

.icon {
  font-size: 1.1em;
}

.timestamp {
  font-size: 0.8em;
  opacity: 0.75;
}

.label {
  font-weight: 500;
}

.stop-button {
  margin-left: 0.5rem;
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 1rem;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.stop-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.stop-button:hover:not(:disabled) {
  opacity: 0.9;
}

.loader {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
