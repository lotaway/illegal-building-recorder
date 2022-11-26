import {Request} from "../utils/request";
import {util} from "../utils/util";
import {api} from "../appConfig/api";
import baseConfig from "../appConfig/baseConfig";

namespace nsResponse {

    //  修改密码响应数据
    export interface changePasswordResponse extends Object {
        status: number
        msg: string
    }

    //  用户凭证获取的用户数据
    export interface userDataResponse extends Object {
        status: number,
        id: number  //  用户标识
        loginAccount: string, //  账号名称
        companyName: string,  //  单位名称
        userRank: number,   //  账户等级权限
        msg: string //  响应提示消息
        region: string  //  所属地区名称
        regionId: number    //  所属地区标识
        cityRegion: string    //  城市名称
        cityRegionId: number  //  城市标识
        totalCount: number  //  统计任务记录数量
        totalArea: number  //  统计面积
        pArea: number   //  统计摸查面积
        pCount: number  //  统计摸查任务记录数量
        bgArea: number   //  统计治理面积
        bgCount: number  //  统计治理任务记录数量
    }

    export interface CheckTokenResponse extends Object {
        status: number,
        msg: string
    }

    //  登录获取到的用户数据
    export interface SignInResponse extends userDataResponse {
        accessToken: string,  //  登录凭证
    }

}

class Adapter {

    constructor() {

    }

    //  用户数据
    static userData(userData: nsResponse.SignInResponse | nsResponse.userDataResponse) {
        return {
            id: userData.id,
            name: userData.loginAccount,
            currentUnit: userData.companyName,
            rank: userData.userRank,
            region: {
                belongArea: {
                    name: userData.region,
                    id: userData.regionId
                },
                city: {
                    name: userData.cityRegion,
                    id: userData.cityRegionId
                }
            },
            statistics: {
                areaSize: userData.totalArea,
                missionRecord: userData.totalCount,
                investigateMissionRecord: userData.pCount,
                investigateArea: userData.pArea,
                dealMissionRecord: userData.bgCount,
                dealArea: userData.bgArea
            }
        };
    }

}

class UserProvider {

    constructor() {

    }

    //  读取登录凭证
    getAccessToken() {
        return util.getStorage(baseConfig.store.accessToken) || "";
    }

    /**
     * 存储登录凭证
     * @param value 登录凭证
     */
    setAccessToken(value: string) {
        return util.setStorage(baseConfig.store.accessToken, value);
    }

    //  清除登录凭证
    clearAccessToken() {
        return util.removeStorageSync(baseConfig.store.accessToken);
    }

    //  存在客户端登录存储信息
    hasClientLoginInStorage() {
        return this.getAccessToken() || "";
    }

    //  清除客户端登录存储信息
    async clearClientLogInStorage() {
        return await this.clearAccessToken() && this.clearUserData();
    }

    // 检查登录状态是否有效（包含客户端和服务端的登录状态）
    checkLogInStatus() {
        return Promise.all([this.checkClientLogInStatus(), this.checkServerLogInStatus()]);
    }

    /**
     * 检查客户端登录状态是否有效
     * @returns {Promise} 是否有效
     */
    checkClientLogInStatus() {
        return new Promise((resolve, reject) => {
            this.hasClientLoginInStorage() ? resolve() : reject();
        });
    }

    //  存储获取到的用户信息
    saveUserData(data: any) {
        return util.setStorage(baseConfig.store.userData, JSON.stringify(data));
    }

    //  读取存储的用户信息
    readUserData() {
        const data = util.getStorage(baseConfig.store.userData);

        return data ? JSON.parse(data) : {};
    }

    //  清除存储的用户信息
    clearUserData() {
        return util.removeStorageSync(baseConfig.store.userData);
    }

    /**
     * 检查服务端登录状态是否有效
     * @returns {Promise} 是否有效
     */
    checkServerLogInStatus() {
        /*const accessToken = this.getAccessToken();

        return Request.send<nsResponse.CheckTokenResponse>({
            url: api.user.checkToken,
            data: "accessToken=" + accessToken
        });*/
        return this.getAccessToken() ? this.getDataByAccessToken().then(res => {
                if (res.status === 1000) {
                    this.saveUserData(Adapter.userData(res));

                    return Promise.resolve(res);
                } else {
                    return Promise.reject(res);
                }
            })
            : Promise.reject("缺少AccessToken")
            ;
    }

    // 用户登录
    signIn(query: {
        username: string,
        password: string
    }) {
        return Request.send<nsResponse.SignInResponse>({
            url: api.user.signIn,
            data: "LoginAccount=" + query.username + "&LoginPassword=" + query.password
        }).then(res => {
            if (res.status === 1000) {
                this.saveUserData(Adapter.userData(res));
            }

            return res;
        });
    }

    //  通过用户凭证获取信息
    getDataByAccessToken() {
        return Request.send<nsResponse.userDataResponse>({
            url: api.user.getDataByAccessToken,
            data: "",
            header: {
                accessToken: this.getAccessToken()
            }
        });
    }

    //  修改密码
    changePassword(query: {
        username: string
        oldPassword: string
        newPassword: string
    }) {
        return Request.send<nsResponse.changePasswordResponse>({
            url: api.user.changePassword,
            data: `LoginAccount=${query.username}&LoginPassword=${query.newPassword}&OldLoginPassword=${query.oldPassword}`
        });
    }

}

export {UserProvider};