<template>
  <div class="w-full h-full top-0 left-0 absolute z-20 text-black" v-show="global.showMailBox === true">
    <div class="w-full h-full bg-black/70 flex items-center justify-center flex-col" @click="global.showMailBox = false">
      <div v-if="global.showMailBox === true && global.isLoadedMessage === false"
        class="w-[90%] h-[70%] p-4 rounded-lg shadow-xl bg-white overflow-scroll flex flex-col items-center " @click.stop>
        <div class="w-full flex justify-center items-center flex-col">
          <h1 class="mb-2 uppercase text-black font-boldHeadline ">Welcome to your mailbox
          </h1>
          <small>You'll see your invites and server messages here</small>
        </div>
        <table class="text-left text-sm w-full">
          <thead class="bg-primary text-white h-8 rounded-md">
            <tr>
              <th class="pl-2">From</th>
              <th>Subject</th>
              <th class="text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr class="h-10" v-for="message in global.messages">
              <td class="pl-2 font-boldHeadline">USER HERE</td>
              <td class="">{{ message.subject }}</td>
              <td class="text-right pr-2">
                <button @click="loadMessage(message)"
                  class="bg-primary text-white px-2 py-1 rounded-lg text-xs">Open</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="global.isLoadedMessage === true"
        class="w-[90%] h-fit p-4 rounded-lg shadow-xl bg-white overflow-scroll flex flex-col items-center justify-center text-black text-sm"
        @click.stop>
        <div class="flex justify-between w-full text-base font-boldHeadline">
          <p>Message From:</p>
          <p>Adam PT Test</p>
        </div>
        <div class="w-full flex flex-col mt-4">
          <!-- CREATE SOME TEMPLATES FOR INVITES ETC -->
          <p>{{ global.loadedMessage.body }}</p>
          <p class="my-1">Plan Name: <span class="font-boldHeadline">{{ global.loadedMessage.message_action.plan_name
          }}</span></p>
          <p class="my-1">Plan Price: <span class="font-boldHeadline">£{{ global.loadedMessage.message_action.plan_price
          }}</span></p>
        </div>
        <button class="bg-primary px-2 py-1 rounded-md text-white my-4" @click="messageAction">Subscribe</button>
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
import supabase from "../supabase";


const store = usePrimeStore();
const userStore = useUserStore();
const global = useGlobalStore();
const loading = ref(false)
const sessionId = ref('');
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY; // Replace with your Stripe publishable key

const loadMessage = (message) => {
  global.loadedMessage = message
  global.isLoadedMessage = true
  // Query database to update timestamp and mark as read.
}

const getMessages = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('sent_to', userStore.user.id)

  data.forEach(message => {
    global.messages.push(message)
  });
}

const messageAction = () => {
  if (global.loadedMessage.message_action.action === 'subscription') {
    const priceId = global.loadedMessage.message_action.price_id;
    const accountId = global.loadedMessage.message_action.account_id
    createCheckoutSession(priceId, accountId)
  }
}


const createCheckoutSession = async (priceId, accountId) => {
  let userToken = userStore.userSession.access_token;
  let userId = userStore.user.id
  let stripe;

  stripe = Stripe(publishableKey, {
    stripeAccount: accountId
  }); // Initialize Stripe

  try {
    loading.value = true;
    const response = await fetch('http://localhost:8000/create-stripe-session', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, isAdminPlan: false, priceId, connectedAccountId: accountId }),
    });
    const data = await response.json();
    sessionId.value = data.sessionId;

    console.log(data, 'data in here from the response from creating a session?');

    if (sessionId.value) {
      const { error } = await stripe.redirectToCheckout({ sessionId: sessionId.value });
      if (error) console.error('Stripe checkout error:', error);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  getMessages();
})

</script>