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

  try {
    const response = await fetch('http://127.0.0.1:54321/functions/v1/stripe-signup-success-redirect', {
      method: 'POST',
      headers: {STRIPE_API_KEY=sk_test_51OAdakBbwsPdB97DkAomRhupj3KCSkeN6PzfHIbnsfWH4eYj8uQmRB1OtymS4CwMIUera1jRxAsc8DFWJwsqUD8l00m2lEP7fK
STRIPE_WEBHOOK_SIGNING_SECRET=whsec_4ff46be390f82a001fc6d999825a0b16ccbd2d4ea7f657e7d70356d0a2574515
BACKEND_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhcHFweWd6cXd3dGJ2ZXFsbmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzIzMjgyMjUsImV4cCI6MTk4NzkwNDIyNX0.Mq6H859Fp4QvGCuGrdEw9mhU_USrTqe3KAWiKHkyvKo
BACKEND_SUPABASE_URL=https://papqpygzqwwtbveqlnfm.supabase.co
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code }),
    });

    console.log(response, 'any response?');

    const data = await response.json();
    if (data.ok) {
      console.log('Successfully exchanged code for token', data);
      // Handle successful exchange (e.g., update UI or redirect)
      // Update supabase in here?
    } else {
      console.error('Error exchanging code for token', data);
    }
  } catch (err) {
    console.error('Error sending request to Edge Function', err);
  }

});
</script>