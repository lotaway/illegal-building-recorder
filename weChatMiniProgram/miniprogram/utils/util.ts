import {Request} from "./request";
import {api} from "../appConfig/api";

namespace nsUtil {

    export interface uploadBuildingPhotoResponse extends Object {
        status: number
        data: {
            buildingPhotoFilePath: Array<string>
        },
        msg: string
    }

    export interface navigatorOptions extends WechatMiniprogram.NavigateToOption {
        query?: {
            [index: string]: string | number | object
        }
    }

    export type storageKey = string;
    export type storageValue = string;

}

class UtilWx {

    constructor() {

    }

    //  移除本地内存存储（异步）
    static removeStorage(key: nsUtil.storageKey) {
        return new Promise((resolve, reject) => {
            wx.removeStorage({
                key,
                success: resolve,
                fail: reject
            });
        });
    }

    //  移除本地内存存储（同步）
    static async removeStorageSync(key: nsUtil.storageKey) {
        return await UtilWx.removeStorage(key);
    }

    //  本地内存存储（异步）
    static setStorage(key: nsUtil.storageKey, value: nsUtil.storageValue) {
        return new Promise((resolve, reject) => {
            wx.setStorage({
                key: key,
                data: value,
                success: resolve,
                fail: reject
            });
        });
    }

    //  本地内存存储（同步）
    static async setStorageSync(key: nsUtil.storageKey, value: nsUtil.storageValue) {
        return await UtilWx.setStorage(key, value);
    }

    // 本地内存读取
    static getStorage(key: string) {
        return wx.getStorageSync(key);
    }

    //  发送请求
    static request<T>(params: any) {
        const _success = params.success;

        params.success = (res: T) => {
            _success(res);
        };

        return wx.request(params);
    }

    /**
     * 吐司
     * @param title 标题
     */
    static showToast(title: string) {
        return wx.showToast({title});
    }

    //  显示操作菜单
    static showActionSheet(options: WechatMiniprogram.ShowActionSheetOption) {
        return wx.showActionSheet(options);
    }

    //  显示等待框（唯一对象）
    static showLoading(options: WechatMiniprogram.ShowLoadingOption) {
        return wx.showLoading(options);
    }

    //  隐藏等待框
    static hideLoading() {
        return wx.hideLoading();
    }

    //  选择图片
    static chooseImage(options: WechatMiniprogram.ChooseImageOption) {
        return wx.chooseImage(options);
    }

    //  上传文件
    static uploadFile(params: {
        filePath: Array<string> | string
    }) {
        let resultPromise = Promise.resolve<nsUtil.uploadBuildingPhotoResponse>({
                status: 1000,
                data: {
                    buildingPhotoFilePath: []
                },
                msg: "未开始上传"
            })
            , buildingPhotoFilePath: Array<string> = []    //  存储返回的服务器图片路径
            , handler = (res: any) => {
                if (res.status === 1000) {
                    res.data.buildingPhotoFilePath.length && [].push.apply(buildingPhotoFilePath, <any>res.data.buildingPhotoFilePath.map(Request.urlWithHost));
                }
            }
        ;

        if (params.filePath.length === undefined) {
            params.filePath = [params.filePath as string];
        }
        resultPromise = (params.filePath as Array<string>).reduce((prev, item) => {
            return prev.then(res => {
                if (res.status === 1000) {
                    handler(res);

                    return new Promise<nsUtil.uploadBuildingPhotoResponse>((resolve, reject) => {
                        wx.uploadFile({
                            url: Request.urlWithHost(api.missionRecord.uploadBuildPhotoWeChat),
                            header: {
                                'content-type': 'multipart/form-data'
                            },
                            name: 'upload',
                            filePath: item,
                            success(res) {
                                if (res.statusCode === 200) {
                                    let _res = JSON.parse(res.data);

                                    if (_res.code === 1) {
                                        _res = {
                                            status: 1000,
                                            data: {
                                                buildingPhotoFilePath: _res.picturePath.split(",")
                                            },
                                            msg: _res.msg
                                        };
                                    } else {
                                        _res = {
                                            status: 1001,
                                            msg: _res.msg
                                        };
                                    }
                                    resolve(_res);
                                } else {
                                    reject(res);
                                }
                            },
                            fail: reject
                        });
                    });
                } else {
                    return Promise.reject("图片上传失败");
                }
            })
        }, resultPromise);

        return resultPromise.then(res => {
            handler(res);

            return {
                status: res.status,
                data: {
                    buildingPhotoFilePath: buildingPhotoFilePath
                },
                msg: res.msg
            };
        });
    }

    //  下载文件
    static downloadFile(options: WechatMiniprogram.DownloadFileOption) {
        return wx.downloadFile(options);
    }

    //  保存临时文件到本地
    static saveFile(options: WechatMiniprogram.WxSaveFileOption){
        return wx.saveFile(options);
    }

    //  打开文件
    static openDocument(options: WechatMiniprogram.OpenDocumentOption) {
        return wx.openDocument(options);
    }

    //  切换选项卡页面
    static switchTo(options: WechatMiniprogram.SwitchTabOption) {
        options.url = "/" + options.url;

        return wx.switchTab(options);
    }

    //  进入页面（深入层级）
    static navigatorTo(options: nsUtil.navigatorOptions) {
        let queryStr = "";  //  请求参数

        if (options.query) {
            for (let q in options.query) {
                if (options.query.hasOwnProperty(q)) {
                    queryStr += `&${q}=${typeof options.query[q] === "object" ? JSON.stringify(options.query[q]) : options.query[q]}`;
                }
            }
        }

        return wx.navigateTo({
            url: options.url.replace(/^pages\//, "../") + queryStr.replace(/^&/, "?"),
            complete: options.complete || function () {

            },
            events: options.events || [],
            success: options.success || function () {

            },
            fail: options.fail || function () {

            }
        });
    }

}

export {UtilWx as util};