import Vue from "vue";
import page from "./add.vue";

const add = new Vue({
    el: "#container-view",
    render: h => h(page)
});