import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import WorkoutView from '../views/WorkoutView.vue';
import StatsView from '../views/StatsView.vue';
import SettingsView from '../views/SettingsView.vue';
import NewWorkoutView from '../views/NewWorkoutView.vue';
import AddNewWorkout from '../views/AddNewWorkout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/workout',
      name: 'workout',
      component: WorkoutView,
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/add-workout',
      name: 'addWorkout',
      component: AddNewWorkout,
    },
    {
      path: '/new-workout',
      name: 'newWorkout',
      component: NewWorkoutView,
    },
  ],
});

export default router;
