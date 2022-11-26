import {util} from "../../utils/util";
import {miniProgramRoute} from "../../appConfig/route";
import bindData from "../../appConfig/bindData";
import baseConfig from "../../appConfig/baseConfig";
import {cn} from "../../appConfig/cn";

// 获取应用实例
const app = getApp<IAppOption>();

Page({
    data: {
        userRankEnum: bindData.userRank.enum,
        addDisabled: false,
        btnShowAllRecordTitle: cn.missionRecord.btnShowAllRecordTitle
    },
    showRecord() {
        util.switchTo({
            url: miniProgramRoute.index,
            success() {
                console.log("跳转到任务记录列表");
            }
            , fail(err) {
                util.showToast("跳转到任务记录列表失败：" + JSON.stringify(err));
            }
        });
    },
    showAdd(callback: Function) {
        util.navigatorTo({
            url: miniProgramRoute.add,
            success() {
                console.log("跳转到添加页面成功");
                typeof callback === "function" && callback();
            },
            fail(err) {
                util.showToast("跳转到添加页面失败：" + JSON.stringify(err));
                typeof callback === "function" && callback();
            }
        });
    },
    checkAuth() {
        this.setData({addDisabled: !app.globalData.isSignIn || app.globalData.user.rank > this.data.userRankEnum.street.value});
    },
    onLoad() {
        util.showLoading({
            title: "正在跳转到资料录入界面"
        });
        this.checkAuth();
        if (!this.data.addDisabled) {
            this.showAdd(() => {
                setTimeout(() => {
                    util.hideLoading();
                }, baseConfig.delay * 1000);
            });
        }
    },
    onShow() {
        this.checkAuth();
        if (this.data.addDisabled) {
            if (!app.globalData.isSignIn) {
                util.showToast("请先登录");
                setTimeout(() => {
                    util.switchTo({
                        url: miniProgramRoute.user,
                        success() {
                            console.log("跳转到登录页面成功");
                        },
                        fail(err) {
                            util.showToast("跳转到登录页面失败：" + JSON.stringify(err));
                        }
                    });
                }, baseConfig.delay * 1000);
            } else {
                util.showToast("您的账号没有权限添加记录");
            }
        }
    }
})