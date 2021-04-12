<template>
    <div id="particles-js"></div>
    <Home v-if="currentAppState == 'home'" />
    <Login v-if="currentAppState == 'login'" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import firebase from 'firebase/app';

@Options({
    components: {
        Home,
        Login,
    },
})
export default class App extends Vue {
    created() {
        firebase.auth().onAuthStateChanged(user => {
            document.getElementById('mainLoader')!.classList.remove('loader--active');
            if (user) {
                if (user.email!.endsWith('mamkschools.org')) {
                    this.currentAppState = 'home';
                }
            }
        });
    }
    currentAppState: string = 'login';
}
</script>
