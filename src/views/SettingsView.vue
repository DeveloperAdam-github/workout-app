<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { usePrimeStore } from '../stores/prime';
import { useGlobalStore } from '../stores/global';
import { Plugins } from '@capacitor/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import supabase from '../supabase';
const { DistancePlugin, ProfilePicture } = Plugins;
import PaymentModal from '../components/PaymentModal.vue';
import PlanModal from '../components/PlanModal.vue';
import SubscriptionModal from '../components/SubscriptionModal.vue';
import StripeAccountModal from '../components/StripeAccountModal.vue';
import MailBoxModal from '../components/MailBoxModal.vue';

const store = useUserStore();
const primeStore = usePrimeStore();
const global = useGlobalStore();
const user = ref(store.user);
const userDetails = ref(store.userDetails);
const hasPrimeStripeAccount = ref(store.hasPrimeStripeAccount);
const steps = ref('');
const imageData = ref('');
const totalWorkouts = ref('');
const profilePicURL = ref('');
const profilePicExists = ref('');
const enteredName = ref('What should we call you?');

const editEnteredName = ref(false);
const showClients = ref(false);
const showInviteModal = ref(false);


const usersEmailAddress = ref('');
const chosenPlan = ref({});

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

const openStripeAccountModal = () => {
  primeStore.toggleStripeAccountCreationModal();
}

const createNewPlan = (value) => {
  primeStore.toggleShowPlanModal(value)
}

const openSubscriptionModal = () => {
  primeStore.toggleSubscriptionModal()
}

const openMessageCenter = () => {
  global.toggleShowMessageCenter();
}

const test = (userId) => {
  console.log('userID', userId);
  store.getPrimeDetailsFromDatabase(userId)
}

const inviteToPlan = (plan) => {
  console.log(plan, 'the plan info here');
  showInviteModal.value = true;
  chosenPlan.value = plan
}

const sendInvitationToUser = async () => {

  // First we get the users ID from the database using their email
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', usersEmailAddress.value)

  console.log(data, 'the user data here');
  console.log(error, 'the error here');
  if (error) {
    return 'No user found'
  }

  // Once we have the users information we now update supabase

  try {
    console.log('make it here?');
    await supabase
      .from('messages')
      .insert({
        sent_from: user.value.id,
        sent_to: data[0].id,
        subject: 'You have been invited to subscribe to ...',
        body: `Hey there, XXX has invited you the subscribe to their plan. "${chosenPlan.value.plan_name}" which is ${chosenPlan.value.plan_price}`,
        message_action: {
          "action": "subscription",
          "price_id": chosenPlan.value.price_id,
          "account_id": store.stripeAccountId,
          "plan_name": chosenPlan.value.plan_name,
          "plan_description": chosenPlan.value.plan_description,
          "plan_price": Math.round(chosenPlan.value.plan_price / 100)
        }
      })
      .then((response) => {
        console.log(reponse, 'whats in th eresponse??')
      });
    console.log('or here');
  } catch (error) {
    console.error(error, 'it faileed here')
  }
}


onMounted(() => {
  getDailySteps();
  getTotalWorkoutCount();
  getProfilePicture();
  checkLinkExists();
  primeStore.getCreatedPlansForUser()
  if (!store.isConnectedToRealTimeDB) {
    store.subscribeToChannel()
  }
});
// }
</script>

