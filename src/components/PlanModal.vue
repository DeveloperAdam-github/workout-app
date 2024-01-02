<template>
  <div class="w-full h-full top-0 left-0 absolute z-20" v-show="store.showPlanModal === true">
    <div class="w-full h-full bg-black/70 flex items-center justify-center flex-col" @click="store.showPlanModal = false">
      <div
        class="w-[80%] h-fit p-4 rounded-lg shadow-xl bg-white overflow-scroll flex flex-col items-center justify-center"
        @click.stop>
        <div class="w-full flex justify-center items-center">
          <h1 class="mb-2 uppercase text-black font-boldHeadline">Create a new plan
          </h1>
        </div>
        <form @submit.prevent="createPlan" class="flex flex-col text-sm">
          <label for="">Plan name</label>
          <input class="bg-transparent pl-1 border my-2 h-8 rounded-md border-primary" type="text" placeholder=""
            v-model="planName">
          <label for="">Plan price (monthly re-occuring)</label>
          <input class="bg-transparent pl-1 border my-2 h-8 rounded-md border-primary" type="number" v-model="planPrice">
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

const convertToSmallestCurrencyUnit = computed(() => {
  return Math.round(planPrice.value * 100);
})

const createPlan = async () => {
  const response = await fetch('http://127.0.0.1:54321/functions/v1/stripe-create-plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ planName: planName.value, planPrice: convertToSmallestCurrencyUnit.value })
  });

  const data = await response.json();

  console.log(data, 'the data after creating a plan?');
}

</script>