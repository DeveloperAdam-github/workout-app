<template>
  <div id="map" style="width: 100%; height: 100%;" class="overflow-hidden"></div>
</template>

<script setup>
import { ref, onMounted, watchEffect, defineEmits, onUnmounted } from 'vue';
import mapboxgl from 'mapbox-gl';
import { Geolocation } from '@capacitor/geolocation';
import { registerPlugin } from '@capacitor/core'
import { App } from '@capacitor/app'

const props = defineProps(['tracking', 'route']);
const emit = defineEmits(['start-tracking', 'stop-tracking', 'updateRouteData', 'updateTotalDistance']);

const BackgroundGeolocation = registerPlugin("BackgroundGeolocation");
const accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
let latitude = ref(0);
let longitude = ref(0);
let map = ref(null); // Declare map in the outer scope
const marker = ref(null);
mapboxgl.accessToken = accessToken;
const zoom = 15; // Default zoom level
const totalDistance = ref(0);
let watcherId = null;

const mapOptions = ref({
  // Customize map options as needed
  // You can add other Mapbox GL JS options here
  // For example, to hide the compass control:
  // showCompass: false,
});

const backgroundConfig = {
  //  Configure options for the background plugin here, desiredAccuracy, DistanceFilter etc
}

async function startBackgroundTracking() {
  const backgroundConfig = {
    // Your configuration here
    distanceFilter: 15, // Update the location every 15 meters
  };

  watcherId = await BackgroundGeolocation.addWatcher(backgroundConfig, (location) => {
    console.log('New location:', location);
    // Handle the location update
    updateLocation(location);
  });
}

function stopBackgroundTracking() {
  if (watcherId !== null) {
    BackgroundGeolocation.removeWatcher({ id: watcherId });
    watcherId = null;
  }
}

function updateLocation(location) {
  const { latitude, longitude } = location;

  // Add the new coordinates to the route
  const newCoordinate = [longitude, latitude];
  props.route.geometry.coordinates.push(newCoordinate);

  // Update the marker's position on the map
  if (marker.value) {
    marker.value.setLngLat(newCoordinate);
  }

  // Update the route on the map
  updateMapRoute();

  // Optionally, calculate and update distance if needed
}


// Request location permission
async function requestLocationPermission() {
  const { state } = await Geolocation.requestPermissions();
  if (state === 'granted') {
    await getCurrentLocation();
    // console.log('granted');
  } else {
    // TODO
  }
}

async function updateRoute() {
  console.log('updte Route');

  // GPS interval
  const gpsUpdateInterval = setInterval(async () => {
    // console.log('interval?');
    // console.log(props.tracking, 'whats tracking?');
    if (props.tracking === true) {
      const coordinates = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = coordinates.coords;

      // Add the new coordinates to the route
      const newCoordinate = [longitude, latitude];
      props.route.geometry.coordinates.push(newCoordinate);

      // console.log('newCoordinate', newCoordinate);

      // Emit the updated route data back to the parent component
      emit('updateRouteData', props.route);

      // Update the marker's position on the map
      if (marker.value) {
        marker.value.setLngLat(newCoordinate);
      }

      updateMapRoute();

      // MOVED TO ABOVE
      // // Update the line on the map only when tracking is active
      // if (map.value && props.route.geometry.coordinates.length > 1) {
      //   // Add a source for the route line if it doesn't exist
      //   if (!map.value.getSource('route')) {
      //     map.value.addSource('route', {
      //       type: 'geojson',
      //       data: props.route.geometry,
      //     });

      //     // Add a layer for the route line
      //     map.value.addLayer({
      //       id: 'route',
      //       type: 'line',
      //       source: 'route',
      //       paint: {
      //         'line-color': '#bbf246',
      //         'line-width': 4,
      //       },
      //     });
      //   } else {
      //     // Update the existing line source
      //     map.value.getSource('route').setData(props.route.geometry);
      //   }

      //   if (props.route.geometry.coordinates.length >= 2) {
      //     const lastIndex = props.route.geometry.coordinates.length - 1;
      //     const prevCoordinate = props.route.geometry.coordinates[lastIndex - 1];
      //     const currentCoordinate = props.route.geometry.coordinates[lastIndex];
      //     const distance = calculateDistance(
      //       prevCoordinate[1], // Latitude of the previous coordinate
      //       prevCoordinate[0], // Longitude of the previous coordinate
      //       currentCoordinate[1], // Latitude of the current coordinate
      //       currentCoordinate[0] // Longitude of the current coordinate
      //     );

      //     // Add the calculated distance to the total distance
      //     totalDistance.value += distance;

      //     // Emit the total distance to the parent component
      //     emit('updateTotalDistance', totalDistance.value);

      //     // Log or display the calculated distance
      //     console.log(`Distance: ${distance} km`);
      //     console.log(`Total Distance: ${totalDistance.value} km`);
      //   }

      // }
    } else {
      clearInterval(gpsUpdateInterval);
    }
  }, 15000); // Update every 15 seconds - trial this as might need to update!
}

function updateMapRoute() {
  console.log('updating map ....... 🔥');
  if (map.value && props.route.geometry.coordinates.length > 1) {
    // Ensure the map source for the route exists, or create it
    if (!map.value.getSource('route')) {
      map.value.addSource('route', {
        type: 'geojson',
        data: props.route.geometry,
      });

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
  } else {
    console.log('no map found is that why?');
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
    // console.log(`Distance: ${distance} km`);
    // console.log(`Total Distance: ${totalDistance.value} km`);
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
  // console.log(coordinates, 'whats in here for co-ords');
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

  App.addListener('appStateChange', (state) => {
    if (!state.isActive) {
      // App has moved to the background, start background tracking
      startBackgroundTracking();
    } else {
      // App has returned to the foreground, stop background tracking
      stopBackgroundTracking();
    }
  });
});

onUnmounted(() => {
  // Clean up listener when component is destroyed
  App.removeAllListeners('appStateChange');
});
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
  border-radius: 8px;
}
</style>
