const PREV_V3 = "/api"
    , api = {
    user: {
        signIn: "/User/UserLoginManage"  // 用户登录
        , getDataByAccessToken: "/User/GetUserModelManage"   //  获取用户数据
        , changePassword: "/User/UserUpdateManage"    //  修改用户密码
        , checkToken: "" //      判断用户登录凭证是否有效
    },
    setting: {
        region: "/Region/GetRegionModel"    //  地区
    },
    missionRecord: {
        uploadBuildPhotoWeChat: PREV_V3 + "/FileUpload/PictureUpload"  //  上传影像资料（微信端）
        , uploadBuildPhotoWeb: PREV_V3 + "/File/UploadFile/"  //  上传影像资料（网页端使用）
        , investigateList: "/Palpation/GetPalpationList"    //  获取摸查任务记录列表
        , dealList: "/BuildGovern/GetBuildGovernList"    //  获取治理任务记录列表
        , investigateRecordDetail: "/Palpation/GetPalpationModel"  //  获取摸查任务记录详情
        , dealRecordDetail: "/BuildGovern/GetBuildGovernModel"  //  获取治理任务记录详情
        , updateInvestigateStatus: "/Palpation/UpdatePalpationStateModel" //  摸查任务记录状态修改
        , updateDealStatus: "/BuildGovern/UpdateBuildGovernStateModel" //  治理任务记录状态修改
        , createInvestigateMissionRecord: "/Palpation/SubmitPalpation" //  提交摸查任务记录
        , createDealMissionRecord: "/BuildGovern/SubmitBuildGovern"   //  提交治理任务记录
        , updateInvestigateMissionRecord: "/Palpation/UpdatePalpationModel"   //  修改摸查任务记录
        , updateDealMissionRecord: "/BuildGovern/UpdateBuildGovernModel" //   修改治理任务记录
    }
};

export {api};