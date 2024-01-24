<template>
  <div class="text-black h-full w-full bg-gray-200 flex flex-col p-4 font-headline">
    <div class="w-full flex justify-center">
      <h1 class="font-boldHeadline">WorkoutApp</h1>
    </div>
    <div class="h-64 flex py-4 flex-col">
      <div class="w-full flex flex-col items-center justify-center h-24 relative">
        <div class="bg-primary h-14 w-14 rounded-full text-white flex items-center justify-center z-10">
          <i class="fa-solid fa-check md:text-4xl"></i>
        </div>
        <div v-for="confetti in confettis" :key="confetti.id" :class="['confetti', confetti.shape]"
          :style="confetti.style"></div>
      </div>
      <div class="w-full flex flex-col mt-5 justify-center items-center">
        <h2>Congratulations on signing up</h2>
        <p v-if="plan">Your plan: {{ plan }}</p>
      </div>
    </div>
    <div class="w-full flex justify-center h-full items-center">
      <button class="bg-secondary px-4 py-2 rounded-full">Let's workout!</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user'
import supabase from '../supabase';
import confetti from "https://cdn.skypack.dev/canvas-confetti";

const plan = ref('');

const userStore = useUserStore()

const confettis = ref([])
const colors = ['#035eff', '#974af5', '#ff0000', '#f2d74e', '#5df2d6', '#888df2'];
const shapes = ['shape1', 'shape2', 'shape3'];

const random = (min, max) => Math.random() * (max - min) + min;

onMounted(async () => {
  const route = useRoute();
  const token = route.params.id; // Access the 'id' parameter from the URL

  if (token) {
    try {
      const { data: tokenData, error: selectError } = await supabase
        .from('tokens')
        .select('*')
        .eq('token', token);

      if (selectError) throw selectError;

      const tokenRecord = tokenData[0];
      // && tokenRecord.used === false
      if (tokenRecord) {
        const { data: updateData, error: updateError } = await supabase
          .from('tokens')
          .update({ used: true })
          .eq('token', token);

        if (updateError) throw updateError;

        const { data: planData, error: planError } = await supabase
          .from('subscribed_plans')
          .select('*')
          .eq('subscription_user', tokenRecord.user_id)

        plan.value = planData[0].product_name;

        if (planError) throw userError;

        const { data: userData, error: userError } = await supabase
          .from('users')
          .update({ account_type: 'prime' })
          .eq('id', tokenRecord.user_id)

        userStore.userDetails.account_type = 'prime'


        console.log(userData, 'update data');
        console.log(userError, 'update error');
        if (updateData.length === 0) {
          console.log('No records updated, possibly due to RLS policies or non-existent token.');
        } else {
          console.log('Token status updated:', updateData);
        }
      } else {
        console.log('Token not found or already used.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  for (let i = 0; i < 50; i++) {
    const color = colors[Math.floor(random(0, colors.length))];
    const size = random(4, 20); // Size range from 4px to 20px
    const shape = shapes[Math.floor(random(0, shapes.length))];
    const left = random(0, 100);
    const top = random(0, 100);
    const rotate = random(0, 360);

    let width, height, borderRadius;

    // Define size and border radius based on the shape
    switch (shape) {
      case 'shape1': // Circle
        width = height = size; // Circle with equal width and height
        borderRadius = '100%'; // Fully rounded corners for circle
        break;
      case 'shape2': // Square
        width = height = size; // Square with equal width and height
        borderRadius = '0'; // No border radius for square
        break;
      case 'shape3': // Rectangle
        width = size;
        height = size / 2; // Rectangle with width twice the height
        borderRadius = '0'; // No border radius for rectangle
        break;
    }

    confettis.value.push({
      id: i,
      style: {
        backgroundColor: color,
        width: `${width}px`,
        height: `${height}px`,
        position: 'absolute',
        left: `${left}%`,
        top: `${top}%`,
        borderRadius: borderRadius,
        transform: `rotate(${rotate}deg)`,
        zIndex: 2,
      },
    });
  }
});

</script>

<style scoped>
.confetti {
  /* This class applies to all confetti pieces */
  /* border-radius: 50%; */
  position: absolute;
}
</style>