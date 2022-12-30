import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useWorkoutStore = defineStore('workout', () => {
  const workout = ref(null);
  const chosenWorkout = ref(null);

  function pickChosenWorkout(value) {
    chosenWorkout.value = value;
  }

  const workoutDetails = ref({
    name: '',
    exercises: [
      {
        name: '',
        sets: [{ reps: '', weight: '' }],
      },
    ],
    time: '',
    calories: '',
  });

  const testWorkout = ref({
    name: 'Chest and Triceps',
    exercises: [
      {
        name: '',
        sets: [
          { weight: 50, reps: 10 },
          { weight: 50, reps: 10 },
          // { weight: 50, reps: 10 },
        ],
      },
      // {
      //   name: 'Tricep Dips',
      //   sets: [
      //     { weight: 50, reps: 10 },
      //     { weight: 50, reps: 10 },
      //     { weight: 50, reps: 10 },
      //   ],
      // },
      // {
      //   name: 'Incline DB Press',
      //   sets: [
      //     { weight: 32.5, reps: 6 },
      //     { weight: 32.5, reps: 6 },
      //     { weight: 32.5, reps: 6 },
      //   ],
      // },
    ],
    time: '',
    calories: '',
  });

  return {
    workout,
    workoutDetails,
    testWorkout,
    chosenWorkout,
    pickChosenWorkout,
  };
});
