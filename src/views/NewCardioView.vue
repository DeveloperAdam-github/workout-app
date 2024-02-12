<script setup>
import MapComponent from '../components/MapComponent.vue';
import { ref } from 'vue'

const tracking = ref(false);
const time = ref('00:00:00')
const startTime = ref('00:00:00');
let timerInterval = null;
let timer = null;
const totalMilliseconds = ref(0);
const route = ref({
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [], // Store coordinates to draw the route
  },
});
let totalDistance = ref(0);
let totalCalories = ref(0);
const weightKg = 80; // ADAM - Default set for now change later

const handleUpdateTotalDistance = (newDistance) => {
  totalDistance.value = newDistance;

  totalCalories.value = calculateCaloriesBurned(weightKg, totalDistance.value);
};


//  We need to doudble check the calcs here.
// Function to calculate calories burned based on weight (in kg) and distance (in km)
function calculateCaloriesBurned(weightKg, distanceKm,) {
  const durationMinutes = totalMilliseconds.value / 60000
  let MET = 3.5; // Moderate walking pace
  const speed = distanceKm / (durationMinutes / 60); // Speed in km/h

  if (speed < 5) {
    MET = 3.5; // slow walking
  } else if (speed >= 5 && speed < 8) {
    MET = 4.3; // moderate walking
  } else if (speed >= 8) {
    MET = 5; // brisk walking
  }

  const caloriesBurned = (MET * weightKg * durationMinutes) / 60;
  return caloriesBurned;
}



// TODO!!!!!  
function handleUpdateRouteData(newRouteData) {
  route.value = newRouteData;
}


function startTracking() {
  if (!tracking.value) {
    tracking.value = true;
    startTime.value = Date.now(); // Record start time
    route.value.geometry.coordinates = []; // Clear existing route data
    time.value = '00:00:00';
    totalMilliseconds.value = 0; // Reset if starting a new session

    // Start or restart the timer interval
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      updateTime();
    }, 1000); // Update the time display every second

    console.log('Starting tracking');
  } else {
    // Stop tracking and clear the interval
    tracking.value = false;
    clearInterval(timerInterval);
    console.log('Stopping tracking');
  }
}

function updateTime() {

  if (startTime.value) {
    const now = Date.now();
    totalMilliseconds.value = now - startTime.value;

    const hours = Math.floor(totalMilliseconds.value / 3600000);
    const minutes = Math.floor((totalMilliseconds.value % 3600000) / 60000);
    const seconds = Math.floor((totalMilliseconds.value % 60000) / 1000);

    time.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}



</script>

<template>
  <div class="w-full flex flex-col h-full bg-gray-200 p-4 pb-10 overflow-scroll pt-12">
    <div class="w-full flex flex-col h-[50%]">
      <div class="h-full bg-white w-full rounded-lg shadow-lg flex items-center justify-center">
        <!-- Show map here -->
        <MapComponent :tracking="tracking" :route="route" @updateRouteData="handleUpdateRouteData"
          @updateTotalDistance="handleUpdateTotalDistance" />
      </div>
    </div>
    <div class="w-full flex flex-col h-[30%]">
      <!-- <div class="bg-secondary h-16 absolute w-full top-4 left-0 text-white flex items-center overflow-scroll">
        {{ route.geometry.coordinates }}
      </div> -->
      <div class="grid grid-cols-2 grid-rows-2  h-full gap-4 my-4 text-black">
        <div class="bg-white rounded-lg shadow-lg p-2 flex flex-col justify-between">
          <div class="h-6 w-6 flex items-center justify-center rounded-md bg-primary text-white">
            <i class="fa-regular fa-clock"></i>
          </div>
          <h4>Time:</h4>
          <p class="text-xl font-boldHeadline">{{ time }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-2 flex flex-col justify-between">
          <div class="h-6 w-6 flex items-center justify-center rounded-md bg-primary text-white">
            <i class="fa-solid fa-shoe-prints -rotate-90"></i>
          </div>
          <h4>Distance:</h4>
          <p class="text-xl font-boldHeadline">{{ totalDistance.toFixed(2) }} km</p>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-2 flex flex-col justify-between">
          <div class="h-6 w-6 flex items-center justify-center rounded-md bg-primary text-white">
            <i class="fa-solid fa-fire"></i>
          </div>
          <h4>Calories:</h4>
          <p class="text-xl font-boldHeadline">{{ totalCalories.toFixed(0) }} Kcal</p>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-2 flex flex-col justify-between">
          <div class="h-6 w-6 flex items-center justify-center rounded-md bg-primary text-white">
            <i class="fa-regular fa-heart"></i>
          </div>
          <h4>Heart Rate</h4>
          <p class="text-xl font-boldHeadline">N/A bpm</p>
        </div>
      </div>
    </div>
    <div>
      <!-- Scroll to select  -->
      <button class="w-full h-10 bg-secondary text-black rounded-full" @click="startTracking">
        {{ tracking === false ? 'Start Tracking' : 'Stop Tracking' }}
      </button>
    </div>
  </div>
</template>