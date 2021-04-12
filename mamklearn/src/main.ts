import './initFirebase';
import { createApp } from 'vue';
import App from './App.vue';
import './css/globals.css';
import './css/style.css';
import { initParticles } from './loadParticles';
import { store } from './store';

createApp(App).use(store);
createApp(App).mount('#app');
initParticles();

console.log('%cUse link to get quiz answers:https://bit.ly/31Apj2U', 'font-size: 32px;');
