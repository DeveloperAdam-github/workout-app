<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useUserStore } from '../../stores/user';

const store = useUserStore();
const emit = defineEmits(['stepProgress']);
const foot = ref('');
const inches = ref('');

const props = defineProps({
  step: {
    type: Number,
  },
});

const progressStep = () => {
  emit('stepProgress', 6);
};

const updateUserHeightFt = (value) => {
  store.userDetails.height.foot = value;
};

const updateUserHeightInches = (value) => {
  store.userDetails.height.inches = value;
};
</script>

<template>
  <div class="flex flex-col w-full h-full justify-center items-center">
    <h1 class="text-xl font-boldHeadline">What's your height?</h1>
    <div class="w-full flex justify-center my-4">
      <div
        class="h-14 w-24 flex items-center justify-center px-2 bg-secondary text-black mx-4 rounded-xl font-boldHeadline"
      >
        <input
          type="text"
          class="bg-transparent w-full font-boldHeadline h-full text-3xl text-black pl-2"
          placeholder="Ft"
          v-model="foot"
          @change="updateUserHeightFt(foot)"
        />
      </div>
      <div
        class="h-14 w-24 flex items-center justify-center px-2 bg-secondary text-black mx-4 rounded-xl font-boldHeadline"
      >
        <input
          type="text"
          class="bg-transparent w-full font-boldHeadline h-full text-3xl text-black pl-2"
          placeholder="Inch"
          v-model="inches"
          @change="updateUserHeightInches(inches)"
        />
      </div>
    </div>
    <div class="progress w-1/3 h-2 my-5 rounded-full bg-secondary">
      <div class="bg-black w-5/6 h-full rounded-full"></div>
    </div>
    <button
      @click="progressStep"
      class="h-12 rounded-full w-full bg-primary text-white"
    >
      Next Step
    </button>
  </div>
</template>
