<script setup>
import womanSquatting from '../assets/images/womanSquatting.jpg';
</script>
<template>
  <div
    class="w-4/5 h-52 rounded-xl carousel-item mr-4 bg-cover bg-center flex flex-col text-white"
    :style="{
      'background-image': `linear-gradient(to bottom, rgba(1,1,1,0.75), rgba(255,255,255,0.000001)), url(${womanSquatting})`,
    }"
  >
    <div class="p-4 flex flex-col">
      <h1 class="text-lg">Lower body workout</h1>
      <div class="">
        <div
          class="p-2 w-max bg-gray-100 flex items-center my-2 text-xs rounded-xl text-black"
        >
          <p><i class="fa-solid fa-fire mr-2"></i>500 Kcal</p>
        </div>
        <div
          class="p-2 w-max bg-gray-100 flex items-center my-2 text-xs rounded-xl text-black"
        >
          <p><i class="fa-solid fa-stopwatch mr-2"></i>50 Min</p>
        </div>
      </div>
    </div>
  </div>
</template>
