<template lang="pug">
    .weui-actionsheet-container(v-show="isShow")
        .weui-mask(@click="clickMask")
        .weui-actionsheet(:class="isShow ? 'weui-actionsheet_toggle' : ''")
            .weui-actionsheet__title
                p.weui-actionsheet__title-text {{title}}
            .weui-actionsheet__menu
                .weui-actionsheet__cell(v-for="(m, index) in menu", @click="clickMenu(index)") {{m.title}}
            .weui-actionsheet__action
                .weui-actionsheet__cell(v-for="(a, index) in action", @click="clickAction(index)") {{a.title}}
</template>

<script>
    export default {
        name: "mp-actionsheet",
        props: {
            //  是否显示
            isShow: {
                type: Boolean,
                default: false
            },
            //  标题
            title: {
                type: String,
                default: ""
            },
            //  菜单列表
            menu: {
                type: Array,
                default: () => []
            },
            //  动作列表
            action: {
                type: Array,
                default: () => []
            },
            eventType: {
                type: Object,
                default: () => {
                    return {
                        clickMenu: "clickMenu",
                        clickAction: "clickAction",
                        clickMask: "clickMask"
                    }
                }
            },
            eventHandlerName: {
                type: String,
                default: "eventHandler"
            }
        },
        methods: {
            /**
             * 点击菜单
             * @param index {number} 索引值
             */
            clickMenu(index) {
                this.$emit(this.eventHandlerName, {
                    eventType: this.eventType.clickMenu,
                    data: {
                        index
                    }
                });
            },
            /**
             * 点击动作
             * @param index {number} 索引值
             */
            clickAction(index) {
                this.$emit(this.eventHandlerName, {
                    eventType: this.eventType.clickAction,
                    data: {
                        index
                    }
                });
            },
            //  点击遮罩层
            clickMask() {
                this.$emit(this.eventHandlerName, {
                    eventType: this.eventType.clickMask,
                    data: {}
                });
            }
        }
    }
</script>

<style scoped>

</style>