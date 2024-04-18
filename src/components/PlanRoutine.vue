<template>
  <div class="w-full flex flex-col overflow-scroll mb-10">
    <h1>Routine Name:</h1>
    <input class="w-full rounded-md bg-transparent border border-black pl-2 h-8 focus:outline-none" type="text"
      v-model="workout.workout_name" />

    <div class="w-full flex flex-col mt-4">
      <div class="flex flex-col w-full mb-" v-for="(day, index) in days" :key="index">
        <div class="w-full mb-2 flex items-center flex-col overflow-hidden"
          :class="selectedDay === day.id ? 'max-h-fit' : 'max-h-11'">
          <div class="w-full flex items-center justify-between relative mb-1">
            <h2 class="text-xl w-full flex items-center justify-center text-center  rounded-md py-2 transition-all"
              @click="selectDay(day)" v-touch:swipe.left="() => removeDay(day.id, index)"
              :class="selectedDay === day.id && !day.startDelete ? 'bg-secondary border-b-4 border-black' : day.startDelete ? 'bg-red-500 border-none w-5/6' : 'bg-gray-600 text-white'">
              {{ day.day_name
              }}
            </h2>
            <div :class="day.startDelete === true ? 'translate-x-0' : 'translate-x-36'"
              class="transition-all  transform absolute right-0">
              <button class="bg-red-500 text-white h-8 w-8 rounded-md" @click="finalRemoveDay(day,
                index)">X</button>
            </div>
          </div>
          <div v-for="(exercise, index) in day.plan_exercises" class="w-full flex flex-col mt-1 -mb-1">
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
              <div class="w-full mt-1 px-2" v-for="(set, index) in exercise.plan_sets"
                v-touch:swipe.left="removeSet(exercise, index)" :class="set.deleted == true
                  ? 'bg-red-500 animate-ping-once'
                  : 'transition-all duration-1000 ease-out'
                  ">
                <div class="w-full flex justify-between items-center">
                  <label for="" class="mb-1 text-sm">Set {{ index + 1 }}</label>

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
          <SearchInput class="" @select="handleSelect" :text="exerciseName" :show="addExerciseToggle"
            @selectedOption="isOptionSelected" />
          <!-- <input v-if="addExerciseToggle" v-model="exerciseName" type="text"
            class="w-full bg-white text-black mb-2 border h-8 rounded-md pl-2 mt-2"
            :class="exerciseError ? 'border-red-500' : 'border-black'" placeholder="Exercise Name.."> -->
          <small class="text-red-500" v-if="exerciseError">{{ exerciseError }}</small>
          <small class="text-red-500" v-if="showSelectError">Select exercise or pick custom</small>
          <button class="w-full text-white h-8 rounded-md my-2 mb-6"
            :class="showSelectError === true ? 'bg-gray-200' : 'bg-primary'" @click="addExercise(day)">{{
              addExerciseToggle
              === false ?
              'New Exercise' : 'Add Exercise' }}</button>
        </div>
      </div>
      <input v-if="addDayToggle" v-model="dayName" type="text"
        class="w-full bg-white text-black mb-2 border h-8 rounded-md pl-2"
        :class="pageError ? 'border-red-500' : 'border-black'" placeholder="Day 1 / Upper / Chest Day">
      <select v-if="addDayToggle" v-model="daySet" name="" id=""
        class="w-full bg-white text-black mb-2 border border-black h-8 rounded-md pl-2">
        <option value="" class="" disabled selected>Select a day
          or leave blank</option>
        <option value="mon">Monday</option>
        <option value="tue">Tuesday</option>
        <option value="wed">Wednesday</option>
        <option value="thu">Thursday</option>
        <option value="fri">Friday</option>
        <option value="sat">Saturday</option>
        <option value="sun">Sunday</option>
      </select>
      <small class="text-red-500" v-if="pageError">{{ pageError }}</small>
      <button class="w-full bg-primary text-white h-8 rounded-md mt-4" @click="addDay">{{ addDayToggle === false ?
        'New Day' : 'Add Day' }}</button>
      <!-- <button class="w-full bg-primary text-white h-8 rounded-md" @click="addExercise">{{ addExerciseToggle === false ?
        'New Exercise' : 'Add Exercise' }}</button> -->
      <button class="w-full bg-blue-500 text-white h-8 rounded-md my-4" @click="saveRoutineToDatabase">Save
        Routine</button>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import SearchInput from '../components/SearchInput.vue';
import supabase from '../supabase';
const workout = ref(props.workout);
const addDayToggle = ref(false)
const addExerciseToggle = ref(false)
const exerciseName = ref('')
const dayName = ref('')
const daySet = ref('')
const pageError = ref('')
const exerciseError = ref('')
const selectedDay = ref('')
const selectedExercise = ref('')
const hasExerciseBeenSelected = ref(false);
const showSelectError = ref(false)
const days = ref(workout.value.plan_days.length > 0 ? props.workout.plan_days : [])
const exercises = ref([]);
const deletedDays = ref([])



const props = defineProps({
  workout: {
    type: Object,
  },
});

const handleSelect = (selectedExercise) => {
  exerciseName.value = selectedExercise
  addExerciseToggle.value = true;
  console.log(exerciseName.value, 'lol here');
}

