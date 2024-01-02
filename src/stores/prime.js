import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import supabase from '../supabase';
import { useGlobalStore } from './global';

export const usePrimeStore = defineStore('prime', () => {
  const globalStore = useGlobalStore();
  const showPrimeUserSettings = ref(true);
  const showPaymentModal = ref(false);
  const showPlanModal = ref(false);
  const showSubscriptionModal = ref(false)

  async function toggleShowPrimeUserSettings() {
    console.log('toggling');
    showPrimeUserSettings.value = !showPrimeUserSettings.value;
    globalStore.showNav = !globalStore.showNav;
  }

  function toggleShowPaymentModal() {
    showPaymentModal.value = !showPaymentModal.value;
  }

  function toggleShowPlanModal(value) {
    showPlanModal.value = !showPlanModal.value;
  }

  function signUpToStripe() {
    const clientId = import.meta.env.VITE_STRIPE_CONNECT_ID;
    const redirectUri = encodeURIComponent('http://localhost:5173/signup-success/');
    const stripeUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${redirectUri}`;

    // ac_P2jPo2Jt0ddOGXsKCzLVVUTmStGyqmyl

    const popup = window.open(stripeUrl, 'stripePopup', 'width=500,height=700');
    if (window.focus) popup.focus();

    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        // Handle the callback here, for example, check your backend to see if authentication was successful
        // You might need to make an API call to your backend to get the status of the OAuth process
      }
    }, 500);
  }

  async function subscribeToPrimeAccount() {
    // Sign up for Paypal / Scribe reoccuring subscription

    // Go through PayPal as payment gateway

    // If success update user account to reflect success and prime status

    // If failure, show user error message and go no further

    // Some kind of periodic check against a user to see if they are still subscribed? We might have to store an expiry date on the subscription 
  }

  const upgradeUserToPrimeStatus = async (user) => {
    console.log(user, 'the user in here');
    await supabase
      .from('users')
      .insert({
        id: user.value.id,
        account_type: 'prime',
      })
      .select()
      .then((response) => {
        console.log(response, 'response from upgrading our user');
        addPrimeUserToTable(user);
      });
  };

  const addPrimeUserToTable = async (user) => {
    await supabase
      .from('prime_accounts')
      .insert({
        id: user.value.id,
        active_subscription: true,
        subscription_end_date: new Date(),
      }).select()
      .then((response) => {
        console.log(response, 'response from inserting prime account');
      })
  }

  const toggleSubscriptionModal = () => {
    showSubscriptionModal.value = !showSubscriptionModal.value;
  };

  return {
    showPrimeUserSettings,
    toggleShowPrimeUserSettings,
    subscribeToPrimeAccount,
    toggleShowPaymentModal,
    showPaymentModal,
    upgradeUserToPrimeStatus,
    showPlanModal,
    toggleShowPlanModal,
    signUpToStripe,
    toggleSubscriptionModal,
    showSubscriptionModal
  };
});
