<script setup>
import TopBar from '../components/TopBar.vue';
import womanSquatting from '../assets/images/womanSquatting.jpg';
</script>

<template>
  <main class="text-white h-full w-full bg-primary flex flex-col">
    <TopBar :title="'Workout'" />
    <div class="w-full flex flex-col p-4">
      <div
        class="h-52 w-full rounded-xl bg-cover bg-center relative flex items-center justify-center"
        :style="{
          'background-image': `linear-gradient(to bottom, rgba(1,1,1,0.95), rgba(255,255,255,0.02)), url(${womanSquatting})`,
        }"
      >
        <div class="">
          <h1 class="text-lg font-boldHeadline">Lower Body Workout</h1>
        </div>
        <div
          class="absolute h-14 w-3/4 rounded-xl bg-transparent/70 flex -bottom-6 m-auto left-0 right-0 text-xs items-center p-1"
        >
          <div class="w-1/2 flex h-full px-1">
            <div class="w-1/2 h-full flex p-2 items-center">
              <div
                class="h-full bg-secondary w-full rounded-xl flex items-center justify-center text-xl"
              >
                <i class="fa-solid fa-stopwatch text-black"></i>
              </div>
            </div>
            <div class="h-full w-1/2 flex flex-col text-xxs justify-center">
              <p>Time</p>
              <p>20 min</p>
            </div>
          </div>
          <div class="w-0.5 h-1/2 bg-gray-400"></div>
          <div class="w-1/2 flex h-full px-1">
            <div class="w-1/2 h-full flex p-2 items-center">
              <div
                class="h-full bg-secondary w-full rounded-xl flex items-center justify-center text-xl"
              >
                <i class="fa-solid fa-fire text-black"></i>
              </div>
            </div>
            <div class="h-full w-1/2 flex flex-col text-xxs justify-center">
              <p>Burn</p>
              <p>300kcal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col carousel-vertical mt-2 pb-14">
      <div class="w-full h-full p-4 flex flex-col">
        <!-- first set -->
        <div class="w-full flex flex-col mt-4 carousel-item">
          <div class="flex justify-between">
            <h2 class="font-boldHeadline text-lg">Bench Press</h2>
            <button class="bg-gray-600 px-2 rounded-lg">
              <i class="fa-solid fa-ellipsis"></i>
            </button>
          </div>
          <table class="mt-4">
            <thead class="text-base">
              <tr>
                <td>Set</td>
                <td>Weight</td>
                <td>Reps</td>
                <td>
                  <div class="flex items-center justify-center">
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="">
                <td>1</td>
                <td>90</td>
                <td>10</td>
                <td>
                  <div
                    class="bg-secondary flex items-center justify-center p-0.5 rounded-lg text-black"
                  >
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>90</td>
                <td>10</td>
                <td>
                  <div
                    class="bg-gray-600 flex items-center justify-center p-0.5 rounded-lg text-white"
                  >
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="w-full flex items-center justify-center mt-4">
            <button class="w-full p-1 my-2 rounded-lg bg-gray-600 text-sm">
              Add Another Set
            </button>
          </div>
        </div>

        <!-- second set -->
        <div class="w-full flex flex-col mt-4 carousel-item">
          <div class="flex justify-between">
            <h2 class="font-boldHeadline text-lg">Incline DB Press</h2>
            <button class="bg-gray-600 px-2 rounded-lg">
              <i class="fa-solid fa-ellipsis"></i>
            </button>
          </div>
          <table class="mt-4">
            <thead class="text-base">
              <tr>
                <td>Set</td>
                <td class="">
                  Weight
                  <span class="text-xxs">(KG)</span>
                </td>
                <td>Reps</td>
                <td>
                  <div class="flex items-center justify-center">
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="">
                <td>1</td>
                <td>32.5</td>
                <td>8</td>
                <td>
                  <div
                    class="bg-secondary flex items-center justify-center p-0.5 rounded-lg text-black"
                  >
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>32.5</td>
                <td>8</td>
                <td>
                  <div
                    class="bg-secondary text-black flex items-center justify-center p-0.5 rounded-lg"
                  >
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td class="flex items-center justify-center">
                  <input type="text" class="rounded-lg w-14 px-1 bg-gray-400" />
                </td>
                <td>
                  <input type="text" class="rounded-lg w-14 px-1 bg-gray-400" />
                </td>
                <td>
                  <div
                    class="bg-gray-600 flex items-center justify-center p-0.5 rounded-lg text-white"
                  >
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="w-full flex items-center justify-center mt-4">
            <button class="w-full p-1 my-2 rounded-lg bg-gray-600 text-sm">
              Add Another Set
            </button>
          </div>
        </div>

        <!-- third set -->
        <div class="w-full flex flex-col mt-4 carousel-item">
          <div class="flex justify-between">
            <h2 class="font-boldHeadline text-lg">Incline DB Press</h2>
            <button class="bg-gray-600 px-2 rounded-lg">
              <i class="fa-solid fa-ellipsis"></i>
            </button>
          </div>
          <table class="mt-4">
            <thead class="text-base">
              <tr>
                <td>Set</td>
                <td class="">
                  Weight
                  <span class="text-xxs">(KG)</span>
                </td>
                <td>Reps</td>
                <td>
                  <div class="flex items-center justify-center">
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="">
                <td>1</td>
                <td>32.5</td>
                <td>8</td>
                <td>
                  <div
                    class="bg-secondary flex items-center justify-center p-0.5 rounded-lg text-black"
                  >
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>32.5</td>
                <td>8</td>
                <td>
                  <div
                    class="bg-secondary text-black flex items-center justify-center p-0.5 rounded-lg"
                  >
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td class="flex items-center justify-center">
                  <input type="text" class="rounded-lg w-14 px-1 bg-gray-400" />
                </td>
                <td>
                  <input type="text" class="rounded-lg w-14 px-1 bg-gray-400" />
                </td>
                <td>
                  <div
                    class="bg-gray-600 flex items-center justify-center p-0.5 rounded-lg text-white"
                  >
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="w-full flex items-center justify-center mt-4">
            <button class="w-full p-1 my-2 rounded-lg bg-gray-600 text-sm">
              Add Another Set
            </button>
          </div>
        </div>

        <!-- furth set -->
        <div class="w-full flex flex-col mt-4 carousel-item">
          <div class="flex justify-between">
            <h2 class="font-boldHeadline text-lg">Incline DB Press</h2>
            <button class="bg-gray-600 px-2 rounded-lg">
              <i class="fa-solid fa-ellipsis"></i>
            </button>
          </div>
          <table class="mt-4">
            <thead class="text-base">
              <tr>
                <td>Set</td>
                <td class="">
                  Weight
                  <span class="text-xxs">(KG)</span>
                </td>
                <td>Reps</td>
                <td>
                  <div class="flex items-center justify-center">
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="">
                <td>1</td>
                <td>32.5</td>
                <td>8</td>
                <td>
                  <div
                    class="bg-secondary flex items-center justify-center p-0.5 rounded-lg text-black"
                  >
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>32.5</td>
                <td>8</td>
                <td>
                  <div
                    class="bg-secondary text-black flex items-center justify-center p-0.5 rounded-lg"
                  >
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td class="flex items-center justify-center">
                  <input type="text" class="rounded-lg w-14 px-1 bg-gray-400" />
                </td>
                <td>
                  <input type="text" class="rounded-lg w-14 px-1 bg-gray-400" />
                </td>
                <td>
                  <div
                    class="bg-gray-600 flex items-center justify-center p-0.5 rounded-lg text-white"
                  >
                    <i class="fa-solid fa-check"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="w-full flex items-center justify-center mt-4">
            <button class="w-full p-1 my-2 rounded-lg bg-gray-600 text-sm">
              Add Another Set
            </button>
          </div>
        </div>
        <div class="w-full flex items-center justify-center">
          <button
            class="w-full p-1 my-2 rounded-lg text-black bg-secondary text-sm"
          >
            Add Exercise
          </button>
        </div>
        <div class="w-full flex items-center justify-center">
          <button
            class="w-full p-1 my-2 rounded-lg bg-blue-600 text-sm text-white"
          >
            Finish Workout
          </button>
        </div>
        <div class="w-full flex items-center justify-center">
          <button
            class="w-full p-1 my-2 rounded-lg bg-red-600 text-sm text-white"
          >
            Stop Workout
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
td {
  text-align: center;
}
input {
  text-align: center;
}
</style>
