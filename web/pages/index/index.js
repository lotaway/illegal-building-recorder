import Vue from "vue";
import page from './index.vue';

const vue = new Vue({
    el: "#container-view",
    render: h => h(page)
});