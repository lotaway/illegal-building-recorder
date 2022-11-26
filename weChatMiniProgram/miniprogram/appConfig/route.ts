const miniProgramRoute = {
        missionRecordDetail: "pages/missionRecordDetail/missionRecordDetail",   //  任务记录详情
        index: "pages/index/index"  //  首页
        , browser: "pages/browser/browser"  //  浏览器
        , add: "pages/add/add"	//	添加/编辑任务记录
        , user: "pages/user/user"	//	账户中心
    }
    ,memberRoute = {
        missionRecordDetail: "./missionRecordDetail.html",   //  任务记录详情
        index: "./index.html"  //  首页
        , browser: "./browser.html"  //  浏览器
        , add: "./add.html"	//	添加/编辑任务记录
        , user: "./user.html"	//	账户中心
    }
    ,
    //	服务器路由地址
    serverRoute = {
        backstageAdminSignIn: "/admin"  //  后台管理登录入口
        , allCollect: "/template/palpation_summary.aspx"	//	违法建设摸查汇总表
        , investigateDetailList: "/template/villager_palpation_summary.aspx"	//	农村村民住宅违法建设摸查表
        , investigateSimpleList: "/template/build_palpation_summary.aspx"	//	违法建设摸查表
        , investigateFarmerDoc: "/template/villager_palpation.aspx"	//	摸查信息表格
        , dealDoc: "/template/build_govern.aspx"	//	治理信息表格
    }
;

export {miniProgramRoute, memberRoute, serverRoute};