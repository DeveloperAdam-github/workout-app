import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import supabase from '../supabase';
import { useUserStore } from './user';

export const useWorkoutStore = defineStore('workout', () => {
  const store = useUserStore()
  const workout = ref(null);
  const lastTenWorkouts = ref(null);
  const lastTenWorkoutsFromApple = ref(null);
  const combinedLastTwentyWorkouts = ref([]);
  const chosenWorkout = ref(null);
  const loadPreBuiltWorkout = ref(false);
  const workoutSet = ref(false);
  const newWorkout = ref(false);
  const loadedWorkoutFromID = ref(false);
  const allPreviousWorkouts = ref([]);
  const freshWorkout = ref({
    name: '',
    exercises: [],
    time: '',
    calories: '',
  });
  const user = ref(store.user)
  const groupedWorkouts = ref({})

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
      .select(
        `*, exercises(*, sets(*)), apple_workouts!apple_workouts_workout_fkey(*)`
      )
      .eq('id', id);

    console.log('retrieving', data[0]);
    loadedWorkoutFromID.value = data[0];
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
          ],
        },
      ],
      time: '',
      calories: '',
    };
  };

  const getAllPreviousWorkouts = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select(`*, exercises(*, sets(*))`)
      .eq('user', user.value.id)
      .eq('is_routine', false)
      .order('created_at', { ascending: false })

    console.log(data, 'what is the data in here?');

    allPreviousWorkouts.value = data;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    data.forEach(workout => {
      const dateObj = new Date(workout.created_at);
      const month = monthNames[dateObj.getMonth()]; // Get month name
      const date = dateObj.getDate();

      if (!groupedWorkouts.value[month]) {
        groupedWorkouts.value[month] = [];
      }

      if (!groupedWorkouts.value[month].includes(date)) {
        groupedWorkouts.value[month].push(date);
      }
    })

    // Sort the dates for each month
    for (const month in groupedWorkouts.value) {
      groupedWorkouts.value[month].sort((a, b) => a - b);
    }

    console.log(groupedWorkouts.value, 'grouped workouts');
    return groupedWorkouts.value;
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
    lastTenWorkoutsFromApple,
    combinedLastTwentyWorkouts,
    getWorkoutFromDatabaseWithId,
    loadedWorkoutFromID,
    loadPreBuiltWorkout,
    setRoutineBackToTemplate,
    getAllPreviousWorkouts,
    groupedWorkouts
  };
});
