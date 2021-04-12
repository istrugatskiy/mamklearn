<template>
    <div class="title" id="title" style="top: 20%;">
        <h1 class="initTitle">MamkLearn</h1>
        <div>
            <div style="text-align: center; display: flex; align-items: center; justify-content: center;">
                <p class="pleaseLogin button buttonLikeTitle">Please login with your mamaroneck schools Google Account.</p>
            </div>
            <p id="loginError1" style="font-size: large; color: red; margin: 0px; padding: 0px;">{{ errorMsg }}</p>
            <div style="text-align: center; display: flex; align-items: center; justify-content: center;">
                <button class="button btn" id="loginBtn" @click="login()">
                    <img src="img/Google__G__Logo.svg" alt="Google Logo" width="30" height="30" />
                    Sign in with Google
                </button>
            </div>
            <p style="font-size: large; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">By signing in you agree to our terms of service and privacy policy.</p>
        </div>
        <div class="bottomBar">
            <ul class="titleTransitionBack">
                <li>
                    <a class="middle" href="javascript:void(0);" id="PrivacyPolicyLink" style="padding-top: 20px; padding-bottom: 0px;">Privacy Policy</a>
                </li>
            </ul>
            <ul class="titleTransitionBack">
                <li>
                    <a class="middle" href="javascript:void(0);" id="TermsOfServiceLink" style="padding-top: 20px; padding-bottom: 0px;">Terms of Service</a>
                </li>
            </ul>
            <ul class="titleTransitionBack">
                <li>
                    <a class="middle" href="javascript:void(0);" id="AboutLink" style="padding-top: 20px; padding-bottom: 0px;">About</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import firebase from 'firebase/app';



export default class Login extends Vue {
    created() {
        firebase.auth().useDeviceLanguage();
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                if (!user.email!.endsWith('mamkschools.org')) {
                    firebase.auth().signOut();
                    this.errorMsg = 'Please sign in with an account that ends in mamkschools.org';
                }
            }
        });
    }
    provider = new firebase.auth.GoogleAuthProvider();
    errorMsg = '';
    login() {
        firebase
            .auth()
            .signInWithPopup(this.provider)
            .catch(error => {
                this.errorMsg = `${error.code}: ${error.message}`;
            });
    }
}
</script>
