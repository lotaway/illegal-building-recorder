import Vue from "vue";
import page from "./user.vue";

const vue = new Vue({
    // el: "#page-user",
    el: "#container-view",
    render: h => h(page)
});