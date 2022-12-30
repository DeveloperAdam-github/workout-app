<script setup>
import TopBar from '../components/TopBar.vue';
import womanSquatting from '../assets/images/womanSquatting.jpg';
import inclineBench from '../assets/images/inclineBench.jpg';
import woman from '../assets/images/woman2.jpg';
import deadlift from '../assets/images/deadlift.jpg';
import { useWorkoutStore } from '../stores/workout';
import { ref } from 'vue';

const store = useWorkoutStore();

const chosenWorkout = ref(store.chosenWorkout);

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
  <main
    class="text-white h-full w-full bg-primary flex flex-col"
    v-if="store.chosenWorkout !== null"
  >
    <TopBar :title="'Workout'" />
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
    <div class="flex flex-col carousel-vertical mt-2 pb-14">
      <div class="w-full h-full p-4 flex flex-col">
        <!-- first set -->
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
                    <!-- <i class="fa-solid fa-check"></i> -->
                  </div>
                </td>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr
                class=""
                v-for="(set, index) in exercise.sets"
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

        <div class="w-full flex items-center justify-center">
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
        <div class="w-full flex items-center justify-center">
          <button
            class="w-full p-1 my-2 rounded-lg bg-red-600 text-sm text-white"
          >
            Stop Workout
          </button>
        </div>
      </div>
    </div>
  </main>

  <main class="text-white h-full w-full bg-primary flex flex-col" v-else>
    <TopBar :title="'Workout'" />
    <div class="w-full flex flex-col p-4">
      <div
        class="h-52 w-full rounded-xl bg-cover bg-center relative flex items-center justify-center"
        :style="{
          'background-image': `linear-gradient(to bottom, rgba(1,1,1,0.95), rgba(255,255,255,0.02)), url(${womanSquatting})`,
        }"
      >
        <div class="">
          <h1 class="text-lg font-boldHeadline">Lower Body Workout</h1>
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
              <p>20 min</p>
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
              <p>300kcal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
td {
  text-align: center;
}
input {
  text-align: center;
}
</style>
