<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '../stores/user';
import { useGlobalStore } from '../stores/global';
import { usePopularWorkoutStore } from '../stores/popularWorkouts';
import BigWorkoutCard from '../components/BigWorkoutCard.vue';
import womanWorkout from '../assets/images/woman.jpg';
import gym from '../assets/images/gym.png';
import StepOne from '../components/steps/StepOne.vue';
import StepThree from '../components/steps/StepThree.vue';
import StepTwo from '../components/steps/StepTwo.vue';
import StepFour from '../components/steps/StepFour.vue';
import StepFive from '../components/steps/StepFive.vue';
import StepSix from '../components/steps/StepSix.vue';
import TopBar from '../components/TopBar.vue';

import man from '../assets/images/man.jpg';
import BigWorkoutCard2 from '../components/BigWorkoutCard2.vue';
import StepFiveNHalf from '../components/steps/StepFiveNHalf.vue';

const step = ref(1);
const store = useUserStore();
const user = ref(store.user);
const email = ref('');
const token = ref('');
const userHold = ref(store.userHold);
const globalStore = useGlobalStore();
const popularWorkoutStore = usePopularWorkoutStore();

const workoutsShown = ref(false);
const showLogin = ref(false);

onMounted(() => {
  setTimeout(() => {
    showLogin.value = true;
  }, 800);
});

const popularWorkouts = ref(popularWorkoutStore.popularWorkouts);

const stepProgress = (value) => {
  step.value = value;

  console.log(step.value, 'whats the step now?');
};

const signUpWithEmail = () => {
  // store.handleLogin(email.value);
  store.signInWithEmail(email.value);
};

const verifyUserWithCode = () => {
  console.log(token.value, 'what is token.value');
  store.verifyUserWithEmailCode(String(token.value));
};

const today = new Date();
const options = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};
const todayString = today.toLocaleDateString('en-UK', options);

const goBackToResendCode = () => {
  console.log('clinkin');
  store.userHold = false;
};

const toggleWorkoutList = () => {
  workoutsShown.value = !workoutsShown.value;
};
</script>

