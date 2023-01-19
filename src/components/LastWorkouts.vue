<script setup>
const props = defineProps({
  workout: {
    type: Object,
  },
});

let dateParts = props.workout.created_at.split('T');

const date = dateParts[0].split('-').reverse().join('/');

console.log(props.workout, 'wot props');
</script>

<template>
  <div
    class="w-full bg-white rounded-lg shadow-xl h-24 flex p-4 items-center mb-4 text-black"
  >
    <div
      class="w-16 mr-4 h-full rounded-lg flex items-center justify-center bg-gray-200"
    >
      <i class="fa-solid fa-dumbbell text-4xl"></i>
    </div>
    <div class="w-max flex flex-col">
      <h2 class="text-lg">{{ props.workout.workout_name }}</h2>
      <p class="text-xs text-gray-600">
        {{ props?.workout?.exercises[0]?.name }}
      </p>
      <p class="text-xs text-gray-600">
        {{ props?.workout?.exercises[1]?.name }}
      </p>
      <small class="text-xs text-gray-600">{{ date }}</small>
    </div>
  </div>
</template>
