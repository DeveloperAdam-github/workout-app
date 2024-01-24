<template>
  <div>
    <h1>test successful signup to stripe??</h1>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import supabase from '../supabase';

onMounted(async () => {
  console.log('hello')
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  // try {
  //   const response = await fetch('http://127.0.0.1:54321/functions/v1/stripe-signup-success-redirect', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ code: code }),
  //   });

  //   console.log(response, 'any response?');

  //   const data = await response.json();
  //   if (data.ok) {
  //     console.log('Successfully exchanged code for token', data);
  //     // Handle successful exchange (e.g., update UI or redirect)
  //     // Update supabase in here?
  //   } else {
  //     console.error('Error exchanging code for token', data);
  //   }
  // } catch (err) {
  //   console.error('Error sending request to Edge Function', err);
  // }

});
</script>