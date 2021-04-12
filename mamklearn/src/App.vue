<template>
    <div id="particles-js"></div>
    <Home v-if="isLoggedIn" />
    <Login v-if="!isLoggedIn" />
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
                    this.isLoggedIn = true;
                }
            }
        });
    }
    isLoggedIn: boolean = false;
}
</script>
