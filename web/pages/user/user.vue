<template lang="pug">
    .page-user
        left-menu
            tab-bar(slot="menu", :list="tabBar.list", :active-index="tabBar.selectedIndex")
            form.weui-form(slot="content")
                .weui-form__title
                    img.img.welcome-banner(:src="welcomeBanner", :alt="title")
                p.weui-form__desc.title.text-center(v-show="false") {{title}}
                .signed(v-if="isSignIn")
                    p 您已登录无需重复登录
                .noSigned(v-else, v-show="!changePassword.isShow")
                    .weui-form__control-area
                        .weui-cells__group.weui-cells__group_form.weui-cells
                            .weui-cell.weui-cell_active.account-name
                                .weui-cell__hd
                                    label.weui-label(:for="form.accountName.name") {{form.accountName.title}}
                                .weui-cell__bd
                                    input.weui-input.input(:id="form.accountName.name", type="text", :placeholder="form.accountName.placeHolder", v-model="form.accountName.value")
                            .weui-cell.weui-cell_active
                                .weui-cell__hd
                                    label.weui-label(:for="form.password.name") {{form.password.title}}
                                .weui-cell__bd
                                    input.weui-input.input(:id="form.password.name", type="password", :placeholder="form.password.placeHolder", v-model="form.password.value")
                    .weui-form__tips-area
                        p.weui-form__tips
                    .weui-form__opr-area.button.control
                        a.weui-btn.weui-btn_primary.size-default.type-primary.btn-submit.btn.block(:class="form.submit.disabled ? 'weui-btn_disabled' : ''", type="button", @click="formSubmit") {{form.submit.title}}
                        a.weui-btn.weui-btn_default.size-default.type-default.btn.block(@click="toggleChangePasswordView(true)") {{changePassword.btnEntryTitle}}
                .weui-form__control-area(v-show="changePassword.isShow")
                    .weui-cells__group.weui-cells__group_form.weui-cells
                        .weui-cell.weui-cell_active.account-name
                            .weui-cell__hd
                                label.weui-label(:for="changePassword.form.accountName.name") {{changePassword.form.accountName.title}}
                            .weui-cell__bd
                                input.weui-input.input(:id="changePassword.form.accountName.name", type="text", :placeholder="changePassword.form.accountName.placeHolder", v-model="changePassword.form.accountName.value")
                        .weui-cell.weui-cell_active
                            .weui-cell__hd
                                label.weui-label(:for="changePassword.form.oldPassword.name") {{changePassword.form.oldPassword.title}}
                            .weui-cell__bd
                                input.weui-input.input(:id="changePassword.form.oldPassword.name", type="password", :placeholder="changePassword.form.oldPassword.placeHolder", v-model="changePassword.form.oldPassword.value")
                        .weui-cell.weui-cell_active
                            .weui-cell__hd
                                label.weui-label(:for="changePassword.form.newPassword.name") {{changePassword.form.newPassword.title}}
                            .weui-cell__bd
                                input.weui-input.input(:id="changePassword.form.newPassword.name", type="password", :placeholder="changePassword.form.newPassword.placeHolder", v-model="changePassword.form.newPassword.value")
                    .weui-form__opr-area.button.control
                        a.weui-btn.weui-btn_primary.size-default.type-primary.btn-submit.btn.block(:class="changePassword.form.submit.disabled ? 'weui-btn_disabled' : ''", type="button", @click="submitChangePassword") {{changePassword.form.submit.title}}
                        a.weui-btn.weui-btn_default.size-default.type-default.btn-submit.btn.block(@click="toggleChangePasswordView(false)") {{changePassword.btnShowSignInViewTitle}}
</template>

