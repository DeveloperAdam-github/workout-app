<template>
  <div class="w-full h-full top-0 left-0 absolute z-20" v-show="store.showPlanModal === true">
    <div class="w-full h-full bg-black/70 flex items-center justify-center flex-col" @click="store.showPlanModal = false">
      <div
        class="w-[80%] h-fit p-4 rounded-lg shadow-xl bg-white overflow-scroll flex flex-col items-center justify-center text-black"
        @click.stop>
        <div class="w-full flex justify-center items-center text-black">
          <div class="flex flex-col items-center">
            <h1 class="mb-2 uppercase text-black font-boldHeadline">Create a new plan
            </h1>
            <small class="text-sm text-center mb-2">This will create a product in Stripe then you will be able to add the
              workout details
              to this
              plan</small>
          </div>
        </div>
        <form @submit.prevent="createPlan" class="flex flex-col text-sm">
          <label for="" class="text-gray-500">Plan name</label>
          <input class="bg-transparent pl-2 border my-2 h-8 rounded-md border-primary" type="text" placeholder=""
            v-model="planName">
          <label for="" class="text-gray-500">Plan Description</label>
          <input class="bg-transparent pl-2 border my-2 h-8 rounded-md border-primary" type="text" placeholder=""
            v-model="planDescription">
          <label for="" class="text-gray-500">Plan price (monthly re-occuring)</label>
          <div class="flex pl-2 border my-2 h-8 rounded-md border-primary items-center">
            <p class="mr-2">£</p>
            <input class="bg-transparent focus:outline-none" type="number" v-model="planPrice" min="1">
          </div>
          <button class="px-2 h-8 py-1 text-sm rounded-md text-white bg-primary my-2" @click="createPlan">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { usePrimeStore } from "../stores/prime";
import axios from 'axios'
import { useUserStore } from "../stores/user";


const store = usePrimeStore();
const userStore = useUserStore();
const planName = ref('')
const planPrice = ref('')
const planDescription = ref('')

const convertToSmallestCurrencyUnit = computed(() => {
  return Math.round(planPrice.value * 100);
})

const createPlan = async () => {
  const response = await fetch('http://localhost:8000/create-stripe-plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ planName: planName.value, planPrice: convertToSmallestCurrencyUnit.value, userId: userStore.user.id, connectedAccountId: userStore.accountId })
  });

  const data = await response.json();

  console.log(data, 'the data after creating a plan?');
}

</script>