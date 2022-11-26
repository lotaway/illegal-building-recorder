import {Request} from "./request";
import {api} from "../../appConfig/api";

namespace WechatMiniprogram {
    export interface uploadFileResponse extends Object {
        status: number
        data: {
            buildingPhotoFilePath: Array<string>
        },
        msg: string
    }

    export interface UploadFileOption extends Object {
        filePath: FileList
    }

    export interface ActionSheetOption extends BaseOptions {
        /**
         * 按钮的文字数组，数组长度最大为6个
         */
        itemList: string[];
        /**
         * 按钮的文字颜色，默认为"#000000"
         */
        itemColor?: string;

        /**
         * 接口调用成功的回调函数
         */
        success?(res: {
            /**
             * 用户点击的按钮，从上到下的顺序，从0开始
             */
            tapIndex: number;
        }): void;
    }

    export interface LoadingOption extends BaseOptions {
        /**
         * 提示的内容
         */
        title: string;
        /**
         * 是否显示透明蒙层，防止触摸穿透，默认：false
         */
        mask?: boolean;
    }

    export interface NavigateToOption extends BaseOptions {
        /** 需要跳转的应用内页面的路径 */
        url: string;
    }

    export interface BaseOptions<R = any, E = any> {
        success?(res: R): void

        fail?(res: E): void

        complete?(res: any): void
    }

    // #region 基本参数
    interface DataResponse {
        /** 回调函数返回的内容 */
        data: object | string | ArrayBuffer;
        /** 开发者服务器返回的 HTTP 状态码 */
        statusCode: number;
        /** 开发者服务器返回的 HTTP Response Header */
        header: object;
    }

    export interface GetStorageOption extends BaseOptions {
        key: StorageKey
    }

    // #region 网络API列表
    // 发起请求
    interface RequestHeader {
        [key: string]: string;
    }

    export interface RequestOption extends BaseOptions<DataResponse> {
        /** 开发者服务器接口地址 */
        url: string;
        /** 请求的参数 */
        data?: string;
        /** 设置请求的 header , header 中不能设置 Referer */
        header?: RequestHeader;
        /** 默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT */
        method?:
            | "GET"
            | "OPTIONS"
            | "HEAD"
            | "POST"
            | "PUT"
            | "DELETE"
            | "TRACE"
            | "CONNECT";
        /** 如果设为json，会尝试对返回的数据做一次 JSON.parse */
        dataType?: string;
        /**
         * 设置响应的数据类型。合法值：text、arraybuffer
         * @version 1.7.0
         */
        responseType?: string;

        /** 收到开发者服务成功返回的回调函数，res = {data: '开发者服务器返回的内容'} */
        success?(res: DataResponse): void;
    }

    export interface RemoveStorageOptions extends BaseOptions {
        key: StorageKey
    }

    export type StorageKey = string

    export interface SetStorageOptions extends BaseOptions {
        key: StorageKey
        data: string
    }

    export interface SwitchTabOption extends BaseOptions {
        /**
         * 需要跳转的 tabBar 页面的路径
         * （需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数
         */
        url: string;
    }

    // #region 界面API列表
    export interface ToastOption extends BaseOptions {
        /**
         * 提示的内容
         */
        title: string;
        /**
         * 图标，只支持"success"、"loading", @version 1.9.0开始支持"none"
         * 图标为"success"/"loading"时，title文本最多显示7个汉字长度
         * 图标为"none"时不显示图标，title文本最多可显示两行
         */
        icon?: "success" | "loading" | "none";
        /**
         * 自定义图标的本地路径，image 的优先级高于 icon
         */
        image?: string;
        /**
         * 提示的延迟时间，单位毫秒，默认：1500
         */
        duration?: number;
        /**
         * 是否显示透明蒙层，防止触摸穿透，默认：false
         */
        mask?: boolean;
    }

    // 上传下载
    export interface UploadFileOption extends BaseOptions {
        /** 开发者服务器 url */
        url: string;
        /** 要上传文件资源 */
        file: File;
        /** 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容 */
        name: string;
        /** HTTP 请求 Header , header 中不能设置 Referer */
        header?: RequestHeader;
        /** HTTP 请求中其他额外的 form data */
        formData?: any;
    }

}

