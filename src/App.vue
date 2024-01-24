<script setup>
import { RouterLink, RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
import InstantAlertModal from './components/InstantAlertModal.vue';
import supabase from './supabase';

import { useUserStore } from './stores/user';
import { useGlobalStore } from './stores/global';
import { onMounted } from 'vue';

const store = useUserStore();
const globalStore = useGlobalStore();

</script>

<template>
  <div class="h-screen w-screen background overflow-hidden font-headline">
    <InstantAlertModal />
    <RouterView class="h-full w-full" />
    <!-- <router-view v-slot="{ Component }" class="h-full w-full">
      <transition name="route" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view> -->
    <Navbar v-if="store.user !== null" v-show="globalStore.showNav == true" />
  </div>
</template>

<style scoped>
/* Route transitions */
.router-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.router-enter-active {
  transition: all 0.4s ease-in-out;
}

.route-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.route-leave-active {
  transition: all 0.4s ease-in-out;
}
</style>
