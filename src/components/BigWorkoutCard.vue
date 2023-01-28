<script setup>
import { ref } from 'vue';
import womanSquatting from '../assets/images/womanSquatting.jpg';
import inclineBench from '../assets/images/inclineBench.jpg';
import woman from '../assets/images/woman2.jpg';
import deadlift from '../assets/images/deadlift.jpg';
import { useWorkoutStore } from '../stores/workout';

const store = useWorkoutStore();
const chosenWorkout = ref(store.chosenWorkout);

const props = defineProps({
  workout: {
    type: Object,
  },
});

const setChosenWorkout = (value) => {
  store.pickChosenWorkout(value);
};
</script>
<template>
  <!--  :style="{
      'background-image': `linear-gradient(to bottom, rgba(1,1,1,0.75), rgba(255,255,255,0.000001)), url(${womanSquatting})`,
    }" -->
  <router-link
    to="/workout-view"
    class="w-4/5 h-52 rounded-xl carousel-item mr-4 bg-cover bg-center flex flex-col text-white shadow-xl"
    :style="{
      'background-image': props.workout.tags.includes('upper', 'bench')
        ? `linear-gradient(to bottom, rgba(1,1,1,0.75), rgba(255,255,255,0.000001)), url(${inclineBench})`
        : props.workout.tags.includes('lower', 'squats')
        ? `linear-gradient(to bottom, rgba(1,1,1,0.75), rgba(255,255,255,0.000001)), url(${womanSquatting})`
        : props.workout.tags.includes('full body')
        ? `linear-gradient(to bottom, rgba(1,1,1,0.75), rgba(255,255,255,0.000001)), url(${deadlift})`
        : '',
    }"
    @click="setChosenWorkout(props.workout)"
    v-if="props.workout"
  >
    <div class="p-4 flex flex-col">
      <h1 class="text-lg">{{ props.workout.workout_name }}</h1>
      <div class="">
        <div
          class="p-2 w-max bg-gray-100 flex items-center my-2 text-xs rounded-xl text-black"
        >
          <p>
            <i class="fa-solid fa-fire mr-2"></i
            >{{ props.workout.calories }}Kcal
          </p>
        </div>
        <div
          class="p-2 w-max bg-gray-100 flex items-center my-2 text-xs rounded-xl text-black"
        >
          <p>
            <i class="fa-solid fa-stopwatch mr-2"></i>{{ props.workout.time }}
          </p>
        </div>
      </div>
    </div>
  </router-link>
</template>
