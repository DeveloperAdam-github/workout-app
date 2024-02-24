<script setup>
import MapComponent from '../components/MapComponent.vue';
import { useUserStore } from "../stores/user";
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, watch, onUnmounted } from 'vue'
import supabase from '../supabase';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { saveCardioToPreferences, getCardioFromPreferences, removeCardioFromPreferences } from '../utils/preferences'

const userStore = useUserStore()
const router = useRouter();
const vueRoute = useRoute();

const CARDIO_PREFERNCES_KEY = 'cardioWorkout';

const tracking = ref(false);
const isLoadedWorkout = ref(false);
const workoutData = ref(null)
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
// const weightKg = 80; // ADAM - Default set for now change later
const weightKg = ref(userStore?.userDetails?.weight ?? 80)
const confirmSave = ref(false);
const save = ref(false);

const handleUpdateTotalDistance = (newDistance) => {
  totalDistance.value = newDistance;

  totalCalories.value = calculateCaloriesBurned(weightKg.value, totalDistance.value);
};


//  We need to doudble check the calcs here.
// Function to calculate calories burned based on weight (in kg) and distance (in km)
function calculateCaloriesBurned(weightKg, distanceKm,) {
  const durationMinutes = totalMilliseconds.value / 60000
  let MET = 3.5; // Moderate walking pace
  // 0.6214 to convert km to miles before we do the speed so all speeds and calories are worked out in miles
  const distanceMiles = distanceKm * 0.6214;
  const speedMph = distanceMiles / (durationMinutes / 60); // Speed in km/h

  // if (speed <= 3) {
  //   MET = 3; // slow walking
  // } else if (speed >= 3 && speed < 4) {
  //   MET = 4.3; // moderate walking
  // } else if (speed >= 4 && speed < 5) {
  //   MET = 7;
  // } else if (speed >= 5 && speed < 7) {
  //   MET = 9.5; // brisk walking
  // } else if (speed >= 7 && speed < 9) {
  //   MET = 11.6; // slow running
  // } else if (speed >= 9 && speed < 10) {
  //   MET = 13.8; // moderate running
  // } else if (speed >= 10 && speed < 12) {
  //   MET = 17; // fast running
  // } else if (speed >= 12) {
  //   MET = 20; // sprinting
  // }
  if (speedMph < 3) {
    MET = 3; // slow walking
  } else if (speedMph < 4) {
    MET = 4.3; // moderate walking
  } else if (speedMph < 5) {
    MET = 7; // moderate walking, faster pace
  } else if (speedMph < 7) {
    MET = 9.5; // brisk walking
  } else if (speedMph < 9) {
    MET = 11.6; // slow running
  } else if (speedMph < 10) {
    MET = 13.8; // moderate running
  } else if (speedMph < 12) {
    MET = 17; // fast running
  } else {
    MET = 20; // sprinting
  }

  // const caloriesBurned = ((MET * weightKg * 3.5) / 200) * durationMinutes;
  const durationHours = durationMinutes / 60;
  const caloriesBurned = MET * weightKg * durationHours;

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

function timeFormat(time) {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const saveCardioToDB = async () => {
  if (confirmSave.value === false) {
    confirmSave.value = true;
  } else {

    const workoutData = {
      cardio_type: 'running',
      cardio_time: totalMilliseconds.value,
      cardio_calories: Number(totalCalories.value.toFixed(2)),
      cardio_distance: Number(totalDistance.value.toFixed(2)),
      cardio_coords: { coords: route.value.geometry.coordinates },
      user_id: userStore.user.id
    }
    // Save to DB

    try {
      await supabase
        .from('cardio_workouts')
        .insert(workoutData)
        .select()
        .then((response) => {
          console.log(response, 'response');
          if (response.data) {
            save.value = true
            // toast here?
            toast("Saved!", {
              "theme": "dark",
              "type": "success",
              "position": "bottom-center",
              "closeOnClick": false,
              "pauseOnHover": false,
              "pauseOnFocusLoss": false,
              "dangerouslyHTMLString": true
            })

            setTimeout(() => {
              router.back();
            }, 3500);
          }
        });

      confirmSave.value = false;
    } catch (error) {
      alert(error.message)
    }
  }
}

watch(
  () => ({
    distance: totalDistance.value,
    calories: totalCalories.value,
    routeCoordinates: route.value.geometry.coordinates,
    time: totalMilliseconds.value,
    startTime: startTime.value
  }),
  (newValues, oldValues) => {
    saveCardioToPreferences(CARDIO_PREFERNCES_KEY, newValues).catch(console.error);
  },
  { deep: true }
);

onMounted(async () => {
  const storedCardio = await getCardioFromPreferences(CARDIO_PREFERNCES_KEY);
  if (storedCardio && !vueRoute.query.workout) {
    if (confirm('You have a saved workout, would you like to continue?')) {
      route.value.geometry.coordinates = storedCardio.routeCoordinates;
      totalDistance.value = storedCardio.distance;
      totalCalories.value = storedCardio.calories;
      totalMilliseconds.value = storedCardio.time;
      startTime.value = storedCardio.startTime;
      updateTime();

    }
  } else {
    await removeCardioFromPreferences(CARDIO_PREFERNCES_KEY)
  }
  if (vueRoute.query.workout) {
    isLoadedWorkout.value = true;

    const { data, error } = await supabase
      .from('cardio_workouts')
      .select('*')
      .eq('id', vueRoute.query.workout)

    workoutData.value = data[0]
    // route.value.geometry.coordinates = data[0].cardio_coords.coords;

    console.log(workoutData.value, 'the data');
  }
})

onUnmounted(() => {
  clearInterval(timerInterval);
})



</script>

<template>
  <div class="w-full flex flex-col h-full bg-gray-200 p-4 pb-10 overflow-scroll pt-12">
    <div class="w-full flex flex-col h-[50%]">
      <div class="h-full bg-white w-full rounded-lg shadow-lg flex items-center justify-center">
        <!-- Show map here -->
        <MapComponent :tracking="tracking" :route="route" :isLoadedWorkout="isLoadedWorkout" :workout="workoutData"
          @updateRouteData="handleUpdateRouteData" @updateTotalDistance="handleUpdateTotalDistance" />
      </div>
    </div>
    <div class="w-full flex flex-col h-[30%]">
      <!-- <div class="bg-secondary h-16 absolute w-full top-4 left-0 text-white flex items-center overflow-scroll">
        {{ route.geometry.coordinates }}
      </div> -->
      <div class="grid grid-cols-2 grid-rows-2  h-full gap-4 my-4 text-black">
        <div :class="workoutData ? 'bg-secondary/80' : 'bg-white'"
          class="bg-white rounded-lg shadow-lg p-2 flex flex-col justify-between">
          <div class="h-6 w-6 flex items-center justify-center rounded-md bg-primary text-white">
            <i class="fa-regular fa-clock"></i>
          </div>
          <h4>Time: {{ route.geometry.coordinates.length }}</h4>
          <p class="text-xl font-boldHeadline" v-if="workoutData">{{ timeFormat(workoutData.cardio_time) }}</p>
          <p class="text-xl font-boldHeadline" v-else>{{ time }}</p>
        </div>
        <div :class="workoutData ? 'bg-secondary/80' : 'bg-white'"
          class="bg-white rounded-lg shadow-lg p-2 flex flex-col justify-between">
          <div class="h-6 w-6 flex items-center justify-center rounded-md bg-primary text-white">
            <i class="fa-solid fa-shoe-prints -rotate-90"></i>
          </div>
          <h4>Distance:</h4>
          <p class="text-xl font-boldHeadline" v-if="workoutData">{{ workoutData.cardio_distance }} km</p>
          <p class="text-xl font-boldHeadline" v-else>{{ totalDistance.toFixed(2) }} km</p>
        </div>
        <div :class="workoutData ? 'bg-secondary/80' : 'bg-white'"
          class="bg-white rounded-lg shadow-lg p-2 flex flex-col justify-between">
          <div class="h-6 w-6 flex items-center justify-center rounded-md bg-primary text-white">
            <i class="fa-solid fa-fire"></i>
          </div>
          <h4>Calories:</h4>
          <p class="text-xl font-boldHeadline" v-if="workoutData">{{ workoutData.cardio_calories }} Kcal</p>
          <p class="text-xl font-boldHeadline" v-else>{{ totalCalories.toFixed(0) }} Kcal</p>
        </div>
        <div :class="workoutData ? 'bg-secondary/80' : 'bg-white'"
          class="bg-white rounded-lg shadow-lg p-2 flex flex-col justify-between">
          <div class="h-6 w-6 flex items-center justify-center rounded-md bg-primary text-white">
            <i class="fa-regular fa-heart"></i>
          </div>
          <h4>Heart Rate</h4>
          <p class="text-xl font-boldHeadline">N/A bpm</p>
        </div>
      </div>
    </div>
    <div v-if="!isLoadedWorkout">
      <!-- Scroll to select  -->
      <button class="w-full h-10 bg-secondary text-black rounded-full" @click="startTracking">
        {{ tracking === false ? 'Start Tracking' : 'Stop Tracking' }}
      </button>
      <button class="w-full h-10 bg-primary text-white rounded-full mt-2" @click="saveCardioToDB"
        v-if="tracking === false && route.geometry.coordinates.length > 0 && save == false">
        {{ confirmSave === false ? 'Finish' : 'Save & Quit' }}
      </button>
    </div>
  </div>
</template>