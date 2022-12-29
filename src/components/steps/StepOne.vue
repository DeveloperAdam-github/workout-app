<script setup>
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['stepProgress']);
const props = defineProps({
  step: {
    type: Number,
  },
});

const progressStep = () => {
  emit('stepProgress', 2);
};
</script>

<template>
  <div class="flex flex-col w-full h-full justify-center items-center">
    <h1 class="text-xl font-boldHeadline">Whatever your goal</h1>
    <h1 class="text-xl font-boldHeadline">This is the app for you</h1>
    <small class="text-xs text-gray-500 my-4 text-center"
      >Get started and enter your stats for a personialised experience</small
    >
    <div class="progress w-1/3 h-2 my-5 rounded-full bg-secondary">
      <div class="bg-black w-1/6 h-full rounded-full"></div>
    </div>
    <button
      @click="progressStep"
      class="h-12 rounded-full w-full bg-primary text-white"
    >
      Get Started
    </button>
  </div>
</template>