<template>
  <div class="w-full h-full flex flex-col relative">
    <PaymentModal />
    <PlanModal />
    <SubscriptionModal />
    <StripeAccountModal />
    <MailBoxModal />
    <div class="w-full h-full flex flex-col bg-gray-200" v-if="primeStore.showPrimeUserSettings">
      <div class="w-full h-20 bg-primary flex items-end justify-end px-4 relative">
        <div class="w-7 h-7 rounded-full flex items-center justify-center bg-secondary" @click="openSubscriptionModal">
          <i class="fa-solid fa-dumbbell text-sm text-black"></i>
        </div>
        <div class="w-5"></div>
        <div class="w-7 h-7 rounded-full flex items-center justify-center bg-secondary">
          <i class="fa-solid fa-cog text-sm text-black"></i>
        </div>
        <div @click="openMessageCenter"
          class="w-7 h-7 rounded-full flex items-center justify-center bg-secondary right-4 -bottom-12 z-20 absolute">
          <i class="fa-solid fa-envelope text-sm text-black relative"></i>
          <div class="hidden bg-red-500 h-4 w-4 rounded-full absolute -top-1 -right-1"></div>
        </div>
      </div>
      <div class="w-full flex">
        <div class="h-[14.5rem] w-full bg-primary flex items-center p-8 pt-14 text-white relative">
          <div class="w-2/3 h-full">
            <h1 class="font-boldHeadline" :class="totalWorkouts > 99 ? 'text-7xl' : 'text-8xl'">
              {{ totalWorkouts }}
            </h1>
            <!-- v-if="userDetails.account_type === 'prime'" -->
            <button @click="showPrimeAdminSettings" v-if="userDetails.account_type === 'prime'"
              class="bg-white text-sm uppercase text-black rounded-2xl px-2 py-1 my-4">
              Show admin details
            </button>
            <button @click="test(store.user.id)">
              Test buttton
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
        <button class="mt-4 w-full bg-secondary px-2 py-1 text-center rounded-full">Update</button>
      </form>

      <div class="w-full flex items-center justify-center text-black" v-if="userDetails.account_type !== 'prime'">
        <button class="bg-secondary px-3 text-sm uppercase py-1 rounded-2xl font-bold" @click="subscribeToPrimeAccount">
          Subscribe to prime account
        </button>
      </div>

      <div class="w-full flex items-center justify-center text-black flex-col px-4"
        v-if="userDetails.account_type == 'prime' && !hasPrimeStripeAccount">
        <small class="text-center mt-4">You've now subscribed but to be able to create plans and take payments you'll need
          to
          either connect a
          Stripe
          account</small>
        <button class="bg-secondary px-3 text-md uppercase py-1 rounded-2xl font-bold mt-6"
          @click="openStripeAccountModal">
          Connect now
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
            @click="showClients = false">Your Plans</button>
        </div>

        <!-- Show clients table -->
        <div class="h-full w-full" v-if="showClients">
          <table class="text-left my-4 w-full">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th class="text-right">Price</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr>
                <td>test@gmail.com</td>
                <td>Active</td>
                <td class="text-right">£5.99</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Show clients table end -->

        <!-- Show client plans -->
        <div class="h-full w-full relative" v-else>
          <!--  -->
          <teleport to="body">
            <div class="w-screen h-screen top-0 left-0 absolute z-20 text-black" v-if="showInviteModal">
              <div @click="showInviteModal = false"
                class="w-full h-full bg-black/70 flex items-center justify-center flex-col p-8">
                <div @click.stop class="w-[90%] h-fit rounded-md bg-white shadow-md flex flex-col p-4">
                  <h1 class="font-boldHeadline text-center w-full underline">Invite user to subscribe</h1>
                  <input type="text" placeholder="Email address here..."
                    class="my-2 bg-transparent border rounded-md pl-2 h-8" v-model="usersEmailAddress">
                  <button @click="sendInvitationToUser"
                    class="px-4 py-2 bg-primary rounded-md text-xs text-white font-boldHeadline">Invite
                    user</button>
                </div>
              </div>
            </div>
          </teleport>
          <!--  -->
          <div class="w-full flex">
            <button class="bg-primary text-white px-2 py-1 text-xs my-2 rounded-md new uppercase"
              @click="createNewPlan">Create new plan</button>
          </div>

          <table class="text-left my-4 w-full">
            <thead>
              <tr>
                <th>Plan Name</th>
                <!-- need to figure this out... -->
                <th class="text-right">Price</th>
                <th class="text-right">Edit</th>
                <th class="text-right">Invite</th>
              </tr>
            </thead>
            <tbody class="text-sm w-full " v-if="primeStore.createdPlans">
              <tr class="" v-for=" plan  in  primeStore.createdPlans ">
                <td class="w-3/5 overflow-hidden text-ellipsis h-10">
                  <p class="w-full overflow-hidden max-h-10 text-ellipsis pr-4">
                    {{ plan.plan_name }}
                  </p>
                </td>
                <td class="text-right">£{{ Math.round(plan.plan_price / 100) }}</td>
                <td class="text-right">
                  <router-link :to="{ name: 'editPlan', params: { id: plan.id } }">
                    <button class="px-2 py-1 text-xs bg-primary text-white rounded-md">Edit</button>
                  </router-link>
                </td>
                <td class="text-right"><button @click="inviteToPlan(plan)"
                    class="px-2 py-1 text-xs bg-primary text-white rounded-md">Invite</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Show client plans end-->
      </div>
    </div>
  </div>
</template>
