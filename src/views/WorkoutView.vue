<script setup>
import TopBar from '../components/TopBar.vue';
import { useWorkoutStore } from '../stores/workout';
import { usePopularWorkoutStore } from '../stores/popularWorkouts';
import { ref, computed, onMounted } from 'vue';
import YourRoutine from '../components/YourRoutine.vue';
import LastWorkouts from '../components/LastWorkouts.vue';
import { useRouter } from 'vue-router';
import supabase from '../supabase';
import { useUserStore } from '../stores/user';

const store = useWorkoutStore();
const userStore = useUserStore();
const user = ref(userStore.user);
const router = useRouter();
const timerStarted = ref(false);
const previousWorkouts = ref(store.lastTenWorkouts);
const savedRoutines = ref([]);
const timer = ref({
  time: null,
  minutes: 0,
  seconds: 0,
});

const getRoutines = async () => {
  const { data, error } = await supabase
    .from('workouts')
    .select(`*, exercises(*, sets(*))`)
    .eq('user', user.value.id)
    .eq('is_routine', true)
    .order('created_at', { ascending: false });

  savedRoutines.value = data;
  console.log('retrieving saved routines', savedRoutines.value);
};

const getPreviousWorkouts = async () => {
  const { data, error } = await supabase
    .from('workouts')
    .select(`*, exercises(*, sets(*))`)
    .eq('user', user.value.id)
    .eq('is_routine', false)
    .order('created_at', { ascending: false });

  previousWorkouts.value = data;
  console.log('retrieving', previousWorkouts.value);
};

onMounted(() => {
  getPreviousWorkouts();
  getRoutines();
});

const startTimer = () => {
  console.log('starting time');
  timerStarted.value = true;
  timer.value.time = setInterval(() => {
    timer.value.seconds++;
    if (timer.value.seconds === 60) {
      timer.value.minutes++;
      timer.value.seconds = 0;
    }
  }, 1000);
};

const formattedMinutes = computed(() => {
  return timer.value.minutes.toString().padStart(2, '0');
});

const formattedSeconds = computed(() => {
  return timer.value.seconds.toString().padStart(2, '0');
});

const pauseTimer = () => {
  console.log('pausing time');
  timerStarted.value = false;
  clearInterval(timer.value.time);
};

const testRoutines = [1, 2, 3, 4, 5, 6];
const startNewWorkout = ref(store.startNewWorkout);

const popularWorkoutStore = usePopularWorkoutStore();
const popularWorkouts = ref(popularWorkoutStore.popularWorkouts);

const chosenWorkout = ref(store.chosenWorkout);
const freshWorkout = ref(store.freshWorkout);

// new workout stuff
const addNewSetToExercise = (exerciseName, index) => {
  // Find the exercise in the workout
  const exercise = freshWorkout.value.exercises.find(
    (ex) => ex.name === exerciseName.name
  );

  // Find the previous set to add same values for next set
  const lastSet = exercise.sets[exercise.sets.length - 1];

  // Add the new set to the exercise's sets array
  exercise.sets.push({ weight: lastSet.weight, reps: lastSet.reps });
};

const addExerciseToFreshWorkout = (exerciseName, index) => {
  console.log(freshWorkout.value);
  //  Check if any exercises exist
  if (freshWorkout.value.exercises) {
    // Add the new set to the exercise's sets array
    freshWorkout.value.exercises.push({
      name: '',
      sets: [
        { weight: 0, reps: 0 },
        { weight: 0, reps: 0 },
      ],
    });
  } else {
    freshWorkout.value = {
      exercises: [
        {
          name: '',
          sets: [
            { weight: 0, reps: 0 },
            { weight: 0, reps: 0 },
          ],
        },
      ],
    };
  }
};

const completeNewSet = (exerciseName, index) => {
  // Find the exercise in the workout
  const exercise = freshWorkout.value.exercises.find(
    (ex) => ex.name === exerciseName.name
  );

  let set = exercise.sets[index];

  set.completed = true;

  console.log(set, 'whats this');
};

