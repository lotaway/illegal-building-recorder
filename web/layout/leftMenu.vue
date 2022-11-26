<template lang="pug">
    .container-menu-content.clearf
        .title
            h5 {{title}}
        .menu
            slot(name="menu")
        .content
            slot(name="content")
</template>

<script>
    import {cn} from "../../appConfig/cn";

    export default {
        name: "leftMenu",
        props: {
            title: {
                type: String,
                default: cn.user.welcomeTitle
            }
        }
    }
</script>

<style scoped>
    .container-menu-content {
        position: relative;
        margin: 25px auto;
        padding: 45px 25px 100px;
        border-radius: 40px;
        width: 1100px;
        background: #f7f7f7;
        box-shadow: 1px 2px 10px #ddd;
    }

    .container-menu-content .title {
        font-size: 30px;
        margin-bottom: 45px;
        text-align: center;
        color: #333;
    }

    .container-menu-content .menu {
        float: left;
        width: 280px;
        border-radius: 4px;
        box-shadow: 1px 2px 2px #eee;
    }

    .container-menu-content .content {
        width: 800px;
        margin-left: 300px;
        border-radius: 4px;
        background: #fff;
        box-shadow: 1px 2px 2px #eee;
    }
</style>