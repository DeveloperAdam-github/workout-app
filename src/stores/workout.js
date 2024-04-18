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
  const exerciseList = ref([]);

  // Dates for stats
  const previousWorkoutDates = ref([]);
  const previousCardioDates = ref([]);

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

  function pickChosenWorkout(workout, type) {
    console.log(workout, 'what is the value?', type);

    if (type === 'plan_routine') {
      workout.exercises = workout.plan_exercises.map(exercise => ({
        ...exercise,
        sets: exercise.plan_sets.map(set => ({
          ...set,
          completed: false,
        }))
      }));
    }
    chosenWorkout.value = workout;
    chosenWorkout.value.workout_name = workout.day_name
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

  const getAllPreviousWorkoutDates = async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('id, created_at')
      .eq('user', user.value.id)
      // .eq('is_routine', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workouts:', error);
      return;
    }

    // Transform the created_at to a simple YYYY-MM-DD format
    const formattedDates = data.map(item => {
      // Extract just the date part from the created_at timestamp
      const datePart = item.created_at.split('T')[0];
      return {
        ...item,
        created_at: datePart
      };
    });

    console.log(formattedDates, 'Transformed dates');
    previousWorkoutDates.value = formattedDates;
  };



  const getAllPreviousCardioDates = async () => {
    const { data, error } = await supabase
      .from('cardio_workouts')
      .select('id, created_at')
      .eq('user_id', user.value.id)
      // .eq('is_routine', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching workouts:', error);
      return;
    }

    const formattedDates = data.map(item => {
      const datePart = item.created_at.split('T')[0];
      return {
        ...item,
        created_at: datePart,
      }
    })

    previousCardioDates.value = formattedDates
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
    getAllPreviousWorkoutDates,
    previousWorkoutDates,
    getAllPreviousCardioDates,
    previousCardioDates,
    groupedWorkouts,
    exerciseList
  };
});
