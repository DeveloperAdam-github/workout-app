import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import supabase from '../supabase';
import { useGlobalStore } from './global';
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const router = useRouter();
  const globalStore = useGlobalStore();
  const user = ref(JSON.parse(localStorage.getItem('user')) ?? null);
  const userSession = ref(localStorage.getItem('userSession') ?? null);
  const emailHold = ref('');
  const userHold = ref(false);
  const loading = ref(false);
  const userDetails = ref({
    gender: '',
    age: '',
    metric: '',
    height: { foot: '', inches: '' },
    weight: '',
    goals: [],
    account_type: 'default',
  });

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

    userDetails.value = data[0];

    console.log(data, 'does anything come back here?');

    if (data === [] || data.length === 0) {
      // primeUserDetailsToDatabase();
      setTimeout(() => {
        globalStore.userDetailsEntered = false;
        globalStore.showPopUpForDetail = true;
      }, 2000);
    } else {
      globalStore.showNav = true;
    }
  };

  const logout = async () => {
    try {
      // Supabase sign out
      await supabase.auth.signOut();

      // Clear localStorage items related to user session
      localStorage.removeItem('userSession');
      localStorage.removeItem('user');

      // Reset user state
      user.value = null;
      userSession.value = null;

      router.push('/')

      // Redirect or perform other actions as needed
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return {
    user,
    userDetails,
    handleLogin,
    signInWithEmail,
    verifyUserWithEmailCode,
    userHold,
    emailHold,
    addUserDetailsToDatabase,
    getUserDetailsFromDatabase,
    logout
  };
});
