import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import WorkoutView from '../views/WorkoutView.vue';
import StatsView from '../views/StatsView.vue';
import SettingsView from '../views/SettingsView.vue';
import NewWorkoutView from '../views/NewWorkoutView.vue';
import NewCardioView from '../views/NewCardioView.vue';
import AddNewWorkout from '../views/AddNewWorkout.vue';
import PreBuiltWorkout from '../views/PreBuiltWorkout.vue';
import SuccessView from '../views/SuccessView.vue';
import SignupSuccessView from '../views/SignupSuccessView.vue';
import ConnectSuccessView from '../views/ConnectSuccessView.vue';
import EditPlanView from '../views/EditPlanView.vue';

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
    {
      path: '/new-cardio',
      name: 'newCardio',
      component: NewCardioView,
    },
    {
      path: '/workout-view',
      name: 'workoutView',
      component: PreBuiltWorkout,
    },
    //  just for testing shit for now
    {
      path: '/success/:id',
      name: 'success',
      component: SuccessView
    },
    {
      path: '/connect-success/:id',
      name: 'connectSuccess',
      component: ConnectSuccessView
    },
    {
      path: '/signup-success',
      name: 'signup-sucess',
      component: SignupSuccessView
    },
    {
      path: '/edit-plan/:id',
      name: 'editPlan',
      component: EditPlanView
    }
  ],
});

export default router;
