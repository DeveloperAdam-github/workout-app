<script setup>
import TopBar from '../components/TopBar.vue';
import SearchInput from '../components/SearchInput.vue';
import gym from '../assets/images/gym.png';
import { useWorkoutStore } from '../stores/workout';
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import supabase from '../supabase';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global';
import { saveWorkoutToPreferences, getWorkoutFromPreferences, removeWorkoutFromPreferences } from '../utils/preferences';

import { Plugins } from '@capacitor/core';
const { DistancePlugin } = Plugins;

const WORKOUT_PREFERENCES_KEY = 'currentWorkout';

const store = useWorkoutStore();
const userStore = useUserStore();
const globalStore = useGlobalStore();

const user = ref(userStore.user);
const showNav = ref(globalStore.showNav);

const router = useRouter();
const workoutId = ref(null);
const exercisesArray = ref([]);
const builtSetArray = ref([]);
const lastThreeWorkoutsForLinking = ref([]);
const chosenWorkoutToLink = ref({});

const openModal = ref();
const openAppleModal = ref();

const workoutName = ref('Default Workout');

const freshWorkout = ref(store.freshWorkout);
const timerStarted = ref(false);
const timer = ref({
  time: null,
  minutes: 0,
  seconds: 0,
});

onMounted(async () => {
  globalStore.showNav = false;
  const storedWorkout = await getWorkoutFromPreferences(WORKOUT_PREFERENCES_KEY);
  if (storedWorkout) {
    // Use a more user-friendly way to ask if they want to resume, this is just a simple example
    if (confirm('Do you want to resume your previous workout?')) {
      freshWorkout.value = storedWorkout;
      // store.freshWorkout = storedWorkout;
    } else {
      await removeWorkoutFromPreferences(WORKOUT_PREFERENCES_KEY);
    }
  }
});

onBeforeUnmount(() => {
  globalStore.showNav = true;
});

const getLastThreeWorkoutsFromApple = async () => {
  let result = await DistancePlugin.authorize();
  let workoutsFromIOS = await DistancePlugin.getLast3Workouts();

  lastThreeWorkoutsForLinking.value = workoutsFromIOS.workouts;
};

const linkChosenAppleWorkoutToWorkout = async () => {
  console.log(
    chosenWorkoutToLink.value,
    'can we see the chosen workout to link?'
  );

  // alert(JSON.stringify(chosenWorkoutToLink.value));

  await supabase
    .from('apple_workouts')
    .insert({
      calories: chosenWorkoutToLink.value.value.calories,
      workout: null,
    })
    .then(() => {
      openModalForSaving();
    });
};

const startTimer = () => {
  timerStarted.value = true;
  timer.value.time = setInterval(() => {
    timer.value.seconds++;
    if (timer.value.seconds === 60) {
      timer.value.minutes++;
      timer.value.seconds = 0;
    }
  }, 1000);
};

const pauseTimer = () => {
  console.log('pausing time');
  timerStarted.value = false;
  clearInterval(timer.value.time);
};

// new workout stuff
const addNewSetToExercise = (exerciseName, index) => {
  // Find the exercise in the workout
  const exercise = freshWorkout.value.exercises.find(
    (ex) => ex.name === exerciseName.name
  );

  // Find the previous set to add same values for next set
  const lastSet = exercise.sets[exercise.sets.length - 1];

  // Add the new set to the exercise's sets array
  exercise.sets.push({
    weight: lastSet.weight,
    reps: lastSet.reps,
    completed: false,
  });
};

