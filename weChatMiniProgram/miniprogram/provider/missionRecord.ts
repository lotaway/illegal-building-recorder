import {Request} from "../utils/request";
import {api} from "../appConfig/api";
import bindData from "../appConfig/bindData";

namespace nsRecord {

    export interface RequestHandler {
        (): void

        send<T>(options: {
            url: string
        }): Promise<T>

        imgArrToImgStr(imgArr: Array<string>): string
    }

    //  获取列表接口的请求参数
    export interface getListQuery extends Object {
        pageIndex: number
        keyword: string
        accessToken: string
    }

    //  获取摸查任务记录列表响应数据
    export interface getInvestigateListResponse extends Object {
        status: number
        data: {
            pageIndex: number,
            total: number,
            pageCount: number,
            keyword: string,
            sumArea: number,
            dataLst: Array<InvestigateInfo>
        },
        msg: string
    }

    //  获取治理任务记录列表响应数据
    export interface getDealListResponse extends Object {
        status: number
        data: {
            pageIndex: number,
            total: number,
            pageCount: number,
            keyword: string,
            sumArea: number,
            dataLst: Array<{
                id: number
                infoType: number
                region: string
                jurisdiction: string
                position: string
                area: string
                dismantleDate: string
                imageData1: string
                imageData2: string
                imageData3: string
                infoState: number
            }>
        },
        msg: string
    }

    //  搜查信息
    interface InvestigateInfo extends Object {
        [key: string]: any

        id: number  //  摸查记录标识
        submitUser: number  //  提交记录的用户标识
        number: number  //  记录编号
        infoState: number   //  记录状态
        position: string   //  建筑物地址
        ownerType: number   //  权属人类型
        unitName: string    //  单位名称
        unitIdentificationType: number    //  单位证件类型
        unitIdentificationNumber: string    //  单位证件号码
        numberType1: boolean //  属于政党等
        numberType2: boolean //  属于军队
        personalName: string    //  个人姓名
        personalIdentificationType: number  //  个人证件类型
        personalIdentificationNumber: string    //  个人证件号码
        area: number    //  所处区域
        natureOfLand: number    //  土地性质
        isHomestead: boolean //  是否宅基地
        areaCovered: number //  占地面积
        builtArea: number   //  建筑面积
        numberOfFloors: number  //  建筑层数
        builtTime: string   //  建筑时间
        beCompletedTime: string //  竣工时间
        presentState: number    //  工程现状
        typeOfViolation: number //  违建类型（新旧）
        purpose: string //  用途
        licence1: boolean    //  建设用地规划许可
        licence1Number: string  //  建设用地证书编号
        licence2: boolean    //  建设工程规划许可
        licence2Number: string  //  建设工程证书编号
        licence3: boolean    //  建设乡村规划许可
        licence3Number: string  //  建设乡村证书编号
        licence4: boolean    //  拥有不动产权
        licence4Number: string  //  不动产证书编号
        licence5: boolean    //  拥有土地权
        licence5Number: string  //  土地权证书
        licence6: boolean    //  拥有房屋权
        licence6Number: string  //  房屋全证书编号
        licence7: boolean    //  拥有其他证书
        licence7Name: string    //  其他证书名称
        licence7Number: string  //  其他证书编号
        natureOfViolation: string   //  违法建设性质
        other: string   //  其他证据
        imageData1: string, // 坐标定位影像资料
        imageData2: string, // 现场照片影像资料
        imageData3: string, // 相关证书复印/扫描件影像资料
        imageData4: string, // 其他证明材料影像资料
        filledBy: string    //  填报人
        reviewedBy: string  //  复核人
        personInCharge: string  //  负责人
    }

    //  搜查详情信息数据
    interface InvestigateDetailData extends InvestigateInfo {
        gbId: number    //  关联的治理信息记录标识
    }

    //  摸查详情信息响应内容
    export interface investigateDetailResponse extends Object {
        status: number
        data: InvestigateDetailData,
        msg: string
    }

