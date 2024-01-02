<template>
  <div>
    <h1>test success</h1>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import supabase from '../supabase';

onMounted(async () => {
  const route = useRoute();
  const sessionId = route.params.id; // Access the 'id' parameter from the URL

  if (sessionId) {
    // Perform your Supabase query here using the sessionId
    try {
      const { data, error } = await supabase
        .from('plans') // Replace with your table name
        .update({ 'active': true })
        .eq('session_id', sessionId); // Adjust the query as per your requirements

      if (error) throw error;
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
});
</script>