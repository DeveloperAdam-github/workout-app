<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';

const store = useUserStore();
const user = ref(store.user);
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full flex">
      <p>Hello</p>
      <p>{{ user }}</p>
    </div>
  </div>
</template>
