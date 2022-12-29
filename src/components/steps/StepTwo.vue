<script setup>
import { defineProps, defineEmits } from 'vue';
import { useUserStore } from '../../stores/user';

const store = useUserStore();

const emit = defineEmits(['stepProgress']);
const props = defineProps({
  step: {
    type: Number,
  },
});

const updateUserGender = (value) => {
  store.userDetails.gender = value;
};

const progressStep = () => {
  emit('stepProgress', 3);
};
</script>

<template>
  <div class="flex flex-col w-full h-full justify-center items-center">
    <h1 class="text-xl font-boldHeadline">What's your gender?</h1>
    <div class="w-full flex justify-between my-4">
      <div
        class="h-14 w-24 flex items-center justify-center px-2 mx-2 rounded-xl transition-all duration-500 ease-in"
        :class="
          store.userDetails.gender === 'male'
            ? 'bg-primary text-white'
            : 'bg-secondary text-black'
        "
        @click="updateUserGender('male')"
      >
        Male
      </div>
      <div
        class="h-14 w-24 flex items-center justify-center px-2 mx-2 rounded-xl transition-all duration-500 ease-in"
        :class="
          store.userDetails.gender === 'female'
            ? 'bg-primary text-white'
            : 'bg-secondary text-black'
        "
        @click="updateUserGender('female')"
      >
        Female
      </div>
      <div
        class="h-14 w-24 flex items-center justify-center px-2 mx-2 rounded-xl transition-all duration-500 ease-in"
        @click="updateUserGender('other')"
        :class="
          store.userDetails.gender === 'other'
            ? 'bg-primary text-white'
            : 'bg-secondary text-black'
        "
      >
        Other
      </div>
    </div>
    <div class="progress w-1/3 h-2 my-5 rounded-full bg-secondary">
      <div class="bg-black w-2/6 h-full rounded-full"></div>
    </div>
    <button
      @click="progressStep"
      class="h-12 rounded-full w-full bg-primary text-white"
    >
      Next Step
    </button>
  </div>
</template>
