<template>
  <div class="w-full flex flex-col">
    <h1>Routine Name:</h1>
    <input class="w-full rounded-md bg-transparent border border-black pl-2 h-8" type="text"
      v-model="workout.workout_name" />

    <div class="w-full flex flex-col mt-4">
      <div class="flex flex-col w-full mb-5">
        <div class="w-full mb-2 flex items-center flex-col overflow-hidden" v-for="(exercise, index) in exercises"
          :key="index" :class="selectedExercise === exercise.id ? 'max-h-fit' : 'max-h-10'">
          <div class="w-full flex items-center justify-between relative">
            <h2 class="text-xl w-full flex items-center justify-center text-center  rounded-md py-1 transition-all"
              @click="selectExercise(exercise)" v-touch:swipe.left="removeExercise(exercise.id, index)"
              :class="selectedExercise === exercise.id && !exercise.startDelete ? 'bg-secondary ' : exercise.startDelete ? 'bg-red-500 border-none w-5/6' : 'bg-gray-600 text-white'">
              {{ exercise.name
              }}
            </h2>
            <div :class="exercise.startDelete === true ? 'translate-x-0' : 'translate-x-36'"
              class="transition-all  transform absolute right-0">
              <button class="bg-red-500 text-white h-8 w-8 rounded-md" @click="finalRemoveExercise(exercise.id,
                index)">X</button>
            </div>
          </div>
          <div class="w-full mt-2" v-for="(set, index) in exercise.sets"
            v-touch:swipe.left="removeSet(exercise.id, index)" :class="set.deleted == true
              ? 'bg-red-500 animate-ping-once'
              : 'transition-all duration-1000 ease-out'
              ">
            <label for="" class="mb-1">Set {{ set.id }}</label>
            <div class="w-full flex mb-2">
              <div class="w-1/2 mr-2">
                <label for="" class="mr-2">Weight</label>
                <input class="w-20 bg-transparent border border-gray-400 h-8 rounded-md mr-2 pl-2" type="number"
                  v-model="set.weight">
              </div>
              <div class="w-1/2 ml-2 ">
                <label for="" class="mr-2">Reps</label>
                <input class="w-20 bg-transparent border border-gray-400 h-8 rounded-md ml-2 pl-2" type="number"
                  v-model="set.reps">
              </div>
            </div>
          </div>
          <button class="w-full bg-secondary text-black h-8 rounded-md my-2" @click="addSet(exercise)">Add Set</button>
        </div>
      </div>
      <input v-if="addExerciseToggle" v-model="exerciseName" type="text"
        class="w-full bg-white text-black mb-2 border h-8 rounded-md pl-2"
        :class="pageError ? 'border-red-500' : 'border-black'" placeholder="Exercise name...">
      <small class="text-red-500" v-if="pageError">{{ pageError }}</small>
      <button class="w-full bg-primary text-white h-8 rounded-md" @click="addDay">{{ addDayToggle === false ?
        'New Day' : 'Add Day' }}</button>
      <!-- <button class="w-full bg-primary text-white h-8 rounded-md" @click="addExercise">{{ addExerciseToggle === false ?
        'New Exercise' : 'Add Exercise' }}</button> -->
      <button class="w-full bg-blue-500 text-white h-8 rounded-md my-4" @click="addExercise">Save Routine</button>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
const workout = ref(props.workout);
const addDayToggle = ref(false)
const addExerciseToggle = ref(false)
const exerciseName = ref('')
const pageError = ref('')
const selectedExercise = ref('')
const days = ref([])
const exercises = ref([]);


const props = defineProps({
  workout: {
    type: Object,
  },
});

const addDay = () => {
  if (addDayToggle === false) {
    addDayToggle.value = true;
    return;
  }

  if (dayName.value === '') {
    pageError.value = 'Please enter a day name'
    return;
  }

  days.value.push({
    id: days.value.length + 1,
    name: dayName.value,
    exercises: [
      {
        id: 1,
        name: '',
        sets: [],
      }
    ]
  })
}


const addExercise = () => {
  if (addExerciseToggle.value === false) {
    addExerciseToggle.value = true;
    return;
  }

  if (exerciseName.value === '') {
    pageError.value = 'Please enter an exercise name'
    return;
  }

  exercises.value.push({
    id: exercises.value.length + 1,
    name: exerciseName.value,
    sets: [
      {
        id: 1,
        weight: 0,
        reps: 0,
      }
    ],
  });

  pageError.value = '';
  exerciseName.value = '';
  addExerciseToggle.value = false;
}

const addSet = (exercise) => {
  console.log(exercise, 'exercise?');
  const set = {
    id: exercise.sets.length + 1,
    weight: 0,
    reps: 0,
  }

  exercise.sets.push(set);
}

const removeSet = (excerciseId, index) => {
  return function () {

    console.log(excerciseId, index, 'any vlaues here?');
    // find the exercise in the chosenWorkout we want to remove a set from
    const exercise = exercises.value.find(
      (ex) => ex.id === excerciseId
    );

    const set = exercise.sets[index];
    set.deleted = true;
    console.log(set, 'hello');

    setTimeout(() => {
      exercise.sets.splice(index, 1);
    }, 250);
  }
};

const removeExercise = (exercise, index) => {
  return function () {
    const foundExercise = exercises.value.find(
      (ex) => ex.id === exercise
    )

    if (foundExercise.startDelete === true) {
      //  remove from array
      exercises.value.splice(index, 1);
      foundExercise.startDelete = false;
      return;
    }
    foundExercise.startDelete = true;
  }
}

// This is after confirmation of removal.
const finalRemoveExercise = (exercise, index) => {
  const foundExercise = exercises.value.find(
    (ex) => ex.id === exercise
  )

  if (foundExercise.startDelete === true) {
    //  remove from array
    exercises.value.splice(index, 1);
    foundExercise.startDelete = false;
    return;
  }
  foundExercise.startDelete = true;
}

const selectExercise = (exercise) => {
  console.log(exercise, 'exercise?');
  if (selectedExercise.value === exercise.id) {
    selectedExercise.value = null
  } else {
    selectedExercise.value = exercise.id
  }
}


</script>