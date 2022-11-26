import {cn} from "../../appConfig/cn";
import bindData from "../../appConfig/bindData";
import {miniProgramRoute} from "../../appConfig/route";
import baseConfig from "../../appConfig/baseConfig";
import {ProviderMissionRecord, nsRecord, AdapterMissionRecord} from "../../provider/missionRecord";
import {UserProvider} from "../../provider/user";
import {ProviderSetting, nsSettingResponse} from "../../provider/setting";
import {util} from "../../utils/util";
import {PingYin} from "../../utils/getPingYin";
import {DateUtil} from "../../utils/date";

// 获取应用实例
const app = getApp<IAppOption>();

//  微信小程序上传文件成功回调参数
interface WechatMiniprogramMpUploaderSuccessCallBackResult extends Object {
    type: string,
    timeStamp: number,
    target: {
        id: string,
        dataset: object
    },
    currentTarget: {
        id: string,
        dataset: {
            [key: string]: string
        }
    },
    mark: object,
    detail: {
        urls: Array<string>
    },
    mut: boolean
}

interface UploadImageFile extends Object {
    url: string
    error?: boolean
    loading?: boolean
}

interface UploadImageFileArr extends Array<UploadImageFile> {

}

//  微信 weui mp-upload 删除图片回调参数类型
interface WechatMiniprogramMpUploaderDeleteHandlerQuery extends Object {
    detail: {
        index: number
        item: object
    }
    currentTarget: {
        id: string
        dataset: {
            [key: string]: string
        }
    }
}

let uploadImageFileArr: UploadImageFileArr = []
    , dateString: string = ""
    /*, pickerSelectionList: Array<{
        alpha: string,
        subItems: Array<{ name: string }>
    }> = []*/
    , regionList: Array<{
        id: number
        regionName: string
    }> = []
    , enumArr: Array<{
        title: string
        value: number
    }> = []
    , otherEvidenceArr: Array<{
        selected: boolean
        title: string
        value: number
        maxCount: number
        filePaths: UploadImageFileArr
    }> = []
    , multiEnumArr: Array<{
        title: string
        value: number
        checked: boolean
    }> = []
    , certificateArr: Array<{
        title: string
        name: string
        selected: boolean
        nameTitle?: string
        nameValue?: string
        numberTitle: string
        numberValue: string
    }> = []
;

