<script setup>
import TopBar from '../components/TopBar.vue';
import gym from '../assets/images/gym.png';
import { useWorkoutStore } from '../stores/workout';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import supabase from '../supabase';
import { useUserStore } from '../stores/user';
import { useRoute, useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global';
import { usePopularWorkoutStore } from '../stores/popularWorkouts';

const store = useWorkoutStore();
const userStore = useUserStore();
const popularWorkouts = usePopularWorkoutStore();
const globalStore = useGlobalStore();

const user = ref(userStore.user);
const showNav = ref(globalStore.showNav);

const router = useRouter();
const route = useRoute();
const workoutId = ref(null);
const exercisesArray = ref([]);
const builtSetArray = ref([]);
const startedThisWorkout = ref(false);

const openModal = ref();

const loadedWorkout = ref(
  computed(() => {
    if (store.loadPreBuiltWorkout === false) {
      return store.loadedWorkoutFromID;
    } else {
      return store.chosenWorkout;
    }
  })
);

console.log(loadedWorkout, 'wots this');

// const workoutName = ref(loadedWorkout.value.workout_name);

const timerStarted = ref(false);
const timer = ref({
  time: null,
  minutes: 0,
  seconds: 0,
});

onMounted(() => {
  const workoutID = route.query.workout;
  globalStore.showNav = false;
  if (store.loadPreBuiltWorkout === false) {
    store.getWorkoutFromDatabaseWithId(workoutID);
  }
});

onBeforeUnmount(() => {
  globalStore.showNav = true;
  store.loadPreBuiltWorkout = false;
});

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
  timerStarted.value = false;
  clearInterval(timer.value.time);
};

