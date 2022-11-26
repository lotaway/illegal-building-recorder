import {ProviderMissionRecord} from "../../provider/missionRecord";
import {util} from "../../utils/util";
import {cn} from "../../appConfig/cn";
import {miniProgramRoute, serverRoute} from "../../appConfig/route";
import baseConfig from "../../appConfig/baseConfig";
import bindData from "../../appConfig/bindData";
import {UserProvider} from "../../provider/user";

// 获取应用实例
const app = getApp<IAppOption>();

let recordList: Array<{
    id: number
    thumbnail: string
    title: string
    desc: string
    status: number
}> = [];

Page({
    data: {
        recordStatusEnum: bindData.missionRecordStatus.enum,
        userProvider: new UserProvider(),
        record: {
            status: 0,  //  加载状态
            statusEnum: {
                noInit: {
                    title: cn.global.load.noInit,
                    value: 0
                },
                loading: {
                    title: cn.global.load.loading,
                    value: 1
                },
                loaded: {
                    title: cn.global.load.loaded,
                    value: 2
                },
                end: {
                    title: cn.global.load.end,
                    value: 3
                },
                error: {
                    title: cn.global.load.error,
                    value: 4
                }
            },
            provider: new ProviderMissionRecord(),
            pageIndex: 0,  //  页码
            filter: {
                title: cn.index.searchTitle,
                keyword: "", //  搜索关键字
                inputTip: cn.index.searchTip,
                keywordPlaceHolder: cn.index.searchPlaceHolder, //  占位内容
                msgType: {
                    value: -1,
                    enum: bindData.missionType.enum
                }
            },
            list: recordList
        },
        user: {
            isSignIn: false,
            id: 0,  //  用户标识
            name: "", //  用户名
            currentUnit: "" //  所在单位
            //  统计
            , statistics: {
                areaSize: 0  //  总面积
                , missionRecord: 0 //  任务总数量
                , investigateMissionRecord: 0 // 摸查任务总数量
                , investigateArea: 0    //  摸查任务总面积
                , dealMissionRecord: 0 //  治理任务总数量
                , dealArea: 0   //  治理任务总面积
            }
        }
    },
    //  搜索框离开事件
    recordSearchBlur(e: WechatMiniprogram.InputEvent) {
        let {record} = this.data;

        record.filter.keyword = e.detail.value;
        this.setData({record});
    },
    //  点击搜索
    search() {
        this.resetRecordList();

        return this.getNextRecord();
    },
    //  重置记录筛选
    resetRecordFilter() {
        let {record} = this.data;

        record.filter.keyword = "";
        record.filter.msgType.value = record.filter.msgType.enum.investigate.value;
        this.setData({record});
    },
    //  重置记录列表
    resetRecordList() {
        let {record} = this.data;

        record.list.splice(0);
        record.pageIndex = 0;
        record.status = record.statusEnum.noInit.value;
        this.setData({record});
    },
    //  选择信息类型
    selectMsgType(e: WechatMiniprogram.TapEvent) {
        let {record} = this.data;

        record.filter.msgType.value = Number(e.currentTarget.dataset.value);
        this.setData({record});
        this.search();
    },
    //  获取下一页
    getNextRecord() {
        let {record} = this.data
            , getListPromise
        ;

        if (record.status === record.statusEnum.loading.value || record.status === record.statusEnum.end.value) {
            return Promise.reject("无法处理的状态：" + record.status);
        }
        record.status = record.statusEnum.loading.value;
        ++record.pageIndex;
        this.setData({record});
        let query = {
            keyword: record.filter.keyword,
            pageIndex: record.pageIndex,
            accessToken: this.data.userProvider.getAccessToken()
        };

        if (record.filter.msgType.value === record.filter.msgType.enum.investigate.value) {
            getListPromise = record.provider.getInvestigateList(query);
        } else {
            getListPromise = record.provider.getDealList(query);
        }

        return getListPromise.then(res => {
            let {record} = this.data;

            switch (res.status) {
                // 成功
                case 1000:
                    record.status = res.data.list.length && record.pageIndex < res.data.pageCount ? record.statusEnum.loaded.value : record.statusEnum.end.value;
                    res.data.list.forEach(item => {
                        record.list.push(item);
                    });
                    break;
                //    失败
                case 1001:
                    util.showToast(res.msg);
                    record.status = record.statusEnum.error.value;
                    break;
                // 未知错误
                default:
                    util.showToast("获取任务记录列表接口出现未知错误：" + res.msg);
                    record.status = record.statusEnum.error.value;
                    break;
            }
            this.setData({record});

            return res;
        }).catch(err => {
            let {record} = this.data;

            util.showToast("获取记录接口异常：" + JSON.stringify(err));
            record.status = record.statusEnum.error.value;
            this.setData({record});
        });
    },
    //  监听滚动事件进行处理
    listScrollHandler() {
        if (this.data.record.status === this.data.record.statusEnum.loaded.value) {
            this.getNextRecord();
        }
    },
    //  显示记录详情
    showRecordDetail(e: WechatMiniprogram.TapEvent) {
        const recordItem = this.data.record.list[Number(e.currentTarget.dataset.index)];

        if (recordItem && recordItem.id) {
            util.navigatorTo({
                url: miniProgramRoute.missionRecordDetail,
                query: {
                    [baseConfig.query.msgType]: this.data.record.filter.msgType.value,
                    [this.data.record.filter.msgType.value === this.data.record.filter.msgType.enum.investigate.value ? baseConfig.query.investigateMissionRecordId : baseConfig.query.dealMissionRecordId]: recordItem.id
                },
                success() {
                    console.log("跳转任务记录详情成功");
                },
                fail() {
                    util.showToast("跳转任务记录详情失败");
                }
            });
        }
    },
    //  显示文档类型选择
    showDocumentTypeSelection() {
        let redirect = "";  //  重定向地址

        util.showActionSheet({
            itemList: ["违法建设摸查汇总表", "农村村民住宅违法建设摸查表", "违法建设摸查表"],
            success: res => {
                switch (res.tapIndex) {
                    case 0:
                        redirect = serverRoute.allCollect;
                        break;
                    case 1:
                        redirect = serverRoute.investigateDetailList;
                        break;
                    case 2:
                        redirect = serverRoute.investigateSimpleList;
                        break;
                    default:
                        util.showToast("异常，不是可选的文档类型");
                        break;
                }
                if (redirect) {
                    util.navigatorTo({
                        url: miniProgramRoute.browser,
                        query: {
                            [baseConfig.query.redirect]: redirect
                            , [baseConfig.query.query]: {
                                [baseConfig.query.accessToken]: this.data.userProvider.getAccessToken() || ""
                            }
                        }
                    });
                    // this.data.record.provider.downloadAndShowDocument(redirect + "?" + baseConfig.query.accessToken + "=" + (this.data.userProvider.getAccessToken() || "")).then(res => util.showToast("文档保存成功：" + JSON.stringify(res))).catch(err => util.showToast("文档保存失败：" + JSON.stringify(err)));
                }
            }
        });
    },
    //  更新用户状态到局部数据源中
    updateUserStatus() {
        let {user} = this.data;

        //  从全局数据同步登录状态到页面数据里
        user.isSignIn = app.globalData.isSignIn;
        user.id = app.globalData.user.id;
        user.name = app.globalData.user.name;
        user.currentUnit = app.globalData.user.currentUnit;
        user.statistics.areaSize = app.globalData.user.statistics.areaSize;
        user.statistics.missionRecord = app.globalData.user.statistics.missionRecord;
        user.statistics.investigateMissionRecord = app.globalData.user.statistics.investigateMissionRecord;
        user.statistics.investigateArea = app.globalData.user.statistics.investigateArea;
        user.statistics.dealMissionRecord = app.globalData.user.statistics.dealMissionRecord;
        user.statistics.dealArea = app.globalData.user.statistics.dealArea;
        this.setData({
            user
        });
    },
    //  显示登录界面
    showSignIn() {
        util.showToast(cn.user.noSignIn);
        setTimeout(() => {
            util.switchTo({
                url: miniProgramRoute.user,
                success() {
                    console.log("跳转登录页面成功");
                },
                fail(err) {
                    console.log("跳转登录页面失败：" + JSON.stringify(err));
                }
            });
        }, baseConfig.delay * 1000);
    },
    onLoad() {
        let {record} = this.data;

        record.filter.msgType.value = record.filter.msgType.enum.investigate.value;
        record.provider = new ProviderMissionRecord();
        this.setData({
            record
            , userProvider: new UserProvider()
        });
    },
    onShow() {
        setTimeout(() => {
            const oldUserId = this.data.user.id;    //  更新用户数据前的用户标识

            this.updateUserStatus();
            if (this.data.user.isSignIn) {
                if(oldUserId !== 0 && this.data.user.id !== oldUserId) {
                    this.resetRecordFilter();
                    this.resetRecordList();
                    this.getNextRecord();
                }
                else {
                    (this.data.record.status === this.data.record.statusEnum.noInit.value) && this.getNextRecord();
                }
            } else {
                this.resetRecordFilter();
                this.resetRecordList();
                this.showSignIn();
            }
        }, 300);
    },
    //  页面上拉触底事件的处理函数
    onReachBottom() {
        if (this.data.user.isSignIn) {
            this.listScrollHandler();
        }
    },
    onShareAppMessage() {
        return {};
    }
})
