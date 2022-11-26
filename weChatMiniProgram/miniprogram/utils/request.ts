import {util} from "./util";
import bindData from "../appConfig/bindData";

interface RequestHeader extends Object {
    [prop: string]: any
}

interface SendParams extends Object {
    header?: RequestHeader
    method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT"
    url: string
    data?: string | ArrayBuffer
    dataType?: "JSON" | "TEXT"

    [index: string]: any
}

//  网络请求
class Request {

    constructor() {

    }

    static imgArrToImgStr = (imgArr: Array<string>) => {
        return imgArr.join(",").replace(new RegExp(bindData.host, "g"), "");
    };

    static urlArrStrWithHost = (urlsStr: string) => {
        return urlsStr.split(",").map(Request.urlWithHost).join(",");
    };

    //  链接添加域名
    static urlWithHost(url: string) {
        return url.indexOf("/") === 0 ? bindData.host + url : url;
    };

    //  下载文件
    static downloadFile(url: string) {
        return new Promise<WechatMiniprogram.DownloadFileSuccessCallbackResult>((resolve, reject) => {
            util.downloadFile({
                url: Request.urlWithHost(url),
                success: result => {
                    console.log("文件临时地址：" + result.tempFilePath);
                    resolve(result);
                },
                fail: err => {
                    console.log("下载文件接口异常：" + JSON.stringify(err));
                    reject();
                }
            });
        });
    }

    /**
     * 打开文档
     * @param filePath {string} 文件路径
     */
    static openDocument(filePath: string) {
        return new Promise<WechatMiniprogram.GeneralCallbackResult>((resolve, reject) => {
            util.openDocument({
                filePath: filePath,
                fileType: "docx",
                success: res => {
                    console.log("打开成功:" + JSON.stringify(res));
                    resolve(res);
                },
                fail: err => {
                    console.log("打开失败：" + JSON.stringify(err));
                    reject(err);
                }
            });
        });
    }

    // 发送请求
    static send<T>(params: SendParams): Promise<T> {
        return new Promise((resolve, reject) => {
            const method = params.method || "POST";
            let header: RequestHeader = {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            ;

            if (!params.url) {
                return reject({
                    errMsg: "需要有接口地址才能发起请求"
                });
            }
            if (params.header && typeof params.header === "object") {
                for (let h of Object.keys(params.header)) {
                    header[h] = params.header[h];
                }
            }
            util.request<T>({
                header,
                method: method,
                url: bindData.host + params.url,
                data: params.data || "",
                success: (res: any) => resolve(res.data),
                fail: reject
            });
        });
    }

}

export {Request};