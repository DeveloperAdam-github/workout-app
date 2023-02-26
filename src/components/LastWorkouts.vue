<script setup>
const props = defineProps({
  workout: {
    type: Object,
  },
});

let dateParts = props?.workout?.created_at?.split('T');

const date = dateParts[0].split('-').reverse().join('/');

console.log(props.workout, 'wot props');
</script>

<template>
  <RouterLink
    :to="{
      name: 'workoutView',
      query: { workout: props.workout.id },
    }"
  >
    <div
      class="w-full rounded-lg shadow-xl h-24 flex p-4 items-center mb-4 text-black relative"
      :class="props.workout.fromApple ? 'bg-white' : 'bg-white'"
    >
      <div
        class="w-16 mr-4 h-full rounded-lg flex items-center justify-center bg-gray-200"
      >
        <i
          class="fa-solid fa-dumbbell text-4xl"
          v-if="!props.workout.fromApple"
        ></i>
        <i
          class="fa-solid fa-bicycle text-4xl"
          v-if="
            props.workout.fromApple &&
            props.workout.workout_name === 'Outdoor Cycle'
          "
        ></i>
        <i
          class="fa-solid fa-person-running text-4xl"
          v-if="
            props.workout.fromApple &&
            props.workout.workout_name === 'Outdoor Run'
          "
        ></i>
        <i
          class="fa-solid fa-dumbbell text-4xl"
          v-if="
            props.workout.fromApple &&
            props.workout.workout_name === 'Traditional Strength Training'
          "
        ></i>
      </div>
      <div class="w-max flex flex-col">
        <h2 class="text-lg" v-if="props.workout.workout_name">
          {{ props.workout.workout_name }}
        </h2>
        <h2 class="text-lg" v-if="props.workout.workoutType">
          {{ props.workout.workoutType }}
        </h2>
        <p class="text-xs text-gray-600" v-if="props.workout.exercises">
          {{ props?.workout?.exercises[0]?.name }}
        </p>
        <p class="text-xs text-gray-600" v-if="props.workout.exercises">
          {{ props?.workout?.exercises[1]?.name }}
        </p>
        <p class="text-xs text-gray-600" v-else>
          {{ props?.workout?.calories }}
        </p>
        <small class="text-xs text-gray-600" v-if="date">{{ date }}</small>
      </div>
      <div class="absolute right-4 top-4" v-if="props.workout.fromApple">
        <img class="h-8 w-8" src="../assets/images/apple_fitness.png" alt="" />
      </div>
    </div>
  </RouterLink>
</template>
