import baseConfig from "../../appConfig/baseConfig";
import {cn} from "../../appConfig/cn";
import {miniProgramRoute, serverRoute} from "../../appConfig/route";
import bindData from "../../appConfig/bindData";
import {ProviderMissionRecord, nsRecord} from "../../provider/missionRecord";
import {UserProvider} from "../../provider/user";
import {util} from "../../utils/util";

// 获取应用实例
const app = getApp<IAppOption>();

let photoArr: Array<string> = []   //  上传图片数组
    , useForArr: Array<string> = []    //  用途数组
    , certificateArr: Array<{
        title: string
        value: string
    }> = []   //  证书数组
    , illegalTypeArr: Array<string> = []   //  违法建设性质数组
    , buildTypeEnum: { [index: string]: any } = bindData.missionBuildType.enum    //  建筑类型枚举
    , otherEvidenceValue: Array<{
        selected: boolean
        title: string
        filePaths: Array<string>
    }> = []   //  其他证据数组
;

Page({
    data: {
        msgTypeEnum: bindData.missionType.enum,
        userRankEnum: bindData.userRank.enum,
        recordStatusEnum: bindData.missionRecordStatus.enum,
        propertyOwnerTypeEnum: bindData.propertyOwnerType.enum,
        unitCredentialsTypeEnum: bindData.unitCredentialsType.enum,
        personalCredentialsTypeEnum: bindData.personalCredentialsType.enum,
        belongTypeEnum: bindData.belongType.enum,   //  所处区域
        landTypeEnum: bindData.landType.enum,   //  土地性质
        engineeringSituationTypeEnum: bindData.engineeringSituationType.enum,   //  工程现状类型
        engineeringAgeTypeEnum: bindData.engineeringAgeType.enum,   //  违建类型（新旧）
        useForTypeEnum: bindData.useForType.enum,   //  用途类型
        illegalTypeEnum: bindData.illegalType.enum, //  违建性质
        certificateEnum: bindData.certificate.enum, //  证书类型
        otherEvidenceTypeEnum: bindData.otherEvidence.enum, //  其他证据
        user: {
            id: 0,
            rank: 0
        },
        record: {
            investigateId: 0   //  摸查任务记录标识
            , dealId: 0 // 治理任务记录标识
            , submitUserId: -1   //  录入资料的用户标识
            , title: ""
            //  编号
            , codeNumber: {
                title: cn.missionRecord.codeNumberTitle,
                value: 0
            }
            , msgType: {
                title: cn.missionRecord.msgTypeTip,
                value: -1
            }
            , buildingAddress: {
                title: cn.missionRecord.buildingAddressTitle,
                value: ""
            }
            , propertyOwnerType: {
                title: cn.missionRecord.propertyOwnerTypeTitle,
                value: 0,
                valueDesc: ""
            }
            , propertyOwnerName: {
                unitTitle: cn.missionRecord.unitNameTitle,
                personalTitle: cn.missionRecord.personalNameTitle,
                value: ""
            }
            , credentialsType: {
                title: cn.missionRecord.credentialsTypeTitle,
                value: ""
            }
            , credentialsNumber: {
                title: cn.missionRecord.credentialsNumberTitle,
                value: ""
            }
            , relative: {
                government: {
                    title: cn.missionRecord.withGovernmentTitle,
                    selected: false
                }
                , armedForces: {
                    title: cn.missionRecord.withArmedForcesTitle,
                    selected: false
                }
            }
            , belongType: {
                title: cn.missionRecord.belongTypeTitle,
                value: ""
            }
            , landType: {
                title: cn.missionRecord.landTypeTitle,
                value: ""
            }
            , curtilage: {
                title: cn.missionRecord.curtilageTitle,
                selected: false
            }
            , coverArea: {
                title: cn.missionRecord.coverAreaTitle,
                value: "",
                valueUnit: cn.missionRecord.buildAreaValueUnit
            }
            , buildingStorey: {
                title: cn.missionRecord.buildingStoreyTitle,
                value: ""
            }
            , buildingStartDate: {
                title: cn.missionRecord.buildStartDateTitle,
                value: ""
            }
            , buildingEndDate: {
                title: cn.missionRecord.buildEndDateTitle,
                value: ""
            }
            , engineeringSituation: {
                title: cn.missionRecord.engineeringSituationTitle,
                value: ""
            }
            , engineeringAge: {
                title: cn.missionRecord.engineeringAgeTitle,
                value: ""
            }
            , useFor: {
                title: cn.missionRecord.useForTitle,
                value: useForArr
            }
            , certificate: {
                title: cn.missionRecord.certificateTitle,
                value: certificateArr
            }
            , illegalType: {
                title: cn.missionRecord.illegalTypeTitle,
                value: illegalTypeArr
            }
            , otherEvidence: {
                title: cn.missionRecord.otherEvidenceTitle,
                value: otherEvidenceValue
            }
            , reporter: {
                title: cn.missionRecord.reporterTitle,
                value: ""
            }
            , confirmer: {
                title: cn.missionRecord.confirmerTitle,
                value: ""
            }
            , leader: {
                title: cn.missionRecord.leaderTitle,
                value: ""
            }
            , belongArea: {
                title: cn.missionRecord.belongDistrictTitle,
                value: ""
            }
            , targetUnit: {
                title: cn.missionRecord.targetStreetTitle,
                value: ""
            }
            //  建筑类型
            , buildType: {
                title: cn.missionRecord.buildTypeTitle,
                enum: buildTypeEnum,
                value: ""
            }
            //  建筑名称
            , buildName: {
                title: cn.missionRecord.buildNameTitle,
                value: ""
            }
            //  建筑面积
            , buildArea: {
                title: cn.missionRecord.buildAreaTitle,
                value: "",
                valueUnit: cn.missionRecord.buildAreaValueUnit
            }
            //  建筑现状
            , buildSituation: {
                title: cn.missionRecord.buildSituationTitle,
                value: ""
            }
            //  任务日期
            , missionDate: {
                dealTitle: cn.missionRecord.dealMissionDateTitle,
                value: ""
            }
            //  治理拆除前
            , beforePhoto: {
                title: cn.missionRecord.dealBeforePhotoTitle,
                value: photoArr
            }
            //  治理拆除中
            , dealingPhoto: {
                title: cn.missionRecord.dealingPhotoTitle,
                value: photoArr
            }
            //  治理拆除后
            , donePhoto: {
                title: cn.missionRecord.dealDonePhotoTitle,
                value: photoArr
            }
            , status: -1    //  任务记录状态
        },
        control: {
            showInvestigate: {
                title: "查看摸查信息"
            },
            dealDetail: {
                title: "查看治理信息"
            },
            editInvestigate: {
                title: "修改摸查信息"
            },
            createDeal: {
                title: "录入治理信息"
            },
            editDeal: {
                title: "修改治理信息"
            },
            checkPass: {
                title: "审查通过"
            }
            , confirmPass: {
                title: "审核通过"
            }
            , reconfirmPass: {
                title: "审定通过"
            }
            , unlockRecord: {
                title: "授权修改"
            }
            , showDocument: {
                title: "生成图表"
            }
        },
        errMsg: "",
        providerMissionRecord: new ProviderMissionRecord()
        , providerUser: new UserProvider()
    },
    //  前往编辑摸查信息
    editInvestigateInfo() {
        util.navigatorTo({
            url: miniProgramRoute.add,
            query: {
                handlerType: "edit",
                [baseConfig.query.msgType]: bindData.missionType.enum.investigate.value,
                [baseConfig.query.investigateMissionRecordId]: this.data.record.investigateId
            }
        });
    },
    //  显示治理信息详情
    showDealInfo() {
        util.navigatorTo({
            url: miniProgramRoute.missionRecordDetail,
            query: {
                [baseConfig.query.dealMissionRecordId]: this.data.record.dealId
            },
            success() {
                console.log("跳转任务记录详情成功");
            },
            fail() {
                util.showToast("跳转任务记录详情失败");
            }
        });
    },
    //  显示摸查信息详情
    showInvestigateInfo() {
        util.navigatorTo({
            url: miniProgramRoute.missionRecordDetail,
            query: {
                [baseConfig.query.investigateMissionRecordId]: this.data.record.investigateId
            },
            success() {
                console.log("跳转任务记录详情成功");
            },
            fail() {
                util.showToast("跳转任务记录详情失败");
            }
        });
    },
    //  编辑治理信息
    editDealInfo() {
        util.navigatorTo({
            url: miniProgramRoute.add,
            query: {
                handlerType: this.data.record.dealId === 0 ? "add" : "edit",
                [baseConfig.query.msgType]: bindData.missionType.enum.deal.value,
                [baseConfig.query.investigateMissionRecordId]: this.data.record.investigateId,
                [baseConfig.query.dealMissionRecordId]: this.data.record.dealId
            }
        });
    },
    //  获取任务记录信息
    getRecordInfo() {
        const accessToken = this.data.providerUser.getAccessToken()
            , adapterPhotoValue = (photoValue: string) => photoValue ? photoValue.split(",") : []
        ;
        let getInfoPromise;

        if (this.data.record.msgType.value === this.data.msgTypeEnum.investigate.value) {
            getInfoPromise = this.data.providerMissionRecord.getInvestigateRecordDetail(this.data.record.investigateId, accessToken).then(res => {
                switch (res.status) {
                    //  成功，显示信息
                    case 1000:
                        const data = res.data as nsRecord.InvestigateDetailAdapterResult;
                        let {record} = this.data;

                        record.investigateId = data.id;
                        record.dealId = data.gbId;
                        record.submitUserId = data.submitUserId;
                        record.codeNumber.value = data.codeNumber;
                        record.status = data.status;
                        record.buildingAddress.value = data.buildingAddress;
                        record.propertyOwnerType.value = data.propertyOwnerType;
                        record.propertyOwnerType.valueDesc = (Object.values(this.data.propertyOwnerTypeEnum).find(item => item.value === record.propertyOwnerType.value) || {title: "未知"}).title;
                        record.propertyOwnerName.value = data.propertyOwnerName;
                        record.credentialsType.value = record.propertyOwnerType.value === this.data.propertyOwnerTypeEnum.unknown.value ? "未知" : (Object.values(record.propertyOwnerType.value === this.data.propertyOwnerTypeEnum.unit.value ? this.data.unitCredentialsTypeEnum : this.data.personalCredentialsTypeEnum).find(item => item.value === data.credentialsType) || {title: ""}).title;
                        record.credentialsNumber.value = data.credentialsNumber;
                        record.relative.government.selected = data.relativeGovernment;
                        record.relative.armedForces.selected = data.relativeArmedForces;
                        record.belongType.value = (Object.values(this.data.belongTypeEnum).find(item => item.value === data.belongType) || {title: "未知"}).title;
                        record.landType.value = (Object.values(this.data.landTypeEnum).find(item => item.value === data.landType) || {title: "未知"}).title;
                        record.curtilage.selected = data.isCurtilage;
                        record.coverArea.value = data.coverArea.toString();
                        record.buildArea.value = data.buildArea.toString();
                        record.buildingStorey.value = data.buildingStorey.toString();
                        record.buildingStartDate.value = data.buildingStartDate;
                        record.buildingEndDate.value = data.buildingEndDate;
                        record.engineeringSituation.value = (Object.values(this.data.engineeringSituationTypeEnum).find(item => item.value === data.engineeringSituation) || {title: "未知"}).title;
                        record.engineeringAge.value = (Object.values(this.data.engineeringAgeTypeEnum).find(item => item.value === data.engineeringAge) || {title: "未知"}).title;
                        (() => {
                            let useForObjByValue: { [key: number]: string } = {};

                            Object.values(this.data.useForTypeEnum).forEach(item => {
                                useForObjByValue[item.value] = item.title;
                            });
                            record.useFor.value = data.useFor.map(value => useForObjByValue[value] || "未知");
                        })();
                        record.certificate.value = Object.keys(data.certificate).map(key => {
                            const item = data.certificate[key];

                            return {
                                title: item.nameValue || (this.data.certificateEnum as { [key: string]: any })[key].title,
                                value: item.selected ? (item.numberValue || "未填写") : "无"
                            };
                        });
                        (() => {
                            let illegalTypeObjByValue: { [key: number]: string } = {};

                            Object.values(this.data.illegalTypeEnum).forEach(item => {
                                illegalTypeObjByValue[item.value] = item.title;
                            });
                            record.illegalType.value = data.illegalType.map(value => illegalTypeObjByValue[value]);
                        })();
                        (() => {
                            let otherEvidenceObj: {[key: number]: string} = {};

                            Object.values(this.data.otherEvidenceTypeEnum).forEach(item => {
                                otherEvidenceObj[item.value] = item.title;
                            });
                            record.otherEvidence.value = data.otherEvidence.map(item => {
                                return {
                                    selected: item.selected,
                                    title: otherEvidenceObj[item.value],
                                    filePaths: item.filePaths
                                };
                            });
                        })();
                        record.reporter.value = data.reporter;
                        record.confirmer.value = data.confirmer;
                        record.leader.value = data.leader;
                        this.setData({record});
                        break;
                    //  未查询到相关信息
                    case 1001:
                    //    未知错误
                    default:
                        util.showToast(res.msg);
                        break;
                }
            });
        } else {
            getInfoPromise = this.data.providerMissionRecord.getDealRecordDetail(this.data.record.dealId, accessToken).then(res => {
                switch (res.status) {
                    //  成功
                    case 1000:
                        let {record} = this.data;

                        record.investigateId = res.data.palpationId;
                        record.dealId = res.data.id;
                        record.submitUserId = res.data.submitUser;
                        record.codeNumber.value = res.data.number;
                        record.belongArea.value = res.data.region;
                        record.targetUnit.value = res.data.jurisdiction;
                        Object.keys(record.buildType.enum).forEach(key => {
                            if (record.buildType.enum[key].value === String(res.data.infoType)) {
                                record.buildType.value = record.buildType.enum[key].title;
                            }
                        });
                        record.buildName.value = res.data.position;
                        record.buildArea.value = res.data.area;
                        record.buildSituation.value = res.data.nowStatus;
                        record.missionDate.value = res.data.dismantleDate;
                        record.beforePhoto.value = adapterPhotoValue(res.data.imageData1);
                        record.dealingPhoto.value = adapterPhotoValue(res.data.imageData2);
                        record.donePhoto.value = adapterPhotoValue(res.data.imageData3);
                        record.status = res.data.infoState;
                        this.setData({record});
                        break;
                    //  未查询到相关信息
                    case 1001:
                    default:
                        util.showToast(res.msg);
                        break;
                }
            });
        }

        return getInfoPromise.catch(err => {
            util.showToast("获取任务记录详情接口异常：" + JSON.stringify(err));
        });
    },
    //  审查通过
    checkPass() {
        const {record, providerMissionRecord, providerUser} = this.data;

        providerMissionRecord.checkMission(record.msgType.value === this.data.msgTypeEnum.investigate.value ? record.investigateId : record.dealId, providerUser.getAccessToken(), record.msgType.value).then(res => {
            switch (res.status) {
                //  成功
                case 1000:
                    (() => {
                        let {record} = this.data;

                        record.status = res.data.recordStatus || record.status;
                        this.setData({record});
                    })();
                    util.showToast(res.msg);
                    break;
                //    失败
                case 1001:
                //    未知错误
                default:
                    util.showToast(res.msg);
                    break;
            }
        });
    },
    //  核实通过
    confirmPass() {
        const {record, providerMissionRecord, providerUser} = this.data;

        providerMissionRecord.confirmMission(record.msgType.value === this.data.msgTypeEnum.investigate.value ? record.investigateId : record.dealId, providerUser.getAccessToken(), record.msgType.value).then(res => {
            switch (res.status) {
                //  成功
                case 1000:
                    (() => {
                        let {record} = this.data;

                        record.status = res.data.recordStatus || record.status;
                        this.setData({record});
                    })();
                    util.showToast(res.msg);
                    break;
                //    失败
                case 1001:
                //    未知错误
                default:
                    util.showToast(res.msg);
                    break;
            }
        });
    },
    //  审定通过
    reconfirmPass() {
        const {record, providerMissionRecord, providerUser} = this.data;

        providerMissionRecord.reconfirmMission(record.msgType.value === this.data.msgTypeEnum.investigate.value ? record.investigateId : record.dealId, providerUser.getAccessToken(), record.msgType.value).then(res => {
            switch (res.status) {
                //  成功
                case 1000:
                    (() => {
                        let {record} = this.data;

                        record.status = res.data.recordStatus || record.status;
                        this.setData({record});
                    })();
                    util.showToast(res.msg);
                    break;
                //    失败
                case 1001:
                //    未知错误
                default:
                    util.showToast(res.msg);
                    break;
            }
        });
    },
    //  授权解锁
    unlockRecord() {
        const {record, providerMissionRecord, providerUser} = this.data;

        providerMissionRecord.unlockRecord(record.msgType.value === this.data.msgTypeEnum.investigate.value ? record.investigateId : record.dealId, providerUser.getAccessToken(), record.msgType.value).then(res => {
            switch (res.status) {
                //  成功
                case 1000:
                    (() => {
                        let {record} = this.data;

                        record.status = res.data.recordStatus || record.status;
                        this.setData({record});
                    })();
                    util.showToast(res.msg);
                    break;
                //    失败
                case 1001:
                //    未知错误
                default:
                    util.showToast(res.msg);
                    break;
            }
        });
    },
    //  显示图表
    showDocument() {
        util.navigatorTo({
            url: miniProgramRoute.browser,
            query: {
                [baseConfig.query.redirect]: this.data.record.msgType.value === this.data.msgTypeEnum.investigate.value ? serverRoute.investigateFarmerDoc : serverRoute.dealDoc
                ,
                [baseConfig.query.query]: {
                    [baseConfig.query.downloadId]: this.data.record.msgType.value === this.data.msgTypeEnum.investigate.value ? this.data.record.investigateId : this.data.record.dealId
                }
            }
        });
    },
    //  下载图表
    /*downloadDocument() {
        const downloadId = this.data.record.msgType.value === this.data.msgTypeEnum.investigate.value ? this.data.record.investigateId : this.data.record.dealId
            ,
            documentUrl = (this.data.record.msgType.value === this.data.msgTypeEnum.investigate.value ? serverRoute.investigateFarmerDoc : serverRoute.dealDoc) + "?" + baseConfig.query.downloadId + "=" + downloadId
        ;

        return downloadId ? this.data.providerMissionRecord.downloadAndShowDocument(documentUrl).then(res => util.showToast("文档保存成功：" + JSON.stringify(res))).catch(err => {
            util.showToast("文档保存失败");
            console.log(err);
        }) : Promise.reject("缺少标识，无法正常下载");
    },*/
    onLoad(options: Record<string, string | undefined>) {
        let {record, user} = this.data;

        //  获取传递的任务记录标识
        record.investigateId = Number(options[baseConfig.query.investigateMissionRecordId] || "0");
        record.dealId = Number(options[baseConfig.query.dealMissionRecordId] || "0");
        record.msgType.value = Number(options[baseConfig.query.msgType] || (record.dealId ? this.data.msgTypeEnum.deal.value : this.data.msgTypeEnum.investigate.value)); //  获取传递的任务类型
        if (app.globalData.isSignIn) {
            user.id = app.globalData.user.id;
            user.rank = app.globalData.user.rank;
            if (record.investigateId || record.dealId) {
                if (record.msgType.value === this.data.msgTypeEnum.investigate.value) {
                    // record.buildArea.title = cn.missionRecord.buildAreaTitleForInvestigate;
                } else {
                    // record.buildArea.title = cn.missionRecord.buildAreaTitleForDeal;
                }
                this.setData({
                    providerUser: new UserProvider(),
                    providerMissionRecord: new ProviderMissionRecord(),
                    record,
                    user
                });
                this.getRecordInfo();
            } else {
                util.showToast("缺少任务记录标识，无法获取任务详情");
            }
        } else {
            util.showToast("请先登录才可查看记录");
            setTimeout(() => {
                util.switchTo({
                    url: miniProgramRoute.user
                });
            }, baseConfig.delay * 1000);
        }
    }
});
