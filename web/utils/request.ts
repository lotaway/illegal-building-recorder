import {util, WechatMiniprogram} from "./util";
import bindData from "../../appConfig/bindData";
import baseConfig from "../../appConfig/baseConfig";

interface RequestHeader extends Object {
    [prop: string]: any
}

interface SendParams extends Object {
    header?: RequestHeader
    method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT"
    url: string
    data?: string | ArrayBuffer | FormData
    dataType?: "JSON" | "TEXT"
    processData?: boolean
    contentType?: boolean

    [index: string]: any
}

interface ParamsToDev extends Object {
    [index: string]: any
}

//  装饰器
class Decorator {

    //  对接口调用设置测试用的域名
    static sendParamsDevHandler<Params extends ParamsToDev>(targetKey: string) {
        return (target: any, key: string, descriptor: PropertyDescriptor) => {
            const _descVal = descriptor.value;

            descriptor.value = (params: Params, ...paramArr: Array<any>) => {
                const host = baseConfig.dev ? bindData.host : "";

                baseConfig.dev && console.info(`${target.name}.${key}方法调用了增加测试域名${host}到${targetKey}属性上`);
                (params as ParamsToDev)[targetKey] = host + params[targetKey];

                return _descVal.call(this, params, ...paramArr);
            }
        }
    }

}

//  网络请求
export class Request {

    constructor() {

    }

    //  获取所有网址参数
    static getAllParams() {
        const paramsStr = location.search.replace(/^\?/, "");
        let resultParamObj: { [index: string]: string } = {};

        if (paramsStr) {
            paramsStr.split("&").forEach(item => {
                const [key, value] = item.split("=");

                resultParamObj[key] = value;
            });
        }

        return resultParamObj;
    }

    static imgArrToImgStr = (imgArr: Array<string>) => {
        return imgArr.join(",").replace(new RegExp(bindData.host, "g"), "");
    };

    static urlArrStrWithHost = (urlsStr: string) => {
        return urlsStr.split(",").map(Request.urlWithHost).join(",");
    };

    //  链接添加域名
    static urlWithHost(url: string) {
        return url.indexOf("/") === 0 && baseConfig.dev ? bindData.host + url : url;
    };

    // 发送请求
    @Decorator.sendParamsDevHandler<SendParams>("url")
    static send<T>(params: SendParams): Promise<T> {
        return new Promise((resolve, reject) => {
            const method = params.method || "POST"
                ,
                accepts: { [index: string]: string } = {
                    xml: "application/xml, text/xml",
                    html: "text/html",
                    script: "text/javascript, application/javascript",
                    json: "application/json, text/javascript",
                    text: "text/plain",
                    _default: "*/*"
                }
            ;
            let header: RequestHeader = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": params.dataType && accepts[params.dataType.toLowerCase()] ?
                        accepts[params.dataType.toLowerCase()] + ", */*; q=0.01" :
                        accepts._default
                }
            ;

            if (!params.url) {
                return reject({
                    errMsg: "需要有接口地址才能发起请求"
                });
            }
            if (params.header && typeof params.header === "object") {
                for (let h of Object.keys(params.header)) {
                    if (h === "Content-Type" && params.header[h] === false) {
                        delete header[h];
                    } else {
                        header[h] = params.header[h];
                    }
                }
            }
            /*if (params.data && params.processData === false && params.data != "string") {
                params.data = (() => {
                    const isFunction = (fn: any) => !!fn && typeof fn != "string" && !fn.nodeName &&
                        fn.constructor != Array && /^[\s[]?function/.test(fn + "");
                    let _data: Array<any> = [];

                    Object.keys(params.data).forEach(key => {
                        if (params.data.hasOwnProperty(key)) {
                            const value = (<{ [index: string]: string | Function }>params.data)[key];

                            _data.push(encodeURIComponent(key) + "=" + encodeURIComponent(isFunction(value) ? (value as Function)() : value));
                        }
                    });

                    return _data.join("&").replace(/%20/g, "+");
                })();
            }*/
            util.request<T>({
                header,
                method: method,
                url: params.url,
                data: params.data || "",
                success: resolve,
                fail: reject
            });
        });
    }

}

export default Request;