// new workout stuff
const addNewSetToExercise = (exerciseName, index) => {
  // Find the exercise in the workout
  const exercise = loadedWorkout.value.exercises.find(
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
  //  Check if any exercises exist
  if (loadedWorkout.value.exercises) {
    // Add the new set to the exercise's sets array
    loadedWorkout.value.exercises.push({
      name: '',
      sets: [
        { weight: 0, reps: 0, completed: false },
        { weight: 0, reps: 0, completed: false },
      ],
    });
  } else {
    loadedWorkout.value = {
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
  const exercise = loadedWorkout.value.exercises.find(
    (ex) => ex.name === exerciseName.name
  );

  let set = exercise.sets[index];

  set.completed = true;
};

const removeSetFromNewExercise = (exerciseName, index) => {
  return function () {
    // find the exercise in the chosenWorkout we want to remove a set from
    const exercise = loadedWorkout.value.exercises.find(
      (ex) => ex.name === exerciseName.name
    );

    const set = exercise.sets[index];
    set.deleted = true;

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

const finishWorkout = async () => {
  await supabase
    .from('workouts')
    .insert({
      user: user.value.id,
      workout_name: loadedWorkout.value.workout_name,
      time: timer.value.time,
    })
    .select()
    .then((response) => {
      workoutId.value = response.data[0].id;
    });

  uploadExercises(workoutId.value);
};

const uploadExercises = async (id) => {
  const exerciseArray = loadedWorkout.value.exercises.map((ex) => {
    return { name: ex.name, workout: id };
  });

  await supabase
    .from('exercises')
    .insert(exerciseArray)
    .select()
    .then((response) => {
      exercisesArray.value = response.data;
    });

  uploadSets(id);
};

const uploadSets = async (id) => {
  let workoutId = id;
  const exerciseArray = loadedWorkout.value.exercises.map((ex) => {
    return ex;
  });

  const exerciseIdToExercise = exercisesArray.value;

  exerciseArray.forEach((exercise) => {
    const singleSet = exercise.sets.map((set) => {
      let exerciseId = null;
      const filteredExercises = exerciseIdToExercise.filter(
        (ex) => ex.name === exercise.name
      );
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

  await supabase.from('sets').insert(flattenSets);

  router.back();
};

const startThisWorkoutAndResetSets = () => {
  loadedWorkout.value.exercises.map((exercise) => {
    exercise.sets.forEach((set) => {
      set.completed = false;
    });
  });
  startTimer();
  startedThisWorkout.value = true;
};
</script>

<template>
  <!-- NEW WORKOUT VIEW -->
  <main class="text-white h-full w-full bg-primary flex flex-col relative">
    <TopBar :title="'Workout'" />
    <label for="my-modal" class="btn hidden" id="modal-button" ref="openModal"
      >open modal</label
    >

    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="my-modal" class="modal-toggle" />
    <div class="modal bg-black/60 flex flex-col items-center justify-center">
      <div class="modal-box bg-primary">
        <h3 class="font-bold text-lg">Name your workout ⬇️</h3>
        <input
          class="bg-transparent p-1 border-b-2 border-secondary rounded-none text-left w-full my-4"
          v-model="loadedWorkout.workout_name"
          placeholder="Bench Day..."
        />
        <div class="modal-action w-full flex justify-center">
          <label
            for="my-modal"
            class="btn bg-secondary text-black px-6 py-1 rounded-lg"
            @click="finishWorkout"
          >
            Save
          </label>
        </div>
      </div>
    </div>
    <div class="w-full flex flex-col p-4">
      <div
        class="h-36 w-full rounded-xl bg-cover bg-center relative flex items-center justify-center"
        :style="{
          'background-image': `linear-gradient(to bottom, rgba(1,1,1,0.75), rgba(255,255,255,0.000001)), url(${gym})`,
        }"
      >
        <div class="">
          <h1 class="text-lg font-boldHeadline">
            {{ loadedWorkout.workout_name }}
          </h1>
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
        <div
          class="rounded-xl bg-secondary/70 h-8 px-2 absolute -bottom-3 right-4 text-xxs flex items-center justify-center text-black"
        >
          <p class="font-boldHeadline">105 kcal</p>
        </div>
      </div>
    </div>
    <div class="flex flex-col carousel-vertical mt-8 pb-52 h-full">
      <div class="w-full h-full p-4 flex flex-col">
        <!-- first set -->
        <div
          class="w-full flex flex-col mt-6 carousel-item"
          v-for="(exercise, index) in loadedWorkout.exercises"
        >
          <div class="flex justify-between">
            <h2 class="font-boldHeadline text-lg">
              <input
                v-model="exercise.name"
                type="text"
                class="text-base p-1 px-2 outline-secondary"
                :class="
                  exercise.name !== ''
                    ? 'bg-transparent border-b-2 border-secondary rounded-none text-left p-0'
                    : 'bg-gray-600 rounded-lg text-center '
                "
                placeholder="Exercise Name..."
              />
            </h2>
            <button
              class="bg-gray-600 px-3 rounded-lg"
              @click="removeExerciseFromWorkout(index)"
            >
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
          <div
            class="w-full flex items-center justify-center mt-4"
            v-show="
              startedThisWorkout == true && store.loadPreBuiltWorkout == false
            "
          >
            <button
              class="w-full p-1 my-2 rounded-lg bg-gray-600 text-sm"
              @click="addNewSetToExercise(exercise, index)"
            >
              Add Another Set
            </button>
          </div>
        </div>

        <div
          class="w-full flex items-center justify-center mt-6"
          v-show="
            startedThisWorkout == true && store.loadPreBuiltWorkout == false
          "
        >
          <button
            class="w-full p-1 my-2 rounded-lg text-black bg-secondary text-sm"
            @click="addExerciseToFreshWorkout"
          >
            Add Exercise
          </button>
        </div>
        <div
          class="w-full flex items-center justify-center"
          v-show="startedThisWorkout == true"
        >
          <button
            class="w-full p-1 my-2 rounded-lg bg-blue-600 text-sm text-white"
            @click="openModalForSaving"
          >
            Finish Workout
          </button>
        </div>
        <div
          class="w-full flex items-center justify-center pb-12"
          v-show="startedThisWorkout == true"
        >
          <button
            class="w-full p-1 my-2 rounded-lg bg-red-600 text-sm text-white"
          >
            Stop Workout
          </button>
        </div>
        <div class="p-4 w-full" v-show="startedThisWorkout === false">
          <button
            class="w-full p-1 my-6 rounded-lg text-black bg-secondary text-sm"
            @click="startThisWorkoutAndResetSets"
          >
            Start this as a workout
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