    //  治理信息响应内容
    export interface dealDetailResponse extends Object {
        status: number
        data: {
            id: number
            palpationId: number
            number: number
            infoType: number
            region: string
            dismantleDate: string
            jurisdiction: string
            position: string
            area: string
            nowStatus: string
            imageData1: string
            imageData2: string
            imageData3: string
            infoState: number
            submitUser: number
        },
        msg: string
    }

    //  证书信息格式
    interface RecordCertificateInfo extends Object {
        selected: boolean
        nameValue?: string
        numberValue: string
    }

    export interface OtherEvidenceItem extends Object {
        selected: boolean
        value: number
        filePaths: Array<string>
    }

    export interface OtherEvidenceArr extends Array<OtherEvidenceItem> {
    }

    //  摸查详情信息适配器结果
    export interface InvestigateDetailAdapterResult extends Object {
        [key: string]: any

        id: number
        gbId: number
        submitUserId: number
        codeNumber: number
        status: number
        buildingAddress: string
        propertyOwnerType: number
        propertyOwnerName: string
        credentialsType: number
        credentialsNumber: string
        relativeGovernment: boolean
        relativeArmedForces: boolean
        belongType: number
        landType: number
        isCurtilage: boolean
        coverArea: number
        buildArea: number
        buildingStorey: number
        buildingStartDate: string
        buildingEndDate: string
        engineeringSituation: number
        engineeringAge: number
        useFor: Array<number>
        certificate: {
            [key: string]: RecordCertificateInfo
        }
        illegalType: Array<number>
        otherEvidence: OtherEvidenceArr
        reporter: string
        confirmer: string
        leader: string
    }

    //  摸查任务记录基础请求参数
    interface InvestigateRecordBaseQuery extends Object {
        accessToken: string
        buildingAddress: string //  建筑物地址
        propertyOwnerType: number   //  全数人信息
        propertyOwnerName: string   //  权属人姓名/单位名称
        credentialsType: number //  证件类型
        credentialsNumber: string   //  证件编号
        relativeGovernment: boolean //  是否属于政党
        relativeArmedForces: boolean    //  是否属于军队
        belongType: number  //  所处区域
        landType: number    //  土地性质
        isCurtilage: boolean    //  是否为宅基地
        coverArea: string   //  占地面积
        buildArea: string   //  建筑面积
        buildingStorey: number  //  建筑层数
        buildingStartDate: string   //  建造时间
        buildingEndDate: string //  竣工时间
        engineeringSituation: number    //  工程现状
        engineeringAge: number  //  违建类型（新旧）
        useFor: Array<number>   //  用途
        //  证书
        certificate: Array<{
            selected: boolean
            name: string
            number: string
        }>
        illegalType: Array<number>  //  违法性质
        otherEvidence: OtherEvidenceArr   //  其他证据
        reporter: string    //  填报人
        confirmer: string   //  复核人
        leader: string  //  负责人
    }

    //  创建摸查任务记录请求数据
    export interface createInvestigateRecordQuery extends InvestigateRecordBaseQuery {

    }

    //  更新摸查任务记录请求数据
    export interface updateInvestigateRecordQuery extends InvestigateRecordBaseQuery {
        id: number  //  摸查任务标识
    }

    //  更新任务状态响应数据
    export interface updateMissionRecordStatusResponse extends Object {
        status: number
        data: {
            id: number
            number: number
            recordStatus?: number
        }
        msg: string
    }

    //  更新摸查信息响应数据
    export interface updateInvestigateRecordResponse extends Object {
        status: number
        msg: string
        data: {
            id: number
            number: number
        }
    }

    //  更新治理信息响应数据
    export interface updateDealRecordResponse extends Object {
        status: number
        msg: string
        data: {
            id: number
        }
    }

}

class Adapter {

    static dateToShow(date: string) {
        let dateStr = ["", "年", "月", "日"];

        return date.split("-").reduce((prev, item) => prev + dateStr.shift() + item, "") + dateStr.shift();
    }

