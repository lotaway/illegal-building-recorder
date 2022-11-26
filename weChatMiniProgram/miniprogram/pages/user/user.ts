import {cn} from "../../appConfig/cn";
import {miniProgramRoute} from "../../appConfig/route";
import baseConfig from "../../appConfig/baseConfig";
import bindData from "../../appConfig/bindData";
import {util} from "../../utils/util";
import {UserProvider} from "../../provider/user";

// 获取应用实例
const app = getApp<IAppOption>();

Page({
    data: {
        title: cn.user.welcomeTitle,
        welcomeBanner: "../../public/temp/welcome-banner.png",
        tips: {
            pleaseInput: cn.global.tips.pleaseInput
        },
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
    },
    inputEventHandler(e: any, options: object) {
        console.log(e + options);
    },
    accountNameInputBlur(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.accountName.value = e.detail.value;
        this.setData({form});
    },
    passwordInputBlur(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.password.value = e.detail.value;
        this.setData({form});
    },
    changePasswordAccountNameInputBlur(e: WechatMiniprogram.InputEvent) {
        let {changePassword} = this.data;

        changePassword.form.accountName.value = e.detail.value;
        this.setData({changePassword});
    },
    changePasswordOldInputBlur(e: WechatMiniprogram.InputEvent) {
        let {changePassword} = this.data;

        changePassword.form.oldPassword.value = e.detail.value;
        this.setData({changePassword});
    },
    changePasswordNewInputBlur(e: WechatMiniprogram.InputEvent) {
        let {changePassword} = this.data;

        changePassword.form.newPassword.value = e.detail.value;
        this.setData({changePassword});
    },
    /**
     * 切换修改密码界面显示/隐藏
     * @param isShow {boolean} 是否显示
     */
    toggleChangePasswordView(isShow: boolean | WechatMiniprogram.TapEvent) {
        let {changePassword} = this.data;

        if (isShow === undefined) {
            isShow = !changePassword.isShow;
        } else if (typeof isShow === "object") {
            const dataToggleVal = (isShow as WechatMiniprogram.TapEvent).currentTarget.dataset.toggle;

            isShow = dataToggleVal === undefined ? !changePassword.isShow : dataToggleVal === "true";
        }
        changePassword.isShow = isShow as boolean;
        if (changePassword.isShow) {
            if (!changePassword.form.accountName.value) {
                changePassword.form.accountName.value = changePassword.form.accountName.value || "";
            }
        }
        this.setData({changePassword});
    },
    //  提交修改密码信息
    submitChangePassword() {
        let {changePassword} = this.data;

        if (changePassword.form.submit.disabled) {
            return false;
        }
        changePassword.form.submit.disabled = true;
        this.data.userProvider.changePassword({
            username: changePassword.form.accountName.value,
            oldPassword: changePassword.form.oldPassword.value,
            newPassword: changePassword.form.newPassword.value
        }).then(response => {
            let {changePassword} = this.data;

            changePassword.form.submit.disabled = false;
            switch (response.status) {
                case 1000:
                    changePassword.form.accountName.value = changePassword.form.oldPassword.value = changePassword.form.newPassword.value = "";
                    this.toggleChangePasswordView(false);
                    util.showToast(response.msg);
                    break;
                case 1001:
                    util.showToast(response.msg);
                    break;
                default:
                    util.showToast("修改密码出现未知错误：" + JSON.stringify(response));
                    break;
            }
            this.setData({changePassword});
        })
            .catch(err => {
                let {changePassword} = this.data;

                changePassword.form.submit.disabled = false;
                this.setData({changePassword});
                util.showToast("修改密码接口出现异常：" + JSON.stringify(err));
            });
        this.setData({changePassword});

        return true;
    },
    //  提交账号信息
    formSubmit(): any {
        let {form} = this.data;

        if (form.submit.disabled) {
            return false;
        }
        if (!form.accountName.value || !form.password.value) {
            return false;
        }
        form.submit.disabled = true;
        this.setData({form});
        this.data.userProvider.signIn({
            username: this.data.form.accountName.value,
            password: this.data.form.password.value
        }).then(res => {
            let msg = ""
                , {form} = this.data
            ;

            switch (res.status) {
                // 成功
                case 1000:
                    this.data.userProvider.setAccessToken(res.accessToken)
                        .then(() => app.readUserStatusAndDataFormCache())
                        .then(() => {
                        if (app.globalData.isSignIn) {
                            let {form} = this.data;

                            form.accountName.value = "";
                            form.password.value = "";
                            this.setData({
                                form
                            });
                            util.showToast(cn.user.signInSuccess);
                            setTimeout(() => {
                                util.switchTo({
                                    url: miniProgramRoute.index
                                });
                            }, baseConfig.delay * 1000);

                            return Promise.resolve();
                        } else {
                            return Promise.reject();
                        }
                    })
                        .catch(err => {
                            util.showToast("登录状态保存失败：" + JSON.stringify(err));
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
            msg && util.showToast(msg);
            form.submit.disabled = false;
            this.setData({form});
        }).catch(err => {
            let {form} = this.data;

            form.submit.disabled = false;
            this.setData({form});
            console.log(`登入${cn.global.error.apiException}：` + JSON.stringify(err));
        });
    },
    //  检查登录状态
    checkSignInStatus(callback = () => {
    }) {
        this.data.userProvider.checkLogInStatus().then(() => true).catch(() => Promise.resolve(false))
            .then(isSignIn => {
                // this.setData({isSignIn});
                app.globalData.isSignIn = isSignIn;
                callback();
            })
        ;
    },
    onLoad() {
        this.setData({
            userProvider: new UserProvider()
        });
        this.checkSignInStatus(() => {
            if (app.globalData.isSignIn) {
                util.showToast(cn.user.signInSuccess);
                /*util.switchTo({
                    url: route.index
                });*/
            }
        });
    },
    onShow() {
        this.toggleChangePasswordView(false);
    },
    onShareAppMessage() {
        return {};
    }
})