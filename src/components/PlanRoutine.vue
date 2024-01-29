<template>
  <div class="w-full flex flex-col overflow-scroll mb-10">
    <h1>Routine Name:</h1>
    <input class="w-full rounded-md bg-transparent border border-black pl-2 h-8" type="text"
      v-model="workout.workout_name" />

    <div class="w-full flex flex-col mt-4">
      <div class="flex flex-col w-full mb-" v-for="(day, index) in days" :key="index">
        <div class="w-full mb-2 flex items-center flex-col overflow-hidden"
          :class="selectedDay === day.id ? 'max-h-fit' : 'max-h-10'">
          <div class="w-full flex items-center justify-between relative mb-1">
            <h2 class="text-xl w-full flex items-center justify-center text-center  rounded-md py-1 transition-all"
              @click="selectDay(day)" v-touch:swipe.left="() => removeDay(day.id, index)"
              :class="selectedDay === day.id && !day.startDelete ? 'bg-secondary border-b-4 border-gray-500' : day.startDelete ? 'bg-red-500 border-none w-5/6' : 'bg-gray-600 text-white'">
              {{ day.name
              }}
            </h2>
            <div :class="day.startDelete === true ? 'translate-x-0' : 'translate-x-36'"
              class="transition-all  transform absolute right-0">
              <button class="bg-red-500 text-white h-8 w-8 rounded-md" @click="finalRemoveDay(day,
                index)">X</button>
            </div>
          </div>
          <div v-for="(exercise, index) in day.exercises" class="w-full flex flex-col mt-1 -mb-1">
            <div class="w-full mb-2 flex items-center flex-col overflow-hidden"
              :class="selectedExercise === exercise.id ? 'max-h-fit' : 'max-h-10'">
              <div class="w-full flex items-center justify-between relative">
                <h3
                  class="text-base w-full h-8 flex items-center justify-center text-center font-headline rounded-md py-1 transition-all"
                  v-if="exercise" @click="selectExercise(exercise)"
                  v-touch:swipe.left="() => removeExercise(day, exercise, index)"
                  :class="selectedExercise === exercise.id && !exercise.startDelete ? 'bg-secondary' : exercise.startDelete ? 'bg-red-500 border-none w-5/6' : 'bg-gray-600 text-white'">
                  {{ exercise.name
                  }}
                </h3>
                <div :class="exercise.startDelete === true ? 'translate-x-0' : 'translate-x-36'"
                  class="transition-all  transform absolute right-0">
                  <button class="bg-red-500 text-white h-8 w-8 rounded-md" @click="finalRemoveExercise(day, exercise,
                    index)">X</button>
                </div>
              </div>
              <div class="w-full mt-1 px-2" v-for="(set, index) in exercise.sets"
                v-touch:swipe.left="removeSet(exercise, index)" :class="set.deleted == true
                  ? 'bg-red-500 animate-ping-once'
                  : 'transition-all duration-1000 ease-out'
                  ">
                <div class="w-full flex justify-between items-center">
                  <label for="" class="mb-1 text-sm">Set {{ set.id }}</label>

                  <!-- Toggle between percentge and kilos -->
                  <!-- <div class="flex items-center">
                    <p class="mr-2">%</p>
                    <label class="switch">
                      <input type="checkbox" v-model="unitToggle" @change="toggleUnit">
                      <span class="slider"></span>
                    </label>
                    <p class="ml-2">kg</p>
                  </div> -->
                </div>
                <div class="w-full flex mb-2">
                  <div class="w-1/2 mr-2 flex items-center">
                    <label for="" class="mr-2 text-sm">Weight</label>
                    <input class="w-14 bg-transparent border border-gray-400 h-7 rounded-md mr-1 pl-2 text-sm"
                      type="number" v-model="set.weight">
                    <p class="text-xs">
                      KG
                    </p>
                  </div>
                  <div class="w-1/2 ml-2 flex items-center justify-end">
                    <label for="" class="text-sm">Reps</label>
                    <input class="w-16 bg-transparent border border-gray-400 h-7 rounded-md ml-2 pl-2 text-sm"
                      type="number" v-model="set.reps">
                  </div>
                </div>
                <div class="w-full flex items-center justify-center">
                  <div class="w-5/6 bg-gray-300/50 h-[1px]"></div>
                </div>
              </div>
              <button class="w-1/2 bg-secondary text-black h-8 rounded-md my-2" @click="addSet(exercise)">Add
                Set</button>
            </div>
          </div>
          <!-- <div class="w-full mt-2" v-for="(set, index) in exercise.sets"
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
          </div> -->
          <input v-if="addExerciseToggle" v-model="exerciseName" type="text"
            class="w-full bg-white text-black mb-2 border h-8 rounded-md pl-2 mt-2"
            :class="exerciseError ? 'border-red-500' : 'border-black'" placeholder="Exercise Name..">
          <small class="text-red-500" v-if="exerciseError">{{ exerciseError }}</small>
          <button class="w-full bg-primary text-white h-8 rounded-md my-2 mb-6" @click="addExercise(day)">{{
            addExerciseToggle
            === false ?
            'New Exercise' : 'Add Exercise' }}</button>
        </div>
      </div>
      <input v-if="addDayToggle" v-model="dayName" type="text"
        class="w-full bg-white text-black mb-2 border h-8 rounded-md pl-2"
        :class="pageError ? 'border-red-500' : 'border-black'" placeholder="Day 1 / Upper / Chest Day">
      <small class="text-red-500" v-if="pageError">{{ pageError }}</small>
      <button class="w-full bg-primary text-white h-8 rounded-md mt-4" @click="addDay">{{ addDayToggle === false ?
        'New Day' : 'Add Day' }}</button>
      <!-- <button class="w-full bg-primary text-white h-8 rounded-md" @click="addExercise">{{ addExerciseToggle === false ?
        'New Exercise' : 'Add Exercise' }}</button> -->
      <button class="w-full bg-blue-500 text-white h-8 rounded-md my-4">Save Routine</button>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import supabase from '../supabase';
