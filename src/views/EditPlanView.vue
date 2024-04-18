<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import supabase from '../supabase';
import PlanRoutine from '../components/PlanRoutine.vue'

const route = useRoute()
const router = useRouter();
const plan = ref({})
const planPrice = computed({
  get: () => plan.value.plan_price / 100,
  set: (value) => Math.round(plan.value.plan_price = value * 100)
})
const workout = ref(null)
const createRoutine = ref(false);
const createWorkoutName = ref('');
const expandedBox = ref('planSettings')

const loadPlanWithID = async () => {
  const planId = route.params.id
  console.log(planId, 'any plan id?');

  const { data, error } = await supabase
    .from('created_plans')
    .select('*')
    .eq('id', planId)
    .select('*, plan_workouts(*, plan_days(*, plan_exercises(*, plan_sets(*))))')

  if (data[0].plan_workouts.length > 0) {
    workout.value = data[0].plan_workouts[0]
  }
  plan.value = data[0]
  createWorkoutName.value = data[0].plan_name
}


const createRoutineForPlan = () => {
  createRoutine.value = true
}

const saveRoutineNameAndCreate = async () => {
  const { data, error } = await supabase
    .from('plan_workouts')
    .insert({
      'workout_name': createWorkoutName.value,
      'plan_id': plan.value.id
    })
    .select()
    .then((response) => {
      console.log(response);
      workout.value = response.data[0]
    });
}

const goBack = () => {
  router.back();
}

onMounted(async () => {
  loadPlanWithID()
})

const test = () => {
  let element = document.getElementById('testid')
  console.log(element, 'element');
  element.classList.add('is-open')
}
</script>

<template>
  <div class="w-full h-full relative flex flex-col p-4 bg-gray-200 text-black" v-if="plan">
    <div class="w-full flex items-center justify-between">
      <div class="h-5 w-5 rounded-full bg-primary text-white items-center justify-center text-xs flex mr-3"
        @click="goBack">
        <i class="fa-solid fa-arrow-left-long" />
      </div>
      <h1 class="text-base">Edit your plan
      </h1>
    </div>
    <!-- <div class="flex flex-col mt-4 bg-white shadow-xl rounded-md p-4"
      :class="{ 'h-fit': expandedBox === 'planSettings', 'h-16 overflow-hidden': expandedBox !== 'planSettings' }">
      <div class="flex justify-between mb-4 items-center"
        @click="expandedBox = expandedBox === 'planSettings' ? null : 'planSettings'">
        <h2 class="text-lg font-boldHeadline">
          <i class="fa-solid fa-cog text-lg mr-4" />
          Plan Stripe Settings:
        </h2>
        <i class="fa-solid fa-chevron-up transition-all duration-300"
          :class="{ 'rotate-180': expandedBox === 'planSettings', '': expandedBox !== 'planSettings' }" />
      </div>
      <div class="w-full flex flex-col">
        <label for="">Plan name:</label>
        <input class="bg-transparent pl-2 border my-2 h-8 rounded-md border-primary" type="text" placeholder=""
          v-model="plan.plan_name">

        <label for="">Plan Price:</label>
        <div class="bg-transparent pl-2 border my-2 h-8 rounded-md border-primary flex items-center">
          <p class="">£</p>
          <input class="bg-transparent w-full" type="number" v-model="planPrice">
        </div>

        <button class="w-full bg-blue-500 text-white h-8 rounded-md my-2" @click="">Save</button>
      </div>
    </div> -->

    <div class="flex flex-col mt-4 bg-white shadow-xl rounded-md p-4">
      <div class="flex justify-between my-4 items-center"
        @click="expandedBox = expandedBox === 'planSettings' ? null : 'planSettings'">
        <h2 class="text-lg font-boldHeadline">
          <i class="fa-solid fa-cog text-lg mr-4" />
          Plan Stripe Settings:
        </h2>
        <i class="fa-solid fa-chevron-up transition-all duration-300"
          :class="{ 'rotate-180': expandedBox === 'planSettings', '': expandedBox !== 'planSettings' }" />
      </div>
      <div class="w-full wrapper grid" :class="expandedBox === 'planSettings' ? 'is-open' : ''">
        <div class="inner">
          <div class="flex flex-col">
            <label for="">Plan name:</label>
            <input class="bg-transparent pl-2 border my-2 h-8 rounded-md border-primary focus:outline-none" type="text"
              placeholder="" v-model="plan.plan_name">

            <label for="">Plan Price:</label>
            <div class="bg-transparent pl-2 border my-2 h-8 rounded-md border-primary flex items-center">
              <p class="">£</p>
              <input class="bg-transparent w-full focus:outline-none" type="number" v-model="planPrice">
            </div>

            <button class="w-full bg-blue-500 text-white h-8 rounded-md my-2" @click="">Save</button>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="flex flex-col mt-4 bg-white shadow-xl rounded-md p-4"
      :class="{ 'h-fit': expandedBox === 'routineSettings', 'h-16 overflow-hidden': expandedBox !== 'routineSettings' }">
      <div class="flex justify-between mb-4 items-center"
        @click="expandedBox = expandedBox === 'routineSettings' ? null : 'routineSettings'">
        <h2 class="text-lg font-boldHeadline">
          <i class="fa-solid fa-dumbbell text-lg mr-4" />
          Routine Settings:
        </h2>
        <i class="fa-solid fa-chevron-up transition-all duration-300"
          :class="{ 'rotate-180': expandedBox === 'routineSettings', '': expandedBox !== 'routineSettings' }" />
      </div>
      <PlanRoutine :workout="workout" />
    </div> -->

    <div v-if="workout" class="flex flex-col mt-4 bg-white shadow-xl rounded-md p-4 overflow-scroll">
      <div class="flex justify-between my-4 items-center"
        @click="expandedBox = expandedBox === 'routineSettings' ? null : 'routineSettings'">
        <h2 class="text-lg font-boldHeadline">
          <i class="fa-solid fa-dumbbell text-lg mr-4" />
          Routine Settings:
        </h2>
        <i class="fa-solid fa-chevron-up transition-all duration-300"
          :class="{ 'rotate-180': expandedBox === 'routineSettings', '': expandedBox !== 'routineSettings' }" />
      </div>
      <div class="w-full wrapper grid" :class="expandedBox === 'routineSettings' ? 'is-open' : ''">
        <div class="inner">
          <PlanRoutine :workout="workout" />
        </div>
      </div>
    </div>

    <!--  -->
    <div v-else class="w-full h-full items-center justify-center pb-14 flex flex-col">
      <div class="w-full h-full items-center justify-center flex flex-col" v-if="createRoutine === false">
        <p class="w-full text-center">
          You haven't created a Routine for this plan yet, please create a routine for your client(s)
        </p>
        <button class="px-4 my-4 py-2 bg-primary text-white rounded-full" @click="createRoutineForPlan">Start
          Routine Creation</button>
      </div>
      <div v-else class="w-full h-full items-center justify-center flex flex-col">
        <label for="">Routine/Workout Name</label>
        <input type="text" class="bg-transparent border rounded-md pl-2 my-2 border-black w-5/ focus:outline-none"
          v-model="createWorkoutName">
        <button class="px-4 my-4 py-2 bg-primary text-white rounded-full" @click="saveRoutineNameAndCreate">Create
          Routine</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.wrapper {
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-out;
}

.wrapper.is-open {
  grid-template-rows: 1fr;
}

.inner {
  overflow: hidden;
}
</style>