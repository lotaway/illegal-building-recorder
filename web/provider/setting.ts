import {Request} from "../utils/request";
import {api} from "../../appConfig/api";

namespace nsSettingResponse {

    export interface regionItem extends Object {
        Id: number
        ParentRegion: number
        RegionName: string
    }

    export interface region extends Object {
        status: number,
        data: Array<regionItem>
    }
}

class Setting {

    constructor() {

    }

    //  根据上级地区标识获取下级地区
    getRegion(preLevelId: number | undefined = 0) {
        return Request.send<nsSettingResponse.region>({
            url: api.setting.region,
            data: `parentRegion=${preLevelId}`
        });
    }

}

export {Setting as ProviderSetting, nsSettingResponse};