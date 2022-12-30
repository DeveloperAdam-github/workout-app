import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const usePopularWorkoutStore = defineStore('popularWorkouts', () => {
  const popularWorkouts = ref([
    {
      name: 'Lower Body Workout',
      exercises: [
        {
          name: 'Barbell Squats',
          sets: [
            { weight: 70, reps: 10 },
            { weight: 70, reps: 10 },
            { weight: 70, reps: 10 },
          ],
        },
        {
          name: 'Stiff Legged Deadlifts',
          sets: [
            { weight: 50, reps: 10 },
            { weight: 50, reps: 10 },
          ],
        },
        {
          name: 'Leg Extensions',
          sets: [
            { weight: 40, reps: 6 },
            { weight: 40, reps: 6 },
            { weight: 40, reps: 6 },
          ],
        },
        {
          name: 'Leg Press',
          sets: [
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
          ],
        },
      ],
      time: '50 Min',
      calories: '300',
      difficulty: 'Medium',
      tags: ['lower', 'legs', 'squats'],
    },
    {
      name: 'Full Body Workout HARD',
      exercises: [
        {
          name: 'Squats',
          sets: [
            { weight: 120, reps: 5 },
            { weight: 120, reps: 5 },
            { weight: 120, reps: 5 },
          ],
        },
        {
          name: 'Bench Press',
          sets: [
            { weight: 80, reps: 8 },
            { weight: 80, reps: 8 },
            { weight: 80, reps: 8 },
            { weight: 80, reps: 8 },
            { weight: 80, reps: 8 },
          ],
        },
        {
          name: 'Barbell Rows',
          sets: [
            { weight: 70, reps: 12 },
            { weight: 70, reps: 12 },
            { weight: 70, reps: 12 },
            { weight: 70, reps: 12 },
            { weight: 70, reps: 12 },
          ],
        },
        {
          name: 'Deadlifts',
          sets: [
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
          ],
        },
        {
          name: 'Bicep Curls',
          sets: [
            { weight: 12, reps: 10 },
            { weight: 12, reps: 10 },
            { weight: 12, reps: 10 },
          ],
        },
        {
          name: 'Tricep Rope Pushdowns',
          sets: [
            { weight: 15, reps: 10 },
            { weight: 15, reps: 10 },
            { weight: 15, reps: 10 },
          ],
        },
      ],
      time: '80 Min',
      calories: '730',
      difficulty: 'Medium',
      tags: ['full body'],
    },
    {
      name: 'Lower Body Workout',
      exercises: [
        {
          name: 'Barbell Squats',
          sets: [
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
          ],
        },
        {
          name: 'Stiff Legged Deadlifts',
          sets: [
            { weight: 50, reps: 10 },
            { weight: 50, reps: 10 },
            { weight: 50, reps: 10 },
            { weight: 50, reps: 10 },
            { weight: 50, reps: 10 },
          ],
        },
        {
          name: 'Leg Extensions',
          sets: [
            { weight: 40, reps: 6 },
            { weight: 40, reps: 6 },
            { weight: 40, reps: 6 },
            { weight: 40, reps: 6 },
            { weight: 40, reps: 6 },
          ],
        },
        {
          name: 'Leg Press',
          sets: [
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
          ],
        },
        {
          name: 'Walking Lunges',
          sets: [
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
          ],
        },
      ],
      time: '60 Min',
      calories: '800',
      difficulty: 'Hard',
      tags: ['lower', 'legs', 'squats'],
    },
    {
      name: 'Upper Body Workout',
      exercises: [
        {
          name: 'Barbell Bench Press',
          sets: [
            { weight: 70, reps: 10 },
            { weight: 70, reps: 10 },
            { weight: 70, reps: 10 },
            { weight: 70, reps: 10 },
            { weight: 70, reps: 10 },
          ],
        },
        {
          name: 'Incline Dumbbell Press',
          sets: [
            { weight: 30, reps: 8 },
            { weight: 30, reps: 8 },
            { weight: 30, reps: 8 },
            { weight: 30, reps: 8 },
            { weight: 30, reps: 8 },
          ],
        },
        {
          name: 'Tricep Pushdowns',
          sets: [
            { weight: 40, reps: 12 },
            { weight: 40, reps: 12 },
            { weight: 40, reps: 12 },
            { weight: 40, reps: 12 },
            { weight: 40, reps: 12 },
          ],
        },
        {
          name: 'Face Pulls',
          sets: [
            { weight: 20, reps: 10 },
            { weight: 20, reps: 10 },
            { weight: 20, reps: 10 },
            { weight: 20, reps: 10 },
            { weight: 20, reps: 10 },
          ],
        },
      ],
      time: '55 Min',
      calories: '350',
      difficulty: 'Medium',
      tags: ['chest', 'upper', 'bench'],
    },
    {
      name: 'Full Body Workout',
      exercises: [
        {
          name: 'Squats',
          sets: [
            { weight: 120, reps: 5 },
            { weight: 120, reps: 5 },
            { weight: 120, reps: 5 },
          ],
        },
        {
          name: 'Bench Press',
          sets: [
            { weight: 80, reps: 8 },
            { weight: 80, reps: 8 },
            { weight: 80, reps: 8 },
            { weight: 80, reps: 8 },
            { weight: 80, reps: 8 },
          ],
        },
        {
          name: 'Barbell Rows',
          sets: [
            { weight: 70, reps: 12 },
            { weight: 70, reps: 12 },
            { weight: 70, reps: 12 },
            { weight: 70, reps: 12 },
            { weight: 70, reps: 12 },
          ],
        },
        {
          name: 'Deadlifts',
          sets: [
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
            { weight: 100, reps: 10 },
          ],
        },
        {
          name: 'Bicep Curls',
          sets: [
            { weight: 12, reps: 10 },
            { weight: 12, reps: 10 },
            { weight: 12, reps: 10 },
          ],
        },
        {
          name: 'Tricep Rope Pushdowns',
          sets: [
            { weight: 15, reps: 10 },
            { weight: 15, reps: 10 },
            { weight: 15, reps: 10 },
          ],
        },
      ],
      time: '80 Min',
      calories: '730',
      difficulty: 'Medium',
      tags: ['full body'],
    },
  ]);

  return { popularWorkouts };
});
