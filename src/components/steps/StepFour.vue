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

const progressStep = () => {
  emit('stepProgress', 5);
};

const updateUserMetric = (value) => {
  store.userDetails.metric = value;
};
</script>

<template>
  <div class="flex flex-col w-full h-full justify-center items-center">
    <h1 class="text-xl font-boldHeadline">What's your preferred metric?</h1>
    <div class="w-full flex justify-center my-4">
      <div
        class="h-14 w-24 flex items-center justify-center px-2 mx-4 rounded-xl font-boldHeadline transition-all duration-500 ease-in"
        @click="updateUserMetric('KG')" :class="store.userDetails?.metric === 'KG'
            ? 'bg-primary text-white'
            : 'bg-secondary text-black'
          ">
        KG
      </div>
      <div
        class="h-14 w-24 flex items-center justify-center px-2 mx-4 rounded-xl font-boldHeadline transition-all duration-500 ease-in"
        @click="updateUserMetric('LB')" :class="store.userDetails?.metric === 'LB'
            ? 'bg-primary text-white'
            : 'bg-secondary text-black'
          ">
        LB
      </div>
    </div>
    <div class="progress w-1/3 h-2 my-5 rounded-full bg-secondary">
      <div class="bg-black w-4/6 h-full rounded-full"></div>
    </div>
    <button @click="progressStep" class="h-12 rounded-full w-full bg-primary text-white">
      Next Step
    </button>
  </div>
</template>