const addExerciseToFreshWorkout = (exerciseName, index) => {
  console.log(freshWorkout.value);
  //  Check if any exercises exist
  if (freshWorkout.value.exercises) {
    // Add the new set to the exercise's sets array
    freshWorkout.value.exercises.push({
      name: '',
      sets: [
        { weight: 0, reps: 0, completed: false },
        { weight: 0, reps: 0, completed: false },
      ],
    });
  } else {
    freshWorkout.value = {
      exercises: [
        {
          name: '',
          sets: [
            { weight: 0, reps: 0, completed: false },
            { weight: 0, reps: 0, completed: false },
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

const formattedMinutes = computed(() => {
  return timer.value.minutes.toString().padStart(2, '0');
});

const formattedSeconds = computed(() => {
  return timer.value.seconds.toString().padStart(2, '0');
});

const openModalForSaving = () => {
  openModal.value.click();
};

const openAddToAppleModal = () => {
  openAppleModal.value.click();
};

const finishWorkout = async () => {
  await supabase
    .from('workouts')
    .insert({
      user: user.value.id,
      workout_name: workoutName.value,
      time: timer.value.time,
    })
    .select()
    .then((response) => {
      workoutId.value = response.data[0].id;
    });

  uploadExercises(workoutId.value);
};

const uploadExercises = async (id) => {
  const exerciseArray = freshWorkout.value.exercises.map((ex) => {
    return { name: ex.name, workout: id };
  });

  await supabase
    .from('exercises')
    .insert(exerciseArray)
    .select()
    .then((response) => {
      // console.log(response.data, 'show us it here');
      exercisesArray.value = response.data;
    });

  uploadSets(id);
};

const uploadSets = async (id) => {
  let workoutId = id;
  const exerciseArray = freshWorkout.value.exercises.map((ex) => {
    return ex;
  });

  const exerciseIdToExercise = exercisesArray.value;

  console.log(exerciseIdToExercise, 'exerciseIdToExercise');

  exerciseArray.forEach((exercise) => {
    console.log('each workout here', exercise);
    const singleSet = exercise.sets.map((set) => {
      let exerciseId = null;
      const filteredExercises = exerciseIdToExercise.filter(
        (ex) => ex.name === exercise.name
      );
      console.log(filteredExercises, 'wot dis');
      if (filteredExercises.length) {
        exerciseId = filteredExercises.find(
          (ex) => ex.name === exercise.name
        ).id;
      }
      return {
        reps: set.reps,
        weight: set.weight,
        exercise: exerciseId,
        completed: set.completed,
        workout: workoutId,
      };
    });
    builtSetArray.value.push(singleSet);
  });

  const flattenSets = builtSetArray.value.flat();

  console.log(flattenSets, 'show me sets array thats built?');

  await supabase.from('sets').insert(flattenSets);

  router.back();
};

const handleSelect = (selectedExercise, currentExercise) => {
  console.log(selectedExercise, 'the selected exercise');
  console.log(currentExercise, 'the  exercise');

  currentExercise.name = selectedExercise
}

watch(freshWorkout, (newValue) => {
  saveWorkoutToPreferences(WORKOUT_PREFERENCES_KEY, newValue).catch(console.error);
}, { deep: true });

</script>

<template>
  <!-- NEW WORKOUT VIEW -->
  <main class="text-white h-full w-full bg-primary flex flex-col relative">
    <TopBar :title="'Workout'" />
    <label for="my-modal" class="btn hidden" id="modal-button" ref="openModal">open modal</label>
    <label for="apple-modal" class="btn hidden" id="modal-button" ref="openAppleModal">open modal</label>
    <!-- APPLE MODAL -->
    <input type="checkbox" id="apple-modal" class="modal-toggle" />
    <div class="modal bg-black/60 flex flex-col items-center justify-center">
      <div class="modal-box bg-primary">
        <h3 class="font-bold text-lg">
          Want to get calories from an apple fitness workout?
        </h3>
        <div class="w-full flex flex-col p-2" v-if="lastThreeWorkoutsForLinking">
          <table class="w-full" v-if="lastThreeWorkoutsForLinking">
            <tr v-for="(workout, index) in lastThreeWorkoutsForLinking" :key="index" class="h-10">
              <td @click="chosenWorkoutToLink.value = workout" :class="workout === chosenWorkoutToLink.value
                ? 'bg-secondary text-black'
                : ''
                ">
                {{ workout.workoutType }} <small>{{ workout.calories }}</small>
              </td>
            </tr>
          </table>
        </div>
        <div class="modal-action w-full flex justify-center">
          <button class="btn bg-secondary text-black px-6 py-1 rounded-lg" @click="getLastThreeWorkoutsFromApple" v-if="lastThreeWorkoutsForLinking &&
            lastThreeWorkoutsForLinking.length <= 0
            ">
            Yes
          </button>
          <label for="apple-modal" class="btn bg-secondary text-black px-6 py-1 rounded-lg" @click="openModalForSaving">
            No
          </label>
          <label for="apple-modal" class="btn bg-secondary text-black px-6 py-1 rounded-lg"
            @click="linkChosenAppleWorkoutToWorkout" v-if="lastThreeWorkoutsForLinking.length > 0">
            Link workout
          </label>
        </div>
      </div>
    </div>
    <!-- APPLE MODAL -->

    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="my-modal" class="modal-toggle" />
    <div class="modal bg-black/60 flex flex-col items-center justify-center">
      <div class="modal-box bg-primary">
        <h3 class="font-bold text-lg">Name your workout ⬇️</h3>
        <input class="bg-transparent p-1 border-b-2 border-secondary rounded-none text-left w-full my-4"
          v-model="workoutName" placeholder="Bench Day..." />
        <div class="modal-action w-full flex justify-center">
          <label for="my-modal" class="btn bg-secondary text-black px-6 py-1 rounded-lg" @click="finishWorkout">
            Save
          </label>
        </div>
      </div>
    </div>
    <div class="w-full flex flex-col p-4">
      <div class="h-36 w-full rounded-xl bg-cover bg-center relative flex items-center justify-center" :style="{
        'background-image': `linear-gradient(to bottom, rgba(1,1,1,0.75), rgba(255,255,255,0.000001)), url(${gym})`,
      }">
        <div class="">
          <h1 class="text-lg font-boldHeadline">Fresh Workout</h1>
        </div>
        <!-- add to an apple workout button -->
        <div @click="openAddToAppleModal" class="absolute bottom-2 right-2">
          <img class="h-8 w-8" src="../assets/images/apple_fitness.png" alt="" />
        </div>
        <div
          class="absolute h-14 w-2/4 rounded-xl bg-transparent/70 flex -bottom-6 m-auto left-0 right-0 text-xs items-center p-1">
          <div class="w-full flex h-full px-1">
            <div class="w-1/2 h-full flex p-2 items-center">
              <div @click="timerStarted === true ? pauseTimer() : startTimer()"
                class="h-full bg-secondary active:bg-secondary/80 transition-all w-full rounded-xl flex items-center justify-center text-xl">
                <i class="fa-solid fa-stopwatch text-black" :class="timerStarted === true ? 'animate-pulse' : ''"></i>
              </div>
            </div>
            <div class="h-full w-1/2 flex flex-col text-xxs justify-center items-center">
              <p class="text-sm">
                {{ formattedMinutes }}:{{ formattedSeconds }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col carousel-vertical mt-8 pb-52 h-full">
      <div class="w-full h-full p-4 flex flex-col">
        <!-- first set -->
        <div class="w-full flex flex-col mt-6 carousel-item" v-for="(exercise, index) in freshWorkout.exercises">
          <div class="flex justify-between relative">
            <SearchInput class="mr-20" :show="true" :text="exercise.name"
              @select="(selectedExercise) => handleSelect(selectedExercise, exercise)" />
            <!-- <h2 class="font-boldHeadline text-lg"> -->
            <!-- <input v-model="exercise.name" type="text" class="text-base p-1 px-2 outline-secondary" :class="exercise.name !== ''
                ? 'bg-transparent border-b-2 border-secondary rounded-none text-left p-0'
                : 'bg-gray-600 rounded-lg'
                " placeholder="Exercise Name..." /> -->
            <!-- </h2> -->
            <button class="bg-gray-600 px-3 rounded-lg absolute right-0 h-9" @click="removeExerciseFromWorkout(index)">
              <!-- <i class="fa-solid fa-ellipsis"></i> -->
              <i class="fa-solid fa-trash text-sm"></i>
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
                    <!-- <i class="fa-solid fa-check"></i> -->
                  </div>
                </td>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="h-8" v-for="(set, index) in exercise.sets" :key="index"
                v-touch:swipe.left="removeSetFromNewExercise(exercise, index)" :class="set.deleted == true
                  ? 'bg-red-500 animate-ping-once'
                  : 'transition-all duration-1000 ease-out'
                  ">
                <td>{{ index + 1 }}</td>
                <td>
                  <input type="number" placeholder="50" class="w-12 bg-transparent text-center outline-secondary"
                    v-model="set.weight" />
                </td>
                <td>
                  <input type="number" placeholder="50" class="w-12 bg-transparent text-center outline-secondary"
                    v-model="set.reps" />
                </td>
                <td>
                  <div @click="completeNewSet(exercise, index)"
                    class="flex items-center justify-center p-0.5 rounded-lg text-black transition-all duration-300 ease-in-out"
                    :class="set?.completed === true ? 'bg-secondary' : 'bg-gray-400'
                      ">
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="w-full flex items-center justify-center mt-4">
            <button class="w-full p-1 my-2 rounded-lg bg-gray-600 text-sm" @click="addNewSetToExercise(exercise, index)">
              Add Another Set
            </button>
          </div>
        </div>

        <div class="w-full flex items-center justify-center mt-6">
          <button class="w-full p-1 my-2 rounded-lg text-black bg-secondary text-sm" @click="addExerciseToFreshWorkout">
            Add Exercise
          </button>
        </div>
        <div class="w-full flex items-center justify-center">
          <button class="w-full p-1 my-2 rounded-lg bg-blue-600 text-sm text-white" @click="openAddToAppleModal">
            Finish Workout
          </button>
        </div>
        <div class="w-full flex items-center justify-center pb-12">
          <button class="w-full p-1 my-2 rounded-lg bg-red-600 text-sm text-white">
            Stop Workout
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
