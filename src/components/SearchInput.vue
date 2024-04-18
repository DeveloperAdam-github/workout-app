<script setup>
import { ref, computed, onMounted } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useWorkoutStore } from '../stores/workout';
import supabase from '../supabase';

// const exercises = [
//   'Bench Press', 'Incline Bench Press', 'Dumbbell Press',
//   'Incline Dumbbell Press', 'Decline Dumbbell Press', 'Bicep Curl',
//   'Squat',
//   // Add more exercises as needed
// ];

// Define custom events your component can emit
const emits = defineEmits(['select', 'addCustom', 'selectedOption']);
const props = defineProps({
  text: String,
  show: Boolean
});

const store = useWorkoutStore();
const exercises = ref([])
const searchText = ref(props.text || '');
const dropdownOpen = ref(false);
const editAvailable = ref(false);
const selectedOption = ref(false);

const filteredExercises = computed(() => {
  if (exercises.value.length > 0) {
    const filteredList = exercises.value.filter(exercise =>
      exercise.exercise_name.toLowerCase().includes(searchText.value.toLowerCase())
    );

    return filteredList
  } else {
    return ''
  }
});

const showAddCustomOption = computed(() => {
  if (exercises.value.length > 0) {
    return !exercises.value.map(e => e.exercise_name.toLowerCase()).includes(searchText.value.toLowerCase());
  } else {
    return ''
  }
});

const dropdownRef = ref(null);
onClickOutside(dropdownRef, () => {
  dropdownOpen.value = false;
});

const emitSelect = (exercise) => {
  emits('select', exercise);
  searchText.value = exercise.exercise_name;
  dropdownOpen.value = false;
  editAvailable.value = false;
  selectedOption.value = true;
  emits('selectedOption', selectedOption.value);
};

const addCustomExercise = () => {
  emits('addCustom', searchText.value);
  dropdownOpen.value = false;
  editAvailable.value = false;
};

const keyDownToResetSelectEmit = () => {
  emits('selectedOption', false)
}

const getExerciseList = async () => {
  console.log('get exercise list');

  await supabase
    .from('exercise_list')
    .select('*')
    .then((response) => {
      // store.exerciseList = response.data;
      exercises.value = response.data
    })
}

onMounted(() => {
  if (!exercises.length > 0) {
    getExerciseList();
  }
})
</script>


<template>
  <div class="w-full flex flex-col relative transition-all"
    :class="dropdownOpen === true && filteredExercises.length > 3 ? 'h-40 mb-10' : dropdownOpen === true && filteredExercises.length <= 3 && filteredExercises.length > 1 ? 'h-28 mb-10' : 'h-10'"
    ref="dropdownRef" v-if="show">
    <input type="text" placeholder="Search for an exercise..." v-model="searchText"
      class="mb-2 p-2 border-2 border-gray-200 rounded bg-white h-9 text-black" @focus="dropdownOpen = true"
      @keydown.escape="dropdownOpen = false" @keydown="keyDownToResetSelectEmit" />
    <ul v-show="dropdownOpen"
      class="absolute w-full z-40 top-8 overflow-scroll h-full border-2 border-gray-200 rounded border-t-0">
      <li v-for="exercise in filteredExercises" :key="exercise" class="p-2 hover:bg-gray-100 cursor-pointer"
        @click="emitSelect(exercise)">
        {{ exercise.exercise_name }}
      </li>
      <li v-if="showAddCustomOption" class="p-2 hover:bg-gray-100 cursor-pointer" @click="addCustomExercise">
        Add Custom Exercise
      </li>
      <li v-else-if="filteredExercises.length === 0" class="p-2">
        No results found
      </li>
    </ul>
  </div>
</template>
