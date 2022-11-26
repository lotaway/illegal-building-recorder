import {UserProvider} from "./provider/user";

const userData = {
    id: 0,  //  标识
    name: "", //  姓名
    currentUnit: "" //  所在单位
    , rank: 0	//	账户等级权限 1 乡镇(街道)、居委(村居)(录入) 2 区(县)(审查) 3 市级(核实) 4 省级(核实)
    , region: {
        //  所属地区
        belongArea: {
            name: ""    //  地区名称
            , id: 0  //  地区标识
        },
        city: {
            name: ""    //  城市名称
            , id: 0 //  地区标识
        }
    }
    //  统计
    , statistics: {
        areaSize: 0  //  总面积
        , missionRecord: 0 //  任务总数量
        , investigateMissionRecord: 0 // 摸查任务总数量
        , investigateArea: 0    //  摸查任务总面积
        , dealMissionRecord: 0 //  治理任务总数量
        , dealArea: 0   //  治理任务总面积
    }
};

App<IAppOption>({
    globalData: {
        isSignIn: false //  用户是否已登录
        , user: userData
    },
    //  从缓存中读取用户登录状态和数据
    readUserStatusAndDataFormCache() {
        const userProvider = new UserProvider();

        return userProvider.checkLogInStatus().then(() => {
            this.globalData.isSignIn = true;
            this.globalData.user = userProvider.readUserData();

            return "";
        }).catch(() => {
            this.globalData.isSignIn = false;
            this.globalData.user = userData;
            userProvider.clearClientLogInStorage();

            return Promise.reject();
        })
        ;
    },
    onLaunch() {
        this.readUserStatusAndDataFormCache();
    }
})