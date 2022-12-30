<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import { useGlobalStore } from '../stores/global';
import { usePopularWorkoutStore } from '../stores/popularWorkouts';
import BigWorkoutCard from '../components/BigWorkoutCard.vue';
import womanWorkout from '../assets/images/woman.jpg';
import StepOne from '../components/steps/StepOne.vue';
import StepThree from '../components/steps/StepThree.vue';
import StepTwo from '../components/steps/StepTwo.vue';
import StepFour from '../components/steps/StepFour.vue';
import StepFive from '../components/steps/StepFive.vue';
import StepSix from '../components/steps/StepSix.vue';
import TopBar from '../components/TopBar.vue';

import man from '../assets/images/man.jpg';
import BigWorkoutCard2 from '../components/BigWorkoutCard2.vue';

const step = ref(1);
const store = useUserStore();
const globalStore = useGlobalStore();
const popularWorkoutStore = usePopularWorkoutStore();

const workoutsShown = ref(false);
const popularWorkouts = ref(popularWorkoutStore.popularWorkouts);

const stepProgress = (value) => {
  step.value = value;

  console.log(step.value, 'whats the step now?');
};

const today = new Date();
const options = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};
const todayString = today.toLocaleDateString('en-UK', options);

const toggleWorkoutList = () => {
  workoutsShown.value = !workoutsShown.value;
};
</script>

