<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { usePrimeStore } from '../stores/prime';
import { Plugins } from '@capacitor/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import supabase from '../supabase';
const { DistancePlugin, ProfilePicture } = Plugins;
import PaymentModal from '../components/PaymentModal.vue';
import PlanModal from '../components/PlanModal.vue';
import SubscriptionModal from '../components/SubscriptionModal.vue';

const store = useUserStore();
const primeStore = usePrimeStore();
const user = ref(store.user);
const userDetails = ref(store.userDetails);
const steps = ref('');
const imageData = ref('');
const totalWorkouts = ref('');
const profilePicURL = ref('');
const profilePicExists = ref('');
const enteredName = ref('What should we call you?');
const editEnteredName = ref(false);
const showClients = ref(false);

console.log(userDetails.value, 'whats the user?')

const workouts = ref('');

const getDailySteps = async () => {
  let data = await DistancePlugin.getTodaySteps();

  steps.value = data;
};

const getTotalWorkoutCount = async () => {
  const { count, error } = await supabase
    .from('workouts')
    .select('*', { count: 'exact', head: true })
    .eq('user', user.value.id)
    .eq('is_routine', false);

  if (error) {
  } else {
    totalWorkouts.value = count;
  }
};

// if (typeof window.capacitor !== 'undefined') {
const getDistance = async () => {
  let result = await DistancePlugin.authorize();
  // let data = await DistancePlugin.getDistance({ startDate: '2022/07/01' });
  let workoutsFromIOS = await DistancePlugin.getWorkouts();

  workouts.value = workoutsFromIOS;
};

const openCamera = async () => {
  const image = await Camera.getPhoto({
    quality: 100,
    allowEditing: true,
    resultType: CameraResultType.Base64,
  });

  const base64Data = image.base64String;
  const fileName = `image-${user.value.id}.png`;

  const binaryData = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(binaryData.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: 'image/png' });

  const { err } = await supabase.storage
    .from('avatars')
    .remove(`public/image-${user.value.id}.png`);

  profilePicURL.value = null;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`public/${fileName}`, blob);

  if (error) {
  } else {
    getProfilePicture();
    checkLinkExists();
  }
};

const getProfilePicture = async () => {
  const { data, error } = await supabase.storage
    .from('avatars')
    .getPublicUrl(`public/image-${user.value.id}.png`);

  const avatarUrl = data.publicUrl;

  const imgUrl = `${avatarUrl}?_t=${Date.now()}`;

  profilePicURL.value = imgUrl;
};

// Checking if the profile picture exists.
const checkLinkExists = async () => {
  try {
    const response = await fetch(
      `https://papqpygzqwwtbveqlnfm.supabase.co/storage/v1/object/public/avatars/public/image-${user.value.id}.png`,
      {
        method: 'HEAD',
      }
    );
    profilePicExists.value = response.status;
  } catch (error) {
    return false;
  }
};

const dynamicProfilePic = computed(() => {
  return profilePicURL.value;
});

const addNameToUserDetails = async () => {
  await supabase
    .from('users')
    .insert({
      name: user.value.id,
    })
    .eq('id', user.value.id)
    .select()
    .then((response) => {
      console.log(response);
    });
};

// prime user functions
const showPrimeAdminSettings = () => {
  primeStore.toggleShowPrimeUserSettings();
}

const subscribeToPrimeAccount = () => {
  // primeStore.subscribeToPrimeAccount();

  primeStore.signUpToStripe()
  console.log('clicking');
  // primeStore.toggleShowPaymentModal();
}

const createNewPlan = (value) => {
  primeStore.toggleShowPlanModal(value)
}

const openSubscriptionModal = () => {
  primeStore.toggleSubscriptionModal()
}

onMounted(() => {
  getDailySteps();
  getTotalWorkoutCount();
  getProfilePicture();
  checkLinkExists();
});
// }
</script>

