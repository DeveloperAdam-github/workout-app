import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', () => {
  const userDetailsEntered = ref(false);
  const showNav = ref(true);
  const showPopUpForDetail = ref(false);

  function increment() {
    count.value++;
  }

  return { userDetailsEntered, showNav, showPopUpForDetail };
});