const workout = ref(props.workout);
const addDayToggle = ref(false)
const addExerciseToggle = ref(false)
const exerciseName = ref('')
const dayName = ref('')
const pageError = ref('')
const exerciseError = ref('')
const selectedDay = ref('')
const selectedExercise = ref('')
const days = ref([])
const exercises = ref([]);


const props = defineProps({
  workout: {
    type: Object,
  },
});

const addDay = () => {
  if (addDayToggle.value === false) {
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
    exercises: []
  })

  pageError.value = '';
  dayName.value = '';
  addDayToggle.value = false;
}


const addExercise = (day) => {
  if (addExerciseToggle.value === false) {
    addExerciseToggle.value = true;
    return;
  }

  if (exerciseName.value === '') {
    exerciseError.value = 'Please enter an exercise name'
    return;
  }

  const exercise = {
    id: day.exercises.length + 1,
    name: exerciseName.value,
    sets: [
      {
        id: 1,
        weight: 0,
        reps: 0,
      }
    ]
  }

  day.exercises.push(exercise);

  // exercises.value.push({
  //   id: exercises.value.length + 1,
  //   name: exerciseName.value,
  //   sets: [
  //     {
  //       id: 1,
  //       weight: 0,
  //       reps: 0,
  //     }
  //   ],
  // });

  selectedExercise.value = exercise.id;
  exerciseError.value = '';
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

const removeSet = (exercise, index) => {
  return function () {

    // console.log(excerciseId, index, 'any vlaues here?');
    // // find the exercise in the chosenWorkout we want to remove a set from
    // const exercise = days.value.exercises.find(
    //   (ex) => ex.id === excerciseId
    // );

    const set = exercise.sets[index];
    set.deleted = true;

    setTimeout(() => {
      exercise.sets.splice(index, 1);
    }, 250);

    setTimeout(() => {
      // get new index of each set and update it to id
      exercise.sets.forEach((set) => {
        set.id = exercise.sets.indexOf(set) + 1;
      })
    }, 300);
  }
};

const removeExercise = (day, exercise, index) => {
  console.log(exercise, index);
  if (exercise.startDelete === true) {
    //  remove from array
    day.exercises.splice(index, 1);
    // foundExercise.startDelete = false;
    day.exercises.forEach((exercise) => {
      exercise.id = day.exercises.indexOf(exercise) + 1;
    })
    return;
  }
  exercise.startDelete = true;
}

const removeDay = (dayId, index) => {
  const foundDay = days.value[index];

  if (foundDay.startDelete) {
    //  remove from array
    days.value.splice(index, 1);
    return;
  }

  foundDay.startDelete = true;
}

// This is after confirmation of removal.
const finalRemoveDay = (day, index) => {
  console.log('click', day);
  if (day.startDelete === true) {
    //  remove from array
    days.value.splice(index, 1);
    return;
  }
}

const finalRemoveExercise = (day, exercise, index) => {
  if (exercise.startDelete === true) {
    //  remove from array
    day.exercises.splice(index, 1);
    // foundExercise.startDelete = false;
    day.exercises.forEach((exercise) => {
      exercise.id = day.exercises.indexOf(exercise) + 1;
    })
    return;
  }
  exercise.startDelete = true;
}

const selectDay = (day) => {
  if (day.startDelete === true) {
    day.startDelete = false;
    return;
  }

  if (selectedDay.value === day.id) {
    selectedDay.value = null
    addExerciseToggle.value = false;
  } else {
    selectedDay.value = day.id
    selectedExercise.value = null
    addExerciseToggle.value = false;
  }
}

const selectExercise = (exercise) => {
  console.log(exercise, 'the selected exercise');
  if (exercise.startDelete === true) {
    exercise.startDelete = false;
    return;
  }
  if (selectedExercise.value === exercise.id) {
    selectedExercise.value = null
  } else {
    selectedExercise.value = exercise.id
  }
}

const saveRoutineToDatabase = async () => {
  try {
    const { data, error } = await supabase.tx(async (tx) => {
      // Insert "days" data and retrieve IDs then match the day names to the exercises arrays
      const daysArrayObject = days.value.map((day) => {
        return { day_name: day.name }
      })
      const dayResponse = await tx
        .from("days")
        .insert({

        });


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

      const dayIDs = dayResponse.data.map(day => day.id);

      // Insert "exercises" data
      const exercisesData = [
        { name: "123", day_id: dayIDs[0] } // Example for the first day
      ];

      await tx
        .from("exercises")
        .upsert(exercisesData, { onConflict: ["name"] });

      // Insert "sets" data
      const setsData = [
        { weight: 0, reps: 0, exercise_id: exerciseIDs[0] } // Example for the first exercise
      ];

      await tx
        .from("sets")
        .upsert(setsData, { onConflict: ["exercise_id"] });
    });
  } catch (error) {

  }

}


</script>


<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 17px;
}

/* Hide the default checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider (slider) */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 34px;
}

/* Add a "slider round" (slider round) */
.slider::before {
  position: absolute;
  content: "";
  height: 13px;
  width: 13px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 50%;
}

/* When the checkbox is checked, add a blue background */
input:checked+.slider {
  background-color: #007bff;
}

/* When the checkbox is checked, move the slider */
input:checked+.slider::before {
  -webkit-transform: translateX(13px);
  -ms-transform: translateX(13px);
  transform: translateX(13px);
}
</style>