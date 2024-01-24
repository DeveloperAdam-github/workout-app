import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import supabase from '../supabase';
import { useGlobalStore } from './global';
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const router = useRouter();
  const globalStore = useGlobalStore();
  const user = ref(JSON.parse(localStorage.getItem('user')) ?? null);
  const userSession = ref(JSON.parse(localStorage.getItem('userSession')) ?? null);
  const emailHold = ref('');
  const userHold = ref(false);
  const loading = ref(false);
  const userDetails = ref(JSON.parse(
    localStorage.getItem('userDetails')) ?? {
    gender: '',
    age: '',
    metric: '',
    height: { foot: '', inches: '' },
    weight: '',
    goals: [],
    account_type: 'default',
  });
  const stripeAccountId = ref('');
  const hasPrimeStripeAccount = ref(false);
  const createdPlans = ref([]);
  const isConnectedToRealTimeDB = ref(false)


  // const userDetails = ref({
  //   gender: '',
  //   age: '',
  //   metric: '',
  //   height: { foot: '', inches: '' },
  //   weight: '',
  //   goals: [],
  //   account_type: 'default',
  // });

  async function signInWithEmail(email) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      type: 'magiclink',
    });
    alert('check your email for a 6 digit code');
    emailHold.value = email;
    userHold.value = true;
    globalStore.showNav = false;
  }

  async function verifyUserWithEmailCode(token) {
    try {
      loading.value = true;
      const { data, error } = await supabase.auth.verifyOtp({
        email: emailHold.value,
        token,
        type: 'magiclink',
      });
      if (error) throw error;
      console.log(data, 'show me data here?');
      if (data) {
        user.value = data.user;
        userSession.value = data.session;
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userSession', JSON.stringify(data.session));

        getUserDetailsFromDatabase();
        getPrimeDetailsFromDatabase();
        subscribeToChannel();
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      loading.value = false;
    }
  }

  const handleLogin = async (email) => {
    console.log(email)
    try {
      loading.value = true;
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });
      if (error) throw error;
      // do we want to replace this for a toast?
      alert('Check your email for the login link!');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
        // we need to check the message here?
      }
    } finally {
      loading.value = false;
    }
  };

  const primeUserDetailsToDatabase = async () => {
    await supabase
      .from('users')
      .insert({
        id: user.value.id,
        email: user.value.email,
        gender: null,
        age: null,
        metric: null,
        height: null,
        weight: null,
        goals: null,
        account_type: 'default'
      })
      .select()
      .then((response) => {
        console.log(response);
      });
  };

  const addUserDetailsToDatabase = async () => {
    await supabase
      .from('users')
      .insert({
        id: user.value.id,
        email: user.value.email,
        gender: userDetails.value.gender,
        age: userDetails.value.age,
        metric: userDetails.value.metric,
        height: userDetails.value.height,
        weight: userDetails.value.weight,
        goals: userDetails.value.goals,
        account_type: 'default'
      })
      .select()
      .then((response) => {
        console.log(response);
      });
  };

  const getUserDetailsFromDatabase = async () => {
    const { data, error } = await supabase
      .from('users')
      .select(`*`)
      .eq('id', user.value.id);


    console.log(data, 'does anything come back here?');


    if (data.length <= 0) {
      console.log('are we here?');
      // primeUserDetailsToDatabase();
      setTimeout(() => {
        globalStore.userDetailsEntered = false;
        globalStore.showPopUpForDetail = true;
        userDetails.value = {
          gender: '',
          age: '',
          metric: '',
          height: { foot: '', inches: '' },
          weight: '',
          goals: [],
          account_type: 'default',
        }
      }, 2000);
    } else {
      globalStore.showNav = true;
      userDetails.value = data[0];
      localStorage.setItem('userDetails', JSON.stringify(data[0]));
    }
  };

  const getPrimeDetailsFromDatabase = async (userId) => {
    console.log('clicking');
    const { data, error } = await supabase
      .from('prime_accounts')
      .select('*')
      .eq('user_id', user.value.id)

    if (data[0]) {
      hasPrimeStripeAccount.value = true;
      stripeAccountId.value = data[0].account_id
    } else {
      hasPrimeStripeAccount.value = false;
    }

    console.log(data, 'the data');
    console.log(error, 'error');
  }

  // const getCreatedPlansForUser = async (userId) => {
  //   const { data, error } = await supabase
  //     .from('created_plans')
  //     .select('*')
  //     .eq('user_id', user.value.id)

  //   createdPlans.value = data;
  // }

  const logout = async () => {
    try {
      // Supabase sign out
      await supabase.auth.signOut();

      // Clear localStorage items related to user session
      localStorage.removeItem('userSession');
      localStorage.removeItem('user');
      localStorage.removeItem('userDetails');

      // Reset user state
      user.value = null;
      userSession.value = null;
      userDetails.value = null;

      router.push('/')

      // Redirect or perform other actions as needed
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const subscribeToChannel = () => {
    console.log(user, 'the user here?');
    const channels = supabase.channel('custom-filter-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages', filter: `sent_to=eq.${user.value.id}` },
        (payload) => {
          console.log('Change received!', payload);
          if (payload.eventType == 'INSERT') {
            console.log('New message received');
            globalStore.messages.push(payload.new);
            globalStore.showInstantAlert = true;
            globalStore.loadedMessage = payload.new
          }
        }
      )
      .subscribe();

    isConnectedToRealTimeDB.value = true;
    console.log('Subscribed to channels', channels);

    // Handling connection closed
    channels.on('CLOSED', () => {
      console.log('Connection closed. Attempting to reconnect...');
      reconnect();
    });

    return channels;
  };

  const reconnect = () => {
    // Add a delay or exponential backoff logic here if necessary
    setTimeout(() => {
      subscribeToChannel();  // Try to resubscribe
    }, 3000); // Wait 3 seconds before attempting to reconnect
  };


  return {
    user,
    userDetails,
    userSession,
    handleLogin,
    signInWithEmail,
    verifyUserWithEmailCode,
    userHold,
    emailHold,
    addUserDetailsToDatabase,
    getUserDetailsFromDatabase,
    getPrimeDetailsFromDatabase,
    hasPrimeStripeAccount,
    // getCreatedPlansForUser,
    stripeAccountId,
    createdPlans,
    isConnectedToRealTimeDB,
    subscribeToChannel,
    logout
  };
});