    //  摸查任务记录列表数据适配
    static investigateRecordList(response: nsRecord.getInvestigateListResponse) {
        return {
            status: response.status,
            data: {
                pageCount: response.data.pageCount,
                list: response.data && response.data.pageCount > 0 ? response.data.dataLst.map(investigateItem => {
                    let illegalTypeGroupByValue: {
                            [index: number]: string
                        } = {}
                    ;

                    Object.values(bindData.illegalType.enum).forEach(item => {
                        illegalTypeGroupByValue[item.value] = item.title;
                    });

                    return {
                        id: investigateItem.id,
                        thumbnail: "",
                        title: investigateItem.position,
                        desc: investigateItem.natureOfViolation.split(",").reduce((prev, item) => "," + illegalTypeGroupByValue[Number(item)], "").replace(/^,/, ""),
                        status: investigateItem.infoState
                    };
                }) : []
            },
            msg: response.msg || ""
        };
    }

    static dealRecordList(response: nsRecord.getDealListResponse) {
        return {
            status: response.status,
            data: {
                pageCount: response.data.pageCount,
                list: response.data ? response.data.dataLst.map(item => {
                    let buildTypeDesc = "";

                    Object.keys(bindData.missionBuildType.enum).forEach(key => {
                        const type = (<any>bindData.missionBuildType.enum)[key];

                        if (type.value === String(item.infoType)) {
                            buildTypeDesc = type.title;
                        }
                    });

                    return {
                        id: item.id,
                        thumbnail: Request.urlWithHost(item.imageData3.split(",")[0]),
                        title: item.position,
                        desc: buildTypeDesc,
                        status: item.infoState
                    };
                }) : []
            },
            msg: response.msg || ""
        };
    }

    //  摸查记录详情数据适配
    static investigateRecordDetail(response: nsRecord.investigateDetailResponse): {
        status: number
        data?: nsRecord.InvestigateDetailAdapterResult
        msg: string
    } {
        let otherEvidenceObj: { [key: number]: Array<string> } = {};    //  以证据标识为键名的图片数组对象

        response.data.other !== "" && response.data.other.split(",").forEach(value => {
            const imageArrStr = response.data["imageData" + value];

            otherEvidenceObj[Number(value)] = imageArrStr === "" ? [] : imageArrStr.split(",").map(Request.urlArrStrWithHost);
        });

        return response.status === 1000 ? {
            status: response.status,
            data: {
                id: response.data.id,
                gbId: response.data.gbId,
                submitUserId: response.data.submitUser,
                codeNumber: response.data.number,
                status: response.data.infoState,
                buildingAddress: response.data.position,
                propertyOwnerType: response.data.ownerType,
                propertyOwnerName: response.data.ownerType === bindData.propertyOwnerType.enum.unknown.value ? "" : (response.data.ownerType === bindData.propertyOwnerType.enum.unit.value ? response.data.unitName : response.data.personalName),
                credentialsType: response.data.ownerType === bindData.propertyOwnerType.enum.unknown.value ? 0 : (response.data.ownerType === bindData.propertyOwnerType.enum.unit.value ? response.data.unitIdentificationType : response.data.personalIdentificationType),
                credentialsNumber: response.data.ownerType === bindData.propertyOwnerType.enum.unknown.value ? "" : (response.data.ownerType === bindData.propertyOwnerType.enum.unit.value ? response.data.unitIdentificationNumber : response.data.personalIdentificationNumber),
                relativeGovernment: response.data.numberType1,
                relativeArmedForces: response.data.numberType2,
                belongType: response.data.area,
                landType: response.data.natureOfLand,
                isCurtilage: response.data.isHomestead,
                coverArea: response.data.areaCovered,
                buildArea: response.data.builtArea,
                buildingStorey: response.data.numberOfFloors,
                buildingStartDate: Adapter.dateToShow(response.data.builtTime),
                buildingEndDate: Adapter.dateToShow(response.data.beCompletedTime),
                engineeringSituation: response.data.presentState,
                engineeringAge: response.data.typeOfViolation,
                useFor: response.data.purpose.split(",").map(str => Number(str)),
                illegalType: response.data.natureOfViolation.split(',').map(str => Number(str)),
                certificate: {
                    use: {
                        selected: response.data.licence1,
                        numberValue: response.data.licence1Number
                    },
                    engineering: {
                        selected: response.data.licence2,
                        numberValue: response.data.licence2Number
                    },
                    country: {
                        selected: response.data.licence3,
                        numberValue: response.data.licence3Number
                    },
                    realEstate: {
                        selected: response.data.licence4,
                        numberValue: response.data.licence4Number
                    },
                    land: {
                        selected: response.data.licence5,
                        numberValue: response.data.licence5Number
                    },
                    building: {
                        selected: response.data.licence6,
                        numberValue: response.data.licence6Number
                    },
                    other: {
                        selected: response.data.licence7,
                        nameValue: response.data.licence7Name,
                        numberValue: response.data.licence7Number
                    }
                },
                otherEvidence: Object.values(bindData.otherEvidence.enum).map(item => {
                    const filePaths = otherEvidenceObj[item.value]; //  图片数组

                    return {
                        selected: !!filePaths,
                        value: item.value,
                        filePaths: !!filePaths ? filePaths : []
                    };
                }),
                reporter: response.data.filledBy,
                confirmer: response.data.reviewedBy,
                leader: response.data.personInCharge
            },
            msg: response.msg || "获取数据成功"
        } : {
            status: response.status,
            msg: response.msg
        };
    }

