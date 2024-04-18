<template>
  <div class="flex items-center">
    <div v-for="index in 5" :key="index" class="mr-1">
      <i v-if="rating >= index" class="fa-solid fa-star text-yellow-300"></i>
      <i v-else-if="rating >= index - 0.5" class="fa-solid fa-star-half-stroke text-yellow-300"></i>
      <i v-else class="fa-regular fa-star"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rating: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style scoped>
/* You can add any additional styling here */
</style>
