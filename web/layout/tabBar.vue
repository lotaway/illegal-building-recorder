<template lang="pug">
    .component-tab-bar
        ul.list
            li.item(v-for="(i, index) in list", :class="(activeIndex === index ? 'active' : '')")
                a.link(@click="tabClickHandler(index)")
                    img.icon(v-show="activeIndex !== index", :src="i.iconNormalPath")
                    img.icon(v-show="activeIndex === index", :src="i.iconActivePath || i.iconNormalPath")
                    span.text {{i.title}}
</template>

<!--<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component({})
    export default class TabBar extends Vue {
        @Prop()
        private activeIndex!: Number;	//	激活的索引值
        @Prop()
        private list!: Array<any>;	//	选项卡列表

        //	点击事件
        private tabClickHandler(index: number) {
            location.href = this.list[index].link;
        }
    }
</script>-->
<script>
    export default {
        props: {
            activeIndex: {
                type: Number,
                isRequire: true
            },	//	激活的索引值
            list: {
                type: Array,
                isRequire: true
            }	//	选项卡列表
        },
        methods: {
            //	点击事件
            tabClickHandler(index) {
                location.href = this.list[index].link;
            }
        }
    }
</script>

<style scoped>
    .component-tab-bar {
        padding: 25px 0;
        min-height: 725.66px;
        background: #fff;
    }

    .list .item {
    }

    .list .item .link {
        display: block;
        padding: 15px 25px;
        cursor: pointer;
    }

    .list .item .link:hover {
        background: rgba(0, 0, 0, 0.1);
    }

    .link .icon,
    .link .text {
        display: inline-block;
        vertical-align: middle;
    }

    .link .icon {
        width: 40px;
        margin-right: 5px;
    }

    .link .text {
        font-size: 16px;
    }

    .active {
        color: #09bb07;
        background: rgba(9, 187, 7, 0.1);
    }
</style>