<script setup>
import TopBar from '../components/TopBar.vue';
import { useWorkoutStore } from '../stores/workout';
import { usePopularWorkoutStore } from '../stores/popularWorkouts';
import { ref, computed } from 'vue';
import YourRoutine from '../components/YourRoutine.vue';
import LastWorkouts from '../components/LastWorkouts.vue';

const store = useWorkoutStore();
const timerStarted = ref(false);
const timer = ref({
  time: null,
  minutes: 0,
  seconds: 0,
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
  <!-- <main
    class="text-white h-full w-full bg-primary flex flex-col"
    v-if="store.chosenWorkout !== null"
  >
    <div class="mt-5">
      <TopBar :title="'Workout'" />
    </div>
    <div class="w-full flex flex-col p-4">
      <div
        class="h-52 w-full rounded-xl bg-cover bg-center relative flex items-center justify-center"
        :style="{
          'background-image': chosenWorkout.tags.includes('upper', 'bench')
            ? `linear-gradient(to bottom, rgba(1,1,1,0.75), rgba(255,255,255,0.000001)), url(${inclineBench})`
            : chosenWorkout.tags.includes('lower', 'squats')
            ? `linear-gradient(to bottom, rgba(1,1,1,0.75), rgba(255,255,255,0.000001)), url(${womanSquatting})`
            : chosenWorkout.tags.includes('full body')
            ? `linear-gradient(to bottom, rgba(1,1,1,0.75), rgba(255,255,255,0.000001)), url(${deadlift})`
            : '',
        }"
      >
        <div class="">
          <h1 class="text-lg font-boldHeadline">{{ chosenWorkout.name }}</h1>
        </div>
        <div
          class="absolute h-14 w-3/4 rounded-xl bg-transparent/70 flex -bottom-6 m-auto left-0 right-0 text-xs items-center p-1"
        >
          <div class="w-1/2 flex h-full px-1">
            <div class="w-1/2 h-full flex p-2 items-center">
              <div
                class="h-full bg-secondary w-full rounded-xl flex items-center justify-center text-xl"
              >
                <i class="fa-solid fa-stopwatch text-black"></i>
              </div>
            </div>
            <div class="h-full w-1/2 flex flex-col text-xxs justify-center">
              <p>Time</p>
              <p>{{ chosenWorkout.time }}</p>
            </div>
          </div>
          <div class="w-0.5 h-1/2 bg-gray-400"></div>
          <div class="w-1/2 flex h-full px-1">
            <div class="w-1/2 h-full flex p-2 items-center">
              <div
                class="h-full bg-secondary w-full rounded-xl flex items-center justify-center text-xl"
              >
                <i class="fa-solid fa-fire text-black"></i>
              </div>
            </div>
            <div class="h-full w-1/2 flex flex-col text-xxs justify-center">
              <p>Burn</p>
              <p>{{ chosenWorkout.calories }}kcal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col carousel-vertical mt-2">
      <div class="w-full h-full p-4 flex flex-col">
        <div
          class="w-full flex flex-col mt-4 carousel-item"
          v-for="(exercise, index) in chosenWorkout.exercises"
        >
          <div class="flex justify-between">
            <h2 class="font-boldHeadline text-lg">{{ exercise.name }}</h2>
            <button
              class="bg-gray-600 px-2 rounded-lg"
              @click="removeExerciseFromWorkout(index)"
            >
              <i class="fa-solid fa-ellipsis"></i>
            </button>
          </div>
          <table class="mt-4">
            <thead class="text-base">
              <tr>
                <td>Set</td>
                <td>Weight</td>
                <td>Reps</td>
                <td>
                  <div class="flex items-center justify-center">
                  </div>
                </td>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr
                class="h-8"
                v-for="(set, index) in exercise.sets"
                :key="index"
                v-touch:swipe.left="removeSetFromExercise(exercise, index)"
                :class="
                  set.deleted == true
                    ? 'bg-red-500 animate-ping-once'
                    : 'transition-all duration-1000 ease-out'
                "
              >
                <td>{{ index + 1 }}</td>
                <td>{{ set.weight }}</td>
                <td>{{ set.reps }}</td>
                <td>
                  <div
                    @click="completeSet(exercise, index)"
                    class="flex items-center justify-center p-0.5 rounded-lg text-black transition-all duration-300 ease-in-out"
                    :class="
                      set?.completed === true ? 'bg-secondary' : 'bg-gray-400'
                    "
                  >
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="w-full flex items-center justify-center mt-4">
            <button
              class="w-full p-1 my-2 rounded-lg bg-gray-600 text-sm"
              @click="addSetToExercise(exercise, index)"
            >
              Add Another Set
            </button>
          </div>
        </div>

        <div class="w-full flex items-center justify-center mt-6">
          <button
            class="w-full p-1 my-2 rounded-lg text-black bg-secondary text-sm"
            @click="addExerciseToChosenWorkout"
          >
            Add Exercise
          </button>
        </div>
        <div class="w-full flex items-center justify-center">
          <button
            class="w-full p-1 my-2 rounded-lg bg-blue-600 text-sm text-white"
          >
            Finish Workout
          </button>
        </div>
        <div class="w-full flex items-center justify-center pb-12">
          <button
            class="w-full p-1 my-2 rounded-lg bg-red-600 text-sm text-white"
          >
            Stop Workout
          </button>
        </div>
      </div>
    </div>
  </main> -->

  <!-- NEW WORKOUT VIEW -->
  <!--
  <main
    class="text-white h-full w-full bg-primary flex flex-col"
    v-if="startNewWorkout === true"
  >
    <TopBar :title="'Workout'" />
    <div class="w-full flex flex-col p-4">
      <div
        class="h-52 w-full rounded-xl bg-cover bg-center relative flex items-center justify-center"
        :style="{
          'background-image': `linear-gradient(to bottom, rgba(1,1,1,0.75), rgba(255,255,255,0.000001)), url(${gym})`,
        }"
      >
        <div class="">
          <h1 class="text-lg font-boldHeadline">Fresh Workout</h1>
        </div>
        <div
          class="absolute h-14 w-2/4 rounded-xl bg-transparent/70 flex -bottom-6 m-auto left-0 right-0 text-xs items-center p-1"
        >
          <div class="w-full flex h-full px-1">
            <div class="w-1/2 h-full flex p-2 items-center">
              <div
                @click="timerStarted === true ? pauseTimer() : startTimer()"
                class="h-full bg-secondary active:bg-secondary/80 transition-all w-full rounded-xl flex items-center justify-center text-xl"
              >
                <i
                  class="fa-solid fa-stopwatch text-black"
                  :class="timerStarted === true ? 'animate-pulse' : ''"
                ></i>
              </div>
            </div>
            <div
              class="h-full w-1/2 flex flex-col text-xxs justify-center items-center"
            >
              <p class="text-sm">
                {{ formattedMinutes }}:{{ formattedSeconds }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col carousel-vertical mt-4 pb-52 h-1/2">
      <div class="w-full h-full p-4 flex flex-col">
        // first set 
        <div
          class="w-full flex flex-col mt-4 carousel-item"
          v-for="(exercise, index) in freshWorkout.exercises"
        >
          <div class="flex justify-between">
            <h2 class="font-boldHeadline text-lg">
              <input
                v-model="exercise.name"
                type="text"
                class="text-base p-1 px-2"
                :class="
                  exercise.name !== ''
                    ? 'bg-transparent border-b-2 rounded-none text-left p-0'
                    : 'bg-gray-600 rounded-lg text-center'
                "
                placeholder="Exercise Name..."
              />
            </h2>
            <button
              class="bg-gray-600 px-2 rounded-lg"
              @click="removeExerciseFromWorkout(index)"
            >
              <i class="fa-solid fa-ellipsis"></i>
            </button>
          </div>
          <table class="mt-4">
            <thead class="text-base">
              <tr>
                <td>Set</td>
                <td>Weight</td>
                <td>Reps</td>
                <td>
                  <div class="flex items-center justify-center">
                    // <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr
                class="h-8"
                v-for="(set, index) in exercise.sets"
                :key="index"
                v-touch:swipe.left="removeSetFromNewExercise(exercise, index)"
                :class="
                  set.deleted == true
                    ? 'bg-red-500 animate-ping-once'
                    : 'transition-all duration-1000 ease-out'
                "
              >
                <td>{{ index + 1 }}</td>
                <td>
                  <input
                    type="number"
                    placeholder="50"
                    class="w-12 bg-transparent text-center"
                    v-model="set.weight"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="50"
                    class="w-12 bg-transparent text-center"
                    v-model="set.reps"
                  />
                </td>
                <td>
                  <div
                    @click="completeNewSet(exercise, index)"
                    class="flex items-center justify-center p-0.5 rounded-lg text-black transition-all duration-300 ease-in-out"
                    :class="
                      set?.completed === true ? 'bg-secondary' : 'bg-gray-400'
                    "
                  >
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="w-full flex items-center justify-center mt-4">
            <button
              class="w-full p-1 my-2 rounded-lg bg-gray-600 text-sm"
              @click="addNewSetToExercise(exercise, index)"
            >
              Add Another Set
            </button>
          </div>
        </div>

        <div class="w-full flex items-center justify-center mt-6">
          <button
            class="w-full p-1 my-2 rounded-lg text-black bg-secondary text-sm"
            @click="addExerciseToFreshWorkout"
          >
            Add Exercise
          </button>
        </div>
        <div class="w-full flex items-center justify-center">
          <button
            class="w-full p-1 my-2 rounded-lg bg-blue-600 text-sm text-white"
          >
            Finish Workout
          </button>
        </div>
        <div class="w-full flex items-center justify-center pb-12">
          <button
            class="w-full p-1 my-2 rounded-lg bg-red-600 text-sm text-white"
          >
            Stop Workout
          </button>
        </div>
      </div>
    </div>
  </main> -->

  <!-- END OF NEW WORKOUT VIEW -->

  <main class="text-white h-full w-full bg-primary flex flex-col">
    <TopBar :title="'Your Workouts'" />
    <div class="w-full flex h-full flex-col p-4">
      <p>Your routines</p>
      <div class="carousel w-full py-4">
        <YourRoutine
          v-for="(routine, index) in popularWorkouts"
          :key="index"
          :routine="routine"
        />
        <div
          class="h-40 p-4 w-3/4 text-black flex-col bg-white shadow-md rounded-lg carousel-item mr-4 flex items-center justify-center"
        >
          <p>Add New Routine</p>
          <div
            class="h-10 w-10 mt-4 rounded-full border border-gray-500 flex items-center justify-center"
          >
            <i class="fa-solid fa-plus text-gray-500"></i>
          </div>
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
      <div class="w-full h-[40%] carousel-vertical">
        <LastWorkouts v-for="(routine, index) in testRoutines" :key="index" />
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