Page({
    data: {
        userRankEnum: bindData.userRank.enum,
        propertyOwnerTypeEnum: bindData.propertyOwnerType.enum, //  权属人类型
        unitCredentialsTypeEnum: bindData.unitCredentialsType.enum, //  单位证件类型
        personalCredentialsTypeEnum: bindData.personalCredentialsType.enum,  //  个人证件类型
        belongTypeEnum: bindData.belongType.enum,   //  所处区域
        landTypeEnum: bindData.landType.enum,   //  土地性质
        engineeringSituationTypeEnum: bindData.engineeringSituationType.enum,   //  工程现状类型
        engineeringAgeTypeEnum: bindData.engineeringAgeType.enum,   //  违建类型（新旧）
        useForTypeEnum: bindData.useForType.enum,   //  用途类型
        illegalTypeEnum: bindData.illegalType.enum, //  违建性质
        certificateEnum: bindData.certificate.enum, //  证书类型
        otherEvidenceTypeEnum: bindData.otherEvidence.enum, //  其他证据
        handlerType: "",   //  操作类型
        pingYin: new PingYin(),
        providerUser: new UserProvider(),
        providerMissionRecord: new ProviderMissionRecord(),
        providerSetting: new ProviderSetting(),
        msg: {
            isShow: false,
            type: "success",
            title: cn.missionRecord.addSuccessTitle,
            desc: cn.missionRecord.addSuccessDescript,
            id: 0,
            button: [
                {
                    title: cn.missionRecord.continueAddBtnTitle,
                    classType: "primary",
                    handlerType: "continueAdd"
                }
                , {
                    title: cn.missionRecord.showResultBtnTitle,
                    classType: "default",
                    handlerType: "showResult"
                }
            ]
        },
        form: {
            dealId: 0,  //
            investigateId: 0,
            fileMaxCount: baseConfig.fileMaxCount,
            tips: {
                pleaseInput: cn.global.tips.pleaseInput,
                pleaseSelect: cn.global.tips.pleaseSelect,
                pleaseUpload: cn.global.tips.pleaseUpload
            },
            error: {
                msg: cn.missionRecord.topTip,
                isShow: true
            },
            msgType: {
                tip: cn.missionRecord.msgTypeTip,
                name: "msgType",
                enum: bindData.missionType.enum,
                value: -1   //  选择的类型
            },
            codeNumber: {
                title: cn.missionRecord.codeNumberTitle,
                value: 0
            },
            //  建筑物详细地址（摸查）
            buildingAddress: {
                title: cn.missionRecord.buildingAddressTitle,
                name: "buildingAddress",
                placeHolder: cn.missionRecord.buildingAddressPlaceHolder,
                value: ""
            },
            //  权属人信息（摸查）
            propertyOwner: {
                title: cn.missionRecord.propertyOwnerTypeTitle,
                type: {
                    selectedValue: 0,
                    list: enumArr
                },
                //  权属人姓名或者公司名称
                name: {
                    title: cn.missionRecord.propertyOwnerInfoTitle,
                    unitTitle: cn.missionRecord.unitNameTitle,
                    unitPlaceHolder: cn.missionRecord.unitNamePlaceHolder,
                    personalTitle: cn.missionRecord.personalNameTitle,
                    personalPlaceHolder: cn.missionRecord.personalNamePlaceHolder,
                    name: "property-owner-name",
                    value: ""
                },
                //  证件类型
                credentialsType: {
                    title: cn.missionRecord.credentialsTypeTitle,
                    unitSelectedIndex: 0,
                    unitList: enumArr,
                    personalSelectedIndex: 0,
                    personalList: enumArr
                },
                //  证件号
                credentialsNumber: {
                    title: cn.missionRecord.credentialsNumberTitle,
                    placeHolder: cn.missionRecord.credentialsNumberPlaceHolder,
                    name: "credentialsNumber",
                    value: ""
                },
                //  从属、依赖关系
                relative: {
                    government: {
                        title: cn.missionRecord.withGovernmentTitle,
                        name: "relative-government",
                        selected: false
                    },
                    armedForces: {
                        title: cn.missionRecord.withArmedForcesTitle,
                        name: "relative-armed-forces",
                        selected: false
                    }
                }
            },
            //  所处区域
            belongType: {
                title: cn.missionRecord.belongTypeTitle,
                selectedIndex: 0,
                list: enumArr
            },
            //  土地性质
            landType: {
                title: cn.missionRecord.landTypeTitle,
                selectedIndex: 0,
                list: enumArr
            },
            //  宅基地判断
            curtilage: {
                title: cn.missionRecord.curtilageTitle,
                name: "curtilage",
                selected: false
            },
            //  占地面积
            coverArea: {
                title: cn.missionRecord.coverAreaTitle,
                placeHolder: cn.missionRecord.coverAreaPlaceHolder,
                name: "coverArea",
                value: "",
                valueUnit: cn.missionRecord.buildAreaValueUnit
            },
            //  建筑层数
            buildingStorey: {
                title: cn.missionRecord.buildingStoreyTitle,
                placeHolder: cn.missionRecord.buildingStoreyPlaceHolder,
                name: "buildingStorey",
                value: ""
            },
            //  建筑时间
            buildingStartDate: {
                title: cn.missionRecord.buildStartDateTitle,
                name: "buildingStartDate",
                placeHolder: cn.missionRecord.buildStartDatePlaceHolder,
                startDate: dateString,
                endDate: dateString,
                value: dateString
            },
            //  竣工时间
            buildingEndDate: {
                title: cn.missionRecord.buildEndDateTitle,
                name: "buildingEndData",
                placeHolder: cn.missionRecord.buildEndDatePlaceHolder,
                startDate: dateString,
                endDate: dateString,
                value: dateString
            },
            //  工程现状
            engineeringSituation: {
                title: cn.missionRecord.engineeringSituationTitle,
                selectedIndex: 0,
                list: enumArr
            },
            //  违建类型（新旧）
            engineeringAge: {
                title: cn.missionRecord.engineeringAgeTitle,
                selectedIndex: 0,
                list: enumArr
            },
            //  用途
            useFor: {
                title: cn.missionRecord.useForTitle
                , name: "useFor"
                , list: multiEnumArr  //  可选的项
            },
            //  证书
            certificate: {
                title: cn.missionRecord.certificateTitle,
                numberPlaceHolder: cn.missionRecord.certificateNumberPlaceHolder,
                list: certificateArr
            },
            //  违建性质类型
            illegalType: {
                title: cn.missionRecord.illegalTypeTitle,
                name: "illegalType",
                list: multiEnumArr
            },
            //  其他证据
            otherEvidence: {
                title: cn.missionRecord.otherEvidenceTitle,
                name: "otherEvidence",
                fileUpdateEventType: 'otherEvidence',   //  文件上传事件类型
                list: otherEvidenceArr
            },
            //  参与者信息
            joinerMsg: {
                list: [
                    //  填报人
                    {
                        title: cn.missionRecord.reporterTitle,
                        placeHolder: cn.missionRecord.reporterPlaceHolder,
                        name: "reporter",
                        value: ""
                    },
                    //  复核人
                    {
                        title: cn.missionRecord.confirmerTitle,
                        placeHolder: cn.missionRecord.confirmerPlaceHolder,
                        name: "confirmer",
                        value: ""
                    },
                    //  负责人
                    {
                        title: cn.missionRecord.leaderTitle,
                        placeHolder: cn.missionRecord.leaderPlaceHolder,
                        name: "leader",
                        value: ""
                    }
                ]
            },
            belongArea: {
                title: cn.missionRecord.belongDistrictTitle,
                name: "belongArea",
                value: "",
                selectedIndex: -1,
                list: regionList
            },
            targetUnit: {
                title: cn.missionRecord.targetStreetTitle,
                name: "targetUnit",
                value: "",
                selectedIndex: -1,
                list: regionList
            },
            buildType: {
                title: cn.missionRecord.buildTypeTitle,
                name: "buildType",
                selectedIndex: 0,    //  选择的索引值
                list: [
                    bindData.missionBuildType.enum.farmer,
                    bindData.missionBuildType.enum.other
                ]
            },
            //  建筑名称
            buildName: {
                title: cn.missionRecord.buildNameTitle,
                name: "buildName",
                placeHolder: cn.missionRecord.buildNamePlaceHolder,
                value: ""
            },
            //  建筑面积
            buildArea: {
                title: cn.missionRecord.buildAreaTitle,
                name: "buildArea",
                placeHolder: cn.missionRecord.buildAreaPlaceHolder,
                value: "",
                valueUnit: cn.missionRecord.buildAreaValueUnit
            },
            //  建筑现状
            buildSituation: {
                title: cn.missionRecord.buildSituationTitle,
                name: "buildSituation",
                placeHolder: cn.missionRecord.buildSituationPlaceHolder,
                value: ""
            },
            //  任务日期
            missionDate: {
                title: cn.missionRecord.dealMissionDateTitle,
                name: "missionDate",
                placeHolder: cn.missionRecord.missionDatePlaceHolder,
                startDate: dateString,  //  开始可选的时间
                endDate: dateString,    //  结束可选时间
                value: dateString   //  显示的值
            },
            uploadPhotoTitle: cn.missionRecord.uploadPhotoTitle,
            //  治理拆除前
            beforePhoto: {
                title: cn.missionRecord.dealBeforePhotoTitle,
                name: "beforePhoto",
                maxCount: baseConfig.fileMaxCount,
                value: uploadImageFileArr
            },
            //  治理拆除中
            dealingPhoto: {
                title: cn.missionRecord.dealingPhotoTitle,
                name: "dealingPhoto",
                maxCount: baseConfig.fileMaxCount,
                value: uploadImageFileArr
            },
            //  治理拆除后
            donePhoto: {
                title: cn.missionRecord.dealDonePhotoTitle,
                name: "donePhoto",
                maxCount: baseConfig.fileMaxCount,
                value: uploadImageFileArr
            },
            submit: {
                disabled: false,
                title: cn.missionRecord.submitInfoBtnTitle
            }
        }
    },
    //  消息提示下一步动作处理
    msgEventHandler(e: WechatMiniprogram.InputEvent) {
        switch (e.currentTarget.dataset.type) {
            case "continueAdd":
                this.resetAll();
                break;
            case "showResult":
                const {id} = this.data.msg;

                if (id !== 0) {
                    util.navigatorTo({
                        url: miniProgramRoute.missionRecordDetail,
                        query: {
                            [this.data.form.msgType.value === this.data.form.msgType.enum.investigate.value ? baseConfig.query.investigateMissionRecordId : baseConfig.query.dealMissionRecordId]: id,
                            msgType: this.data.form.msgType.value
                        }
                    });
                } else {
                    util.showToast(cn.global.recordNoFound);
                }
                break;
            default:
                util.showToast("无法处理的点击类型：" + JSON.stringify(e));
                break;
        }
    },
    //  清除所有已填入的数据
    resetAll() {
        let {msg, form} = this.data;

        msg.isShow = false;
        msg.id = 0;
        form.dealId = 0;
        form.investigateId = 0;
        form.msgType.value = form.msgType.enum.investigate.value;
        if (form.msgType.value === form.msgType.enum.investigate.value) {
            form.buildingAddress.value = "";
            form.propertyOwner.type.selectedValue = form.propertyOwner.type.list[0].value;
            form.propertyOwner.name.value = "";
            form.propertyOwner.credentialsType.unitSelectedIndex = 0;
            form.propertyOwner.credentialsType.personalSelectedIndex = 0;
            form.propertyOwner.credentialsNumber.value = "";
            form.propertyOwner.relative.government.selected = form.propertyOwner.relative.armedForces.selected = false;
            form.belongType.selectedIndex = 0;
            form.landType.selectedIndex = 0;
            form.curtilage.selected = false;
            form.coverArea.value = "";
            form.buildingStorey.value = "";
            form.buildingStartDate.value = form.buildingEndDate.value = "";
            form.engineeringSituation.selectedIndex = 0;
            form.engineeringAge.selectedIndex = 0;
            form.useFor.list.forEach(item => item.checked = false);
            form.certificate.list.forEach(item => {
                item.selected = false;
                item.nameValue && (item.nameValue = "");
                item.numberValue && (item.numberValue = "");
            });
            form.illegalType.list.forEach(item => item.checked = false);
            form.otherEvidence.list.forEach(item => {
                item.selected = false;
                item.filePaths = [];
            });
            form.joinerMsg.list.forEach(item => item.value = "");
        } else {
            form.buildType.selectedIndex = 0;
            form.belongArea.value = "";
            form.buildName.value = "";
            form.targetUnit.value = "";
            form.buildSituation.value = "";
            form.beforePhoto.value = [];
            form.dealingPhoto.value = [];
            form.donePhoto.value = [];
            form.missionDate.value = "";
        }
        form.buildArea.value = "";
        this.setData({
            handlerType: "add",
            msg,
            form
        });
    },
    //  选择归属地区
    selectBelongArea(e: WechatMiniprogram.InputEvent) {
        const newIndex = Number(e.detail.value);
        let {form} = this.data;

        if (form.belongArea.selectedIndex !== newIndex) {
            form.belongArea.selectedIndex = newIndex;
            form.belongArea.value = form.belongArea.list[form.belongArea.selectedIndex].regionName;
            //  重选了归属地区后同样重置辖区
            form.targetUnit.value = "";
            form.targetUnit.selectedIndex = 0;
            this.initTargetStreet();
            this.setData({form});
        }
    },
    //  选择辖区
    selectTargetUnit(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.targetUnit.selectedIndex = Number(e.detail.value);
        form.targetUnit.value = form.targetUnit.list[form.targetUnit.selectedIndex].regionName;
        this.setData({form});
    },
    //  选择其他证据
    selectOtherEvidence(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data
            , curIndex = Number(e.currentTarget.dataset.index)
        ;

        form.otherEvidence.list[curIndex].selected = !form.otherEvidence.list[curIndex].selected;
        this.setData({form});
    },
    //  提交表单
    submitInfo(): any {
        let {form} = this.data
            , editMissionRecordPromise: Promise<any>
            , accessToken = this.data.providerUser.getAccessToken()
            , dealPreChecker = () => {
                let errorMsg = "";

                switch (true) {
                    case !app.globalData.isSignIn:
                        errorMsg = cn.user.noSignIn;
                        break;
                    //  验证是否都已经输入完成
                    case form.buildType.selectedIndex === -1:
                        errorMsg = `${form.tips.pleaseInput + form.buildType.title}！`;
                        break;
                    case form.belongArea.value === "":
                        errorMsg = `${form.tips.pleaseInput + form.belongArea.title}！`;
                        break;
                    case form.buildName.value === "":
                        errorMsg = `${form.tips.pleaseInput + form.buildName.title}！`;
                        break;
                    case form.targetUnit.value === "":
                        errorMsg = `${form.tips.pleaseInput + form.targetUnit.title}！`;
                        break;
                    case form.beforePhoto.value.length === 0:
                        errorMsg = `${form.tips.pleaseUpload + form.beforePhoto.title}！`;
                        break;
                    case form.dealingPhoto.value.length === 0:
                        errorMsg = `${form.tips.pleaseUpload + form.dealingPhoto.title}！`;
                        break;
                    case form.donePhoto.value.length === 0:
                        errorMsg = `${form.tips.pleaseUpload + form.donePhoto.title}！`;
                        break;
                    case form.buildArea.value === "":
                        errorMsg = `${form.tips.pleaseInput + form.buildArea.title}！`;
                        break;
                    case form.missionDate.value === "":
                        errorMsg = `${form.tips.pleaseInput + form.missionDate.title}！`;
                        break;
                }

                return errorMsg;
            }
            //  摸查信息验证
            , investigatePreChecker = () => {
                let errorMsg = "";

                switch (true) {
                    case form.buildingAddress.value === "":
                        errorMsg = form.tips.pleaseInput + form.buildingAddress.title + "！";
                        break;
                    case form.propertyOwner.type.selectedValue !== this.data.propertyOwnerTypeEnum.unknown.value && form.propertyOwner.name.value === "":
                        errorMsg = form.tips.pleaseInput + form.propertyOwner.name.title;
                        break;
                    case form.propertyOwner.type.selectedValue !== this.data.propertyOwnerTypeEnum.unknown.value && form.propertyOwner.credentialsNumber.value === "":
                        errorMsg = form.tips.pleaseInput + form.propertyOwner.credentialsNumber.title;
                        break;
                    // case (this.form.propertyOwner.type.selectedValue === this.propertyOwnerTypeEnum.unit.value && ) || (this.form.propertyOwner.type.selectedValue === this.propertyOwnerTypeEnum.personal.value):
                    case form.coverArea.value === "":
                        errorMsg = form.tips.pleaseInput + form.coverArea.title;
                        break;
                    case form.buildArea.value === "":
                        errorMsg = form.tips.pleaseInput + form.buildArea.title;
                        break;
                    case form.buildingStorey.value === "":
                        errorMsg = form.tips.pleaseInput + form.buildingStorey.title;
                        break;
                    case !form.useFor.list.find(item => item.checked):
                        errorMsg = form.tips.pleaseSelect + form.useFor.title;
                        break;
                    case !!form.certificate.list.find(item => item.selected && (item.numberValue === "" || item.nameValue === "")):
                        errorMsg = form.tips.pleaseInput + form.certificate.title;
                        break;
                    case !form.illegalType.list.find(item => item.checked):
                        errorMsg = form.tips.pleaseSelect + form.illegalType.title;
                        break;
                    case !!form.otherEvidence.list.find(item => item.selected && (item.filePaths.length === 0 || !!item.filePaths.find(file => !!file.error || !!file.loading))):
                        errorMsg = form.tips.pleaseUpload + form.otherEvidence.title + "图片";
                        break;
                    case !!form.joinerMsg.list.find(item => item.value === ""):
                        errorMsg = form.tips.pleaseInput + (form.joinerMsg.list.find(item => item.value === "") || {title: "未知"}).title;
                        break;
                }

                return errorMsg;
            }
            //  获取摸查记录要提交的数据
            , getInvestigateRequestData = () => {
                const joinerObj: { [key: string]: string } = {};

                form.joinerMsg.list.forEach(item => {
                    joinerObj[item.name] = item.value;
                });

                return {
                    accessToken,
                    buildingAddress: form.buildingAddress.value,
                    propertyOwnerType: form.propertyOwner.type.selectedValue,
                    propertyOwnerName: form.propertyOwner.name.value,
                    credentialsType: form.propertyOwner.type.selectedValue === this.data.propertyOwnerTypeEnum.unit.value ? form.propertyOwner.credentialsType.unitList[form.propertyOwner.credentialsType.unitSelectedIndex].value : form.propertyOwner.credentialsType.personalList[form.propertyOwner.credentialsType.personalSelectedIndex].value,
                    credentialsNumber: form.propertyOwner.credentialsNumber.value,
                    relativeGovernment: form.propertyOwner.relative.government.selected,
                    relativeArmedForces: form.propertyOwner.relative.armedForces.selected,
                    belongType: form.belongType.list[form.belongType.selectedIndex].value,
                    landType: form.landType.list[form.landType.selectedIndex].value,
                    isCurtilage: form.curtilage.selected,
                    coverArea: form.coverArea.value,
                    buildArea: form.buildArea.value,
                    buildingStorey: Number(form.buildingStorey.value),
                    buildingStartDate: form.buildingStartDate.value,
                    buildingEndDate: form.buildingEndDate.value,
                    engineeringSituation: form.engineeringSituation.list[form.engineeringSituation.selectedIndex].value,
                    engineeringAge: form.engineeringAge.list[form.engineeringAge.selectedIndex].value,
                    useFor: form.useFor.list.filter(item => item.checked).map(item => item.value),
                    certificate: form.certificate.list.map(item => ({
                        selected: item.selected,
                        name: item.nameValue || "",
                        number: item.numberValue || ""
                    })),
                    illegalType: form.illegalType.list.filter(item => item.checked).map(item => item.value),
                    otherEvidence: form.otherEvidence.list.map(item => ({
                        selected: item.selected,
                        value: item.value,
                        filePaths: item.filePaths.filter(item => !item.error && !item.loading).map(item => item.url)
                    })),
                    reporter: joinerObj.reporter,
                    confirmer: joinerObj.confirmer,
                    leader: joinerObj.leader
                }
            }
        ;

        form.error.msg = form.msgType.value === form.msgType.enum.investigate.value ? investigatePreChecker() : dealPreChecker();
        if (form.error.msg) {
            // util.showToast(form.error.msg);
            form.error.isShow = true;
            if (form.error.msg === cn.user.noSignIn) {
                setTimeout(() => {
                    util.switchTo({
                        url: miniProgramRoute.user
                    });
                }, baseConfig.delay * 1000);
            }
            this.setData({form});
            setTimeout(() => {
                let {form} = this.data;

                form.error.isShow = false;
                this.setData({form});
            }, baseConfig.delay * 1000);

            return false;
        }
        //  新增
        if (this.data.handlerType === "add") {
            if (form.msgType.value === form.msgType.enum.investigate.value) {
                editMissionRecordPromise = this.data.providerMissionRecord.createInvestigateMissionRecord({
                    ...getInvestigateRequestData()
                });
            } else {
                editMissionRecordPromise = this.data.providerMissionRecord.createDealMissionRecord({
                    investigateId: form.investigateId,
                    buildType: form.buildType.list[form.buildType.selectedIndex].value,
                    belongArea: form.belongArea.value,
                    buildName: form.buildName.value,
                    targetUnit: form.targetUnit.value,
                    buildArea: form.buildArea.value,
                    beforePhoto: form.beforePhoto.value.filter(item => !item.loading && !item.error).map(item => item.url),
                    dealingPhoto: form.dealingPhoto.value.filter(item => !item.loading && !item.error).map(item => item.url),
                    donePhoto: form.donePhoto.value.filter(item => !item.loading && !item.error).map(item => item.url),
                    missionDate: form.missionDate.value,
                    accessToken
                });
            }
        }
        //  编辑提交
        else {
            if (form.msgType.value === form.msgType.enum.investigate.value) {
                editMissionRecordPromise = this.data.providerMissionRecord.updateInvestigateMissionRecord({
                    id: form.investigateId,
                    ...getInvestigateRequestData()
                });
            } else {
                editMissionRecordPromise = this.data.providerMissionRecord.updateDealMissionRecord({
                    id: form.dealId,
                    buildType: form.buildType.list[form.buildType.selectedIndex].value,
                    belongArea: form.belongArea.value,
                    buildName: form.buildName.value,
                    targetUnit: form.targetUnit.value,
                    buildArea: form.buildArea.value,
                    beforePhoto: form.beforePhoto.value.filter(item => !item.loading && !item.error).map(item => item.url),
                    dealingPhoto: form.dealingPhoto.value.filter(item => !item.loading && !item.error).map(item => item.url),
                    donePhoto: form.donePhoto.value.filter(item => !item.loading && !item.error).map(item => item.url),
                    missionDate: form.missionDate.value,
                    accessToken
                });
            }
        }
        editMissionRecordPromise.then(res => {
            switch (res.status) {
                //  成功
                case 1000:
                    util.showToast("提交成功！");
                    let {msg} = this.data;

                    msg.id = res.data.id;
                    msg.isShow = true;
                    this.setData({msg});
                    break;
                //  失败
                case 1001:
                    util.showToast(res.msg);
                    break;
                //  未知错误
                default:
                    util.showToast(`创建任务记录出现${cn.global.error.errorUnknown}：` + JSON.stringify(res));
                    break;
            }
        })
            .catch(err => {
                util.showToast("更新任务记录接口异常：" + JSON.stringify(err));
            })
        ;
    },
    //  建筑物地址输入框离开事件
    buildingAddressBlur(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.buildingAddress.value = e.detail.value;
        this.setData({form});
    },
    //  修改权属人类型
    changePropertyOwnerType(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.propertyOwner.type.selectedValue = Number(e.detail.value);
        this.setData({form});
    },
    //  权属人姓名/组织名称输入框离开事件
    propertyOwnerNameBlur(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.propertyOwner.name.value = e.detail.value;
        this.setData({form});
    },
    //  修改权属人证件类型
    changeCredentialsType(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;
        const isUnitType = form.propertyOwner.type.selectedValue === this.data.propertyOwnerTypeEnum.unit.value
            ,
            newValue = (isUnitType ? form.propertyOwner.credentialsType.unitList : form.propertyOwner.credentialsType.personalList).findIndex(item => item.value === Number(e.detail.value));

        isUnitType ? (form.propertyOwner.credentialsType.unitSelectedIndex = newValue) : (form.propertyOwner.credentialsType.personalSelectedIndex = newValue);
        this.setData({form});
    },
    //  权属人证件号输入框离开事件
    propertyOwnerCredentialsNumberBlur(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.propertyOwner.credentialsNumber.value = e.detail.value;
        this.setData({form});
    },
    //  切换选择是否属于政府单位
    toggleIsGovernment() {
        let {form} = this.data;

        form.propertyOwner.relative.government.selected = !form.propertyOwner.relative.government.selected;
        this.setData({form});
    },
    //  切换选择是否属于军队
    toggleIsArmedForces() {
        let {form} = this.data;

        form.propertyOwner.relative.armedForces.selected = !form.propertyOwner.relative.armedForces.selected;
        this.setData({form});
    },
    //  所处地区修改事件
    changeBelongType(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.belongType.selectedIndex = form.belongType.list.findIndex(item => item.value === Number(e.detail.value));
        this.setData({form});
    },
    //  土地性质修改事件
    changeLandType(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.landType.selectedIndex = form.landType.list.findIndex(item => item.value === Number(e.detail.value));
        this.setData({form});
    },
    //  切换是否为宅基地
    toggleIsCurtilage() {
        let {form} = this.data;

        form.curtilage.selected = !form.curtilage.selected;
        this.setData({form});
    },
    //  建筑位置输入框离开事件
    buildNameBlur(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.buildName.value = e.detail.value;
        this.setData({form});
    },
    //  占地面积输入框离开事件
    coverAreaBlur(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.coverArea.value = e.detail.value;
        this.setData({form});
    },
    //  建筑面积输入框离开事件
    buildAreaBlur(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.buildArea.value = e.detail.value;
        this.setData({form});
    },
    //  建筑层数输入框离开事件
    buildingStoreyBlur(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.buildingStorey.value = e.detail.value;
        this.setData({form});
    },
    //  工程现状输入框离开事件
    changeEngineeringSituation(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.engineeringSituation.selectedIndex = form.engineeringSituation.list.findIndex(item => item.value === Number(e.detail.value));
        this.setData({form});
    },
    //  工程违建类型（新旧）修改事件
    changeEngineeringAge(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.engineeringAge.selectedIndex = form.engineeringAge.list.findIndex(item => item.value === Number(e.detail.value));
        this.setData({form});
    },
    //  修改用途
    changeUseFor(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data
            , useForObj: { [key: number]: boolean } = {}
        ;

        (<any>e.detail.value).forEach((value: number) => {
            useForObj[value] = true;
        });
        form.useFor.list.forEach(item => {
            item.checked = !!useForObj[item.value];
        });
        this.setData({form});
    },
    //  切换证书是否存在
    toggleCertificate(e: WechatMiniprogram.InputEvent) {
        const curIndex = Number(e.currentTarget.dataset.index);
        let {form} = this.data;

        form.certificate.list[curIndex].selected = !form.certificate.list[curIndex].selected;
        this.setData({form});
    },
    //  证书名称输入框离开事件
    certificateNameBlur(e: WechatMiniprogram.InputEvent) {
        const curIndex = Number(e.currentTarget.dataset.index);
        let {form} = this.data;

        form.certificate.list[curIndex].nameValue = e.detail.value;
        this.setData({form});
    },
    //  证书编号输入框离开事件
    certificateNumberBlur(e: WechatMiniprogram.InputEvent) {
        const curIndex = Number(e.currentTarget.dataset.index);
        let {form} = this.data;

        form.certificate.list[curIndex].numberValue = e.detail.value;
        this.setData({form});
    },
    //  修改违法建设性质
    changeIllegalType(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data
            , illegalCheckedObj: { [key: number]: boolean } = {}
        ;

        (<any>e.detail.value).forEach((value: number) => {
            illegalCheckedObj[value] = true;
        });
        form.illegalType.list.forEach(item => {
            item.checked = !!illegalCheckedObj[item.value];
        });
        this.setData({form});
    },
    //  参与人员输入框离开事件
    joinerBlur(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.joinerMsg.list[Number(e.currentTarget.dataset.index)].value = e.detail.value;
        this.setData({form});
    },
    //  建筑现状输入框离开事件
    buildSituationBlur(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.buildSituation.value = e.detail.value;
        this.setData({form});
    },
    //  建设开始日期更改事件处理
    changeBuildingStartDate(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.buildingStartDate.value = AdapterMissionRecord.dateToShow(e.detail.value);
        this.setData({form});
    },
    //  竣工日期更改事件处理
    changeBuildingEndDate(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.buildingEndDate.value = AdapterMissionRecord.dateToShow(e.detail.value);
        this.setData({form});
    },
    //  任务日期更改事件处理
    missionDateChange(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.missionDate.value = e.detail.value;
        this.setData({form});
    },
    //  任务时间输入框离开事件
    missionDateBlur(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data;

        form.missionDate.value = AdapterMissionRecord.dateToShow(e.detail.value);
        this.setData({form});
    },
    //  修改建设类型
    buildTypeChange(e: WechatMiniprogram.InputEvent) {
        let {form} = this.data
            , currentIndex = form.buildType.list.findIndex(item => item.value === e.detail.value)
        ;

        if (currentIndex > -1) {
            form.buildType.selectedIndex = currentIndex;
            this.setData({form});
        } else {
            console.log(`没有正确的${this.data.form.buildType.title}选项可选`);
        }
    },
    selectFile(files: Array<object>) {
        console.log("选择的文件：" + files);
    },
    //  上传证据图片
    uploadOtherEvidencePhotoFile(result: WechatMiniprogram.ChooseImageSuccessCallbackResult) {
        return this.uploadFile(result.tempFilePaths, {});
    },
    //  上传证据图片成功回调
    uploadEvidencePhotoFileSuccess(e: WechatMiniprogramMpUploaderSuccessCallBackResult) {
        let {form} = this.data;

        e.detail.urls.forEach(item => {
            form.otherEvidence.list[Number(e.currentTarget.dataset.index)].filePaths.push({
                url: item,
                loading: false,
                error: false
            });
        });
        this.setData({form});
    },
    //  上传拆除前照片
    uploadBeforeDealPhotoFile(result: WechatMiniprogram.ChooseImageSuccessCallbackResult) {
        return this.uploadFile(result.tempFilePaths, {
            /*successHandler: res => {
                let {form} = this.data;

                res.data.buildingPhotoFilePath.forEach((item: any) => {
                    form.beforePhoto.value.push({
                        url: item,
                        loading: false,
                        error: false
                    });
                });
                this.setData({form});
            }*/
        });
    },
    //  上传拆除前照片成功
    uploadBeforePhotoSuccess(e: WechatMiniprogramMpUploaderSuccessCallBackResult) {
        let {form} = this.data;

        e.detail.urls.forEach(item => {
            form.beforePhoto.value.push({
                url: item,
                loading: false,
                error: false
            });
        });
        this.setData({form});
    },
    //  上传拆除中照片
    uploadDealingPhotoFile(result: WechatMiniprogram.ChooseImageSuccessCallbackResult) {
        return this.uploadFile(result.tempFilePaths, {
            /*successHandler: res => {
                let {form} = this.data;

                res.data.buildingPhotoFilePath.forEach((item: any) => {
                    form.dealingPhoto.value.push({
                        url: item,
                        loading: false,
                        error: false
                    });
                });
                this.setData({form});
            }*/
        });
    },
    // 上传拆除中照片成功
    uploadDealingPhotoSuccess(e: WechatMiniprogramMpUploaderSuccessCallBackResult) {
        let {form} = this.data;

        e.detail.urls.forEach(item => {
            form.dealingPhoto.value.push({
                url: item,
                loading: false,
                error: false
            });
        });
        this.setData({form});
    },
    //  上传拆除后照片
    uploadDoneDealPhotoFile(result: WechatMiniprogram.ChooseImageSuccessCallbackResult) {
        return this.uploadFile(result.tempFilePaths, {
            /*successHandler: res => {
                let {form} = this.data;

                res.data.buildingPhotoFilePath.forEach((item: any) => {
                    form.donePhoto.value.push({
                        url: item,
                        loading: false,
                        error: false
                    });
                });
                this.setData({form});
            }*/
        });
    },
    // 上传拆除后照片成功
    uploadDonePhotoSuccess(e: WechatMiniprogramMpUploaderSuccessCallBackResult) {
        let {form} = this.data;

        e.detail.urls.forEach(item => {
            form.donePhoto.value.push({
                url: item,
                loading: false,
                error: false
            });
        });
        this.setData({form});
    },
    //  总处理上传文件
    uploadFile(filePaths: Array<string>, options: { successHandler?: (res: any) => void }) {
        console.log("进入文件上传处理：" + JSON.stringify(filePaths));

        return util.uploadFile({
            filePath: filePaths
        }).then(res => {
            let resultPromise;

            switch (res.status) {
                //  成功
                case 1000:
                    typeof options.successHandler === "function" && options.successHandler(res);
                    resultPromise = Promise.resolve({
                        urls: res.data.buildingPhotoFilePath
                    });
                    break;
                //    失败
                case 1001:
                    resultPromise = Promise.reject(res.msg);
                    break;
                //    未知错误
                default:
                    resultPromise = Promise.reject("未知错误");
                    break;
            }

            return resultPromise;
        })
            .catch((err: any) => Promise.reject("上传图片接口异常：" + JSON.stringify(err)))
            ;
    },
    //  上传成功
    uploadSuccess() {
        util.showToast("上传成功");
    },
    //  上传出错
    uploadError(err: {
        type: number,
        errMsg: string
    }) {
        util.showToast("上传错误：" + JSON.stringify(err));
    },
    //  删除其他证据图片触发事件
    otherEvidencePhotoDelete(e: WechatMiniprogramMpUploaderDeleteHandlerQuery) {
        let {form} = this.data;

        form.otherEvidence.list[Number(e.currentTarget.dataset.index)].filePaths.splice(e.detail.index, 1);
        this.setData({form});
    },
    //  删除拆除前照片触发事件
    beforeDealPhotoDelete(e: WechatMiniprogramMpUploaderDeleteHandlerQuery) {
        let {form} = this.data;

        form.beforePhoto.value.splice(e.detail.index, 1);
        this.setData({form});
    },
    //  删除拆除中照片触发事件
    dealingPhotoDelete(e: WechatMiniprogramMpUploaderDeleteHandlerQuery) {
        let {form} = this.data;

        form.dealingPhoto.value.splice(e.detail.index, 1);
        this.setData({form});
    },
    //  删除拆除后照片触发事件
    doneDealPhotoDelete(e: WechatMiniprogramMpUploaderDeleteHandlerQuery) {
        let {form} = this.data;

        form.donePhoto.value.splice(e.detail.index, 1);
        this.setData({form});
    },
    //  初始化目标辖区选择
    initTargetStreet() {
        let {form} = this.data;

        this.getRegion(form.belongArea.list[form.belongArea.selectedIndex].id, resData => {
            let {form} = this.data;

            form.targetUnit.list = resData.map(item => {
                return {
                    id: item.Id,
                    regionName: item.RegionName
                };
            });
            if (form.targetUnit.value) {
                form.targetUnit.list.forEach((item, index) => {
                    if (item.regionName === form.targetUnit.value) {
                        form.targetUnit.selectedIndex = index;
                    }
                });
            } else if (form.targetUnit.list.length) {
                form.targetUnit.selectedIndex = 0;
                form.targetUnit.value = form.targetUnit.list[form.targetUnit.selectedIndex].regionName;
            }
            this.setData({form});
        });
    },
    //  获取地区
    getRegion(regionId: number | undefined, callback: (data: Array<nsSettingResponse.regionItem>) => void) {
        this.data.providerSetting.getRegion(regionId).then(res => {
            switch (res.status) {
                //  成功
                case 1000:
                    callback(res.data);
                    break;
                //   失败
                case 1001:
                default:
                    util.showToast("获取地区接口出现错误：" + JSON.stringify(res));
                    break;
            }
        })
    },
    onLoad(options: Record<string, string | undefined>) {
        const dateFormat = "yyyy-MM-dd" //  日期格式
            , {form} = this.data
            , msgType = Number(options[baseConfig.query.msgType] || form.msgType.enum.investigate.value)
        ;
        let date = new Date()
            , dateForDatePicker = new DateUtil(date).pattern(dateFormat)
            , limitEarliestDate = +date - 100 * 365 * 24 * 60 * 60 * 1000    //    限制的最早日期
            , resultPromise
        ;

        this.setData({
            //  直接填写在data中会丢失实例对象，原因未知，先以再次赋值进行处理
            providerUser: new UserProvider(),
            providerMissionRecord: new ProviderMissionRecord(),
            providerSetting: new ProviderSetting(),
            handlerType: options.handlerType || "add"
        });
        form.investigateId = Number(options[baseConfig.query.investigateMissionRecordId] || 0);
        form.dealId = Number(options[baseConfig.query.dealMissionRecordId] || 0);
        //  确定要填写的信息类型
        form.msgType.value = msgType === form.msgType.enum.deal.value ? msgType : form.msgType.enum.investigate.value;
        //  对不同信息类型进行处理
        if (form.msgType.value === form.msgType.enum.investigate.value) {
            Object.values(this.data.propertyOwnerTypeEnum).forEach(item => form.propertyOwner.type.list.push(item));
            form.propertyOwner.type.list.length && (form.propertyOwner.type.selectedValue = form.propertyOwner.type.list[0].value);
            Object.values(this.data.unitCredentialsTypeEnum).forEach(item => form.propertyOwner.credentialsType.unitList.push(item));
            Object.values(this.data.personalCredentialsTypeEnum).forEach(item => form.propertyOwner.credentialsType.personalList.push(item));
            Object.values(this.data.belongTypeEnum).forEach(item => form.belongType.list.push(item));
            Object.values(this.data.landTypeEnum).forEach(item => form.landType.list.push(item));
            Object.values(this.data.engineeringSituationTypeEnum).forEach(item => form.engineeringSituation.list.push(item));
            Object.values(this.data.engineeringAgeTypeEnum).forEach(item => form.engineeringAge.list.push(item));
            Object.values(this.data.useForTypeEnum).forEach(item => form.useFor.list.push({
                title: item.title,
                value: item.value,
                checked: false
            }));
            Object.values(this.data.illegalTypeEnum).forEach(item => form.illegalType.list.push({
                title: item.title,
                value: item.value,
                checked: false
            }));
            Object.keys(this.data.certificateEnum).forEach(key => {
                const item = (this.data.certificateEnum as { [key: string]: any })[key];

                item.name = key;
                item.selected = item.selected || false;
                item.nameTitle && (item.nameValue = item.nameValue || "");
                item.numberValue = item.numberValue || "";
                form.certificate.list.push(item);
            });
            Object.values(this.data.otherEvidenceTypeEnum).forEach(item => {
                form.otherEvidence.list.push({
                    selected: false
                    , title: item.title
                    , value: item.value
                    , maxCount: form.fileMaxCount
                    , filePaths: []
                });
            });
            form.buildingStartDate.value = form.buildingEndDate.value = AdapterMissionRecord.dateToShow(dateForDatePicker);
        } else {
            form.buildArea.title = cn.missionRecord.buildAreaTitleForDeal;
            form.missionDate.value = AdapterMissionRecord.dateToShow(dateForDatePicker);
        }
        //  操作类型
        switch (this.data.handlerType) {
            //  查看
            case "check":

                break;
            // 编辑，需要处理摸查和治理的信息获取
            case "edit":
                if (form.investigateId || form.dealId) {
                    const accessToken = this.data.providerUser.getAccessToken();
                    let {form} = this.data
                        , adapterPhotoValue = (valueStr: string) => {
                            return valueStr ? valueStr.split(",").map(url => {
                                return {
                                    url,
                                    error: false,
                                    loading: false
                                };
                            }) : []
                        }
                    ;

                    if (form.msgType.value === form.msgType.enum.investigate.value) {
                        resultPromise = this.data.providerMissionRecord.getInvestigateRecordDetail(form.investigateId, accessToken).then(res => {
                            switch (res.status) {
                                //  成功，显示内容
                                case 1000:
                                    const data = res.data as nsRecord.InvestigateDetailAdapterResult;
                                    let {form} = this.data;

                                    form.dealId = data.gbId;
                                    form.codeNumber.value = data.codeNumber;
                                    form.buildingAddress.value = data.buildingAddress;
                                    form.propertyOwner.type.selectedValue = data.propertyOwnerType;
                                    form.propertyOwner.name.value = data.propertyOwnerName;
                                    if (form.propertyOwner.type.selectedValue !== this.data.propertyOwnerTypeEnum.unknown.value) {
                                        form.propertyOwner.type.selectedValue === this.data.propertyOwnerTypeEnum.unit.value ? (form.propertyOwner.credentialsType.unitSelectedIndex = form.propertyOwner.credentialsType.unitList.findIndex(item => item.value === data.credentialsType)) : (form.propertyOwner.credentialsType.personalSelectedIndex = form.propertyOwner.credentialsType.personalList.findIndex(item => item.value === data.credentialsType));
                                    }
                                    form.propertyOwner.credentialsNumber.value = data.credentialsNumber;
                                    form.propertyOwner.relative.government.selected = data.relativeGovernment;
                                    form.propertyOwner.relative.armedForces.selected = data.relativeArmedForces;
                                    form.belongType.selectedIndex = form.belongType.list.findIndex(item => item.value === data.belongType);
                                    form.landType.selectedIndex = form.landType.list.findIndex(item => item.value === data.landType);
                                    form.curtilage.selected = data.isCurtilage;
                                    form.coverArea.value = data.coverArea.toString();
                                    form.buildArea.value = data.buildArea.toString();
                                    form.buildingStorey.value = data.buildingStorey.toString();
                                    form.buildingStartDate.value = data.buildingStartDate;
                                    form.buildingEndDate.value = data.buildingEndDate;
                                    form.engineeringSituation.selectedIndex = form.engineeringSituation.list.findIndex(item => item.value === data.engineeringSituation);
                                    form.engineeringAge.selectedIndex = form.engineeringAge.list.findIndex(item => item.value === data.engineeringAge);
                                    (() => {
                                        let useForCheckedObj: { [key: number]: boolean } = {};  //  将已选的用途标识映射成键值对形式

                                        data.useFor.forEach(value => {
                                            useForCheckedObj[value] = true;
                                        });
                                        form.useFor.list.forEach(item => {
                                            if (useForCheckedObj[item.value]) {
                                                item.checked = true;
                                            }
                                        });
                                    })();
                                    form.certificate.list.forEach(certItem => {
                                        const itemData = data.certificate[certItem.name];

                                        if (itemData) {
                                            certItem.selected = itemData.selected;
                                            itemData.nameValue && (certItem.nameValue = itemData.nameValue);
                                            itemData.numberValue && (certItem.numberValue = itemData.numberValue);
                                        }
                                    });
                                    (() => {
                                        let illegalTypeCheckedObj: { [key: number]: boolean } = {}; //  将已选的违法建设性质映射为键值对形式

                                        data.illegalType.forEach(value => {
                                            illegalTypeCheckedObj[value] = true;
                                        });
                                        form.illegalType.list.forEach(illegalItem => {
                                            if (illegalTypeCheckedObj[illegalItem.value]) {
                                                illegalItem.checked = true;
                                            }
                                        });
                                    })();
                                    (() => {
                                        let otherEvidenceObj: {[value: number]: nsRecord.OtherEvidenceItem} = {};  //  将已有的其他证据内容映射为对象

                                        data.otherEvidence.forEach(item => {
                                            otherEvidenceObj[item.value] = item;
                                        });
                                        form.otherEvidence.list.forEach((item, index) => {
                                            const curTarget = otherEvidenceObj[item.value];

                                            if (curTarget) {
                                                item.selected = curTarget.selected;
                                                item.filePaths = curTarget.filePaths.map(url => {
                                                    return {
                                                        url
                                                        , loading: false
                                                        , error: false
                                                    };
                                                });
                                            }
                                        });
                                    })();
                                    form.joinerMsg.list.forEach(joinerItem => {
                                        const joinerData = data[joinerItem.name];

                                        if (joinerData) {
                                            joinerItem.value = joinerData;
                                        }
                                    });
                                    this.setData({form});
                                    break;
                                default:
                                    util.showToast("获取摸查任务记录详情未知错误:" + JSON.stringify(res));
                                    break;
                            }
                        });
                    } else {
                        resultPromise = this.data.providerMissionRecord.getDealRecordDetail(form.dealId, accessToken).then(res => {
                            switch (res.status) {
                                //  成功
                                case 1000:
                                    let {form} = this.data;

                                    form.investigateId = res.data.palpationId;
                                    form.dealId = res.data.id;
                                    form.codeNumber.value = res.data.number;
                                    form.belongArea.value = res.data.region;
                                    form.targetUnit.value = res.data.jurisdiction;
                                    form.buildType.list.forEach((item, index) => {
                                        if (item.value === String(res.data.infoType)) {
                                            form.buildType.selectedIndex = index;
                                        }
                                    });
                                    form.buildName.value = res.data.position;
                                    form.buildArea.value = res.data.area;
                                    form.buildSituation.value = res.data.nowStatus;
                                    form.missionDate.value = res.data.dismantleDate;
                                    form.beforePhoto.value = adapterPhotoValue(res.data.imageData1);
                                    form.dealingPhoto.value = adapterPhotoValue(res.data.imageData2);
                                    form.donePhoto.value = adapterPhotoValue(res.data.imageData3);
                                    this.setData({form});
                                    break;
                                //  失败
                                case 1001:
                                //  未知错误
                                default:
                                    util.showToast("获取治理任务记录详情未知错误:" + JSON.stringify(res));
                                    break;
                            }
                        });
                    }
                    resultPromise
                        .catch(err => {
                            util.showToast("获取任务记录详情接口异常：" + JSON.stringify(err));
                        });
                    this.setData({form});
                } else {
                    util.showToast("缺少任务记录标识，无法编辑");
                }
                break;
            //  新增
            case "add":
            default:
                break;
        }
        //  补充公用配置信息
        form.buildingStartDate.startDate = form.buildingEndDate.startDate = form.missionDate.startDate = (new DateUtil(new Date(limitEarliestDate))).pattern(dateFormat);
        form.buildingStartDate.endDate = dateForDatePicker;
        form.buildingEndDate.endDate = dateForDatePicker;
        form.missionDate.endDate = dateForDatePicker;
        //  预填资料
        !form.belongArea.value && (form.belongArea.value = app.globalData.user.region.belongArea.name);
        !form.targetUnit.value && app.globalData.user.rank === this.data.userRankEnum.street.value && (form.targetUnit.value = app.globalData.user.currentUnit);
        //  获取可选地区
        if (this.data.handlerType === "add" || this.data.handlerType === "edit") {
            Promise.all([resultPromise, new Promise(resolve => this.getRegion(app.globalData.user.region.city.id, resolve))])
                .then(([infoData, regionRes]) => {
                    let {form} = this.data;

                    console.log(infoData);
                    form.belongArea.list = (<Array<nsSettingResponse.regionItem>>regionRes).map(item => {
                        return {
                            id: item.Id,
                            regionName: item.RegionName
                        };
                    });
                    //  已有预填入值的情况
                    if (form.belongArea.value) {
                        form.belongArea.list.forEach((item, index) => {
                            if (item.regionName === form.belongArea.value) {
                                form.belongArea.selectedIndex = index;
                            }
                        });
                    }
                    //  没有预填入值，使用第一个地区
                    else if (form.belongArea.list.length) {
                        form.belongArea.selectedIndex = 0;
                        form.belongArea.value = form.belongArea.list[form.belongArea.selectedIndex].regionName;
                    } else {
                        util.showToast("没有可选地区，无法正常选择");
                    }
                    //  有选择地区的情况下，继续提前加载可选辖区
                    if (form.belongArea.selectedIndex > -1) {
                        this.initTargetStreet();
                    }
                    form.error.isShow = false;
                    this.setData({form});
                })
            ;
        }
        // const ubepFileArr = this.data.form.otherEvidence.list.map(item => this.uploadOtherEvidencePhotoFile.bind(this));

        this.setData({
            form,
            uploadOtherEvidencePhotoFile: this.uploadOtherEvidencePhotoFile.bind(this),
            // uploadOtherEvidencePhotoFile: ubepFileArr,
            uploadBeforeDealPhotoFile: this.uploadBeforeDealPhotoFile.bind(this),
            uploadDealingPhotoFile: this.uploadDealingPhotoFile.bind(this),
            uploadDoneDealPhotoFile: this.uploadDoneDealPhotoFile.bind(this),
            //这里需要绑定uploadFile函数，因为在uploader组件中会调用这个方法，不绑定的话，this会指向uploader组件中的this，但是uploader组件中没有这个方法，这个方法需要用户自定义
        });
    },
    onShow() {
    }
});