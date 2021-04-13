import './initFirebase';
import { createApp } from 'vue';
import App from './App.vue';
import './css/globals.css';
import './css/style.css';
import { initParticles } from './loadParticles';

// This is the vairable for handling the global state of the app
const app = createApp({
    provide: {
        globalVariable: 123,
    },
}).mount('#app');


console.log('%cUse link to get quiz answers:https://bit.ly/31Apj2U', 'font-size: 32px;');
