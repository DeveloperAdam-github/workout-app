<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { Plugins } from '@capacitor/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import supabase from '../supabase';
const { DistancePlugin, ProfilePicture } = Plugins;

const store = useUserStore();
const user = ref(store.user);
const steps = ref('');
const imageData = ref('');
const totalWorkouts = ref('');
const profilePicURL = ref('');
const profilePicExists = ref('');
const enteredName = ref('What should we call you?');
const editEnteredName = ref(false);

const workouts = ref('');

const getDailySteps = async () => {
  let data = await DistancePlugin.getTodaySteps();

  steps.value = data;
};

const getTotalWorkoutCount = async () => {
  const { count, error } = await supabase
    .from('workouts')
    .select('*', { count: 'exact', head: true })
    .eq('user', user.value.id)
    .eq('is_routine', false);

  if (error) {
  } else {
    totalWorkouts.value = count;
  }
};

// if (typeof window.capacitor !== 'undefined') {
const getDistance = async () => {
  let result = await DistancePlugin.authorize();
  // let data = await DistancePlugin.getDistance({ startDate: '2022/07/01' });
  let workoutsFromIOS = await DistancePlugin.getWorkouts();

  workouts.value = workoutsFromIOS;
};

const openCamera = async () => {
  const image = await Camera.getPhoto({
    quality: 100,
    allowEditing: true,
    resultType: CameraResultType.Base64,
  });

  const base64Data = image.base64String;
  const fileName = `image-${user.value.id}.png`;

  const binaryData = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(binaryData.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: 'image/png' });

  const { err } = await supabase.storage
    .from('avatars')
    .remove(`public/image-${user.value.id}.png`);

  profilePicURL.value = null;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`public/${fileName}`, blob);

  if (error) {
  } else {
    getProfilePicture();
    checkLinkExists();
  }
};

const getProfilePicture = async () => {
  const { data, error } = await supabase.storage
    .from('avatars')
    .getPublicUrl(`public/image-${user.value.id}.png`);

  const avatarUrl = data.publicUrl;

  const imgUrl = `${avatarUrl}?_t=${Date.now()}`;

  profilePicURL.value = imgUrl;
};

const checkLinkExists = async () => {
  try {
    const response = await fetch(
      `https://papqpygzqwwtbveqlnfm.supabase.co/storage/v1/object/public/avatars/public/image-${user.value.id}.png`,
      {
        method: 'HEAD',
      }
    );
    profilePicExists.value = response.status;
  } catch (error) {
    return false;
  }
};

const dynamicProfilePic = computed(() => {
  return profilePicURL.value;
});

const addNameToUserDetails = async () => {
  await supabase
    .from('users')
    .insert({
      name: user.value.id,
    })
    .eq('id', user.value.id)
    .select()
    .then((response) => {
      console.log(response);
    });
};

const createDynamicIslandScene = () => {
  // Create a new view controller with a simple label
  const label = UILabel(frame: CGRect(x: 0, y: 0, width: 200, height: 100));
  label.text = "Hello, Dynamic Island!";
  label.center = CGPoint(x: 100, y: 100);
  const viewController = UIViewController();
  viewController.view.addSubview(label);

  // Create a new scene configuration and request activation of the scene session
  const sceneConfiguration = UISceneConfiguration('com.yourcompany.yourapp.DynamicIslandScene', 'Dynamic Island', 'UIWindowSceneSessionRoleApplication');
  const dynamicIslandScene = UIApplication.sharedApplication().requestSceneSessionActivation(nil, sceneConfiguration, nil, (error) => {
    console.error('Error creating dynamic island scene:', error);
  });

  // Set the view controller's view as the root view of the scene's window
  dynamicIslandScene.window.rootViewController = viewController;
};

App.addListener('resume', createDynamicIslandScene);

onMounted(() => {
  getDailySteps();
  getTotalWorkoutCount();
  getProfilePicture();
  checkLinkExists();
});
// }
</script>

<template>
  <div class="w-full h-full flex flex-col bg-gray-200">
    <div class="w-full flex">
      <div
        class="h-[14.5rem] w-full bg-primary flex items-center p-8 pt-14 text-white relative"
      >
        <div class="w-2/3 h-full">
          <h1
            class="font-boldHeadline"
            :class="totalWorkouts > 99 ? 'text-8xl' : 'text-9xl'"
          >
            {{ totalWorkouts }}
          </h1>
        </div>
        <div class="w-1/3 flex flex-col h-full pt-2">
          <p
            v-if="totalWorkouts <= 1"
            class="uppercase text-gray-400 text-xs font-boldHeadline"
          >
            workout
          </p>
          <p v-else class="uppercase text-gray-400 text-xs font-boldHeadline">
            workouts
          </p>
          <p class="uppercase text-white text-xs font-boldHeadline">
            completed
          </p>
        </div>
        <p
          class="absolute left-5 bottom-1 text-sm font-boldHeadline"
          v-if="steps"
        >
          {{ Number(steps.totalSteps.toFixed()) }} steps today
        </p>
        <div
          v-if="profilePicExists === 404"
          @click="openCamera"
          class="absolute h-24 w-24 rounded-full bg-primary right-8 -bottom-12 border-gray-200 border-4 flex items-center justify-center"
        >
          <i class="fa-solid fa-camera text-2xl"></i>
        </div>
        <div
          v-else
          class="absolute h-24 w-24 rounded-full bg-primary right-8 -bottom-12 border-gray-200 border-4 flex items-center justify-center"
        >
          <img
            v-if="profilePicURL && profilePicExists !== 404"
            :src="dynamicProfilePic"
            @click="openCamera"
            class="h-20 w-20 object-cover rounded-full"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="w-full flex flex-col p-4 text-black">
      <div class="">
        <p class="font-boldHeadline text-lg">How you doing today?</p>
      </div>
      <!-- <div class="">
        <p v-if="user.name">
          Homer Simpson <i class="fa-solid fa-pencil ml-4"></i>
        </p>
        <div v-else>
          <input type="text" v-model="enteredName" />
          <i class="fa-solid fa-pencil ml-4"></i>
        </div>
      </div> -->
    </div>
    <form class="w-full text-black font-bold flex flex-col p-4">
      <input type="text" placeholder="name" />
      <input type="text" placeholder="name" />
      <input type="text" placeholder="name" />
      <input type="text" placeholder="name" />
    </form>
  </div>
</template>
