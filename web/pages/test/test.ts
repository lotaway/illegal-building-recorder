import Vue from "vue";
import page from "./test.vue";

const test = new Vue({
    el: "#container-view",
    render: h => h(page)
});