import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', () => {
  const userDetailsEntered = ref(true);
  const showNav = ref(true);
  const showPopUpForDetail = ref(false);

  function hideNavFunction() {
    showNav.value = false;
  }

  return { userDetailsEntered, showNav, showPopUpForDetail, hideNavFunction };
});
