<template>
  <div class="dashboard">
    <h1 v-if="authStore.user.username">
      Welcome, {{ authStore.user.username }}!
    </h1>

    <!-- Current Activity Section -->
    <div class="current-activity-container">
      <LastStamp />
    </div>

    <!-- Main Content Columns -->
    <div class="dashboard-columns">
      <!-- Activities Column (unchanged) -->
      <div class="dashboard-column">
        <div class="column-header">
          <h2>Activities</h2>
          <NuxtLink to="/activities" class="view-all">View All</NuxtLink>
        </div>
        <div class="activities-container">
          <div v-if="activitiesStore.loading" class="loading-spinner"></div>
          <div v-else-if="activitiesStore.error" class="error">
            {{ activitiesStore.error }}
          </div>
          <div v-else class="activities-list">
            <ActivityItem
              v-for="activity in activitiesStore.activities"
              :key="activity.id"
              :activity="activity"
            />
          </div>
        </div>
      </div>

      <!-- Stamps Column -->
      <div class="dashboard-column">
        <div class="column-header">
          <h2>Stamps</h2>
          <button @click="refreshTimeSections" class="refresh-button">
            <Icon name="material-symbols:refresh" />
          </button>
        </div>
        <div class="stamps-container">
          <div v-if="timeSectionsStore.loading" class="loading-spinner"></div>
          <div v-else-if="timeSectionsStore.error" class="error">
            {{ timeSectionsStore.error }}
          </div>
          <div v-else class="stamps-list">
            <StampItem
              v-for="stamp in timeSectionsStore.stamps"
              :key="stamp.id"
              :stamp="stamp"
            />
          </div>
        </div>
      </div>

      <!-- Intervals Column -->
      <div class="dashboard-column">
        <div class="column-header">
          <h2>Intervals</h2>
          <div class="stats">
            <span class="total-duration">
              <Icon name="mdi:clock-outline" /> {{ totalDuration }}
            </span>
          </div>
        </div>
        <div class="intervals-container">
          <div v-if="timeSectionsStore.loading" class="loading-spinner"></div>
          <div v-else-if="timeSectionsStore.error" class="error">
            {{ timeSectionsStore.error }}
          </div>
          <div v-else class="intervals-list">
            <IntervalItem
              v-for="interval in timeSectionsStore.intervals"
              :key="interval.opening_stamp"
              :interval="interval"
            />
            <div v-if="!filteredIntervals.length" class="empty-state">
              No time sessions recorded yet
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ActivityItem from "~/components/ActivityItem.vue";
import StampItem from "~/components/StampItem.vue";
import LastStamp from "~/components/CurrentActivity.vue";
import IntervalItem from "~/components/IntervalItem.vue";

const authStore = useAuthStore();
const activitiesStore = useActivitiesStore();
const timeSectionsStore = useTimeSectionsStore(); // Replace both stamps and intervals stores
const config = useRuntimeConfig();

// Computed properties
const filteredIntervals = computed(() => {
  return timeSectionsStore.intervals.slice(0, 50); // Show most recent 50 intervals
});

const totalDuration = computed(() => {
  const totalSeconds = timeSectionsStore.intervals.reduce((sum, interval) => {
    return sum + parseFloat(interval.duration);
  }, 0);

  if (totalSeconds < 60) return `${totalSeconds.toFixed(0)}s`;
  if (totalSeconds < 3600) return `${(totalSeconds / 60).toFixed(0)}m`;
  return `${(totalSeconds / 3600).toFixed(1)}h`;
});

// Methods
const refreshTimeSections = async () => {
  await timeSectionsStore.fetchAll(); // Fetches both stamps and intervals
};

definePageMeta({
  middleware: "auth",
});

onMounted(async () => {
  await Promise.all([
    activitiesStore.fetchActivities(config.public.apiBaseUrl),
    timeSectionsStore.fetchAll(), // Replaces both stamps and intervals fetches
  ]);
});
</script>

<style scoped>
.dashboard {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.current-activity-container {
  margin: 1.5rem 0;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eaeaea;
}

.dashboard-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.dashboard-column {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.column-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.view-all {
  font-size: 0.85rem;
  color: #666;
  text-decoration: none;
}

.view-all:hover {
  color: #000;
}

.refresh-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
}

.refresh-button:hover {
  color: #000;
}

.stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.total-duration {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.activities-container,
.stamps-container,
.intervals-container {
  height: 500px;
}

.activities-list,
.stamps-list,
.intervals-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 0.95rem;
}

.loading-spinner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner::after {
  content: "";
  width: 24px;
  height: 24px;
  border: 3px solid #e0e0e0;
  border-top-color: #666;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  color: #ef4444;
  padding: 0.75rem;
  background: #fee2e2;
  border-radius: 8px;
  margin-top: 1rem;
}

@media (max-width: 1024px) {
  .dashboard-columns {
    grid-template-columns: 1fr;
  }

  .dashboard-column {
    margin-bottom: 1.5rem;
  }
}
</style>
