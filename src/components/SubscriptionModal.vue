<script setup>
import { computed, ref } from "vue";
import { usePrimeStore } from "../stores/prime";


const store = usePrimeStore();
const showPremiumTrainer = ref(true);
const swipeDirection = ref("");

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY; // Replace with your Stripe publishable key
const stripe = Stripe(publishableKey); // Initialize Stripe
const sessionId = ref('');
const loading = ref(false);

const swipeLeft = () => {
  swipeDirection.value = "left";
  showPremiumTrainer.value = !showPremiumTrainer.value;
}
const swipeRight = () => {
  swipeDirection.value = "right";
  showPremiumTrainer.value = !showPremiumTrainer.value;
}

const createCheckoutSession = async () => {
  try {
    loading.value = true;
    // http://127.0.0.1:54321/functions/v1/create-stripe-session
    const response = await fetch('http://localhost:8000/create-stripe-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: "cb199b01-3eff-4c88-8d5f-13476c31f876" }),
    });
    const data = await response.json();
    sessionId.value = data.sessionId;

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
</script>

<template>
  <div class="w-full h-full top-0 left-0 absolute z-20 text-black" v-show="store.showSubscriptionModal === true">
    <div class="w-full h-full bg-black/70 flex items-center justify-center flex-col p-8"
      @click="store.showSubscriptionModal = false">
      <div @click.stop
        class="h-1/2 w-full bg-[#f5f5f5] shadow-md shadow-black rounded-md flex flex-col p-4 relative transition-all duration-500"
        :class="showPremiumTrainer == true ? 'opacity-100' : 'opacity-0'" v-touch:swipe.left="swipeLeft"
        v-touch:swipe.right="swipeRight" v-show="showPremiumTrainer == true">
        <div class="w-full flex justify-end">
          <div class="bg-secondary w-7 h-7 rounded-full flex items-center justify-center">
            <i class="fa-solid fa-plus text-sm text-black font-bold rotate-45"></i>
          </div>
        </div>
        <div class="w-full flex flex-col h-full">
          <h2 class="font-boldHeadline text-base mb-1">Do you want to become a premium trainer?</h2>
          <small class="text-xxs">A premium trainer has the ability to create programs and manage their clients through
            the
            app using
            stripe to take payments.</small>
          <small class="mt-3 text-xxs">You also have access to a desktop dashboard for easier managing and exporting of
            data to see
            your monthly
            earnings.</small>
          <small class="my-3 text-xxs">
            This is a monthly subscription of <span class="text-black font-boldHeadline text-sm mx-1">£19.99</span> per
            month and you get access to all the features.
          </small>
          <button class="bg-secondary px-3 text-sm uppercase py-2 rounded-2xl font-bold my-6" :disabled="loading"
            @click="createCheckoutSession">
            Subscribe to prime account
          </button>
          <div class="flex-1 flex flex-col justify-end">
            <div class="w-full h-8 flex items-center justify-center">
              <div class="h-4 w-4 rounded-full bg-gray-400 shadow-sm shadow-black mx-2"></div>
              <div class="h-4 w-4 rounded-full bg-gray-200/70 shadow-sm shadow-black mx-2"></div>
            </div>
          </div>
        </div>
      </div>
      <div @click.stop
        class="h-1/2 w-full bg-[#f5f5f5] shadow-md shadow-black rounded-md flex flex-col p-4 relative transition-all duration-500"
        :class="showPremiumTrainer == false ? 'opacity-100' : 'opacity-0'" v-touch:swipe.left="swipeLeft"
        v-touch:swipe.right="swipeRight" v-show="showPremiumTrainer === false">
        <div class="w-full flex justify-end">
          <div class="bg-secondary w-7 h-7 rounded-full flex items-center justify-center">
            <i class="fa-solid fa-plus text-sm text-black font-bold rotate-45"></i>
          </div>
        </div>
        <div class="w-full flex flex-col h-full">
          <h2 class="font-boldHeadline text-base mb-1">Do you want to sign up to a premium trainers plan?</h2>
          <small class="text-xs">You can sign up to a personal trainers plan that they have set for you, enter the code
            they provided into the input to subscribe to the plan!</small>
          <input type="text" class="w-full rounded-2xl my-3 py-1 px-3 bg-transparent border-2 border-black/70">
          <button class="bg-secondary px-3 text-sm uppercase py-2 rounded-2xl font-bold my-3"
            @click="subscribeToPrimeAccount">
            Subscribe to prime account
          </button>
          <div class="flex-1 flex flex-col justify-end">
            <div class="w-full h-8 flex items-center justify-center">
              <div :class="showPremiumTrainer === true ? 'bg-gray-400' : 'bg-gray-200/70'"
                class="h-4 w-4 rounded-full  shadow-sm shadow-black mx-2" @click="() => showPremiumTrainer = true">
              </div>
              <div :class="showPremiumTrainer === false ? 'bg-gray-400' : 'bg-gray-200/70'"
                class="h-4 w-4 rounded-full  shadow-sm shadow-black mx-2" @click="() => showPremiumTrainer = false">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transition-group-container {
  position: relative;
}

.transition-content {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.slide-leave-from,
.slide-enter-to {
  transform: translateX(0);
}
</style>
