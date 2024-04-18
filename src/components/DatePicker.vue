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

const workoutStore = useWorkoutStore()

// Additional ref for weekdays
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const testWorkouts = [
  '2024-04-01',
  '2024-04-02',
  '2023-10-05',
  '2023-10-15',
];

const testCardioWorkouts = [
  '2024-04-02',
  '2024-04-03',
  '2024-04-30',
  '2023-10-10',
  '2023-10-20',
];


const getFirstDayOfMonth = () => {
  let indexOfMonth = months.value.indexOf(chosenMonth.value);
  const firstDay = new Date(year.value, indexOfMonth, 1).getDay();
  // Converting Sunday (0) to 7 to make it easier to work with Mon-Sun (1-7)
  return firstDay === 0 ? 7 : firstDay;
};

const calendarDays = computed(() => {
  const days = [];
  const indexOfMonth = months.value.indexOf(chosenMonth.value);
  const totalDays = new Date(year.value, indexOfMonth + 1, 0).getDate();
  const paddingDays = getFirstDayOfMonth() - 1;
  const prevMonthTotalDays = new Date(year.value, indexOfMonth, 0).getDate();

  // Previous month padding
  for (let i = 0; i < paddingDays; i++) {
    days.push({ day: prevMonthTotalDays - paddingDays + i + 1, isPrevMonth: true });
  }

  // Actual days of the month
  for (let day = 1; day <= totalDays; day++) {
    const fullDate = `${year.value}-${String(indexOfMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Find the workout and cardio entries for this date
    const workoutEntry = workoutStore.previousWorkoutDates.find(workout => workout.created_at === fullDate);
    const cardioEntry = workoutStore.previousCardioDates.find(workout => workout.created_at === fullDate);

    // Check if the entries exist and assign a boolean value
    const isWorkoutDay = !!workoutEntry;
    const isCardioDay = !!cardioEntry;

    // If the entries exist, extract their IDs; otherwise, use null
    const workoutId = workoutEntry ? workoutEntry.id : null;
    const cardioId = cardioEntry ? cardioEntry.id : null;

    days.push({ day, isCurrentMonth: true, isWorkoutDay, isCardioDay, workoutId, cardioId });
  }

  return days;
});


// const calendarDays = computed(() => {
//   const days = [];
//   const indexOfMonth = months.value.indexOf(chosenMonth.value);
//   const totalDays = new Date(year.value, indexOfMonth + 1, 0).getDate();
//   const paddingDays = getFirstDayOfMonth() - 1;
//   const prevMonthTotalDays = new Date(year.value, indexOfMonth, 0).getDate();

//   // Add days from the previous month for padding
//   for (let i = 0; i < paddingDays; i++) {
//     days.push({ day: prevMonthTotalDays - paddingDays + i + 1, isPrevMonth: true });
//   }

//   // Add actual days of the month
//   for (let day = 1; day <= totalDays; day++) {
//     days.push({ day, isCurrentMonth: true });
//   }

//   // Optionally, you can add days from the next month to fill the last row,
//   // similar to how you added days from the previous month.

//   return days;
// });


const chosenMonth = ref(null);
const chosenDay = ref(null);
const chosenDays = ref([]);
const date = ref(new Date());
const year = ref(date.value.getFullYear());
const store = useWorkoutStore();
const selectedDayInfo = ref(null);

const toggleMonthRight = () => {
  if (chosenMonth.value === 'December') {
    return
  } else {


    let indexOfMonth = months.value.indexOf(chosenMonth.value);
    let nextMonth = months.value[indexOfMonth + 1];
    chosenMonth.value = nextMonth;
    getDaysInMonth();
  }
};
const toggleMonthLeft = () => {
  if (chosenMonth.value === 'January') {
    return
  } else {

    let indexOfMonth = months.value.indexOf(chosenMonth.value);
    let nextMonth = months.value[indexOfMonth - 1];
    chosenMonth.value = nextMonth;
    getDaysInMonth();
  }
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


const selectDay = (item) => {
  // Check if the day has a workout or cardio session
  if (item.isWorkoutDay || item.isCardioDay) {
    console.log(item, 'the item');
    selectedDayInfo.value = item;
  } else {
    selectedDayInfo.value = null;
  }
};

const linkTo = (type) => {
  if (type == 'cardio' && selectedDayInfo.value.isCardioDay) {
    return {
      name: 'newCardio',
      query: { workout: selectedDayInfo.value.cardioId },
    }
  } else {
    return {
      name: 'workoutView',
      query: { workout: selectedDayInfo.value.workoutId },
    }
  }
}

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
  <div class="h-fit mt-4 w-full flex flex-col bg-primary rounded-lg p-4">
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
    <div class="grid grid-cols-7 gap-1 text-center text-white">
      <!-- Weekday Headers -->
      <div v-for="weekday in weekdays" :key="weekday" class="font-bold">
        {{ weekday }}
      </div>
      <!-- Day Numbers -->
      <!-- <div v-for="(item, index) in calendarDays" :key="index"
        class="w-8 h-8 rounded-full flex items-center justify-center mx-1"
        :class="[item.isCurrentMonth ? 'text-white' : 'text-gray-400', chosenDays.includes(item.day) ? 'bg-white text-gray-900' : '']">
        <p>
          {{ item.day }}
        </p>
      </div> -->
      <div v-for="(item, index) in calendarDays" :key="index" class="relative">
        <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm relative" @click="selectDay(item)"
          :class="[item.isCurrentMonth ? 'text-white' : 'text-gray-400']">
          <p v-if="item.isWorkoutDay && !item.isCardioDay"
            class=" flex items-center justify-center border-[3px] rounded-full h-9 w-9 border-orange-500">
            {{ item.day }}
          </p>
          <p v-else-if="item.isCardioDay && !item.isWorkoutDay"
            class="border-[3px] h-9 w-9 flex items-center justify-center rounded-full border-green-500">
            {{ item.day }}
          </p>
          <p v-else-if="item.isCardioDay && item.isWorkoutDay"
            class="border-[3px] h-9 w-9 border-orange-500 flex items-center justify-center rounded-full relative">
            <span class="absolute left-0 top-0 h-[1.9rem] w-[1.9rem] rounded-full border-[3px] border-green-500"></span>
            {{ item.day }}
          </p>
          <p v-else class="h-8 w-8 rounded-full flex items-center justify-center text-sm">{{ item.day }}</p>
        </div>
        <!-- Modal -->
      </div>
      <div v-if="selectedDayInfo" class="fixed inset-0 bg-black/70 flex justify-center items-center text-black"
        @click="selectedDayInfo = null">
        <div @click.stop
          class="bg-white shadow-lg p-4 rounded-lg max-w-sm w-full flex flex-col items-center justify-center">
          <h3 class="font-boldHeadline uppercase text-lg">On this day..</h3>
          <p v-if="selectedDayInfo.isWorkoutDay" class="bg-primary rounded-md px-2 py-1 text-white my-2 w-64">
            <RouterLink :to="linkTo('workout')">
              View Prev
              Workout
            </RouterLink>
          </p>
          <p v-if="selectedDayInfo.isCardioDay" class="bg-secondary px-2 py-1 rounded-md my-2 w-64">
            <RouterLink :to="linkTo('cardio')">View Prev Cardio</RouterLink>
          </p>
          <!-- <button @click="selectedDayInfo = null" class="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
