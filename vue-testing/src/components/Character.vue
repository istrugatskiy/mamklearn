<template>
    <img alt="character eyes" v-bind:src="`img/eyes-${characterConfig[0]}.png`" style="position: absolute;" width="250" height="337" />
    <img alt="character nose" v-bind:src="`img/nose-${characterConfig[1]}.png`" style="position: absolute;" width="250" height="337" />
    <img alt="character mouth" v-bind:src="`img/mouth-${characterConfig[2]}.png`" style="position: absolute;" width="250" height="337" />
    <img alt="character shirt" v-bind:src="`img/shirt-${characterConfig[3]}.png`" style="position: absolute;" width="250" height="337" />
    <img alt="character arms" v-bind:src="`img/arms-${characterConfig[4]}.png`" style="position: absolute;" width="250" height="337" />
    <img alt="character profile picture" src="img/base.png" width="250" height="337" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {
        characterConfig: Array,
    },
})
export default class Character extends Vue {
    characterConfig: number[] = [0, 0, 0, 0, 0];
}
</script>