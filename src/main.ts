import './assets/css/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { fas } from '@fortawesome/free-solid-svg-icons';
/* add icons to the library */
library.add(fas);

const app = createApp(App)
.component('font-awesome-icon', FontAwesomeIcon);

app.use(router);
app.use(VueVideoPlayer);

app.mount('#app');
