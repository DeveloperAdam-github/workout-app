<script>
import { defineComponent } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default defineComponent({
  name: 'Home',
  components: { LineChart },
  setup() {
    const testData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'],
      datasets: [
        {
          data: [84, 82, 79, 77, 78],
          backgroundColor: ['#192126', '#bbf246', '#50535E'],
          label: 'Weight in KG',
        },
      ],
    };

    return { testData };
  },
});
</script>
<template>
  <div class="h-full w-full">
    <LineChart class="h-full w-full text-xs" :chartData="testData" />
  </div>
</template>
