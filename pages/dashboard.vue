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

    <div class="stamps-container">
      <div v-if="stampsStore.loading">Loading stamps...</div>
      <div v-else-if="stampsStore.error" class="error">
        {{ stampsStore.error }}
      </div>
      <div v-else class="stamps-scroll">
        <StampItem
          v-for="stamp in stampsStore.stamps"
          :key="stamp.id"
          :stamp="stamp"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ActivityItem from "~/components/ActivityItem.vue";
import StampItem from "~/components/StampItem.vue";
const authStore = useAuthStore();
const activitiesStore = useActivitiesStore();
const stampsStore = useStampsStore();
const config = useRuntimeConfig();

definePageMeta({
  middleware: "auth",
});

onMounted(async () => {
  await activitiesStore.fetchActivities(config.public.apiBaseUrl);
  await stampsStore.fetchStamps(config.public.apiBaseUrl);
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

when loaded, as you find fetchActivities I want to find aswell stamps using: //
Actions async function fetchStamps(apiBaseUrl: string) { a stamp is: { "id": 2,
"type": "start", "timestamp": "2025-06-10T18:57:01.490097Z", "activity":
"a38fb25a-a78e-406f-bd4e-7bafd89b81e8", "user": 2 },
