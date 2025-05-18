<template>
  <div class="dashboard">
    <h1 v-if="authStore.user.username">
      Welcome, {{ authStore.user.username }}!
    </h1>

    <div class="activities-container">
      <div v-if="activitiesStore.loading">Loading...</div>
      <div v-else-if="activitiesStore.error" class="error">
        {{ activitiesStore.error }}
      </div>
      <div v-else class="activities-scroll">
        <ActivityItem
          v-for="activity in activitiesStore.activities"
          :key="activity.id"
          :activity="activity"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ActivityItem from "~/components/ActivityItem.vue";
const authStore = useAuthStore();
const activitiesStore = useActivitiesStore();
const config = useRuntimeConfig();

definePageMeta({
  middleware: "auth",
});

onMounted(async () => {
  await activitiesStore.fetchActivities(config.public.apiBaseUrl);
});
</script>

<style scoped>
.dashboard {
  padding: 1rem;
}

.activities-container {
  margin-top: 1.5rem;
}

.activities-scroll {
  display: flex;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  gap: 0.5rem;
}

.error {
  color: red;
}

/* Hide scrollbar but keep functionality */
.activities-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.activities-scroll::-webkit-scrollbar {
  display: none;
}
</style>
