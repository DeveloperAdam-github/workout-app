<script setup>
import TopBar from '../components/TopBar.vue';
import StarRating from '../components/StarRating.vue';

// Save trainer list to database when the trainers sign up, make it a choice?
const trainerList = [
  {
    id: 1,
    name: 'Johns Personal Training',
    desc: 'I\'ll help ypu change your life, get stronger, fitter, faster and better looking',
    picture: "https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png",
    rating: 3.5,
    plansSold: 12
  },
  {
    id: 2,
    name: 'Adam PT',
    desc: 'I can get you strong, stronger than Konrad can believe me',
    picture: "https://upload.wikimedia.org/wikipedia/en/a/aa/Bart_Simpson_200px.png",
    rating: 5,
    plansSold: 35
  },
  {
    id: 3,
    name: 'Konrad Mcdees & Nandos',
    desc: 'I will eat pizza with you then take you nandos and mcodonalds',
    picture: "https://upload.wikimedia.org/wikipedia/en/d/de/Barney_Gumble.png",
    rating: 1,
    plansSold: 4
  },
]
</script>

<template>
  <div class="h-full w-full flex flex-col bg-gray-200 text-black">
    <TopBar title="Discover trainers" />

    <div class="w-full h-full flex flex-col carousel-vertical px-4 mt-4">
      <div v-for="(trainer, index) in trainerList" :key="index"
        class="w-full carousel-item shadow-md rounded-md h-36 mb-4 bg-white flex flex-col">
        <RouterLink :to="{ name: 'TrainerView', params: { id: trainer.id } }" class="w-full h-full">
          <div class="h-1/2 items-center justify-center flex w-full p-4">
            <div class="flex ">
              <div class="w-12 h-12 mr-10 rounded-md bg-gray-200 flex items-center justify-center">
                <img v-if="trainer.picture" :src="trainer.picture" class="h-full w-full object-cover object-top" alt="">
                <i v-else class="fa-solid fa-user text-xl"></i>
              </div>
            </div>
            <div class="flex flex-col flex-1 ">
              <p class="text-lg">{{ trainer.name }}</p>
              <div class="flex justify-between w-full mt-2 text-xs">
                <div class="flex items-center">
                  <p class="mr-2">Rating:</p>
                  <StarRating :rating="trainer.rating" />
                </div>
                <p>{{ trainer.plansSold }} Plans Sold</p>
              </div>
            </div>
          </div>
          <div class="w-full p-4 text-sm">
            {{ trainer.desc }}
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>