<template>
  <div class="w-full h-full flex flex-col relative">
    <PaymentModal />
    <PlanModal />
    <SubscriptionModal />
    <div class="w-full h-full flex flex-col bg-gray-200" v-if="primeStore.showPrimeUserSettings">
      <div class="w-full h-20 bg-primary flex items-end justify-end px-4">
        <div class="w-7 h-7 rounded-full flex items-center justify-center bg-secondary mr-4"
          @click="openSubscriptionModal">
          <i class="fa-solid fa-dumbbell text-sm text-black"></i>
        </div>
        <div class="w-7 h-7 rounded-full flex items-center justify-center bg-secondary">
          <i class="fa-solid fa-cog text-sm text-black"></i>
        </div>
      </div>
      <div class="w-full flex">
        <div class="h-[14.5rem] w-full bg-primary flex items-center p-8 pt-14 text-white relative">
          <div class="w-2/3 h-full">
            <h1 class="font-boldHeadline" :class="totalWorkouts > 99 ? 'text-7xl' : 'text-8xl'">
              {{ totalWorkouts }}
            </h1>
            <!-- v-if="userDetails.account_type === 'prime'" -->
            <button @click="showPrimeAdminSettings" v-if="!userDetails.account_type === 'prime'"
              class="bg-white text-sm uppercase text-black rounded-2xl px-2 py-1 my-4">
              Show admin details
            </button>
          </div>
          <div class="w-1/3 flex flex-col h-full pt-2">
            <p @click="store.logout">Logout</p>
            <p v-if="totalWorkouts <= 1" class="uppercase text-gray-400 text-xs font-boldHeadline">
              workout
            </p>
            <p v-else class="uppercase text-gray-400 text-xs font-boldHeadline">
              workouts
            </p>
            <p class="uppercase text-white text-xs font-boldHeadline">
              completed
            </p>
          </div>
          <p class="absolute left-5 bottom-1 text-sm font-boldHeadline" v-if="steps">
            {{ Number(steps.totalSteps.toFixed()) }} steps today
          </p>
          <div v-if="profilePicExists === 404" @click="openCamera"
            class="absolute h-24 w-24 rounded-full bg-primary right-8 -bottom-12 border-gray-200 border-4 flex items-center justify-center">
            <i class="fa-solid fa-camera text-2xl"></i>
          </div>
          <div v-else
            class="absolute h-24 w-24 rounded-full bg-primary right-8 -bottom-12 border-gray-200 border-4 flex items-center justify-center">
            <img v-if="profilePicURL && profilePicExists !== 404" :src="dynamicProfilePic" @click="openCamera"
              class="h-20 w-20 object-cover rounded-full" alt="" />
          </div>
        </div>
      </div>
      <div class="w-full flex flex-col p-4 text-black">
        <div class="">
          <p class="font-boldHeadline text-lg">How you doing today?</p>
        </div>
      </div>
      <form class="w-full text-black font-bold flex flex-col p-4">
        <div class="flex justify-between mb-4">
          <p>Select your metric</p>
          <select name="" id="" class="bg-transparent border border-primary rounded-md p-1 w-24 h-8">
            <option value="metric" disabled>Metric</option>
            <option value="KG">KG</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
        <div class="w-full flex justify-between">
          <div class="flex items-center space-x-2">
            <p>Weight</p>
          </div>
          <input type="number" placeholder="80" class="bg-transparent border border-primary rounded-md p-1  w-24 h-8">
        </div>
      </form>

      <div class="w-full flex items-center justify-center text-black" v-if="userDetails.account_type !== 'prime'">
        <button class="bg-secondary px-3 text-sm uppercase py-1 rounded-2xl font-bold" @click="subscribeToPrimeAccount">
          Subscribe to prime account
        </button>
      </div>
    </div>
    <!-- If viewing prime admin settings -->
    <div v-else class="w-full h-full flex flex-col bg-gray-200 text-black p-4">
      <div class="w-full flex justify-between items-center mb-4">
        <i class="fa-solid fa-arrow-left text-lg" @click="showPrimeAdminSettings"></i>
        <p>Go back to view your settings</p>
      </div>

      <div class="w-full flex flex-col">
        <div class="w-full flex justify-between">
          <button class="uppercase font-boldHeadline px-2 py-1 transition-all  rounded-md"
            :class="showClients === true ? 'bg-primary text-white' : 'text-gray-500 bg-transparent'"
            @click="showClients = true">Your clients</button>
          <button class="uppercase font-boldHeadline transition-all px-2 py-1 rounded-md"
            :class="showClients === false ? 'bg-primary text-white' : 'text-gray-500 bg-transparent'"
            @click="showClients = false">Client plans</button>
        </div>

        <!-- Show clients table -->
        <div class="h-full w-full" v-if="showClients">
          <table class="text-left my-4 w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Account status</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr>
                <td>Adam</td>
                <td>Active</td>
                <td>£5.99</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Show clients table end -->

        <!-- Show client plans -->
        <div class="h-full w-full" v-else>
          <div class="w-full flex">
            <button class="bg-primary text-white px-2 py-1 text-xs my-2 rounded-md new uppercase"
              @click="createNewPlan">Create new plan</button>
          </div>

          <table class="text-left my-4">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Price</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="">
                <td class="w-3/5 overflow-hidden text-ellipsis">
                  <p class="h-10 w-full overflow-hidden max-h-10 text-ellipsis pr-4">
                    4 day a week plan to improve bums & tums
                  </p>
                </td>
                <td class="">£25.99</td>
                <td><button class="px-2 py-1 text-xs bg-primary text-white rounded-md">Edit</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Show client plans end-->
      </div>
    </div>
  </div>
</template>
