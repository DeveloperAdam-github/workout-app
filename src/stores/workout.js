import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useWorkoutStore = defineStore('workout', () => {
  const workout = ref(null);
  const lastTenWorkouts = ref(null);
  const chosenWorkout = ref(null);
  const workoutSet = ref(false);
  const newWorkout = ref(false);
  const freshWorkout = ref({
    name: '',
    exercises: [],
    time: '',
    calories: '',
  });

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
    ],
    time: '',
    calories: '',
  });

  function pickChosenWorkout(value) {
    chosenWorkout.value = value;
  }

  return {
    workout,
    workoutDetails,
    testWorkout,
    chosenWorkout,
    pickChosenWorkout,
    workoutSet,
    newWorkout,
    freshWorkout,
    lastTenWorkouts,
  };
});
