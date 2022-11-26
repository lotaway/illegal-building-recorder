const baseConfig = {
    // dev: true,  //  是否开发模式
    dev: false,
    delay: 1.5, //  延迟时间
    fileMaxCount: 10,   //  多文件上传总数量
    // 存储名称
    store: {
        accessToken: "userAccessToken"  //  用户权限凭证名称
        , userData: "userData"  //  用户信息
    },
    query: {
        investigateMissionRecordId: "investigateMissionRecordId" //   摸查任务记录标识
        , dealMissionRecordId: "dealMissionRecordId" //   摸查任务记录标识
        , msgType: "msgType"	//	任务类型
        , redirect: "redirect"	//	重定向链接
        , query: "query"    //  重定向参数
        , accessToken: "accessToken"    //  用户凭证
        , downloadId: "id"  //  下载链接传递的表单名称
    }
};

export default baseConfig;