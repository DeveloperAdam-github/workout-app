import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const user = ref('homer');
  const userDetails = ref({
    gender: '',
    age: '',
    metric: '',
    height: { foot: '', inches: '' },
    goals: [],
  });

  return { user, userDetails };
});
