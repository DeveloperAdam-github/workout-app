// src/utils/preferences.js
import { Preferences } from '@capacitor/preferences';

export const saveWorkoutToPreferences = async (key, workout) => {
  await Preferences.set({
    key: key,
    value: JSON.stringify(workout),
  });
};

export const getWorkoutFromPreferences = async (key) => {
  const { value } = await Preferences.get({ key });
  return JSON.parse(value);
};

export const removeWorkoutFromPreferences = async (key) => {
  await Preferences.remove({ key });
};

export const saveCardioToPreferences = async (key, cardio) => {
  await Preferences.set({
    key: key,
    value: JSON.stringify(cardio),
  });
};

export const getCardioFromPreferences = async (key) => {
  const { value } = await Preferences.get({ key });
  return JSON.parse(value);
};

export const removeCardioFromPreferences = async (key) => {
  await Preferences.remove({ key });
};

async function logStoredPreferences() {
  const { keys } = await Preferences.keys();
  console.log('Stored keys:', keys);
  keys.forEach(async (key) => {
    const { value } = await Preferences.get({ key });
    console.log(`Key: ${key}, Value: ${value}`);
  });
}