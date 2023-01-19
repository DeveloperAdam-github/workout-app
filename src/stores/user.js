import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import supabase from '../supabase';
import { useGlobalStore } from './global';

export const useUserStore = defineStore('user', () => {
  const globalStore = useGlobalStore();
  const user = ref(localStorage.getItem('user') ?? null);
  const userSession = ref(localStorage.getItem('userSession') ?? null);
  const emailHold = ref('');
  const userHold = ref(false);
  const loading = ref(false);
  const userDetails = ref({
    gender: '',
    age: '',
    metric: '',
    height: { foot: '', inches: '' },
    goals: [],
  });

  async function signInWithEmail(email) {
    console.log(email, 'whta the email here?');
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      type: 'magiclink',
    });
    alert('Check your email for your 6 digit code');
    emailHold.value = email;
    userHold.value = true;
    globalStore.showNav = false;

    console.log(data, 'show me data?', error, 'show me error?');
  }

  async function verifyUserWithEmailCode(token) {
    console.log(token, 'wot token');
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

        setTimeout(() => {
          globalStore.showPopUpForDetail = true;

          console.log(globalStore, 'whats global store');
        }, 2000);
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
    console.log(email, 'whats email passed in?');
    try {
      loading.value = true;
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      loading.value = false;
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
  };
});
