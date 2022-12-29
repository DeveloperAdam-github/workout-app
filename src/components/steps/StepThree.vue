<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useUserStore } from '../../stores/user';

const store = useUserStore();
const age = ref(null);

const emit = defineEmits(['stepProgress']);
const props = defineProps({
  step: {
    type: Number,
  },
});

const updateUserAge = (value) => {
  store.userDetails.age = value;
};

const progressStep = () => {
  emit('stepProgress', 4);
};
</script>

<template>
  <div class="flex flex-col w-full h-full justify-center items-center">
    <h1 class="text-xl font-boldHeadline">What's your age?</h1>
    <div class="h-20 w-full flex items-center justify-center my-4">
      <input
        type="text"
        class="w-24 h-full border-gray-600 border-b-4 text-5xl font-boldHeadline bg-white flex items-center justify-center pl-3"
        :class="age === '' ? 'animate-pulse' : ''"
        v-model="age"
        @change="updateUserAge(age)"
      />
    </div>
    <div class="progress w-1/3 h-2 my-5 rounded-full bg-secondary">
      <div class="bg-black w-3/6 h-full rounded-full"></div>
    </div>
    <button
      @click="progressStep"
      class="h-12 rounded-full w-full bg-primary text-white"
    >
      Next Step
    </button>
  </div>
</template>
