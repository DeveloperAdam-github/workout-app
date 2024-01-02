<script setup>
import { ref, onMounted, computed, defineEmits } from 'vue';
import { useWorkoutStore } from '../stores/workout';
var months = ref([
  'January',
  'Feburary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]);
const emit = defineEmits(['daysPicked']);

const chosenMonth = ref(null);
const chosenDay = ref(null);
const chosenDays = ref([]);
const date = ref(new Date());
const year = ref(date.value.getFullYear());
const store = useWorkoutStore();

const toggleMonthRight = () => {
  let indexOfMonth = months.value.indexOf(chosenMonth.value);
  let nextMonth = months.value[indexOfMonth + 1];
  chosenMonth.value = nextMonth;
  getDaysInMonth();
};
const toggleMonthLeft = () => {
  let indexOfMonth = months.value.indexOf(chosenMonth.value);
  let nextMonth = months.value[indexOfMonth - 1];
  chosenMonth.value = nextMonth;
  getDaysInMonth();
};

const changeMonth = () => {
  getDaysInMonth();
};

const getDaysInMonth = () => {
  let indexOfMonth = months.value.indexOf(chosenMonth.value);
  const days = new Date(year.value, indexOfMonth + 1, 0).getDate();
  daysInMonth.value = days;
  return days;
};
const daysInMonth = ref(getDaysInMonth.value);
const daysInMonthArray = ref(new Array(31));

const figureOutMonthDays = () => {
  const totalDaysIntheMonth = Array(31).fill('day');

  daysInMonthArray.value = totalDaysIntheMonth;
};

const pickedDays = (day) => {
  if (chosenDays.value.includes(day, 0)) {
    const index = chosenDays.value.indexOf(day);
    chosenDays.value.splice(index, 1);
  } else {
    chosenDays.value.push(day);
  }

  emit('daysPicked', chosenDays.value);
};

const pickedDaysEnd = (index) => { };

// Need to loop through workouts and match against the calendar if the date matches that on the calendar, just to show days we worked out?



onMounted(() => {
  const date = new Date();
  let month = date.getMonth();
  let getMonthFromArray = months.value.at(month);
  chosenMonth.value = getMonthFromArray;
  daysInMonth.value = getDaysInMonth();
  figureOutMonthDays();
});
</script>

<template>
  <div class="h-52 mt-4 w-full flex flex-col bg-primary rounded-lg p-4">
    <div class="w-full flex justify-between mb-4 text-white">
      <div>
        <i class="fa-solid fa-arrow-left-long" @click="toggleMonthLeft"></i>
      </div>
      <div>
        <select @change="changeMonth" name="" id="" class="w-full bg-transparent text-white" v-model="chosenMonth">
          <option :value="month" v-for="(month, index) in months" :key="index">
            {{ month }}
          </option>
        </select>
      </div>
      <div>
        <i class="fa-solid fa-arrow-right-long" @click="toggleMonthRight"></i>
      </div>
    </div>
    <div class="flex h-10 w-full flex-wrap">
      <!-- :class="
          chosenDay === index + 1 ? 'bg-white text-gray-900' : 'text-white'
        " -->
      <div v-for="(day, index) in daysInMonth" class="w-8 h-8 rounded-full flex items-center justify-center mx-1" :class="chosenDays.includes(index + 1)
        ? 'bg-white text-gray-900'
        : 'text-white'
        ">
        {{ index + 1 }}
      </div>
    </div>
  </div>
</template>
<style scoped></style>