    //  治理记录详情数据适配
    static dealRecordDetail(response: nsRecord.dealDetailResponse) {
        if (response.status === 1000) {
            response.data.imageData1 = Request.urlArrStrWithHost((response as nsRecord.dealDetailResponse).data.imageData1);
            response.data.imageData2 = Request.urlArrStrWithHost((response as nsRecord.dealDetailResponse).data.imageData2);
            response.data.imageData3 = Request.urlArrStrWithHost((response as nsRecord.dealDetailResponse).data.imageData3);
            response.data.dismantleDate = Adapter.dateToShow((response as nsRecord.dealDetailResponse).data.dismantleDate);
        }

        return response;
    }

    //  将请求参数序列化
    static investigateRecordQuerySerialization(query: nsRecord.createInvestigateRecordQuery | nsRecord.updateInvestigateRecordQuery) {
        return ((query as nsRecord.updateInvestigateRecordQuery).id ? `id=${(query as nsRecord.updateInvestigateRecordQuery).id}&` : "") + `position=${query.buildingAddress}&ownerType=${query.propertyOwnerType}&unitName=${query.propertyOwnerName}&personalName=${query.propertyOwnerName}&unitIdentificationType=${query.credentialsType}&personalIdentificationType=${query.credentialsType}&unitIdentificationNumber=${query.credentialsNumber}&personalIdentificationNumber=${query.credentialsNumber}&numberType1=${query.relativeGovernment ? 1 : 0}&numberType2=${query.relativeArmedForces ? 1 : 0}&area=${query.belongType}&natureOfLand=${query.landType}&isHomestead=${query.isCurtilage ? 1 : 0}&areaCovered=${query.coverArea}&builtArea=${query.buildArea}&numberOfFloors=${query.buildingStorey}&builtTime=${query.buildingStartDate}&beCompletedTime=${query.buildingEndDate}&presentState=${query.engineeringSituation}&typeOfViolation=${query.engineeringAge}&purpose=${query.useFor.join(",")}&natureOfViolation=${query.illegalType.join(",")}&other=${query.otherEvidence.filter(oe => oe.selected).map(oe => oe.value).join(",")}&filledBy=${query.reporter}&reviewedBy=${query.confirmer}&personInCharge=${query.leader}` + query.certificate.reduce((prev, item, index) => {
                const _index = index + 1;

                return `${prev}&licence${_index}=${item.selected ? 1 : 0}&licence${_index}Name=${item.name || ""}&licence${_index}Number=${item.number || ""}`;
            }, "")
            + query.otherEvidence.reduce((prev, item) => `${prev}&imageData${item.value}=${Request.imgArrToImgStr(item.filePaths)}`, "")
            ;
    }

}

