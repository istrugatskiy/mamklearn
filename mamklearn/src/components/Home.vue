<template>
    <div class="title" id="title" style="top: 15%; height: 800px;">
        <h1 class="titleTransitionBack" id="homeText">Home</h1>
        <div class="button titleTransitionBack" id="charCustomize" tabindex="0">
            <p class="notifyTextChar" id="tapToCustom">Tap to customize...</p>
            <div id="stableBody">
                <Character :characterConfig="currentCharacterConfig" />
            </div>
            <p class="notifyTextChar" id="customType">
                <a class="arrow left" href="javascript:void(0)"> </a>
                <a href="javascript:void(0)" id="customButtonChange" @click="incrementSelector()">{{ currentSelectorText }}</a>
                <a class="arrow right" href="javascript:void(0)"> </a>
            </p>
            <img alt="Tap to change button..." width="195" height="90" src="img/tapToChange.png" style="cursor: pointer; pointer-events: all;" />
        </div>

        <br />
        <button class="button titleTransitionBack" id="makebtn">Make</button>
        <button class="button titleTransitionBack">Play</button>
        <div class="link-background titleTransitionBack">
            <ul>
                <li>
                    <a class="middle" href="javascript:void(0);" style="padding-top: 20px; padding-bottom: 0px;" @click="signOut()">Sign out</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Options } from 'vue-class-component';
import Character from './Character.vue';
import firebase from 'firebase/app';

let userObject: firebase.database.Reference;

@Options({
    components: {
        Character,
    },
})
export default class Home extends Vue {
    created() {
        userObject = firebase
            .database()
            .ref()
            .child('userProfiles')
            .child(firebase.auth().currentUser!.uid);
        userObject.on(
            'value',
            snap => {
                if (firebase.auth().currentUser) {
                    if (snap.val()) {
                        this.currentCharacterConfig = snap.val().charConfig;
                    } else {
                        userObject.set({
                            charConfig: {
                                0: 0,
                                1: 0,
                                2: 0,
                                3: 0,
                                4: 0,
                            },
                        });
                    }
                }
            },
            error => {
                console.log(error.message);
            }
        );
    }
    private characterConfig: string[] = ['Eyes', 'Nose', 'Mouth', 'Shirt', 'Arms'];
    private currentSelector: number = 0;
    currentSelectorText: string = 'Eyes';
    currentCharacterConfig: number[] = [0, 0, 0, 0, 0];
    incrementSelector() {
        this.currentSelector = this.currentSelector > 3 ? 0 : this.currentSelector + 1;
        this.currentSelectorText = this.characterConfig[this.currentSelector];
    }
    signOut() {
        firebase.auth().signOut().then(() => {
            window.location.reload();
        })
    }
}
</script>
