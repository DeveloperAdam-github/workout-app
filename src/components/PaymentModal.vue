<template>
  <div class="w-full h-full top-0 left-0 absolute z-20" v-show="store.showPaymentModal === true">
    <div class="w-full h-full bg-black/70 flex items-center justify-center flex-col"
      @click="store.showPaymentModal = false">
      <div
        class="w-[80%] h-fit p-4 rounded-lg shadow-xl bg-white overflow-scroll flex flex-col items-center justify-center"
        @click.stop>
        <h1 class="w-full flex text-center mb-2 uppercase text-black font-boldHeadline" @click="main">Sign up to prime
          account</h1>

        <small class="text-center w-full my-2 p-2 ">Pay <span
            class="text-black font-boldHeadline text-sm mx-1">£9.99</span> a month to
          unlock the ability
          to have
          clients and
          create customized
          plans for them</small>
        <!-- <div id="pay-pal-buttons"></div> -->
        <!-- <div id="paypal-button-container" class="w-full"></div> -->

        <stripe-checkout v-if="store.showPaymentModal" ref="checkoutRef" mode="subscription" :pk="publishableKey"
          :success-url="successURL" :cancel-url="cancelURL" :line-items="lineItems" @loading="v => loading = v" />
        <button @click="submit">Subscribe!</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { loadScript } from "@paypal/paypal-js";
import { ref } from "vue";
import { usePrimeStore } from "../stores/prime";
import axios from 'axios'
import { useUserStore } from "../stores/user";
import { StripeCheckout } from '@vue-stripe/vue-stripe';
const sessionId = ref('');
const successURL = ref(`https://developeradam.com/success1/`)
const cancelURL = ref(`https://developeradam.com/cancelled`)

// const bearerToken = ref('');

const store = usePrimeStore();
const userStore = useUserStore();
const checkoutRef = ref('');

const submit = async () => {
  try {
    // Replace with the actual endpoint of your Supabase function
    const response = await fetch('http://127.0.0.1:54321/functions/v1/create-stripe-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: "cb199b01-3eff-4c88-8d5f-13476c31f876" }), // Send the user ID to the backend
    });
    const data = await response.json();
    sessionId.value = data.sessionId; // Set the received session ID

    console.log(data, 'the data in here?');

    successURL.value = `http://localhost:5173/success/${sessionId.value}`

    if (sessionId.value !== '') {
      await checkoutRef.value.redirectToCheckout({ sessionId: sessionId.value });
    }

  } catch (error) {
    console.error('Error:', error);
  }
};

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const lineItems = [{
  price: 'price_1OC8R3BbwsPdB97DojAPvrQc',
  quantity: 1,
}]
</script>