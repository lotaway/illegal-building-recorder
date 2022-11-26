import {memberRoute, serverRoute} from "../../appConfig/route";
import {cn} from "../../appConfig/cn";

const tabBar = {
    "list": [
        {
            "pagePath": memberRoute.index,
            "iconPath": "./public/icon/icon-eye.png",
            "selectedIconPath": "./public/icon/icon-eye-active.png",
            "text": cn.global.tabBar.search
        },
        {
            "pagePath": memberRoute.add,
            "iconPath": "./public/icon/icon-add.png",
            "selectedIconPath": "./public/icon/icon-add-active.png",
            "text": cn.global.tabBar.record
        },
        {
            "pagePath": memberRoute.user,
            "iconPath": "./public/icon/icon-user.png",
            "selectedIconPath": "./public/icon/icon-user-active.png",
            "text": cn.global.tabBar.account
        },
        {
            "pagePath": serverRoute.backstageAdminSignIn,
            "iconPath": "./public/icon/icon-manage.png",
            "selectedIconPath": "./public/icon/icon-manage-active.png",
            "text": cn.global.tabBar.management
        }
    ]
};

export default tabBar;