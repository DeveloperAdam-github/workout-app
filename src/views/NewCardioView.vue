<script setup>
import MapComponent from '../components/MapComponent.vue';
import { ref } from 'vue'

const tracking = ref(false);
const time = ref('00:00:00');
let timer = null;
let totalMilliseconds = 0;
const route = ref({
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [], // Store coordinates to draw the route
  },
});
let totalDistance = ref(0); // Create a variable to store the total distance
let totalCalories = ref(0); // Create a variable to store the total calories burned
const weightKg = 80; // Set your weight in kilograms

// Define a function to handle the emitted total distance from the child component
const handleUpdateTotalDistance = (newDistance) => {
  totalDistance.value = newDistance;

  // Update the total calories burned based on the new distance
  totalCalories.value = calculateCaloriesBurned(weightKg, totalDistance.value);
};

// Function to calculate calories burned based on weight (in kg) and distance (in km)
function calculateCaloriesBurned(weightKg, distanceKm) {
  const MET = 3.9; // MET value for walking at a moderate pace
  const caloriesBurned = (MET * weightKg) * distanceKm;
  return caloriesBurned;
}

// Event handler for the updateRouteData event
function handleUpdateRouteData(newRouteData) {
  // Update the route data in the parent component
  route.value = newRouteData;
}


function startTracking() {
  if (tracking.value === false) {

    tracking.value = true;
    route.value.geometry.coordinates = []; // Clear existing route data
    time.value = '00:00:00.00';

    // Start the timer
    timer = setInterval(updateTime, 10); // Update every millisecond
    console.log('starting tracking');
  } else {
    tracking.value = false;
    console.log('stopping tracking');
    clearInterval(timer);
  }
}

function updateTime() {
  // Increment the timer by 10 milliseconds
  totalMilliseconds += 10;
  const minutes = Math.floor(totalMilliseconds / 60000);
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
  const milliseconds = Math.floor((totalMilliseconds % 1000) / 10); // Display two digits for milliseconds

  time.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
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
          <p class="text-xl font-boldHeadline">{{ totalDistance.toFixed(0) }} km</p>
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