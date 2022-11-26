<template lang="pug">
    .page-mission-record-detail
        left-menu
            tab-bar(slot="menu", :list="tabBar.list", :active-index="tabBar.selectedIndex")
            div(slot="content")
                .page__hd
                    .page__title.page-title.text-center {{record.belongArea.value}}{{record.msgType.value === msgTypeEnum.investigate.value ? msgTypeEnum.investigate.title : msgTypeEnum.deal.title}}工作台账
                .page__bd
                    mp-gallery(:isShow="gallery.isShow", :image="gallery.imageUrl", @eventHandler="galleryEventHandler")
                    .weui-cells__title {{record.title}}
                    .weui-cells
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.codeNumber.title}}
                            .weui-cell__ft {{record.codeNumber.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.msgType.title}}
                            .weui-cell__ft {{record.msgType.value === msgTypeEnum.investigate.value ? msgTypeEnum.investigate.title : msgTypeEnum.deal.title}}
                    .weui-cells(v-show="record.msgType.value === msgTypeEnum.investigate.value")
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.buildingAddress.title}}
                            .weui-cell__ft {{record.buildingAddress.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.propertyOwnerType.title}}
                            .weui-cell__ft {{record.propertyOwnerType.valueDesc}}
                        .weui-cell.mp-cell(v-show="record.propertyOwnerType.value !== propertyOwnerTypeEnum.unknown.value")
                            .weui-cell__bd
                                p {{record.propertyOwnerType.value === propertyOwnerTypeEnum.unit.value ? record.propertyOwnerName.unitTitle :  record.propertyOwnerName.personalTitle}}
                            .weui-cell__ft {{record.propertyOwnerName.value}}
                        .weui-cell.mp-cell(v-show="record.propertyOwnerType.value !== propertyOwnerTypeEnum.unknown.value")
                            .weui-cell__bd
                                p {{record.credentialsType.title}}
                            .weui-cell__ft {{record.credentialsType.value}}
                        .weui-cell.mp-cell(v-show="record.propertyOwnerType.value !== propertyOwnerTypeEnum.unknown.value")
                            .weui-cell__bd
                                p {{record.credentialsNumber.title}}
                            .weui-cell__ft {{record.credentialsNumber.value}}
                        .weui-cell.mp-cell(v-show="record.propertyOwnerType.value === propertyOwnerTypeEnum.unit.value")
                            .weui-cell__bd
                                p {{record.relative.government.title}}
                            .weui-cell__ft {{record.relative.government.selected ? '是' : '否'}}
                        .weui-cell.mp-cell(v-show="record.propertyOwnerType.value === propertyOwnerTypeEnum.unit.value")
                            .weui-cell__bd
                                p {{record.relative.armedForces.title}}
                            .weui-cell__ft {{record.relative.armedForces.selected ? '是' : '否'}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.belongType.title}}
                            .weui-cell__ft {{record.belongType.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.landType.title}}
                            .weui-cell__ft {{record.landType.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.curtilage.title}}
                            .weui-cell__ft {{record.curtilage.selected ? "是" : "否"}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.coverArea.title}}
                            .weui-cell__ft {{record.coverArea.value}}{{record.buildArea.valueUnit}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.buildArea.title}}
                            .weui-cell__ft {{record.buildArea.value}}{{record.buildArea.valueUnit}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.buildingStorey.title}}
                            .weui-cell__ft {{record.buildingStorey.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.buildingStartDate.title}}
                            .weui-cell__ft {{record.buildingStartDate.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.buildingEndDate.title}}
                            .weui-cell__ft {{record.buildingEndDate.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.engineeringSituation.title}}
                            .weui-cell__ft {{record.engineeringSituation.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.engineeringAge.title}}
                            .weui-cell__ft {{record.engineeringAge.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.useFor.title}}
                            .weui-cell__ft {{record.useFor.value.join("、")}}
                        .weui-cell.mp-cell(v-for="cert in record.certificate.value")
                            .weui-cell__bd
                                p {{cert.title}}
                            .weui-cell__ft {{cert.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.illegalType.title}}
                            .weui-cell__ft {{record.illegalType.value.join("、")}}
                    .weui-cells__group.weui-cells__group_form(v-show="record.msgType.value === msgTypeEnum.investigate.value && oe.selected", v-for="oe in record.otherEvidence.value", :key="oe.value")
                        .weui-cells__title {{oe.title}}
                        .weui-cells
                            .weui-cell.mp-cell
                                ul.photo-list.ul.clearf
                                    .li(v-for="(imageUrl, index) in oe.filePaths", :key="imageUrl", @click="uploadPhotoClick(index, 'otherEvidence', imageUrl)")
                                        img.photo(:src="imageUrl")
                    .weui-cells(v-show="record.msgType.value === msgTypeEnum.investigate.value")
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.reporter.title}}
                            .weui-cell__ft {{record.reporter.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.confirmer.title}}
                            .weui-cell__ft {{record.confirmer.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.leader.title}}
                            .weui-cell__ft {{record.leader.value}}
                    .weui-cells(v-show="record.msgType.value === msgTypeEnum.deal.value")
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.belongArea.title}}
                            .weui-cell__ft {{record.belongArea.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.targetUnit.title}}
                            .weui-cell__ft {{record.targetUnit.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.buildType.title}}
                            .weui-cell__ft {{record.buildType.value === record.buildType.enum.farmer.value ? record.buildType.enum.farmer.title : record.buildType.enum.other.title}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.buildName.title}}
                            .weui-cell__ft {{record.buildName.value}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.buildArea.title}}
                            .weui-cell__ft {{record.buildArea.value}}{{record.buildArea.valueUnit}}
                        .weui-cell.mp-cell
                            .weui-cell__bd
                                p {{record.missionDate.dealTitle}}
                            .weui-cell__ft {{record.missionDate.value}}
                    .weui-cells__title(v-show="record.msgType.value === msgTypeEnum.deal.value") {{record.beforePhoto.title}}
                    .weui-cells(v-show="record.msgType.value === msgTypeEnum.deal.value")
                        ul.photo-list.ul.clearf
                            .li(v-for="(item, index) in record.beforePhoto.value", :key="item", @click="uploadPhotoClick(index, 'beforePhoto', item)")
                                img.photo(:src="item")
                    .weui-cells__title(v-show="record.msgType.value === msgTypeEnum.deal.value") {{record.dealingPhoto.title}}
                    .weui-cells(v-show="record.msgType.value === msgTypeEnum.deal.value")
                        ul.photo-list.ul.clearf
                            .li(v-for="(item, index) in record.dealingPhoto.value", :key="item", @click="uploadPhotoClick(index, 'dealingPhoto', item)")
                                img.photo(:src="item")
                    .weui-cells__title(v-show="record.msgType.value === msgTypeEnum.deal.value") {{record.donePhoto.title}}
                    .weui-cells(v-show="record.msgType.value === msgTypeEnum.deal.value")
                        ul.photo-list.ul.clearf
                            .li(v-for="(item, index) in record.donePhoto.value", :key="item", @click="uploadPhotoClick(index, 'donePhoto', item)")
                                img.photo(:src="item")
                    .status.component-status
                        p.value.disabled(v-show="record.status === recordStatusEnum.waitForCheck.value") {{recordStatusEnum.waitForCheck.title}}
                        p.value.active(v-show="record.status >= recordStatusEnum.checked.value && record.status !== recordStatusEnum.unlocked.value") {{recordStatusEnum.checked.title2}}
                        p.value.disabled(v-show="record.status === recordStatusEnum.checked.value") {{recordStatusEnum.checked.title}}
                        p.value.active(v-show="record.status >= recordStatusEnum.confirmed.value && record.status !== recordStatusEnum.unlocked.value") {{recordStatusEnum.confirmed.title2}}
                        p.value.disabled(v-show="record.status === recordStatusEnum.confirmed.value") {{recordStatusEnum.confirmed.title}}
                        p.value.active(v-show="record.status === recordStatusEnum.reconfirmed.value") {{recordStatusEnum.reconfirmed.title}}
                        p.value.warn(v-show="record.status === recordStatusEnum.unlocked.value") {{recordStatusEnum.unlocked.title}}
                    .control-bar
                        a.weui-btn.weui-btn_primary.btn.block.btn-download-document.text-center(v-show="record.status === recordStatusEnum.reconfirmed.value", @click="downloadDocument")
                            span.text {{control.showDocument.title}}
                            img.icon(:src="iconDownloadPath")
                        a.weui-btn.weui-btn_default.btn.block(v-show="record.msgType.value === msgTypeEnum.deal.value && record.investigateId !== 0", @click="showInvestigateInfo") {{control.showInvestigate.title}}
                        a.weui-btn.weui-btn_default.btn.block(v-show="user.id === record.submitUserId && record.msgType.value === msgTypeEnum.investigate.value && record.status === recordStatusEnum.unlocked.value", @click="editInvestigateInfo") {{control.editInvestigate.title}}
                        a.weui-btn.weui-btn_default.btn.block(v-show="record.msgType.value === msgTypeEnum.investigate.value && record.dealId !== 0", @click="showDealInfo") {{control.dealDetail.title}}
                        a.weui-btn.weui-btn_default.btn.block(v-show="user.id === record.submitUserId && (record.dealId === 0 || (record.msgType.value === msgTypeEnum.deal.value && record.status === recordStatusEnum.unlocked.value))", @click="editDealInfo") {{record.dealId === 0 ? control.createDeal.title : control.editDeal.title}}
                        a.weui-btn.weui-btn_primary.btn.block(v-show="record.status === recordStatusEnum.waitForCheck.value && user.rank === userRankEnum.street.value", @click="checkPass") {{control.checkPass.title}}
                        a.weui-btn.weui-btn_primary.btn.block(v-show="user.rank === userRankEnum.area.value && record.status === recordStatusEnum.checked.value", @click="confirmPass") {{control.confirmPass.title}}
                        a.weui-btn.weui-btn_primary.btn.block(v-show="user.rank >= userRankEnum.city.value && record.status === recordStatusEnum.confirmed.value", @click="reconfirmPass") {{control.reconfirmPass.title}}
                        a.weui-btn.weui-btn_warn.btn.block(v-show="record.status !== recordStatusEnum.unlocked.value && user.rank >= userRankEnum.street.value", @click="unlockRecord") {{control.unlockRecord.title}}
