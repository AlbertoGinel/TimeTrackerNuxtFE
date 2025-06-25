<template>
  <div
    class="interval-item"
    :style="{
      backgroundColor: interval.activity.color + '20',
      borderColor: interval.activity.color,
    }"
  >
    <span class="icon">{{ interval.activity.icon }}</span>
    <span class="activity-name">{{ interval.activity.name }}</span>
    <div class="time-range">
      <div>{{ formattedStartDate }}</div>
      <div>{{ formattedEndDate }}</div>
    </div>
    <span class="duration">{{ formattedDuration }}</span>
    <span class="status" :style="{ color: statusColor }">
      {{ interval.is_open ? "Active" : "Completed" }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Interval } from "~/types/interval";
import { computed } from "vue";

const props = defineProps<{
  interval: Interval;
}>();

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return "--/--/-- --:--:--";
  const date = new Date(dateString);
  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "");
};

const formattedStartDate = computed(() =>
  formatDateTime(props.interval.fromDate)
);
const formattedEndDate = computed(() =>
  props.interval.toDate
    ? formatDateTime(props.interval.toDate)
    : "--/--/-- --:--:--"
);

const formattedDuration = computed(() => {
  const seconds = parseFloat(props.interval.duration);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ].join(":");
});

const statusColor = computed(() => {
  return props.interval.is_open ? "#4CAF50" : "#9E9E9E";
});
</script>

<style scoped>
.interval-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid;
  border-radius: 6px;
  font-size: 0.9rem;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.7);
}

.icon {
  font-size: 1.3em;
  flex: 0 0 5%;
  text-align: center;
}

.activity-name {
  font-weight: 500;
  flex: 0 0 20%;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time-range {
  flex: 0 0 45%;
  font-family: monospace;
  font-size: 0.85em;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.duration {
  flex: 0 0 15%;
  font-family: monospace;
  font-weight: 500;
  text-align: center;
}

.status {
  flex: 0 0 15%;
  font-size: 0.8em;
  font-weight: 500;
  padding: 0.2em 0;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  text-align: center;
}

@media (max-width: 768px) {
  .interval-item {
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    padding: 0.6rem;
  }

  .icon {
    flex-basis: 5%;
  }

  .activity-name {
    flex-basis: calc(25% - 1rem);
  }

  .time-range {
    flex-basis: 70%;
    order: 1;
    margin-top: 0.25rem;
    margin-left: 5%;
  }

  .duration,
  .status {
    flex-basis: calc(50% - 0.5rem);
  }
}
</style>
