<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import gym from '../assets/images/gym.png';
import TopBar from '../components/TopBar.vue';
import { useGlobalStore } from '../stores/global';
import { useUserStore } from '../stores/user';
import { useWorkoutStore } from '../stores/workout';
import supabase from '../supabase';

const store = useWorkoutStore();
const globalStore = useGlobalStore();
const workout = ref(store.testWorkout);
const workoutId = ref(null);
const exercisesArray = ref([]);
const builtSetArray = ref([]);
const showNav = ref(globalStore.showNav);
const userStore = useUserStore();
const user = ref(userStore.user);
const router = useRouter();

const addSetToExercise = (exerciseName, index) => {
  // Find the exercise in the workout
  const exercise = workout.value.exercises.find(
    (ex) => ex.name === exerciseName.name
  );

  // Find the previous set to add same values for next set
  const lastSet = exercise.sets[exercise.sets.length - 1];

  // Add the new set to the exercise's sets array
  exercise.sets.push({ weight: lastSet.weight, reps: lastSet.reps });
};

const removeSetFromExercise = (exerciseName, index) => {
  // find the exercise in the workout we want to remove a set from
  const exercise = workout.value.exercises.find(
    (ex) => ex.name === exerciseName.name
  );

  exercise.sets.splice(index, 1);
};

const addExerciseToWorkout = (exerciseName, index) => {
  // Add the new set to the exercise's sets array
  workout.value.exercises.push({
    name: '',
    sets: [
      { weight: 0, reps: 0 },
      { weight: 0, reps: 0 },
    ],
  });
};

onMounted(() => {
  globalStore.hideNavFunction();
});

const removeExerciseFromWorkout = (index) => {
  workout.value.exercises.splice(index, 1);
};

const finishWorkout = async () => {
  await supabase
    .from('workouts')
    .insert({
      user: user.value.id,
      workout_name: workout.value.name,
      is_routine: true,
    })
    .select()
    .then((response) => {
      workoutId.value = response.data[0].id;
    });

  uploadExercises(workoutId.value);
};

const uploadExercises = async (id) => {
  const exerciseArray = workout.value.exercises.map((ex) => {
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
  const exerciseArray = workout.value.exercises.map((ex) => {
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

  store.setRoutineBackToTemplate();

  router.back();
};
</script>
<template>
  <div class="h-full w-full bg-gray-200 text-black">
    <TopBar title="New Workout" />
    <div class="p-4 w-full">
      <div
        class="h-36 w-full rounded-xl bg-center bg-cover flex items-center justify-center shadow-xl"
        :style="{
          'background-image': `linear-gradient(to bottom, rgba(1,1,1,0.75), rgba(255,255,255,0.000001)), url(${gym})`,
        }"
      >
        <h2 class="text-white text-lg font-boldHeadline">
          Create a new Routine
        </h2>
      </div>
    </div>
    <div class="flex w-full h-full flex-col mt-2 pb-14">
      <div class="w-full p-4 flex flex-col text-black carousel-vertical pb-80">
        <p class="m2-4 carousel-item">Create new workout routine below</p>
        <small class="text-xs text-gray-600 carousel-item"
          >Workouts created will be saved to your workouts section for you to
          begin this workout at any time.</small
        >
        <input
          type="text"
          class="bg-transparent border-black border-b-2 my-4 w-3/4 outline-secondary"
          placeholder="Workout Name"
          v-model="workout.name"
        />
        <div class="flex flex-col">
          <div class="w-full h-full flex flex-col">
            <!-- first set -->
            <div
              class="w-full flex flex-col mt-2 carousel-item"
              v-for="(exercise, index) in store.testWorkout.exercises"
            >
              <div class="flex justify-between">
                <h2 class="font-boldHeadline text-lg">
                  <input
                    type="text"
                    placeholder="Exercise"
                    class="bg-transparent outline-secondary"
                    v-model="exercise.name"
                  />
                </h2>
                <button
                  class="bg-gray-600 px-3 rounded-lg"
                  @click="removeExerciseFromWorkout(index)"
                >
                  <!-- <i class="fa-solid fa-ellipsis"></i> -->
                  <i class="fa-solid fa-minus"></i>
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
                        <!-- <i class="fa-solid fa-minus"></i> -->
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody class="text-sm">
                  <tr class="" v-for="(set, index) in exercise.sets">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <input
                        type="number"
                        placeholder="50"
                        class="w-16 bg-transparent"
                        v-model="set.weight"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="50"
                        class="w-16 bg-transparent"
                        v-model="set.reps"
                      />
                    </td>
                    <td>
                      <div
                        @click="removeSetFromExercise(exercise, index)"
                        class="bg-gray-400 flex items-center justify-center p-0.5 rounded-lg text-white"
                      >
                        <i class="fa-solid fa-minus"></i>
                      </div>
                    </td>
                  </tr>
                  <!-- <tr>
                    <td>2</td>
                    <td>90</td>
                    <td>10</td>
                    <td>
                      <div
                        class="bg-gray-400 flex items-center justify-center p-0.5 rounded-lg text-white"
                      >
                        <i class="fa-solid fa-minus"></i>
                      </div>
                    </td>
                  </tr> -->
                </tbody>
              </table>
              <div class="w-full flex items-center justify-center mt-4">
                <button
                  @click="addSetToExercise(exercise, index)"
                  class="w-full p-1 my-2 rounded-lg bg-gray-600 text-sm text-white"
                >
                  Add Another Set
                </button>
              </div>
            </div>

            <div class="w-full flex items-center justify-center">
              <button
                @click="addExerciseToWorkout"
                class="w-full p-1 my-2 rounded-lg text-black bg-secondary text-sm"
              >
                Add Exercise
              </button>
            </div>
            <!-- <div class="w-full flex items-center justify-center">
              <button
                class="w-full p-1 my-2 rounded-lg bg-blue-600 text-sm text-white"
              >
                Create Workout
              </button>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div
      class="bottom-0 text-white absolute h-20 px-4 w-full z-10"
      @click="finishWorkout"
    >
      <button class="w-full h-10 rounded-full bg-primary">
        Create Workout
      </button>
    </div>
  </div>
</template>