</template>

<script>
    import "babel-polyfill";
    import iconDownloadPath from "../../public/icon/icon-download.png";
    import App from "../../utils/app";
    import baseConfig from "../../../appConfig/baseConfig";
    import {cn} from "../../../appConfig/cn";
    import {memberRoute, serverRoute} from "../../../appConfig/route";
    import bindData from "../../../appConfig/bindData";
    import tabBarConfig from "../../config/tabBar";
    import {ProviderMissionRecord} from "../../provider/missionRecord";
    import {UserProvider} from "../../provider/user";
    import {util} from "../../utils/util";
    import {Request} from "../../utils/request";
    import TabBar from "../../layout/tabBar";
    import LeftMenu from "../../layout/leftMenu";
    import MpGallery from "../../component/mp-gallery";

    let app;
    const userDataPromise = new Promise((resolve, reject) => {
        // 获取应用实例
        app = new App((isOk) => {
            isOk ? resolve() : reject();
        });
    });
    let photoArr = []   //  上传图片数组
        , useForArr = []    //  用途数组
        , certificateArr = []   //  证书数组
        , illegalTypeArr = []   //  违法建设性质数组
        , buildTypeEnum = bindData.missionBuildType.enum    //  建筑类型枚举
        , otherEvidenceValue = []   //  其他证据数组
    ;

    export default {
        name: "missionRecordDetail",
        components: {
            TabBar,
            LeftMenu,
            MpGallery
        },
        data() {
            return {
                iconDownloadPath,
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
                tabBar: {
                    selectedIndex: tabBarConfig.list.findIndex(item => item.pagePath.indexOf(memberRoute.missionRecordDetail) > -1),
                    list: tabBarConfig.list.map(item => {
                        return {
                            iconNormalPath: item.iconPath,
                            iconActivePath: item.selectedIconPath,
                            link: item.pagePath,
                            title: item.text
                        };
                    })
                },
                gallery: {
                    isShow: false,
                    imageUrl: ""
                },
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
            };
        }
        , methods: {
            /**
             * 点击已上传的图片，显示或者重新选择提交
             * @param index {number} 索引值
             * @param type {string} 文件归属类型
             * @param imageUrl {string} 图片路径
             * @param custom {object} 自定义内容
             */
            uploadPhotoClick(index, type, imageUrl, custom = {}) {
                this.gallery.imageUrl = imageUrl;
                this.gallery.isShow = true;
                this.gallery.targetData = {
                    index,
                    type,
                    custom
                };
            },
            //  画板事件处理
            galleryEventHandler({eventType, data}) {
                if (eventType === "clickImg") {
                    this.gallery.isShow = false;
                } else {
                    util.showToast("无法处理的事件类型" + eventType);
                }
            },
            //  前往编辑摸查信息
            editInvestigateInfo() {
                util.navigatorTo({
                    url: memberRoute.add,
                    query: {
                        handlerType: "edit",
                        [baseConfig.query.msgType]: bindData.missionType.enum.investigate.value,
                        [baseConfig.query.investigateMissionRecordId]: this.record.investigateId
                    }
                });
            },
            //  显示治理信息详情
            showDealInfo() {
                util.navigatorTo({
                    url: memberRoute.missionRecordDetail,
                    query: {
                        [baseConfig.query.dealMissionRecordId]: this.record.dealId
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
                    url: memberRoute.missionRecordDetail,
                    query: {
                        [baseConfig.query.investigateMissionRecordId]: this.record.investigateId
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
                    url: memberRoute.add,
                    query: {
                        handlerType: this.record.dealId === 0 ? "add" : "edit",
                        [baseConfig.query.msgType]: bindData.missionType.enum.deal.value,
                        [baseConfig.query.investigateMissionRecordId]: this.record.investigateId,
                        [baseConfig.query.dealMissionRecordId]: this.record.dealId
                    }
                });
            },
            //  获取任务记录信息
            getRecordInfo() {
                const accessToken = this.providerUser.getAccessToken()
                    , adapterPhotoValue = (photoValue) => photoValue ? photoValue.split(",") : []
                ;
                let getInfoPromise;

                if (this.record.msgType.value === this.msgTypeEnum.investigate.value) {
                    getInfoPromise = this.providerMissionRecord.getInvestigateRecordDetail(this.record.investigateId, accessToken).then(res => {
                        switch (res.status) {
                            //  成功，显示信息
                            case 1000:
                                const data = res.data;

                                this.record.investigateId = data.id;
                                this.record.dealId = data.gbId;
                                this.record.submitUserId = data.submitUserId;
                                this.record.codeNumber.value = data.codeNumber;
                                this.record.status = data.status;
                                this.record.buildingAddress.value = data.buildingAddress;
                                this.record.propertyOwnerType.value = data.propertyOwnerType;
                                this.record.propertyOwnerType.valueDesc = (Object.values(this.propertyOwnerTypeEnum).find(item => item.value === this.record.propertyOwnerType.value) || {title: "未知"}).title;
                                this.record.propertyOwnerName.value = data.propertyOwnerName;
                                this.record.credentialsType.value = this.record.propertyOwnerType.value === this.propertyOwnerTypeEnum.unknown.value ? "未知" : (Object.values(this.record.propertyOwnerType.value === this.propertyOwnerTypeEnum.unit.value ? this.unitCredentialsTypeEnum : this.personalCredentialsTypeEnum).find(item => item.value === data.credentialsType) || {title: ""}).title;
                                this.record.credentialsNumber.value = data.credentialsNumber;
                                this.record.relative.government.selected = data.relativeGovernment;
                                this.record.relative.armedForces.selected = data.relativeArmedForces;
                                this.record.belongType.value = (Object.values(this.belongTypeEnum).find(item => item.value === data.belongType) || {title: "未知"}).title;
                                this.record.landType.value = (Object.values(this.landTypeEnum).find(item => item.value === data.landType) || {title: "未知"}).title;
                                this.record.curtilage.selected = data.isCurtilage;
                                this.record.coverArea.value = data.coverArea.toString();
                                this.record.buildArea.value = data.buildArea.toString();
                                this.record.buildingStorey.value = data.buildingStorey.toString();
                                this.record.buildingStartDate.value = data.buildingStartDate;
                                this.record.buildingEndDate.value = data.buildingEndDate;
                                this.record.engineeringSituation.value = (Object.values(this.engineeringSituationTypeEnum).find(item => item.value === data.engineeringSituation) || {title: "未知"}).title;
                                this.record.engineeringAge.value = (Object.values(this.engineeringAgeTypeEnum).find(item => item.value === data.engineeringAge) || {title: "未知"}).title;
                                (() => {
                                    let useForObjByValue = {};

                                    Object.values(this.useForTypeEnum).forEach(item => {
                                        useForObjByValue[item.value] = item.title;
                                    });
                                    this.record.useFor.value = data.useFor.map(value => useForObjByValue[value]);
                                })();
                                this.record.certificate.value = Object.keys(data.certificate).map(key => {
                                    const item = res.data.certificate[key];

                                    return {
                                        title: item.nameValue || this.certificateEnum[key].title,
                                        value: item.selected ? (item.numberValue || "未填写") : "无"
                                    };
                                });
                                (() => {
                                    let illegalTypeObjByValue = {};

                                    Object.values(this.illegalTypeEnum).forEach(item => {
                                        illegalTypeObjByValue[item.value] = item.title;
                                    });
                                    this.record.illegalType.value = data.illegalType.map(value => illegalTypeObjByValue[value]);
                                })();
                                (() => {
                                    let otherEvidenceObj = {};

                                    Object.values(this.otherEvidenceTypeEnum).forEach(item => {
                                        otherEvidenceObj[item.value] = item.title;
                                    });
                                    this.record.otherEvidence.value = data.otherEvidence.map(item => {
                                        return {
                                            selected: item.selected,
                                            title: otherEvidenceObj[item.value],
                                            filePaths: item.filePaths
                                        }
                                    });
                                })();
                                this.record.reporter.value = data.reporter;
                                this.record.confirmer.value = data.confirmer;
                                this.record.leader.value = data.leader;
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
                    getInfoPromise = this.providerMissionRecord.getDealRecordDetail(this.record.dealId, accessToken).then(res => {
                        switch (res.status) {
                            //  成功
                            case 1000:
                                this.record.investigateId = res.data.palpationId;
                                this.record.dealId = res.data.id;
                                this.record.submitUserId = res.data.submitUser;
                                this.record.codeNumber.value = res.data.number;
                                this.record.belongArea.value = res.data.region;
                                this.record.targetUnit.value = res.data.jurisdiction;
                                Object.keys(this.record.buildType.enum).forEach(key => {
                                    if (this.record.buildType.enum[key].value === String(res.data.infoType)) {
                                        this.record.buildType.value = this.record.buildType.enum[key].title;
                                    }
                                });
                                this.record.buildName.value = res.data.position;
                                this.record.buildArea.value = res.data.area;
                                this.record.buildSituation.value = res.data.nowStatus;
                                this.record.missionDate.value = res.data.dismantleDate;
                                this.record.beforePhoto.value = adapterPhotoValue(res.data.imageData1);
                                this.record.dealingPhoto.value = adapterPhotoValue(res.data.imageData2);
                                this.record.donePhoto.value = adapterPhotoValue(res.data.imageData3);
                                this.record.status = res.data.infoState;
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
                const {record, providerMissionRecord, providerUser} = this;

                providerMissionRecord.checkMission(record.msgType.value === this.msgTypeEnum.investigate.value ? record.investigateId : record.dealId, providerUser.getAccessToken(), record.msgType.value).then(res => {
                    switch (res.status) {
                        //  成功
                        case 1000:
                            this.record.status = res.data.recordStatus || this.record.status;
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
                const {record, providerMissionRecord, providerUser} = this;

                providerMissionRecord.confirmMission(record.msgType.value === this.msgTypeEnum.investigate.value ? record.investigateId : record.dealId, providerUser.getAccessToken(), record.msgType.value).then(res => {
                    switch (res.status) {
                        //  成功
                        case 1000:
                            this.record.status = res.data.recordStatus || this.record.status;
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
                const {record, providerMissionRecord, providerUser} = this;

                providerMissionRecord.reconfirmMission(record.msgType.value === this.msgTypeEnum.investigate.value ? record.investigateId : record.dealId, providerUser.getAccessToken(), record.msgType.value).then(res => {
                    switch (res.status) {
                        //  成功
                        case 1000:
                            this.record.status = res.data.recordStatus || this.record.status;
                            util.showToast(res.msg);
                            break;
                        //  失败
                        case 1001:
                        //  未知错误
                        default:
                            util.showToast(res.msg);
                            break;
                    }
                });
            },
            //  授权解锁
            unlockRecord() {
                const {record, providerMissionRecord, providerUser} = this;

                providerMissionRecord.unlockRecord(record.msgType.value === this.msgTypeEnum.investigate.value ? record.investigateId : record.dealId, providerUser.getAccessToken(), record.msgType.value).then(res => {
                    switch (res.status) {
                        //  成功
                        case 1000:
                            this.record.status = res.data.recordStatus || this.record.status;
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
            //  下载图表
            downloadDocument() {
                const downloadId = this.record.msgType.value === this.msgTypeEnum.investigate.value ? this.record.investigateId : this.record.dealId;

                if (downloadId) {
                    util.navigatorTo({
                        url: this.record.msgType.value === this.msgTypeEnum.investigate.value ? serverRoute.investigateFarmerDoc : serverRoute.dealDoc
                        , query: {
                            [baseConfig.query.downloadId]: downloadId
                        }
                    });
                } else {
                    util.showToast("缺少标识，无法正常下载");
                }
            },
        }
        , mounted() {
            const options = Request.getAllParams(); //  获取所有参数

            //  获取传递的任务记录标识
            this.record.investigateId = Number(options[baseConfig.query.investigateMissionRecordId] || "0");
            this.record.dealId = Number(options[baseConfig.query.dealMissionRecordId] || "0");
            this.record.msgType.value = Number(options[baseConfig.query.msgType] || (this.record.dealId ? this.msgTypeEnum.deal.value : this.msgTypeEnum.investigate.value)); //  获取传递的任务类型
            userDataPromise.then(() => {
                if (app.globalData.isSignIn) {
                    this.user.id = app.globalData.user.id;
                    this.user.rank = app.globalData.user.rank;
                    if (this.record.investigateId || this.record.dealId) {
                        if (this.record.msgType.value === this.msgTypeEnum.investigate.value) {
                            // this.record.buildArea.title = cn.missionRecord.buildAreaTitleForInvestigate;
                        } else {
                            // this.record.buildArea.title = cn.missionRecord.buildAreaTitleForDeal;
                        }
                        this.getRecordInfo();
                    } else {
                        util.showToast("缺少任务记录标识，无法获取任务详情");
                    }
                } else {
                    return Promise.reject();
                }
            })
                .catch(() => {
                    util.showToast(cn.user.noSignIn);
                    setTimeout(() => {
                        util.switchTo({
                            url: memberRoute.user
                        });
                    }, baseConfig.delay * 1000);
                });
        }
    }
</script>

<style scoped>
    @import "missionRecordDetail.css";

    .control-bar {
        padding: 10px 0;
    }
</style>