<script>
    import "babel-polyfill";
    import welcomeBanner from "../../public/temp/welcome-banner.png";
    import {cn} from "../../../appConfig/cn";
    import bindData from "../../../appConfig/bindData";
    import baseConfig from "../../../appConfig/baseConfig";
    import tabBarConfig from "../../config/tabBar";
    import {memberRoute, serverRoute} from "../../../appConfig/route";
    import App from "../../utils/app";
    import {util} from "../../utils/util";
    import {UserProvider} from "../../provider/user";
    import TabBar from "../../layout/tabBar";
    import LeftMenu from "../../layout/leftMenu";

    const app = new App();

    export default {
        name: "user",
        components: {
            TabBar,
            LeftMenu
        },
        data() {
            return {
                title: cn.user.welcomeTitle,
                welcomeBanner,
                tabBar: {
                    selectedIndex: tabBarConfig.list.findIndex(item => item.pagePath.indexOf(memberRoute.user) > -1),
                    list: tabBarConfig.list.map(item => {
                        return {
                            iconNormalPath: item.iconPath,
                            iconActivePath: item.selectedIconPath,
                            link: item.pagePath,
                            title: item.text
                        };
                    })
                },
                tips: {
                    pleaseInput: cn.global.tips.pleaseInput
                },
                admin: {
                    btnEntryTitle: cn.admin.btnAdminCenterTitle
                },
                //  修改密码
                changePassword: {
                    btnEntryTitle: cn.user.btnChangePasswordEntryTitle,
                    btnShowSignInViewTitle: cn.user.btnShowSignInViewTitle,
                    isShow: false,
                    form: {
                        accountName: {
                            title: cn.user.accountNameTitle,
                            name: "account-name",
                            placeHolder: cn.user.accountNamePlaceHolder,
                            value: ""
                        },
                        oldPassword: {
                            title: cn.user.oldPasswordTitle,
                            name: "old-password",
                            placeHolder: cn.user.oldPasswordPlaceHolder,
                            value: ""
                        },
                        newPassword: {
                            title: cn.user.newPasswordTitle,
                            name: "new-password",
                            placeHolder: cn.user.newPasswordPlaceHolder,
                            value: ""
                        },
                        submit: {
                            disabled: false,
                            title: cn.user.btnSubmitChangePasswordTitle
                        }
                    }
                },
                form: {
                    /*wjw  123456  市级 审定
                    ldh 123456 区(县) 核实
                    wxm 123456 街道 录入、审查
                    wcx 123456 居委 录入*/
                    accountName: {
                        tip: cn.user.accountNameTip.replace("${name}", Object.values(bindData.userRank.enum).reduce((prev, cur) => `${prev}、${cur.title}`, "").replace(/^、/, "")),
                        title: cn.user.accountNameTitle,
                        name: "accountName",
                        placeHolder: cn.user.accountNamePlaceHolder,
                        value: ""
                    },
                    password: {
                        tip: cn.user.passwordTip,
                        title: cn.user.passwordTitle,
                        name: "password",
                        placeHolder: cn.user.passwordPlaceHolder,
                        value: ""
                    },
                    submit: {
                        disabled: false,
                        title: cn.user.btnSubmitTitle
                    }
                },
                isSignIn: false //  是否已登录
                , userProvider: new UserProvider()
            }
        },
        methods: {
            /**
             * 切换修改密码界面显示/隐藏
             * @param isShow {boolean} 是否显示
             */
            toggleChangePasswordView(isShow) {
                this.changePassword.isShow = isShow === undefined ? !this.changePassword.isShow : isShow;
                if (this.changePassword.isShow) {
                    if (!this.changePassword.form.accountName.value) {
                        this.changePassword.form.accountName.value = this.form.accountName.value || "";
                    }
                }
            },
            //  提交修改密码信息
            submitChangePassword() {
                var errorMsg = "";  //  错误文本

                if (this.changePassword.form.submit.disabled) {
                    return false;
                }
                this.changePassword.form.submit.disabled = true;
                switch (true) {
                    case !this.changePassword.form.accountName.value:
                        errorMsg = `${this.tips.pleaseInput + this.changePassword.form.accountName.title}`;
                        break;
                    case !this.changePassword.form.oldPassword.value:
                        errorMsg = this.tips.pleaseInput + this.changePassword.form.oldPassword.title;
                        break;
                    case !this.changePassword.form.newPassword.value:
                        errorMsg = this.tips.pleaseInput + this.changePassword.form.newPassword.title;
                        break;
                }
                if (errorMsg) {
                    util.showToast(errorMsg);
                    this.changePassword.form.submit.disabled = false;

                    return false;
                }
                this.userProvider.changePassword({
                    username: this.changePassword.form.accountName.value,
                    oldPassword: this.changePassword.form.oldPassword.value,
                    newPassword: this.changePassword.form.newPassword.value
                }).then(response => {
                    this.changePassword.form.submit.disabled = false;
                    switch (response.status) {
                        case 1000:
                            this.changePassword.form.accountName.value = this.changePassword.form.oldPassword.value = this.changePassword.form.newPassword.value;
                            this.toggleChangePasswordView(false);
                            util.showToast(response.msg);
                            break;
                        case 1001:
                            util.showToast(response.msg);
                            break;
                        default:
                            util.showToast("修改密码遇到未知错误：" + JSON.stringify(response));
                            break;
                    }
                })
                    .catch(err => {
                        this.changePassword.form.submit.disabled = false;
                        util.showToast("修改密码接口异常：" + JSON.stringify(err));
                    })
                ;
            },
            //  提交账号信息
            formSubmit() {
                let {form} = this;

                if (form.submit.disabled) {
                    return false;
                }
                if (!form.accountName.value || !form.password.value) {
                    return false;
                }
                this.form.submit.disabled = true;
                this.userProvider.signIn({
                    username: this.form.accountName.value,
                    password: this.form.password.value
                }).then(res => {
                    let msg = "";

                    switch (res.status) {
                        // 成功
                        case 1000:
                            msg = cn.user.signInSuccess;
                            this.form.accountName.value = "";
                            this.form.password.value = "";
                            // , isSignIn: true  //  暂未使用登录后的界面，不设置
                            Promise.all([
                                this.userProvider.setAccessToken(res.accessToken)
                                , new Promise(resolve => {
                                    setTimeout(() => {
                                        resolve();
                                    }, baseConfig.delay * 1000)
                                })
                            ])
                                .then(() => {
                                    util.switchTo({
                                        url: memberRoute.index
                                    });
                                })
                            ;
                            break;
                        // 参数错误
                        case 1001:
                            msg = cn.global.error.errorQuery;
                            break;
                        //  登录失败，密码错误
                        case 1002:
                            msg = cn.user.errorSignInInfo;
                            break;
                        //  账户被禁用
                        case 1003:
                            msg = cn.user.forbiddenAccount;
                            break;
                        //  用户不存在
                        case 1005:
                            msg = cn.user.accountNotExist;
                            break;
                        // 未知错误
                        default:
                            msg = `${cn.global.error.errorUnknown}:` + JSON.stringify(res);
                            break;
                    }
                    util.showToast(msg);
                    this.form.submit.disabled = false;
                }).catch(err => {
                    this.form.submit.disabled = false;
                    console.log(`登入${cn.global.error.apiException}：` + JSON.stringify(err));
                });
            }
        },
        created() {
        },
        mounted() {

        }
    };
</script>

<style scoped>
    @import "user.css";
</style>