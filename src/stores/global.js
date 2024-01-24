import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', () => {
  const userDetailsEntered = ref(true);
  const showNav = ref(true);
  const showPopUpForDetail = ref(false);
  const showMailBox = ref(false);
  const isLoadedMessage = ref(false)
  const loadedMessage = ref({})
  const showInstantAlert = ref(false)
  const instantAlertMessage = ref('')
  const messages = ref([])

  function hideNavFunction() {
    showNav.value = false;
  }

  function toggleShowMessageCenter() {
    console.log('clicking');
    showMailBox.value = !showMailBox.value;
  }

  return { userDetailsEntered, showNav, showPopUpForDetail, hideNavFunction, showMailBox, loadedMessage, isLoadedMessage, toggleShowMessageCenter, showInstantAlert, instantAlertMessage, messages };
});
