<template>
  <div class="w-full h-full top-0 left-0 absolute z-20 text-black" v-show="global.showInstantAlert === true">
    <div class="w-full h-full bg-black/70 flex items-center justify-center flex-col"
      @click="global.showInstantAlert = false">
      <div
        class="w-[90%] h-fit p-4 rounded-lg shadow-xl bg-white overflow-scroll flex flex-col items-center justify-center"
        @click.stop>
        <h1>Instant alert lol ..</h1>
        <p>Something here</p>
        <button @click="navigateToMessage" class="bg-primary px-2 py-1 rounded-md text-white">Take me to my
          message</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { usePrimeStore } from "../stores/prime";
import axios from 'axios'
import { useUserStore } from "../stores/user";
import { useGlobalStore } from "../stores/global";
import { useRouter } from "vue-router";


const store = usePrimeStore();
const userStore = useUserStore();
const global = useGlobalStore();
const router = useRouter();

const navigateToMessage = () => {

  router.push({ name: 'settings' })
  global.showMailBox = true;
  global.isLoadedMessage = true;
}


onMounted(async () => {
})

</script>