class MissionRecord {

    constructor() {

    }

    /**
     * 下载并显示文档
     * @param documentUrl {string} 文档链接
     */
    /*downloadAndShowDocument(documentUrl: string) {
        return Request.downloadFile(documentUrl).then(res => {
            return new Promise((resolve, reject) => {
                util.saveFile({
                    tempFilePath: res.tempFilePath,
                    success: res => {
                        console.log("保存文件成功：" + res.savedFilePath);
                        resolve(Request.openDocument(res.savedFilePath));
                        // resolve();
                    },
                    fail: err => {
                        console.log("保存文件失败：" + JSON.stringify(err));
                        reject("保存文件失败：" + JSON.stringify(err));
                    }
                });
            });
        });
    }*/

    //  获取摸查列表
    getInvestigateList(query: nsRecord.getListQuery) {
        return Request.send<nsRecord.getInvestigateListResponse>({
            url: api.missionRecord.investigateList,
            data: `p=${query.pageIndex}&kw=${query.keyword}`,
            header: {
                accessToken: query.accessToken
            }
        })
            .then(Adapter.investigateRecordList)
            ;
    }

    //  获取治理列表
    getDealList(query: nsRecord.getListQuery) {
        return Request.send<nsRecord.getDealListResponse>({
            url: api.missionRecord.dealList,
            data: `p=${query.pageIndex}&kw=${query.keyword}`,
            header: {
                accessToken: query.accessToken
            }
        })
            .then(Adapter.dealRecordList)
            ;
    }

    //  获取摸查详情
    getInvestigateRecordDetail(missionRecordId: number, accessToken: string) {
        return Request.send<nsRecord.investigateDetailResponse>({
            url: api.missionRecord.investigateRecordDetail,
            data: "id=" + missionRecordId,
            header: {
                accessToken
            }
        }).then(Adapter.investigateRecordDetail);
    }

    //  获取治理详情
    getDealRecordDetail(missionRecordId: number, accessToken: string) {
        return Request.send<nsRecord.dealDetailResponse>({
            url: api.missionRecord.dealRecordDetail,
            data: "id=" + missionRecordId,
            header: {
                accessToken
            }
        }).then(Adapter.dealRecordDetail);
    }

    //  创建摸查任务记录
    createInvestigateMissionRecord(query: nsRecord.createInvestigateRecordQuery) {
        return Request.send<nsRecord.updateInvestigateRecordResponse>({
            url: api.missionRecord.createInvestigateMissionRecord,
            data: Adapter.investigateRecordQuerySerialization(query),
            header: {
                accessToken: query.accessToken
            }
        });
    }

    //  创建治理任务记录
    createDealMissionRecord(query: {
        investigateId: number
        buildType: string
        belongArea: string
        buildName: string
        targetUnit: string
        buildArea: string
        beforePhoto: Array<string>
        dealingPhoto: Array<string>
        donePhoto: Array<string>
        missionDate: string
        accessToken: string
    }) {
        return Request.send<nsRecord.updateDealRecordResponse>({
            url: api.missionRecord.createDealMissionRecord,
            data: `palpationId=${query.investigateId}&infoType=${query.buildType}&region=${query.belongArea}&position=${query.buildName}&jurisdiction=${query.targetUnit}&area=${query.buildArea}&imageData1=${Request.imgArrToImgStr(query.beforePhoto)}&imageData2=${Request.imgArrToImgStr(query.dealingPhoto)}&imageData3=${Request.imgArrToImgStr(query.donePhoto)}&dismantleDate=${query.missionDate}`,
            header: {
                accessToken: query.accessToken
            }
        });
    }

    //  修改摸查任务记录
    updateInvestigateMissionRecord(query: nsRecord.updateInvestigateRecordQuery) {
        return Request.send<nsRecord.updateInvestigateRecordResponse>({
            url: api.missionRecord.updateInvestigateMissionRecord,
            data: Adapter.investigateRecordQuerySerialization(query),
            header: {
                accessToken: query.accessToken
            }
        });
    }

