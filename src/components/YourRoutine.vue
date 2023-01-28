<script setup>
import womanSquatting from '../assets/images/womanSquatting.jpg';
import inclineBench from '../assets/images/inclineBench.jpg';
import woman from '../assets/images/woman2.jpg';
import deadlift from '../assets/images/deadlift.jpg';
import { useWorkoutStore } from '../stores/workout';

const props = defineProps({
  routine: {
    type: Object,
  },
});
</script>

<template>
  <div
    class="h-40 w-3/4 bg-white rounded-lg carousel-item mr-4 flex flex-col text-white p-4 bg-cover bg-center"
    :style="{
      'background-image':
        props.routine.workout_name.toLowerCase().includes('chest') ||
        props.routine.workout_name.toLowerCase().includes('bench') ||
        props.routine.workout_name.toLowerCase().includes('press')
          ? `linear-gradient(to bottom, rgba(1,1,1,0.85), rgba(1,1,1,0.40)), url(${inclineBench})`
          : props.routine.workout_name.toLowerCase().includes('lower') ||
            props.routine.workout_name.toLowerCase().includes('squats') ||
            props.routine.workout_name.toLowerCase().includes('leg')
          ? `linear-gradient(to bottom, rgba(1,1,1,0.85), rgba(1,1,1,0.40)), url(${womanSquatting})`
          : props.routine.workout_name.toLowerCase().includes('full') ||
            props.routine.workout_name.toLowerCase().includes('body') ||
            props.routine.workout_name.toLowerCase().includes('upper')
          ? `linear-gradient(to bottom, rgba(1,1,1,0.85), rgba(1,1,1,0.40)), url(${deadlift})`
          : '',
    }"
  >
    <div class="w-full h-12">
      <h2 class="text-lg font-boldHeadline">
        {{ props.routine.workout_name }}
      </h2>
    </div>
    <div class="w-full"></div>
  </div>
</template>
