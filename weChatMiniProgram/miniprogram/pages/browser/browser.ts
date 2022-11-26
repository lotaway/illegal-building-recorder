import bindData from "../../appConfig/bindData";
import baseConfig from "../../appConfig/baseConfig";
import {Request} from "../../utils/request";

Page({
    data: {
        host: bindData.host,
        query: {},  //  外界传递的重定向参数
        webViewPath: "" //  webview跳转的路径
    },
    onShow() {
    },
    onLoad(options) {
        const redirect = options[baseConfig.query.redirect]   //  重定向网址
            , optionsQueryStr = options[baseConfig.query.query]   //  重定向参数
        ;
        let query: { [index: string]: string } = {}
            , queryStr = ""
        ;

        if (optionsQueryStr) {
            try {
                query = JSON.parse(optionsQueryStr);
            } catch (e) {
            }
        }
        for (let p in query) {
            if (query.hasOwnProperty(p)) {
                queryStr += `&${p}=${query[p]}`;
            }
        }
        if (redirect) {
            this.setData({
                webViewPath: Request.urlWithHost(redirect) + queryStr.replace(/^&/, "?")
            });
        } else {

        }
    }
})