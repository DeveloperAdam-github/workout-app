<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { usePrimeStore } from '../stores/prime';
import { useGlobalStore } from '../stores/global';
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




</script>

<template>
  <div class="w-full h-full flex flex-col relative">
    <h1>The explore area</h1>
  </div>
</template>