<template>
  <main
    v-if="store.user"
    class="text-black h-full w-full bg-gray-200 flex flex-col"
  >
    <TopBar :title="'Welcome ' + store.user" />
    <!-- Carousel -->
    <transition name="step" mode="out-in" v-show="workoutsShown === false">
      <div
        class="w-full px-4 flex flex-col"
        :class="workoutsShown !== false ? 'absolute' : ''"
      >
        <p class="my-4">
          Popular Workouts
          <i
            class="fa-solid fa-turn-down ml-2 text-sm"
            @click="toggleWorkoutList"
          ></i>
        </p>
        <div class="w-full carousel flex items-center">
          <BigWorkoutCard
            v-for="(workout, index) in popularWorkouts"
            :workout="workout"
            :key="index"
          />
          <!-- <BigWorkoutCard2 />
          <BigWorkoutCard /> -->
        </div>
      </div>
    </transition>

    <!-- YOUR workouts -->
    <transition name="step" mode="in-out" v-show="workoutsShown === true">
      <div
        class="w-full px-4 flex flex-col"
        :class="workoutsShown !== true ? 'absolute' : ''"
      >
        <p class="my-4">
          Your Workouts
          <i
            class="fa-solid fa-turn-down ml-2 text-sm"
            @click="toggleWorkoutList"
          ></i>
        </p>
        <div class="w-full carousel flex items-center">
          <BigWorkoutCard />
          <BigWorkoutCard />
          <router-link
            to="/add-workout"
            class="w-4/5 h-52 rounded-xl carousel-item mr-4 bg-cover bg-center flex flex-col text-black bg-white shadow-xl"
          >
            <div
              class="p-4 flex flex-col justify-center items-center w-full h-full"
            >
              <p>Add New Workout</p>
              <div
                class="h-10 w-10 mt-4 rounded-full border border-gray-500 flex items-center justify-center"
              >
                <i class="fa-solid fa-plus text-gray-500"></i>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </transition>

    <!-- Todays plan -->
    <div class="w-full px-4 flex flex-col carousel-vertical mt-2 pb-32">
      <p class="my-4 carousel-item">Todays Plan</p>
      <div class="w-full flex items-center flex-col carousel-item">
        <div
          class="w-full bg-white rounded-lg shadow-xl h-24 flex p-4 items-center mb-4"
        >
          <div
            class="w-16 mr-4 h-full rounded-lg flex items-center justify-center bg-gray-200"
          >
            <i class="fa-solid fa-dumbbell text-4xl"></i>
          </div>
          <div class="w-max flex flex-col">
            <h2 class="text-lg">Push day - heavy</h2>
            <small class="text-xs text-gray-600">{{ todayString }}</small>
          </div>
        </div>
        <div
          class="w-full bg-white rounded-lg shadow-xl h-24 flex p-4 items-center mb-4"
        >
          <div
            class="w-16 mr-4 h-full rounded-lg flex items-center justify-center bg-gray-200"
          >
            <i class="fa-solid fa-person-running text-4xl"></i>
          </div>
          <div class="w-max flex flex-col">
            <h2 class="text-lg">Light run 5km</h2>
            <small class="text-xs text-gray-600">{{ todayString }}</small>
          </div>
        </div>
      </div>
      <!-- Discover -->
      <p class="mb-4 carousel-item">Discover</p>
      <div class="w-full flex items-center flex-col carousel-item">
        <div
          class="w-full bg-white rounded-lg shadow-xl h-36 flex p-4 items-center mb-4"
        >
          <div
            class="w-1/3 mr-2 h-full rounded-lg flex items-center justify-center bg-gray-200 bg-center bg-cover relative"
            :style="{
              'background-image': `linear-gradient(to bottom, rgba(1,1,1,0.25), rgba(255,255,255,0.000001)), url(${man})`,
            }"
          >
            <div
              class="bg-secondary h-8 w-8 rounded-full items-center flex justify-center"
            >
              <i class="fa-solid fa-play text-xs pl-0.5"></i>
            </div>
          </div>
          <div class="w-3/4 px-2 flex flex-col">
            <h2 class="text-lg font-boldHeadline">Discover exercises</h2>
            <small class="text-xs"
              >See the full libary of videos on how to perform exercises and the
              benefits of the specific exercise.</small
            >
          </div>
        </div>
      </div>
    </div>
  </main>
  <main v-else>
    <div
      class="h-full w-full bg-cover bg-center relative text-black"
      :style="{ 'background-image': 'url(' + womanWorkout + ')' }"
    >
      <div
        class="absolute bg-white w-full z-20 rounded-tr-3xl rounded-tl-3xl p-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-out"
        :class="
          globalStore.userDetailsEntered === false
            ? 'h-1/3 bottom-0'
            : 'h-0 -bottom-10 opacity-0'
        "
      >
        <transition name="step" mode="out-in" v-show="step === 1">
          <StepOne
            @stepProgress="stepProgress"
            :step="step"
            :class="step !== 1 ? 'absolute' : ''"
          />
        </transition>
        <transition
          name="step"
          mode="out-in"
          v-show="step === 2"
          :class="step !== 2 ? 'absolute' : ''"
        >
          <StepTwo @stepProgress="stepProgress" :step="step" />
        </transition>
        <transition
          name="step"
          mode="out-in"
          v-show="step === 3"
          :class="step !== 3 ? 'absolute' : ''"
        >
          <StepThree @stepProgress="stepProgress" :step="step" />
        </transition>
        <transition
          name="step"
          mode="out-in"
          v-show="step === 4"
          :class="step !== 4 ? 'absolute' : ''"
        >
          <StepFour @stepProgress="stepProgress" :step="step" />
        </transition>
        <transition
          name="step"
          mode="out-in"
          v-show="step === 5"
          :class="step !== 5 ? 'absolute' : ''"
        >
          <StepFive @stepProgress="stepProgress" :step="step" />
        </transition>
        <transition
          name="step"
          mode="out-in"
          v-show="step === 6"
          :class="step !== 6 ? 'absolute' : ''"
        >
          <StepSix @stepProgress="stepProgress" :step="step" />
        </transition>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* step transitions */
.stepr-enter-from {
  opacity: 0;
  transform: translateX(200px);
}

.stepr-enter-active {
  transition: all 0.5s ease-in-out;
}

.step-leave-to {
  opacity: 0;
  transform: translateX(-200px);
}

.step-leave-active {
  transition: all 0.5s ease-in-out;
}
</style>
