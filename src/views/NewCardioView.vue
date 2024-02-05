<script setup>
import MapComponent from '../components/MapComponent.vue';


</script>

<template>
  <div class="w-full flex flex-col h-full bg-gray-200 p-4 pb-10 overflow-scroll">
    <div class="w-full flex flex-col h-[50%]">
      <div class="h-full bg-white w-full rounded-lg shadow-lg flex items-center justify-center">
        <!-- Show map here -->
        <MapComponent />
      </div>
    </div>
    <div class="w-full flex flex-col h-[30%]">
      <div class="grid grid-cols-2 grid-rows-2  h-full gap-4 my-4 text-black">
        <div class="bg-white rounded-lg shadow-lg p-2 flex flex-col">
          <div class="h-6 w-6 flex items-center justify-center rounded-md bg-primary text-white">
            <i class="fa-regular fa-clock"></i>
          </div>
          <h4>Time:</h4>
          <p class="text-xl font-boldHeadline">1:32:35</p>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-2 flex flex-col">Distance</div>
        <div class="bg-white rounded-lg shadow-lg p-2 flex flex-col">Calories</div>
        <div class="bg-white rounded-lg shadow-lg p-2 flex flex-col">Heart Rate</div>
      </div>
    </div>
    <div>
      <!-- Scroll to select  -->
      <button class="w-full h-10 bg-secondary text-black rounded-full">Start Walk</button>
    </div>
  </div>
</template>