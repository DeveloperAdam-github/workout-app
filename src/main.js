import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Vue3TouchEvents from 'vue3-touch-events';
import * as Sentry from '@sentry/vue';

import App from './App.vue';
import router from './router';

import './assets/main.css';
import './assets/tailwind.css';

const app = createApp(App);

Sentry.init({
  dsn: "https://52cf0c393e7cc78fe1a7afb6d7346a39@o4506774047686656.ingest.sentry.io/4506774050308096",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});


app.use(createPinia());
app.use(router);
app.use(Vue3TouchEvents);

app.mount('#app');
