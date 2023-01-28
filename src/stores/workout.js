import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import supabase from '../supabase';

export const useWorkoutStore = defineStore('workout', () => {
  const workout = ref(null);
  const lastTenWorkouts = ref(null);
  const chosenWorkout = ref(null);
  const loadPreBuiltWorkout = ref(false);
  const workoutSet = ref(false);
  const newWorkout = ref(false);
  const loadedWorkoutFromID = ref(false);
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
    loadPreBuiltWorkout.value = true;
  }

  const getWorkoutFromDatabaseWithId = async (id) => {
    console.log(id, 'what is passed id?');

    const { data, error } = await supabase
      .from('workouts')
      .select(`*, exercises(*, sets(*))`)
      .eq('id', id);

    loadedWorkoutFromID.value = data[0];
    console.log('retrieving', data[0]);
  };

  const setRoutineBackToTemplate = () => {
    testWorkout.value = {
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
    };
  };

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
    getWorkoutFromDatabaseWithId,
    loadedWorkoutFromID,
    loadPreBuiltWorkout,
    setRoutineBackToTemplate,
  };
});