//  重写在浏览器中缺少的小程序方法
const web = {
    //  todo 隐藏等待框
    hideLoading() {
        alert("隐藏等待框");
    },
    //  上传文件
    uploadFile(params: WechatMiniprogram.UploadFileOption) {
        let resultPromise = Promise.resolve<WechatMiniprogram.uploadFileResponse>({
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

        resultPromise = [].reduce.call(params.filePath, (prev: Promise<any>, file: File) => {
            return prev.then(res => {
                if (res.status === 1000) {
                    handler(res);

                    return new Promise<WechatMiniprogram.uploadFileResponse>((resolve, reject) => {
                        let formData = new FormData();

                        formData.append('upload', file);

                        Request.send<{
                            ext: string
                            msg: string
                            name: string
                            path: string
                            size: number
                            status: number
                        }>({
                            url: api.missionRecord.uploadBuildPhotoWeb,
                            dataType: "JSON",
                            header: {
                                "Content-Type": false
                            },
                            processData: false,
                            data: formData
                        }).then(res => {
                            if (res.status === 1000) {
                                resolve({
                                    status: res.status,
                                    data: {
                                        buildingPhotoFilePath: res.path.split(",")
                                    },
                                    msg: res.msg
                                });
                            } else if (res.status === 1001) {
                                resolve({
                                    status: res.status,
                                    data: {
                                        buildingPhotoFilePath: []
                                    },
                                    msg: res.msg
                                });
                            } else {
                                reject("未知错误");
                            }
                        }).catch(reject);
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
    },
    //  导航到下一级页面
    navigateTo(options: WechatMiniprogram.NavigateToOption) {
        location.href = options.url;
        /*try {
            window.open(options.url);
        } catch (e) {
            location.href = options.url;
        }*/
    },
    //  发起请求
    request(options: WechatMiniprogram.RequestOption) {
        let xhr = new XMLHttpRequest()
            , responseText //  响应内容
        ;

        // options.timeout && (xhr.timeout = options.timeout);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    switch (options.dataType || "JSON") {
                        case 'JSON':
                            try {
                                responseText = JSON.parse(xhr.responseText);
                            } catch (e) {
                                responseText = xhr.responseText;
                            }
                            break;
                        case "XML":
                        default:
                            responseText = xhr.responseText;
                            break;
                    }
                    options.success(responseText);
                } else {
                    options.fail(xhr);
                }
            }
        };
        xhr.ontimeout = () => options.fail("超时");
        xhr.onerror = err => options.fail(err);
        try {
            xhr.open(options.method, options.url);
            if (options.header) {
                Object.keys(options.header).forEach(key => {
                    xhr.setRequestHeader(key, options.header[key]);
                });
            }
            xhr.send(options.data || "");
        } catch(err) {
            options.fail(err);
        }
    },
    //  todo 显示等待框
    showLoading(options: WechatMiniprogram.LoadingOption) {
        alert("等待中");
    },
    // todo 显示内容
    showToast(options: WechatMiniprogram.ToastOption) {
        alert(options.title);
    },
    //  todo 显示弹窗列表
    showActionSheet(options: WechatMiniprogram.ActionSheetOption) {
        alert(options);
    },
    //  跳转标签栏
    switchTab(options: WechatMiniprogram.SwitchTabOption) {
        location.href = options.url;
    },
    getStorageSync(key: WechatMiniprogram.StorageKey) {
        return web.getStorage({
            key
        });
    },
    getStorage(options: WechatMiniprogram.GetStorageOption) {
        return window.localStorage.getItem(options.key);
    },
    setStorage(options: WechatMiniprogram.SetStorageOptions) {
        try {
            window.localStorage.setItem(options.key, options.data);
            options.success && options.success(null);
        } catch (e) {
            options.fail && options.fail(e);
        } finally {
            options.complete && options.complete(null);
        }
    },
    removeStorage(options: WechatMiniprogram.RemoveStorageOptions) {
        try {
            window.localStorage.removeItem(options.key);
            options.success && options.success(null);
        } catch (e) {
            options.fail && options.fail(e);
        } finally {
            options.complete && options.complete(null);
        }
    }
};

namespace nsUtil {
    export interface navigatorOptions extends WechatMiniprogram.NavigateToOption {
        query?: {
            [index: string]: string | number | object
        }
    }

    export type storageKey = string;
    export type storageValue = string;

}

export class UtilWx {

    constructor() {

    }

    //  上传文件
    static uploadFile(options: WechatMiniprogram.UploadFileOption) {
        return web.uploadFile(options);
    }

    //  移除本地内存存储（异步）
    static removeStorage(key: nsUtil.storageKey) {
        return new Promise((resolve, reject) => {
            web.removeStorage({
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
            web.setStorage({
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
        return web.getStorageSync(key);
    }

    //  发送请求
    static request<T>(params: any) {
        const _success = params.success;

        params.success = (res: T) => {
            _success(res);
        };

        return web.request(params);
    }

    /**
     * 吐司
     * @param title 标题
     */
    static showToast(title: string) {
        return web.showToast({title});
    }

    //  显示操作菜单
    static showActionSheet(options: WechatMiniprogram.ActionSheetOption) {
        return web.showActionSheet(options);
    }

    //  显示等待框（唯一对象）
    static showLoading(options: WechatMiniprogram.LoadingOption) {
        return web.showLoading(options);
    }

    //  隐藏等待框
    static hideLoading() {
        return web.hideLoading();
    }

    //  切换选项卡页面
    static switchTo(options: WechatMiniprogram.SwitchTabOption) {
        return web.switchTab(options);
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

        return web.navigateTo({
            url: options.url.replace(/^pages\//, "../") + queryStr.replace(/^&/, "?"),
            complete: options.complete || function () {

            },
            // events: options.events || [],
            success: options.success || function () {

            },
            fail: options.fail || function () {

            }
        });
    }

}

export {UtilWx as util, WechatMiniprogram};