    //  修改治理任务记录
    updateDealMissionRecord(query: {
        id: number
        buildType: string,
        belongArea: string,
        buildName: string,
        targetUnit: string,
        buildArea: string,
        beforePhoto: Array<string>,
        dealingPhoto: Array<string>,
        donePhoto: Array<string>,
        missionDate: string
        accessToken: string
    }) {
        return Request.send<nsRecord.updateDealRecordResponse>({
            url: api.missionRecord.updateDealMissionRecord,
            data: `id=${query.id}&infoType=${query.buildType}&region=${query.belongArea}&position=${query.buildName}&jurisdiction=${query.targetUnit}&area=${query.buildArea}&imageData1=${Request.imgArrToImgStr(query.beforePhoto)}&imageData2=${Request.imgArrToImgStr(query.dealingPhoto)}&imageData3=${Request.imgArrToImgStr(query.donePhoto)}&dismantleDate=${query.missionDate}`,
            header: {
                accessToken: query.accessToken
            }
        });
    }

    //  任务审查通过
    checkMission(missionRecordId: number, accessToken: string, missionType: number = bindData.missionType.enum.investigate.value) {
        const newStatus = bindData.missionRecordStatus.enum.checked.value;

        return Request.send<nsRecord.updateMissionRecordStatusResponse>({
            url: missionType === bindData.missionType.enum.investigate.value ? api.missionRecord.updateInvestigateStatus : api.missionRecord.updateDealStatus,
            data: `id=${missionRecordId}&infoState=${newStatus}`,
            header: {
                accessToken
            }
        }).then(res => {
            if (res.status === 1000) {
                res.data.recordStatus = res.data.recordStatus || newStatus;
            }

            return res;
        });
    }

    //  任务核实通过
    confirmMission(missionRecordId: number, accessToken: string, missionType: number = bindData.missionType.enum.investigate.value) {
        const newStatus = bindData.missionRecordStatus.enum.confirmed.value;

        return Request.send<nsRecord.updateMissionRecordStatusResponse>({
            url: missionType === bindData.missionType.enum.investigate.value ? api.missionRecord.updateInvestigateStatus : api.missionRecord.updateDealStatus,
            data: `id=${missionRecordId}&infoState=${newStatus}`,
            header: {
                accessToken
            }
        }).then(res => {
            if (res.status === 1000) {
                res.data.recordStatus = res.data.recordStatus || newStatus;
            }

            return res;
        });
    }

    //  任务审定通过
    reconfirmMission(missionRecordId: number, accessToken: string, missionType: number = bindData.missionType.enum.investigate.value) {
        const newStatus = bindData.missionRecordStatus.enum.reconfirmed.value;

        return Request.send<nsRecord.updateMissionRecordStatusResponse>({
            url: missionType === bindData.missionType.enum.investigate.value ? api.missionRecord.updateInvestigateStatus : api.missionRecord.updateDealStatus,
            data: `id=${missionRecordId}&infoState=${newStatus}`,
            header: {
                accessToken
            }
        }).then(res => {
            if (res.status === 1000) {
                res.data.recordStatus = res.data.recordStatus || newStatus;
            }

            return res;
        });
    }

    //  解锁记录
    unlockRecord(missionRecordId: number, accessToken: string, missionType: number = bindData.missionType.enum.investigate.value) {
        const newStatus = bindData.missionRecordStatus.enum.unlocked.value;

        return Request.send<nsRecord.updateMissionRecordStatusResponse>({
            url: missionType === bindData.missionType.enum.investigate.value ? api.missionRecord.updateInvestigateStatus : api.missionRecord.updateDealStatus,
            data: `id=${missionRecordId}&infoState=${newStatus}`,
            header: {
                accessToken
            }
        }).then(res => {
            if (res.status === 1000) {
                res.data.recordStatus = res.data.recordStatus || newStatus;
            }

            return res;
        });
    }

}

export {MissionRecord as ProviderMissionRecord, nsRecord, Adapter as AdapterMissionRecord};