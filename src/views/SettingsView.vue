<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';

const store = useUserStore();
const user = ref(store.user);
</script>

<template>
  <h1>hello world {{ user.id }}</h1>
</template>
