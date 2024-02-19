<template>
  <div id="map" style="width: 100%; height: 100%;" class="overflow-hidden"></div>
</template>

<script setup>
import { ref, onMounted, watchEffect, defineEmits, onUnmounted } from 'vue';
import mapboxgl from 'mapbox-gl';
import { useRoute } from 'vue-router';
import { Geolocation } from '@capacitor/geolocation';
import { registerPlugin } from '@capacitor/core'
import { App } from '@capacitor/app'

const props = defineProps(['tracking', 'route', 'isLoadedWorkout', 'workout']);
const emit = defineEmits(['start-tracking', 'stop-tracking', 'updateRouteData', 'updateTotalDistance']);
const vueRoute = useRoute();


const BackgroundGeolocation = registerPlugin("BackgroundGeolocation");
let gpsUpdateInterval = null;

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
  clearInterval(gpsUpdateInterval);
  const backgroundConfig = {
    // Your configuration here
    // distanceFilter: 5, // Update the location every 15 meters
    backgroundMessage: "Tracking GPS for map data"
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

    watchEffect(() => {
      if (props.tracking) {
        updateRoute();
      } else {
        // Stop tracking logic TODO
      }
    });

    // Update the route on the map
    updateMapRoute();
    recenterMapOnMarker();
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

  // // Update the route on the map
  // updateMapRoute();

  // Optionally, calculate and update distance if needed

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
  }
}


// Request location permission
async function requestLocationPermission() {
  const { state } = await Geolocation.requestPermissions();
  if (state === 'granted') {
    await getCurrentLocation();
  } else {
    // TODO
  }
}

async function updateRoute() {

  // Clear existing interval before setting a new one
  if (gpsUpdateInterval !== null) {
    clearInterval(gpsUpdateInterval);
    gpsUpdateInterval = null; // Reset the interval ID
  }

  // GPS interval
  gpsUpdateInterval = setInterval(async () => {
    if (props.tracking === true) {
      const coordinates = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = coordinates.coords;

      // Add the new coordinates to the route
      const newCoordinate = [longitude, latitude];
      props.route.geometry.coordinates.push(newCoordinate);


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
      //   }

      // }
    } else {
      clearInterval(gpsUpdateInterval);
      gpsUpdateInterval = null;
    }
  }, 3000); // Update every 6 seconds - trial this as might need to update!
}

function updateMapRoute() {

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
  }

  recenterMapOnMarker();
}

function recenterMapOnMarker() {
  if (map.value && marker.value) {
    // Use flyTo for a smooth transition
    map.value.flyTo({
      center: marker.value.getLngLat(),
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
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
  if (vueRoute.query.workout) {
    setTimeout(() => {
      const coordinates = props.workout.cardio_coords.coords[0]
      latitude.value = coordinates[1]
      longitude.value = coordinates[0]


      map.value = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude.value, latitude.value],
        zoom: zoom,
        ...mapOptions.value,
      });

      marker.value = new mapboxgl.Marker()
        .setLngLat([longitude.value, latitude.value])
        .addTo(map.value);
    }, 500)

    // watchEffect(() => {
    //   if (props.workout.cardio_coords) {
    //     const coordinates = props.workout.cardio_coords.coords[0]
    //     latitude.value = coordinates[1]
    //     longitude.value = coordinates[0]


    //     map.value = new mapboxgl.Map({
    //       container: 'map',
    //       style: 'mapbox://styles/mapbox/streets-v11',
    //       center: [longitude.value, latitude.value],
    //       zoom: zoom,
    //       ...mapOptions.value,
    //     });

    //     marker.value = new mapboxgl.Marker()
    //       .setLngLat([longitude.value, latitude.value])
    //       .addTo(map.value);

    //   } else {
    //     // Stop tracking logic TODO
    //   }
    // });


    setTimeout(() => {
      if (map.value && props.workout.cardio_coords.coords.length > 1) {
        if (!map.value.getSource('route')) {
          map.value.addSource('route', {
            type: 'geojson',
            data: {
              type: 'LineString',
              coordinates: props.workout.cardio_coords.coords
            },
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
          map.value.getSource('route').setData({ type: 'LineString', coordinates: props.workout.cardio_coords.coords.length.coords });
        }
      }
    }, 1000)
  } else {
    const coordinates = await Geolocation.getCurrentPosition();
    latitude.value = coordinates.coords.latitude;
    longitude.value = coordinates.coords.longitude;

    // Initialize the Mapbox map
    map.value = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude.value, latitude.value],
      zoom: zoom,
      ...mapOptions.value,
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
}




onMounted(() => {
  requestLocationPermission();
  getCurrentLocation();

  App.addListener('appStateChange', (state) => {
    if (!state.isActive && !vueRoute.query.workout) {
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


<!-- import UIKit
import CapacitorBackgroundRunner
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        
        BackgroundRunnerPlugin.registerBackgroundTask()
        BackgroundRunnerPlugin.handleApplicationDidFinishLaunching(launchOptions: launchOptions)
        
        return true
    }
    
    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
            // ....
            BackgroundRunnerPlugin.dispatchEvent(event: "remoteNotification", eventArgs: userInfo) { result in
                switch result {
                case .success:
                    completionHandler(.newData)
                case .failure:
                    completionHandler(.failed)
                }
            }
        } -->