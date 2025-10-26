import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/index.js';
import './styles/index.css';
import './styles/app.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
