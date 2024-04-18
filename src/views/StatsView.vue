<script setup>
import TopBar from '../components/TopBar.vue';
import womanSquatting from '../assets/images/womanSquatting.jpg';
import WorkoutsPerWeek from '../components/WorkoutsPerWeek.vue';
import WeightTrackGraph from '../components/WeightTrackGraph.vue';
import DatePicker from '../components/DatePicker.vue';
import { useWorkoutStore } from '../stores/workout';
import { useUserStore } from '../stores/user';
import { onMounted } from 'vue'

const store = useWorkoutStore()
const userStore = useUserStore()

onMounted(() => {
  // Different direction?
  // store.getAllPreviousWorkouts()

  // New direction
  store.getAllPreviousWorkoutDates()
  store.getAllPreviousCardioDates()

  if (!userStore.isConnectedToRealTimeDB) {
    userStore.subscribeToChannel()
  }
})
</script>

<template>
  <main class="text-black h-full w-full bg-gray-200 flex flex-col overflow-scroll">
    <TopBar :title="'Statistics'" />
    <div class="w-full flex flex-col p-4 mb-20">
      <p>Dashboard</p>
      <div class="w-full carousel mt-4 py-4">
        <!-- <div class="h-48 w-3/4 rounded-lg bg-white shadow-xl carousel-item mr-4">
          <WorkoutsPerWeek />
        </div> -->
        <div class="h-48 w-3/4 rounded-lg bg-white shadow-xl carousel-item mr-4">
          <WeightTrackGraph />
        </div>
      </div>
      <p class="mt-4">Calendar</p>
      <DatePicker />
    </div>
  </main>
</template>

<style scoped>
td {
  text-align: center;
}

input {
  text-align: center;
}
</style>
