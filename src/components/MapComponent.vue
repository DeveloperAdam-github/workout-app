<template>
  <div id="map" style="width: 100%; height: 100%;" class="overflow-hidden"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import mapboxgl from 'mapbox-gl';

// Replace 'YOUR_MAPBOX_ACCESS_TOKEN' with your actual Mapbox access token
const accessToken = import.meta.env.VITE_MAPBOX_API_KEY
const center = [-74.044502, 40.689247]; // Default center coordinates
const zoom = 15; // Default zoom level

const mapOptions = ref({
  // Customize map options as needed
  // You can add other Mapbox GL JS options here
  // For example, to hide the compass control:
  // showCompass: false,
});

onMounted(() => {
  mapboxgl.accessToken = accessToken;

  // Initialize the Mapbox map
  const map = new mapboxgl.Map({
    container: 'map', // Element ID where the map will be displayed
    style: 'mapbox://styles/mapbox/streets-v11', // Mapbox style URL
    center: center,
    zoom: zoom,
    ...mapOptions.value, // Apply custom map options
  });

  // Add a marker
  // new mapboxgl.Marker()
  //   .setLngLat(center)
  //   .addTo(map);

  // You can add your route drawing logic here using Mapbox GL JS features
});
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
