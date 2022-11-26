import Vue from "vue";
import page from "./missionRecordDetail.vue";

const vue = new Vue({
    el: "#container-view",
    render: h => h(page)
});