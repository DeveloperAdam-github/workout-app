<script>
import { defineComponent } from 'vue';
import { BarChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default defineComponent({
  name: 'Home',
  components: { BarChart },
  setup() {
    const testData = {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
      datasets: [
        {
          data: [3, 1, 2, 0, 1],
          backgroundColor: ['#192126', '#bbf246', '#50535E'],
          label: 'Workouts per week',
        },
      ],
    };

    return { testData };
  },
});
</script>
<template>
  <div class="h-full w-full">
    <BarChart class="h-full w-full text-xs" :chartData="testData" />
  </div>
</template>
