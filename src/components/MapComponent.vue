<template>
  <div id="map" style="width: 100%; height: 100%;" class="overflow-hidden"></div>
</template>

<script setup>
import { ref, onMounted, watchEffect, defineEmits } from 'vue';
import mapboxgl from 'mapbox-gl';
import { Geolocation } from '@capacitor/geolocation';
import { BackgroundTask } from '@capacitor/core'

const props = defineProps(['tracking', 'route']);
const emit = defineEmits(['start-tracking', 'stop-tracking', 'updateRouteData', 'updateTotalDistance']);

const accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
let latitude = ref(0);
let longitude = ref(0);
let map = ref(null); // Declare map in the outer scope
const marker = ref(null);
mapboxgl.accessToken = accessToken;
const zoom = 15; // Default zoom level
const totalDistance = ref(0);

const mapOptions = ref({
  // Customize map options as needed
  // You can add other Mapbox GL JS options here
  // For example, to hide the compass control:
  // showCompass: false,
});


// Request location permission
async function requestLocationPermission() {
  const { state } = await Geolocation.requestPermissions();
  if (state === 'granted') {
    await getCurrentLocation();
    console.log('granted');
  } else {
    // TODO
  }
}

async function updateRoute() {
  console.log('updte Route');

  // GPS interval
  const gpsUpdateInterval = setInterval(async () => {
    console.log('interval?');
    console.log(props.tracking, 'whats tracking?');
    if (props.tracking === true) {
      const coordinates = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = coordinates.coords;

      // Add the new coordinates to the route
      const newCoordinate = [longitude, latitude];
      props.route.geometry.coordinates.push(newCoordinate);

      console.log('newCoordinate', newCoordinate);

      // Emit the updated route data back to the parent component
      emit('updateRouteData', props.route);

      // Update the marker's position on the map
      if (marker.value) {
        marker.value.setLngLat(newCoordinate);
      }

      // Update the line on the map only when tracking is active
      if (map.value && props.route.geometry.coordinates.length > 1) {
        // Add a source for the route line if it doesn't exist
        if (!map.value.getSource('route')) {
          map.value.addSource('route', {
            type: 'geojson',
            data: props.route.geometry,
          });

          // Add a layer for the route line
          map.value.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': '#bbf246',
              'line-width': 4,
            },
          });
        } else {
          // Update the existing line source
          map.value.getSource('route').setData(props.route.geometry);
        }

        if (props.route.geometry.coordinates.length >= 2) {
          const lastIndex = props.route.geometry.coordinates.length - 1;
          const prevCoordinate = props.route.geometry.coordinates[lastIndex - 1];
          const currentCoordinate = props.route.geometry.coordinates[lastIndex];
          const distance = calculateDistance(
            prevCoordinate[1], // Latitude of the previous coordinate
            prevCoordinate[0], // Longitude of the previous coordinate
            currentCoordinate[1], // Latitude of the current coordinate
            currentCoordinate[0] // Longitude of the current coordinate
          );

          // Add the calculated distance to the total distance
          totalDistance.value += distance;

          // Emit the total distance to the parent component
          emit('updateTotalDistance', totalDistance.value);

          // Log or display the calculated distance
          console.log(`Distance: ${distance} km`);
          console.log(`Total Distance: ${totalDistance.value} km`);
        }

      }
    } else {
      clearInterval(gpsUpdateInterval);
    }
  }, 15000); // Update every 15 seconds - trial this as might need to update!
}

// TEST THIS ON MOBILE
async function startBackgroundTask() {
  try {
    await BackgroundTask.register({
      taskId: 'updateRouteTask',
      taskName: 'Update Route',
      async taskHandler() {
        console.log('Background task running...');
        await updateRoute();
      },
      period: 15000, // Run every 15 seconds
    });
  } catch (error) {
    console.error('Error starting background task:', error);
  }
}
// Function to end background task
async function endBackgroundTask() {
  try {
    await BackgroundTask.cancel({ taskId: 'updateRouteTask' });
    console.log('Background task ended.');
  } catch (error) {
    console.error('Error ending background task:', error);
  }
}

// Import the Haversine formula function
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers // TODO mke it a variable so can use Miles or KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers (for now)
  return distance;
}

async function getCurrentLocation() {
  const coordinates = await Geolocation.getCurrentPosition();
  console.log(coordinates, 'whats in here for co-ords');
  latitude.value = coordinates.coords.latitude;
  longitude.value = coordinates.coords.longitude;

  // Initialize the Mapbox map
  map.value = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [longitude.value, latitude.value],
    zoom: zoom,
    ...mapOptions.value, // Apply custom map options
  });

  marker.value = new mapboxgl.Marker()
    .setLngLat([longitude.value, latitude.value])
    .addTo(map.value);

  watchEffect(() => {
    if (props.tracking) {
      updateRoute();
    } else {
      // Stop tracking logic TODO
    }
  });
}




onMounted(() => {
  requestLocationPermission();
  getCurrentLocation();
});
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
  border-radius: 8px;
}
</style>
