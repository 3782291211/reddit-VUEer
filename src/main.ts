import './assets/css/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faArrowAltCircleLeft, faArrowAltCircleRight, faChevronCircleLeft, faChevronCircleRight, faCircleArrowLeft, faCircleNotch, faHeartMusicCameraBolt, faMagnifyingGlass, faPauseCircle, faPlayCircle, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
/* add icons to the library */
library.add(faMagnifyingGlass, faSpinner, faUser, faHeartMusicCameraBolt, faChevronCircleLeft, faChevronCircleRight, faPauseCircle, faPlayCircle, faCircleNotch);

const app = createApp(App)
.component('font-awesome-icon', FontAwesomeIcon);

app.use(router);

app.mount('#app');
