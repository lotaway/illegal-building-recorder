<template lang="pug">
    .weui-gallery(v-show="isShow")
        span.weui-gallery__img(:style="'background-image: url(' + image + ');'", @click="clickImgHandler")
        .weui-gallery__opr
            a.weui-gallery__del(v-show="isShowDelete", @click="deleteHandler")
                i.weui-icon-delete.weui-icon_gallery-delete
</template>

<script>
    export default {
        name: "mp-gallery",
        props: {
            //  是否显示
            isShow: {
                type: Boolean,
                default: true
            },
            //  图片地址
            image: {
                type: String,
                isRequire: true
            },
            //  是否显示删除按钮
            isShowDelete: {
                type: Boolean,
                default: false
            },
            eventType: {
                type: Object,
                default: () => {
                    return {
                        clickImg: "clickImg",
                        clickDelete: "clickDelete"
                    };
                }
            },
            eventHandlerName: {
                type: String,
                default: "eventHandler"
            }
        },
        data() {
            return {}
        },
        methods: {
            clickImgHandler() {
                this.$emit(this.eventHandlerName, {
                    eventType: this.eventType.clickImg,
                    imageUrl: this.imageUrl
                });
            },
            deleteHandler() {
                this.$emit(this.eventHandlerName, {
                    eventType: this.eventType.clickDelete,
                    imageUrl: this.imageUrl
                });
            }
        }
    }
</script>

<style scoped>
    .weui-gallery {
        display: block;
    }
</style>