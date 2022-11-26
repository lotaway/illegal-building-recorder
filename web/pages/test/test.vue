<template lang="pug">
    p 这是测试页面
</template>
<script lang="ts">
    import "babel-polyfill";
    import {Component, Vue, Prop} from "vue-property-decorator";

    @Component({name: "test"})
    export default class Test extends Vue {
        // render(h: CreateElement) {
        //     return h(this);
        // }
    }
</script>
<!--<script>
export default {
    name: "test"
}
</script>-->
<style scoped>
</style>