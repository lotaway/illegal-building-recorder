import {cn} from "./cn";

const bindData = {
    // host: "http://192.168.44.229:10041",    //  本地域名
    // host: "http://192.168.44.168:177",    //  后端域名
    host: "https://stwj.8248.net",  //  发布域名
    //  账户等级权限
    userRank: {
        enum: {
            //  仅可录入
            committee: {
                title: "居委（村委）",
                value: 1
            },
            //  可录入和审查
            street: {
                title: "乡镇（街道）",
                value: 2
            },
            //  审核
            area: {
                title: "区（县）",
                value: 3
            },
            //  审定
            city: {
                title: "市",
                value: 4
            }
            //  审定
            , province: {
                title: "省",
                value: 5
            }
        }
    },
    //  任务记录状态
    missionRecordStatus: {
        enum: {
            waitForCheck: {
                title: "待审查",
                value: 1
            },
            checked: {
                title: "待审核",
                title2: "已审查",
                value: 2
            },
            confirmed: {
                title: "待审定",
                title2: "已审核",
                value: 3
            },
            reconfirmed: {
                title: "已审定",
                value: 4
            },
            unlocked: {
                title: "待修改",
                value: 5
            }
        }
    },
    //  任务类型
    missionType: {
        enum: {
            //  摸查
            investigate: {
                title: cn.missionRecord.investigateTitle,
                value: 0
            },
            //  治理
            deal: {
                title: cn.missionRecord.dealTitle,
                value: 1
            }
        }
    },
    //  建筑类型
    missionBuildType: {
        enum: {
            farmer: {
                title: cn.missionRecord.buildTypeFarmer,
                value: "1"
            },
            other: {
                title: cn.missionRecord.buildTypeOther,
                value: "2"
            }
        }
    },
    //  土地性质
    landType: {
        enum: {
            country: {
                title: cn.missionRecord.countryAreaTitle,
                value: 1
            },
            group: {
                title:cn.missionRecord.groupAreaTitle,
                value: 2
            }
        }
    },
    //  权属人信息类型
    propertyOwnerType: {
        title: cn.missionRecord.propertyOwnerTypeTitle,
        enum: {
            unit: {
                title: cn.missionRecord.unitOwnerTitle,
                value: 1
            }
            , personal: {
                title: cn.missionRecord.personalOwnerTitle,
                value: 2
            }
            ,unknown: {
                title: cn.missionRecord.unknownOwnerTitle,
                value: 3
            }
        }
    },
    //  单位证件类型
    unitCredentialsType: {
        enum: {
            society: {
                title: cn.missionRecord.societyCredentialsTitle,
                value: 1
            },
            organization: {
                title: cn.missionRecord.organizationCredentialsTitle,
                value: 2
            }
        }
    },
    //  个人证件类型
    personalCredentialsType: {
        enum: {
            identity: {
                title: cn.missionRecord.identityCredentialsTitle,
                value: 1
            },
            officer: {
                title: cn.missionRecord.officerCredentialsTitle,
                value: 2
            },
            passport: {
                title: cn.missionRecord.passportCredentialsTitle,
                value: 3
            },
            hkmacao: {
                title: cn.missionRecord.hkmacaoCredentialsTitle,
                value: 4
            },
            taiwan: {
                title: cn.missionRecord.taiwanCredentialsTitle,
                value: 5
            }
        }
    },
    //  所处区域
    belongType: {
        enum: {
            city: {
                title: cn.missionRecord.belongTypeIsCityTitle,
                value: 1
            },
            country: {
                title: cn.missionRecord.belongTypeIsCountryTitle,
                value: 2
            }
        }
    },
    //  工程现状
    engineeringSituationType: {
        enum: {
            finished: {
                title: cn.missionRecord.engineeringFinishedTitle,
                value: 1
            },
            unfinished: {
                title: cn.missionRecord.engineeringUnfinishedTitle,
                value: 0
            }
        }
    },
    //  违建类型（新旧）
    engineeringAgeType: {
        enum: {
            isNew: {
                title: cn.missionRecord.newEngineeringTitle,
                value: 1
            },
            isOld: {
                title: cn.missionRecord.oldEngineeringTitle,
                value: 2
            }
        }
    },
    //  用途
    useForType: {
        enum: {
            industry: {
                title: cn.missionRecord.useForIndustryTitle,
                value: 1
            },
            business: {
                title: cn.missionRecord.useForBusinessTitle,
                value: 2
            },
            farm: {
                title: cn.missionRecord.useForFarmTitle,
                value: 3
            },
            live: {
                title: cn.missionRecord.useForLiveTitle,
                value: 4
            },
            publicMatch: {
                title: cn.missionRecord.useForPublicMatchTitle,
                value: 5
            },
            nothing: {
                title: cn.missionRecord.useForNothingTitle,
                value: 6
            },
            other: {
                title: cn.missionRecord.useForOtherTitle,
                value: 7
            }
        }
    },
    //  违建性质
    illegalType: {
        enum: {
            engineering: {
                title: "未取得或未按照建设工程规划许可证进行建设",
                value: 1
            },
            country: {
                title: "未取得或未按照乡村建设规划许可证进行建设",
                value: 2
            },
            noMatch: {
                title: "未取得、未按城乡规划批准内容或超过批准期限的临时建筑",
                value: 3
            },
            land: {
                title: "违反土地管理方面法律法规的建（构）筑物",
                value: 4
            },
            farm: {
                title: "违反农业农村方面法律法规的建（构）筑物",
                value: 5
            },
            traffic: {
                title: "违反交通运输方面法律法规的建（构）筑物",
                value: 6
            },
            water: {
                title: "违反水利方面法律法规的建（构）筑物",
                value: 7
            },
            natural: {
                title: "违反生态环境方面法律法规的建（构）筑物",
                value: 8
            },
            emergency: {
                title: "违反应急管理方面法律法规的建（构）筑物",
                value: 9
            },
            forest: {
                title: "违反林地管理方面法律法规的建（构）筑物",
                value: 10
            },
            other: {
                title: "违反其他领域法律法规的建（构）筑物",
                value: 11
            }
        }
    },
    certificate: {
        enum: {
            //  用地许可
            use: {
                title: cn.missionRecord.useCertificateTitle,
                numberTitle: cn.missionRecord.certificateNumberTitle
            },
            //  工程许可
            engineering: {
                title: cn.missionRecord.engineeringCertificateTitle,
                numberTitle: cn.missionRecord.certificateNumberTitle
            },
            //  乡村许可
            country: {
                title: cn.missionRecord.countryCertificateTitle,
                numberTitle: cn.missionRecord.certificateNumberTitle
            },
            //  不动产证书
            realEstate: {
                title: cn.missionRecord.realEstateCertificateTitle,
                numberTitle: cn.missionRecord.certificateNumberTitle
            },
            //  土地证书
            land: {
                title: cn.missionRecord.landCertificateTitle,
                numberTitle: cn.missionRecord.certificateNumberTitle
            },
            //  房屋证书
            building: {
                title: cn.missionRecord.buildingCertificateTitle,
                numberTitle: cn.missionRecord.certificateNumberTitle
            },
            //  其他证书
            other: {
                title: cn.missionRecord.otherCertificateTitle,
                nameTitle: cn.missionRecord.otherCertificateNameTitle,
                numberTitle: cn.missionRecord.otherCertificateNumberTitle,
            }
        }
    },
    otherEvidence: {
        enum: {
            location: {
                title: "坐标定位",
                value: 1
            },
            photo: {
                title: "现场照片",
                value: 2
            },
            certificate: {
                title: "相关证书复印/扫描件",
                value: 3
            },
            other: {
                title: "其他证明材料",
                value: 4
            }
        }
    }
};

export default bindData;