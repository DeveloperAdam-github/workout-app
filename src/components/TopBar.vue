<script setup>
const props = defineProps({
  title: {
    type: String,
  },
});
</script>
<template>
  <div class="h-14 flex w-full items-end px-4">
    <a @click="$router.go(-1)" class="cursor-pointer">
      <i class="fas fa-arrow-left text-xl"></i>
    </a>
    <div class="w-full flex justify-center">
      <p class="text-lg">{{ props.title }}</p>
    </div>
  </div>
</template>