<template>
  <main v-if="store.user" class="text-black h-full w-full bg-gray-200 flex flex-col">
    <!-- USER DETAILS SECTION -->
    <div v-if="globalStore.userDetailsEntered === false" class="h-full w-full bg-cover bg-center relative text-black"
      :style="{ 'background-image': 'url(' + gym + ')' }">
      <p>{{ globalStore.showPopUpForDetail }}</p>
      <div v-show="globalStore.showPopUpForDetail"
        class="absolute bg-white w-full z-20 rounded-tr-3xl rounded-tl-3xl p-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-out"
        :class="globalStore.showPopUpForDetail
            ? 'h-1/3 bottom-0 transition-all duration-700 ease-out'
            : 'h-0 -bottom-10 opacity-0 transition-all duration-700 ease-out'
          ">
        <transition name="step" mode="out-in" v-show="step === 1">
          <StepOne @stepProgress="stepProgress" :step="step" :class="step !== 1 ? 'absolute' : ''" />
        </transition>
        <transition name="step" mode="out-in" v-show="step === 2" :class="step !== 2 ? 'absolute' : ''">
          <StepTwo @stepProgress="stepProgress" :step="step" />
        </transition>
        <transition name="step" mode="out-in" v-show="step === 3" :class="step !== 3 ? 'absolute' : ''">
          <StepThree @stepProgress="stepProgress" :step="step" />
        </transition>
        <transition name="step" mode="out-in" v-show="step === 4" :class="step !== 4 ? 'absolute' : ''">
          <StepFour @stepProgress="stepProgress" :step="step" />
        </transition>
        <transition name="step" mode="out-in" v-show="step === 5" :class="step !== 5 ? 'absolute' : ''">
          <StepFive @stepProgress="stepProgress" :step="step" />
        </transition>
        <transition name="step" mode="out-in" v-show="step === 5.5" :class="step !== 5.5 ? 'absolute' : ''">
          <StepFiveNHalf @stepProgress="stepProgress" :step="step" />
        </transition>
        <transition name="step" mode="out-in" v-show="step === 6" :class="step !== 6 ? 'absolute' : ''">
          <StepSix @stepProgress="stepProgress" :step="step" />
        </transition>
      </div>
    </div>
    <!-- USER DETAILS SECTION -->
    <div v-else class="transition-all duration-700 ease-in h-full w-full">
      <TopBar :title="'Welcome '" />
      <!-- Carousel -->
      <transition name="step" mode="out-in" v-show="workoutsShown === false">
        <div class="w-full px-4 flex flex-col" :class="workoutsShown !== false ? 'absolute' : ''">
          <p class="my-4">
            Popular Workouts
            <i class="fa-solid fa-turn-down ml-2 text-sm" @click="toggleWorkoutList"></i>
          </p>
          <div class="w-full carousel flex items-center">
            <BigWorkoutCard v-for="(workout, index) in popularWorkouts" :workout="workout" :key="index" />
            <!-- <BigWorkoutCard2 />
          <BigWorkoutCard /> -->
          </div>
        </div>
      </transition>

      <!-- YOUR workouts -->
      <transition name="step" mode="in-out" v-show="workoutsShown === true">
        <div class="w-full px-4 flex flex-col" :class="workoutsShown !== true ? 'absolute' : ''">
          <p class="my-4">
            Your Workouts
            <i class="fa-solid fa-turn-down ml-2 text-sm" @click="toggleWorkoutList"></i>
          </p>
          <div class="w-full carousel flex items-center">
            <BigWorkoutCard />
            <BigWorkoutCard />
            <router-link to="/add-workout"
              class="w-4/5 h-52 rounded-xl carousel-item mr-4 bg-cover bg-center flex flex-col text-black bg-white shadow-xl">
              <div class="p-4 flex flex-col justify-center items-center w-full h-full">
                <p>Add New Workout</p>
                <div class="h-10 w-10 mt-4 rounded-full border border-gray-500 flex items-center justify-center">
                  <i class="fa-solid fa-plus text-gray-500"></i>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </transition>

      <!-- Todays plan -->
      <div class="w-full h-3/5 px-4 flex flex-col carousel-vertical pb-20">
        <p class="my-4 carousel-item">Todays Plan</p>
        <!-- <div
          class="w-full flex items-center flex-col carousel-item"
        > -->
        <div class="w-full bg-white rounded-lg shadow-xl h-20 flex p-4 items-center mb-4">
          <div class="w-16 mr-4 h-full rounded-lg flex items-center justify-center bg-gray-200">
            <i class="fa-solid fa-dumbbell text-4xl"></i>
          </div>
          <div class="w-max flex flex-col">
            <h2 class="text-lg">Push day - heavy</h2>
            <small class="text-xs text-gray-600">{{ todayString }}</small>
          </div>
        </div>
        <div class="w-full bg-white rounded-lg shadow-xl h-20 flex p-4 items-center mb-4">
          <div class="w-16 mr-4 h-full rounded-lg flex items-center justify-center bg-gray-200">
            <i class="fa-solid fa-person-running text-4xl"></i>
          </div>
          <div class="w-max flex flex-col">
            <h2 class="text-lg">Light run 5km</h2>
            <small class="text-xs text-gray-600">{{ todayString }}</small>
          </div>
        </div>
        <div class="w-full bg-white rounded-lg shadow-xl h-20 flex p-4 items-center mb-4">
          <div class="w-16 mr-4 h-full rounded-lg flex items-center justify-center bg-gray-200">
            <i class="fa-solid fa-person-running text-4xl"></i>
          </div>
          <div class="w-max flex flex-col">
            <h2 class="text-lg">Light run 5km</h2>
            <small class="text-xs text-gray-600">{{ todayString }}</small>
          </div>
        </div>
        <!-- </div> -->
        <!-- Discover -->
        <p class="mb-4 carousel-item">Discover</p>
        <div class="w-full flex items-center flex-col carousel-item">
          <div class="w-full bg-white rounded-lg shadow-xl h-36 flex p-4 items-center mb-4">
            <div
              class="w-1/3 mr-2 h-full rounded-lg flex items-center justify-center bg-gray-200 bg-center bg-cover relative"
              :style="{
                'background-image': `linear-gradient(to bottom, rgba(1,1,1,0.25), rgba(255,255,255,0.000001)), url(${man})`,
              }">
              <div class="bg-secondary h-8 w-8 rounded-full items-center flex justify-center">
                <i class="fa-solid fa-play text-xs pl-0.5"></i>
              </div>
            </div>
            <div class="w-3/4 px-2 flex flex-col">
              <h2 class="text-lg font-boldHeadline">Discover exercises</h2>
              <small class="text-xs">See the full libary of videos on how to perform exercises and
                the benefits of the specific exercise.</small>
            </div>
          </div>
        </div>
        <div class="w-full flex items-center flex-col carousel-item">
          <div class="w-full bg-white rounded-lg shadow-xl h-36 flex p-4 items-center mb-4">
            <div
              class="w-1/3 mr-2 h-full rounded-lg flex items-center justify-center bg-gray-200 bg-center bg-cover relative"
              :style="{
                'background-image': `linear-gradient(to bottom, rgba(1,1,1,0.25), rgba(255,255,255,0.000001)), url(${man})`,
              }">
              <div class="bg-secondary h-8 w-8 rounded-full items-center flex justify-center">
                <i class="fa-solid fa-play text-xs pl-0.5"></i>
              </div>
            </div>
            <div class="w-3/4 px-2 flex flex-col">
              <h2 class="text-lg font-boldHeadline">Discover exercises</h2>
              <small class="text-xs">See the full libary of videos on how to perform exercises and
                the benefits of the specific exercise.</small>
            </div>
          </div>
        </div>
        <div class="w-full flex items-center flex-col carousel-item">
          <div class="w-full bg-white rounded-lg shadow-xl h-36 flex p-4 items-center mb-4">
            <div
              class="w-1/3 mr-2 h-full rounded-lg flex items-center justify-center bg-gray-200 bg-center bg-cover relative"
              :style="{
                'background-image': `linear-gradient(to bottom, rgba(1,1,1,0.25), rgba(255,255,255,0.000001)), url(${man})`,
              }">
              <div class="bg-secondary h-8 w-8 rounded-full items-center flex justify-center">
                <i class="fa-solid fa-play text-xs pl-0.5"></i>
              </div>
            </div>
            <div class="w-3/4 px-2 flex flex-col">
              <h2 class="text-lg font-boldHeadline">Discover exercises</h2>
              <small class="text-xs">See the full libary of videos on how to perform exercises and
                the benefits of the specific exercise.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <main v-else>
    <div class="h-full w-full bg-cover bg-center relative text-black"
      :style="{ 'background-image': 'url(' + womanWorkout + ')' }">
      <div v-if="store.userHold === true"
        class="absolute bg-gray-200/90 w-full z-20 rounded-tr-3xl rounded-tl-3xl p-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-out"
        :class="showLogin === true ? 'h-1/3 bottom-0' : 'h-0 -bottom-10 opacity-0'
          ">
        <h2 class="uppercase font-headline text-lg">Enter your 6 digit code</h2>
        <input type="tel" v-model="token" class="w-full bg-white shadow-md rounded-full my-5 p-2 px-3" />
        <button @click="verifyUserWithCode" class="h-12 rounded-full w-full bg-secondary shadow-md text-black my-1">
          Verify Account
        </button>
        <small class="text-xxs mt-6" @click="goBackToResendCode">Didn't get an code? Click here to resend</small>
      </div>
      <div v-else
        class="absolute bg-gray-200/90 w-full z-20 rounded-tr-3xl rounded-tl-3xl p-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-out"
        :class="showLogin === true ? 'h-1/3 bottom-0' : 'h-0 -bottom-10 opacity-0'
          ">
        <h2 class="uppercase font-boldHeadline text-2xl">Login</h2>
        <input type="email" v-model="email" placeholder="Email address.."
          class="w-full bg-white shadow-md rounded-full my-5 p-2 px-3" />
        <button @click="signUpWithEmail" class="h-12 rounded-full w-full bg-secondary shadow-md text-black my-1">
          Log In
        </button>
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