const isOptionSelected = (value) => {
  console.log(value, 'the value inside optionSelected?');

  if (value === true) {
    hasExerciseBeenSelected.value = true;
    showSelectError.value = false
  } else {
    hasExerciseBeenSelected.value = false;
    showSelectError.value = true
  }
}

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
    id: 'temp-id' + days.value.length + 1,
    day_name: dayName.value,
    day_set: daySet.value,
    plan_exercises: []
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

  // if (hasExerciseBeenSelected.value === false) {
  //   exerciseError.value = 'Please select an exercise or choose custom exercise'
  //   return;
  // }

  const exercise = {
    id: day.plan_exercises.length + 1,
    name: exerciseName.value,
    exercise_number: day.plan_exercises.length === 0 ? 1 : day.plan_exercises.length + 1,
    plan_sets: [
      {
        id: 1,
        set_number: 1,
        weight: 0,
        reps: 0,
        is_percentage: false,
      }
    ]
  }

  day.plan_exercises.push(exercise);

  selectedExercise.value = exercise.id;
  exerciseError.value = '';
  exerciseName.value = '';
  addExerciseToggle.value = false;
  hasExerciseBeenSelected.value = false;
}

const addSet = (exercise) => {
  const set = {
    id: exercise.plan_sets.length + 1,
    set_number: exercise.plan_sets.length + 1,
    weight: 0,
    reps: 0,
    is_percentage: false,
  }

  exercise.plan_sets.push(set);
}

const removeSet = (exercise, index) => {
  return function () {
    const set = exercise.sets[index];
    set.deleted = true;

    setTimeout(() => {
      exercise.sets.splice(index, 1);
    }, 250);

    setTimeout(() => {
      // get new index of each set and update it to id
      exercise.sets.forEach((set) => {
        set.id = exercise.sets.indexOf(set) + 1;
        set.set_number = exercise.sets.indexOf(set) + 1;
      })
    }, 300);
  }
};

const removeExercise = (day, exercise, index) => {

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

  foundDay.startDelete = true;
}

// This is after confirmation of removal.
const finalRemoveDay = (day, index) => {

  if (day.startDelete == true) {
    //  remove from array
    days.value.splice(index, 1);

    deletedDays.value.push(day);
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
  //  need to generate random ids firstly.
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
  const daysArrayObject = days.value.map((day) => {
    // const isTempId = typeof day.id === 'string' && day.id.startsWith('temp-id');
    // ...(isTempId ? {} : { id: day.id }),
    return { day_name: day.day_name, day_set: day.day_set, workout_id: props.workout.id }
  });

  try {
    const { data, error } = await supabase
      .from('plan_days')
      .upsert(daysArrayObject, { onConflict: ['day_name', 'day_set', 'workout_id'] })
      .select()

    if (error) {
      throw error;
    }

    if (data) {
      const dayIds = data.map(day => day.id);

      await saveExercisesToDatabase(dayIds);
    }

    console.log(deletedDays, 'the deleted days?');

    if (deletedDays.value.length > 0) {
      const deletedDayIds = deletedDays.value.map(day => day.id);
      console.log(deletedDayIds, 'deleting days ids?');

      // Finally, delete the days themselves
      const { data: deleteData, error: deleteError } = await supabase
        .from('plan_days')
        .delete()
        .in('id', deletedDayIds);

      if (deleteError) {
        throw deleteError;
      }

      console.log(deleteData, 'deleted data');


    }

  } catch (err) {
    console.error(err);
  }
}

const saveExercisesToDatabase = async (dayIds) => {
  const exercisesArray = [];


  days.value.forEach((day, index) => {
    day.plan_exercises.forEach((exercise) => {
      const { plan_sets, id, created_at, ...exerciseData } = exercise;
      exercisesArray.push({
        ...exerciseData,
        plan_day: dayIds[index]
      });
    });
  });

  try {
    const { data, error } = await supabase
      .from('plan_exercises')
      .upsert(exercisesArray, { onConflict: ['name', 'exercise_number', 'plan_day'] })
      .select()


    if (error) {
      throw error;
    }

    if (data) {
      const exerciseIds = data.map(exercise => exercise.id);

      await saveSetsToExercisesInDatabase(exerciseIds);
    }
  } catch (err) {
    console.error(err);
  }
}

const saveSetsToExercisesInDatabase = async (exerciseIds) => {
  const setsArray = [];

  let currentIndex = 0;

  days.value.forEach((day) => {
    day.plan_exercises.forEach((exercise) => {
      exercise.plan_sets.forEach((set) => {
        const { id, created_at, ...setData } = set;
        setsArray.push({
          ...setData,
          exercise: exerciseIds[currentIndex]  // Use the currentIndex to get the correct ID
        });
      });
      currentIndex++;  // Move to the next exercise ID after processing all sets for an exercise so we don't double up.
    });
  });

  try {
    const { data, error } = await supabase
      .from('plan_sets')
      // .upsert(setsArray)
      .upsert(setsArray, { onConflict: ['set_number', 'weight', 'reps', 'exercise'] })

    if (error) {
      throw error;
    }

    if (data) {
      // reset the state after succesfully uploading to the database.
    }
  } catch (err) {
    console.error(err);
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