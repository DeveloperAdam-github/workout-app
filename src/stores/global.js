import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', () => {
  const userDetailsEntered = ref(true);

  function increment() {
    count.value++;
  }

  return { userDetailsEntered };
});