const removeSetFromNewExercise = (exerciseName, index) => {
  return function () {
    console.log(exerciseName, index, 'any vlaues here?');
    // find the exercise in the chosenWorkout we want to remove a set from
    const exercise = freshWorkout.value.exercises.find(
      (ex) => ex.name === exerciseName.name
    );

    const set = exercise.sets[index];
    set.deleted = true;
    console.log(set, 'hello');

    setTimeout(() => {
      exercise.sets.splice(index, 1);
    }, 250);
  };
};
// end new workout stuff

const newWorkoutStarted = () => {
  startNewWorkout.value = true;
  router.push('/new-workout');
};

const addSetToExercise = (exerciseName, index) => {
  // Find the exercise in the workout
  const exercise = chosenWorkout.value.exercises.find(
    (ex) => ex.name === exerciseName.name
  );

  // Find the previous set to add same values for next set
  const lastSet = exercise.sets[exercise.sets.length - 1];

  // Add the new set to the exercise's sets array
  exercise.sets.push({ weight: lastSet.weight, reps: lastSet.reps });
};

const removeSetFromExercise = (exerciseName, index) => {
  return function () {
    console.log(exerciseName, index, 'any vlaues here?');
    // find the exercise in the chosenWorkout we want to remove a set from
    const exercise = chosenWorkout.value.exercises.find(
      (ex) => ex.name === exerciseName.name
    );

    const set = exercise.sets[index];
    set.deleted = true;
    console.log(set, 'hello');

    setTimeout(() => {
      exercise.sets.splice(index, 1);
    }, 250);
  };
};

const addExerciseToChosenWorkout = (exerciseName, index) => {
  // Add the new set to the exercise's sets array
  chosenWorkout.value.exercises.push({
    name: '',
    sets: [
      { weight: 0, reps: 0 },
      { weight: 0, reps: 0 },
    ],
  });
};

const removeExerciseFromWorkout = (index) => {
  chosenWorkout.value.exercises.splice(index, 1);
};

const completeSet = (exerciseName, index) => {
  // Find the exercise in the workout
  const exercise = chosenWorkout.value.exercises.find(
    (ex) => ex.name === exerciseName.name
  );

  let set = exercise.sets[index];

  set.completed = true;

  console.log(set, 'whats this');
};
</script>

<template>
  <main class="text-white h-full w-full bg-primary flex flex-col">
    <div>
      <TopBar :title="'Your Workouts'" />
    </div>
    <div class="w-full flex h-full flex-col p-4">
      <p>Your routines</p>
      <div class="carousel w-full py-4">
        <YourRoutine
          v-for="(routine, index) in savedRoutines"
          :key="index"
          :routine="routine"
        />
        <div
          class="h-40 p-4 w-3/4 text-black flex-col bg-white shadow-md rounded-lg carousel-item mr-4 flex items-center justify-center"
        >
          <RouterLink
            to="/add-workout"
            class="h-full w-full flex items-center justify-center flex-col"
          >
            <p>Add New Routine</p>
            <div
              class="h-10 w-10 mt-4 rounded-full border border-gray-500 flex items-center justify-center"
            >
              <i class="fa-solid fa-plus text-gray-500"></i>
            </div>
          </RouterLink>
        </div>
      </div>
      <div class="w-full py-4 flex">
        <button
          @click="newWorkoutStarted"
          class="p-2 py-3 rounded-lg bg-secondary text-black w-full shadow-md shadow-black/50"
        >
          Start a new workout
        </button>
      </div>
      <p class="my-4">Last workouts..</p>
      <div class="w-full h-[40%] carousel-vertical pb-12">
        <LastWorkouts
          v-for="(workout, index) in previousWorkouts"
          :workout="workout"
          :key="index"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
td {
  text-align: center;
}
/* input {
  text-align: center;
} */
</style>
