import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', () => {
  const userDetailsEntered = ref(false);

  function increment() {
    count.value++;
  }

  return { userDetailsEntered };
});
