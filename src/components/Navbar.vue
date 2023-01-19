<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const user = ref(userStore.user);
</script>

<template>
  <div class="bottom-0 text-white absolute h-20 px-4 w-full z-10" v-show="user">
    <nav
      class="h-16 rounded-full w-full flex justify-around items-center transition-all duration-700 ease-out"
      :class="
        $route.path === '/workout'
          ? 'bg-gray-300'
          : $route.path === '/new-workout'
          ? 'bg-gray-300'
          : 'bg-primary'
      "
    >
      <router-link to="/" class="text-white">
        <div
          class="h-10 w-10 mx-2 bg-transparent flex items-center justify-center transition-all duration-1000 ease-out text-sm"
          :class="
            $route.path === '/'
              ? 'bg-secondary rounded-3xl text-black transition-all duration-1000 ease-out px-2'
              : $route.path === '/workout'
              ? 'text-black'
              : $route.path === '/new-workout'
              ? 'text-black'
              : ' transition-all duration-500 ease-out '
          "
        >
          <i class="fa-solid fa-house-chimney md:text-4xl"></i>
        </div>
      </router-link>
      <router-link to="/workout" class="text-white">
        <div
          class="h-10 w-10 mx-2 bg-transparent flex items-center justify-center transition-all duration-1000 ease-out text-sm"
          :class="
            $route.path === '/workout'
              ? 'bg-secondary rounded-3xl text-black transition-all duration-1000 ease-out px-2'
              : $route.path === '/new-workout'
              ? 'bg-secondary rounded-3xl text-black transition-all duration-1000 ease-out px-2'
              : ' transition-all duration-500 ease-out '
          "
        >
          <i class="fa-solid fa-rocket md:text-4xl"></i>
        </div>
      </router-link>
      <router-link to="/stats" class="text-white">
        <div
          class="h-10 w-10 mx-2 bg-transparent flex items-center justify-center transition-all duration-1000 ease-out text-sm"
          :class="
            $route.path === '/stats'
              ? 'bg-secondary rounded-3xl text-black transition-all duration-1000 ease-out px-2'
              : $route.path === '/workout'
              ? 'text-black'
              : $route.path === '/new-workout'
              ? 'text-black'
              : ' transition-all duration-500 ease-out '
          "
        >
          <i class="fa-solid fa-chart-simple md:text-4xl"></i>
        </div>
      </router-link>
      <router-link to="/settings" class="text-white">
        <div
          class="h-10 w-10 mx-2 bg-transparent flex items-center justify-center transition-all duration-1000 ease-out text-sm"
          :class="
            $route.path === '/settings'
              ? 'bg-secondary rounded-3xl text-black transition-all duration-1000 ease-out px-2'
              : $route.path === '/workout'
              ? 'text-black'
              : $route.path === '/new-workout'
              ? 'text-black'
              : ' transition-all duration-500 ease-out '
          "
        >
          <i class="fa-solid fa-user md:text-4xl"></i>
          <!-- <span
            class="ml-2 overflow-hidden transition-all duration-500 ease-out"
            :class="
              $route.path === '/settings'
                ? 'w-min transition-all duration-1000 ease-out'
                : 'w-0 transition-all duration-1000 ease-out '
            "
            >Settings</span
          > -->
        </div>
      </router-link>
    </nav>
  </div>
</template>

<style scoped></style>
