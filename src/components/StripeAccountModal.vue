<template>
  <div class="w-full h-full top-0 left-0 absolute z-20 text-black" v-show="store.showStripeAccountModal === true">
    <div class="w-full h-full bg-black/70 flex items-center justify-center flex-col"
      @click="store.showStripeAccountModal = false">
      <div
        class="w-[80%] h-fit p-4 rounded-lg shadow-xl bg-white overflow-scroll flex flex-col items-center justify-center"
        @click.stop>
        <div class="w-full flex justify-center items-center">
          <h1 class="mb-2 uppercase text-black font-boldHeadline">Create a new Stripe Account
          </h1>
        </div>
        <form @submit.prevent class="flex flex-col text-sm">
          <label for="">Country</label>
          <input class="bg-transparent pl-1 border my-2 h-8 rounded-md border-primary" type="text" placeholder=""
            v-model="accountCountry">
          <label for="">Email Address</label>
          <input class="bg-transparent pl-1 border my-2 h-8 rounded-md border-primary" type="text" placeholder=""
            v-model="accountEmail">
          <!-- <a class="underline font-boldHeadline" href="https://stripe.com/gb/legal/connect-account" target="_blank">Read
            Terms Of Service
            here</a> -->
          <label for="">Business Type</label>
          <select class="bg-transparent h-8 border border-black rounded-md mt-2" name="" id="" v-model="businessType">
            <option value="" selected disabled>Please select</option>
            <option value="company">Company</option>
            <option value="government_entity">Government Entity (US Only)</option>
            <option value="individual">individual</option>
            <option value="non_profit">non_profit</option>
          </select>
          <a class="underline font-boldHeadline mt-4" @click="handleTosClicked" href="#">Read Terms Of Service here</a>
          <div class="flex items-center mt-4">
            <input type="checkbox" class="h-5 w-5 mr-4" v-model="agreeTos" :disabled="tosClicked == false">
            <label class="text-xs" for="">I agree to Stripes terms of service</label>
          </div>
          <button :class="!isValidated ? 'bg-gray-200' : 'bg-primary'"
            class="px-2 h-8 py-1 text-sm rounded-md text-white my-2" :disabled="!isValidated"
            @click="createAccount">Create
            Account</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { usePrimeStore } from "../stores/prime";
import axios from 'axios'
import { useUserStore } from "../stores/user";


const store = usePrimeStore();
const userStore = useUserStore();
const accountCountry = ref('')
const accountEmail = ref('')
const businessType = ref('')
const usersIp = ref('')
const tosClicked = ref(false);
const agreeTos = ref(false);

const isValidated = computed(() => {
  return accountCountry.value !== '' &&
    accountEmail.value !== '' &&
    usersIp.value !== '' &&
    tosClicked.value && agreeTos.value;
});

const handleTosClicked = () => {
  tosClicked.value = true;

  window.open('https://stripe.com/gb/legal/connect-account', '_blank');
}


const createAccount = async () => {
  console.log('llol');
  const response = await fetch('http://localhost:8000/create-stripe-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ country: accountCountry.value, email: accountEmail.value, userId: userStore.user.id, usersIp: usersIp.value })
  });

  const data = await response.json();

  if (data.accountLinkUrl) {
    window.open(data.accountLinkUrl, '_blank');
  }

  console.log(data, 'the data after creating an account?');

  accountCountry.value = ''
  accountEmail.value = ''
  businessType.value = ''
  usersIp.value = ''
  tosClicked.value = false;
  agreeTos.value = false;

  store.showStripeAccountModal = false;
}

const getUserIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return null;
  }
}

onMounted(async () => {
  const ip = await getUserIP();
  usersIp.value = ip
  console.log(usersIp.value, 'the ip?');
})

</script>