<script setup>
import { defineProps, defineEmits } from 'vue';
import { useUserStore } from '../../stores/user';
import { useGlobalStore } from '../../stores/global';

const store = useUserStore();
const globalStore = useGlobalStore();

const emit = defineEmits(['stepProgress']);
const props = defineProps({
  step: {
    type: Number,
  },
});

const progressStep = () => {
  console.log('are we making it here yet?');
  emit('stepProgress', 7);
  globalStore.userDetailsEntered = true;
  globalStore.showNav = true;

  addUserDetailsToDatabase();
};

const updateUserGoals = (value) => {
  if (store.userDetails.goals.includes(value)) {
    const index = store.userDetails.goals.indexOf(value);

    if (index !== -1) {
      store.userDetails.goals.splice(index, 1);
    }
  } else {
    store.userDetails.goals.push(value);
  }
};

const addUserDetailsToDatabase = () => {
  store.addUserDetailsToDatabase();
};
</script>

<template>
  <div class="flex flex-col w-full h-full justify-center items-center">
    <h1 class="text-xl font-boldHeadline">What's your goal?</h1>
    <div class="w-full flex justify-between flex-wrap">
      <div
        class="h-10 text-xs w-45% my-2 flex items-center text-center justify-center px-2 rounded-xl transition-all duration-500 ease-in"
        @click="updateUserGoals('lose weight')" :class="store.userDetails.goals?.includes('lose weight')
            ? 'bg-primary text-white'
            : 'bg-secondary text-black'
          ">
        Lose weight
      </div>
      <div
        class="h-10 text-xs w-45% my-2 flex items-center text-center justify-center px-2 rounded-xl transition-all duration-500 ease-in"
        @click="updateUserGoals('gain muscle')" :class="store.userDetails.goals?.includes('gain muscle')
            ? 'bg-primary text-white'
            : 'bg-secondary text-black'
          ">
        Gain Muscle
      </div>
      <div
        class="h-10 text-xs w-45% my-2 flex items-center text-center justify-center px-2 rounded-xl transition-all duration-500 ease-in"
        @click="updateUserGoals('increase strength')" :class="store.userDetails.goals?.includes('increase strength')
            ? 'bg-primary text-white'
            : 'bg-secondary text-black'
          ">
        Increase Strength
      </div>
      <div
        class="h-10 text-xs w-45% my-2 flex items-center text-center justify-center px-2 rounded-xl transition-all duration-500 ease-in"
        @click="updateUserGoals('increase endurance')" :class="store.userDetails.goals?.includes('increase endurance')
            ? 'bg-primary text-white'
            : 'bg-secondary text-black'
          ">
        Increase Endurance
      </div>
    </div>
    <div class="progress w-1/3 h-2 my-5 rounded-full bg-secondary">
      <div class="bg-black w-6/6 h-full rounded-full"></div>
    </div>
    <button @click="progressStep" class="h-12 rounded-full w-full bg-primary text-white">
      Let's BEGIN!
    </button>
  </div>
</template>
