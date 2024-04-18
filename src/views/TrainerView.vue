<script setup>
import TopBar from '../components/TopBar.vue';
import { useRoute } from 'vue-router'

const route = useRoute();
const trainerId = route.params.id

// const props = defineProps({
//   trainer: {
//     type: Object,
//   },
// });

</script>

<template>
  <div class="w-full h-full flex flex-col bg-gray-200 text-black">
    <TopBar title="Trainers name" />
    {{ trainerId }}
  </div>
</template>