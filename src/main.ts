import './assets/css/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faChevronCircleLeft, faChevronCircleRight, faCircleNotch, faHeartMusicCameraBolt, faMagnifyingGlass, faPauseCircle, faPlayCircle, faSpinner, faUser, faCommenting, faFileCirclePlus, faFaceFlushed } from '@fortawesome/free-solid-svg-icons';
/* add icons to the library */
library.add(faMagnifyingGlass, faSpinner, faUser, faHeartMusicCameraBolt, faChevronCircleLeft, faChevronCircleRight, faPauseCircle, faPlayCircle, faCircleNotch, faCommenting, faFileCirclePlus, faFaceFlushed);

const app = createApp(App)
.component('font-awesome-icon', FontAwesomeIcon);

app.use(router);

app.mount('#app');
