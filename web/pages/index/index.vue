<template lang="pug">
  .page-user
    left-menu
      tab-bar(slot="menu", :list="tabBar.list", :active-index="tabBar.selectedIndex")
      div(slot="content")
        .account-msg.text-center 当前{{user.isSignIn ? "已登录的账户为" + user.currentUnit + " " + user.name : "请登录后再使用本功能"}}
        .statistics
          p.text 总宗数
            span.important {{user.statistics.missionRecord}}
          p.text 总面积
            span.important {{user.statistics.areaSize}}
          p.text 摸查宗数
            span.important {{user.statistics.investigateMissionRecord}}
          p.text 摸查面积
            span.important {{user.statistics.investigateArea}}
          p.text 治理宗数
            span.important {{user.statistics.dealMissionRecord}}
          p.text 治理面积
            span.important {{user.statistics.dealArea}}
          .btn.text-center.important(@click="showDocumentTypeSelection") 下载
        mp-actionsheet(:isShow="downloadOptions.isShow", :title="downloadOptions.title" :menu="downloadOptions.menu.list", @eventHandler="actionSheetEventHandler")
        .container-search
          .wrapper-search
            button.weui-btn.weui-btn_default.btn(:class="record.status === record.statusEnum.loading.value ? 'disabled' : ''", type="default", @click="search") {{record.filter.keywordPlaceHolder}}
            input.weui-input.input(type="text", v-model="record.filter.keyword", :placeholder="record.filter.inputTip", @keyup.entry="search")
        //  摸查和治理信息两种筛选
        .tab-filter
          p(:class="'tab-item' + (record.filter.msgType.enum.investigate.value === record.filter.msgType.value ? ' active' : '')", @click="selectMsgType(record.filter.msgType.enum.investigate.value)") {{record.filter.msgType.enum.investigate.title}}
          p(:class="'tab-item' + (record.filter.msgType.enum.deal.value === record.filter.msgType.value ? ' active' : '')", @click="selectMsgType(record.filter.msgType.enum.deal.value)") {{record.filter.msgType.enum.deal.title}}
        .tip 符合条件的信息
        .TypeList.record-list
          .record-item.item-goods.list-item(v-for="(item, index) in record.list", :key="item.id")
            .component-goods-item.component-goods-list-item(:class="item.thumbnail ? 'with-thumbnail' : 'no-thumbnail'", @click="showRecordDetail(index)")
              .thumbnail
                img.img(:src="item.thumbnail")
              .msg
                p.name {{item.title}}
                p.desc {{item.desc}}
                s.status.component-status.clearf
                  p.value.desabled(v-if="item.status === recordStatusEnum.waitForCheck.value") {{recordStatusEnum.waitForCheck.title}}
                  p.value.active(v-if="item.status >= recordStatusEnum.checked.value && item.status !== recordStatusEnum.unlocked.value") {{recordStatusEnum.checked.title2}}
                  p.value.disabled(v-if="item.status === recordStatusEnum.checked.value") {{recordStatusEnum.checked.title}}
                  p.value.active(v-if="item.status >= recordStatusEnum.confirmed.value && item.status !== recordStatusEnum.unlocked.value") {{recordStatusEnum.confirmed.title2}}
                  p.value.disabled(v-if="item.status === recordStatusEnum.confirmed.value") {{recordStatusEnum.confirmed.title}}
                  p.value.active(v-if="item.status >= recordStatusEnum.reconfirmed.value && item.status !== recordStatusEnum.unlocked.value") {{recordStatusEnum.reconfirmed.title}}
                  p.value.warn(v-if="item.status === recordStatusEnum.unlocked.value") {{recordStatusEnum.unlocked.title}}
          a.weui-btn.weui-btn_primary.size-default.type-primary.btn.block(@click="listScrollHandler", v-show="record.status === record.statusEnum.loaded.value") 加载下一页
          .loading.text-center.tip(v-show="record.status === record.statusEnum.loading.value")
            p 加载中
          .status-no.tip(:class="!record.list.length && record.status === record.statusEnum.end.value ? '' : ' hide'")
            p 找不到任务记录了~
          .component-tips.tip(:class="record.list.length && record.status === record.statusEnum.end.value ? '' : ' hide'")
            p 没有更多记录了~
</template>

<script lang="js">
// import Vue from "vue";
// import Component from "vue-class-component";
import "babel-polyfill";
import App from "../../utils/app";
import {ProviderMissionRecord} from "../../provider/missionRecord";
import {util} from "../../utils/util";
import {cn} from "../../../appConfig/cn";
import {memberRoute, serverRoute} from "../../../appConfig/route";
import baseConfig from "../../../appConfig/baseConfig";
import bindData from "../../../appConfig/bindData";
import tabBarConfig from "../../config/tabBar";
import {UserProvider} from "../../provider/user";
import TabBar from "../../layout/tabBar";
import LeftMenu from "../../layout/leftMenu";
import MpActionsheet from "../../component/mp-actionsheet";

let app;
const userDataPromise = new Promise((resolve, reject) => {
  // 获取应用实例
  app = new App((isOk, err) => {
    isOk ? resolve() : reject(err);
  });
});

let recordList/*: Array<{
        id: number
        thumbnail: string
        title: string
        desc: string
        status: number
    }>*/ = [];

export default {
  name: "index",
  components: {
    TabBar,
    LeftMenu,
    MpActionsheet
  },
  data() {
    return {
      recordStatusEnum: bindData.missionRecordStatus.enum,
      userProvider: new UserProvider(),
      tabBar: {
        selectedIndex: tabBarConfig.list.findIndex(item => item.pagePath.indexOf(memberRoute.index) > -1),
        list: tabBarConfig.list.map(item => {
          return {
            iconNormalPath: item.iconPath,
            iconActivePath: item.selectedIconPath,
            link: item.pagePath,
            title: item.text
          };
        })
      },
      downloadOptions: {
        isShow: false,
        title: "请选择",
        menu: {
          list: [
            {
              title: "违法建设摸查汇总表",
              link: serverRoute.allCollect
            },
            {
              title: "农村村民住宅违法建设摸查表",
              link: serverRoute.investigateDetailList
            },
            {
              title: "违法建设摸查表",
              link: serverRoute.investigateSimpleList
            }
          ]
        }
      },
      record: {
        status: 0,  //  加载状态
        statusEnum: {
          noInit: {
            title: cn.global.load.noInit,
            value: 0
          },
          loading: {
            title: cn.global.load.loading,
            value: 1
          },
          loaded: {
            title: cn.global.load.loaded,
            value: 2
          },
          end: {
            title: cn.global.load.end,
            value: 3
          },
          error: {
            title: cn.global.load.error,
            value: 4
          }
        },
        provider: new ProviderMissionRecord(),
        pageIndex: 0,  //  页码
        filter: {
          title: cn.index.searchTitle,
          keyword: "", //  搜索关键字
          inputTip: cn.index.searchTip,
          keywordPlaceHolder: cn.index.searchPlaceHolder, //  占位内容
          msgType: {
            value: -1,
            enum: bindData.missionType.enum
          },
          area: {
            title: cn.global.location.areaTitle,
            name: "area",
            defaultSelected: null,
            list: []
          }
          , street: {
            title: cn.global.location.streetTitle,
            name: "street",
            defaultSelected: null,
            list: []
          }
        },
        list: recordList
      },
      user: {
        isSignIn: false,
        name: "", //  用户名
        currentUnit: "" //  所在单位
        //  统计
        , statistics: {
          areaSize: 0  //  总面积
          , missionRecord: 0 //  任务总数量
          , investigateMissionRecord: 0 // 摸查任务总数量
          , investigateArea: 0    //  摸查总面积
          , dealMissionRecord: 0 //  治理任务总数量
          , dealArea: 0   //  治理总面积
        }
      }
    }
  }
  , methods: {
    //  点击搜索
    search() {
      if (this.record.status !== this.record.statusEnum.loading.value) {
        this.resetRecordList();

        return this.getNextRecord();
      }

      return null;
    },
    //  重置记录筛选
    resetRecordFilter() {
      this.record.filter.keyword = "";
      this.record.filter.msgType.value = this.record.filter.msgType.enum.investigate.value;
    },
    //  重置记录列表
    resetRecordList() {
      this.record.list = [];
      this.record.pageIndex = 0;
      this.record.status = this.record.statusEnum.noInit.value;
    },
    //    选择信息类型
    selectMsgType(newValue) {
      this.record.filter.msgType.value = newValue;
      this.search();
    },
    //      获取下一页
    getNextRecord() {
      let getListPromise;

      if (this.record.status === this.record.statusEnum.loading.value || this.record.status === this.record.statusEnum.end.value) {
        return Promise.reject("无法处理的状态：" + this.record.status);
      }
      this.record.status = this.record.statusEnum.loading.value;
      ++this.record.pageIndex;
      let query = {
        keyword: this.record.filter.keyword,
        pageIndex: this.record.pageIndex,
        accessToken: this.userProvider.getAccessToken()
      };

      if (this.record.filter.msgType.value === this.record.filter.msgType.enum.investigate.value) {
        getListPromise = this.record.provider.getInvestigateList(query);
      } else {
        getListPromise = this.record.provider.getDealList(query);
      }

      return getListPromise.then(res => {
        switch (res.status) {
            //  成功
          case 1000:
            this.record.status = res.data.list.length && this.record.pageIndex < res.data.pageCount ? this.record.statusEnum.loaded.value : this.record.statusEnum.end.value;
            res.data.list.forEach(item => {
              this.record.list.push(item);
            });
            break;
            //        失败
          case 1001:
            util.showToast(res.msg);
            this.record.status = this.record.statusEnum.error.value;
            break;
            //    未知错误
          default:
            util.showToast(`获取任务记录列表${cn.global.error.errorUnknown}：` + res.msg);
            this.record.status = this.record.statusEnum.error.value;
            break;
        }

        return res;
      })
          .catch(err => {
            util.showToast(`获取记录${cn.global.error.apiException}：` + JSON.stringify(err));
            this.record.status = this.record.statusEnum.error.value;
          })
          ;
    },
    //      点击加载下一页
    listScrollHandler() {
      if (this.record.status === this.record.statusEnum.loaded.value) {
        this.getNextRecord();
      }
    },
    //  显示记录详情
    showRecordDetail(index) {
      const recordItem = this.record.list[index];

      if (recordItem && recordItem.id) {
        util.navigatorTo({
          url: memberRoute.missionRecordDetail,
          query: {
            [baseConfig.query.msgType]: this.record.filter.msgType.value,
            [this.record.filter.msgType.value === this.record.filter.msgType.enum.investigate.value ? baseConfig.query.investigateMissionRecordId : baseConfig.query.dealMissionRecordId]: recordItem.id
          }
        });
      }
    },
    //    显示文档类型选择
    showDocumentTypeSelection() {
      this.downloadOptions.isShow = true;
    },
    // 选择文档下载类型
    actionSheetEventHandler({eventType, data}) {
      switch (eventType) {
          //  点击文档类型选择
        case "clickMenu":
          const redirect = this.downloadOptions.menu.list[data.index].link;

          if (redirect) {
            util.navigatorTo({
              url: redirect,
              query: {
                [baseConfig.query.accessToken]: this.userProvider.getAccessToken()
              }
            });
          } else {
            util.showToast("异常，不是可选的文档类型");
          }
          break;
          //    关闭
        case "clickMask":
          break;
        default:
          util.showToast("无法处理的情况");
          break;
      }
      this.downloadOptions.isShow = false;
    },
    //  显示登录界面
    showSignIn(err) {
      util.showToast(err ? err.msg : cn.user.noSignIn);
      util.switchTo({
        url: memberRoute.user
      });
    }
  },
  mounted() {
    //  @onLoad()
    this.record.filter.msgType.value = this.record.filter.msgType.enum.investigate.value;
    // @onShow()
    userDataPromise.then(() => {
      //  从全局数据同步登录状态到页面数据里
      if (this.user.isSignIn !== app.globalData.isSignIn) {
        this.user.isSignIn = app.globalData.isSignIn;
        this.user.name = app.globalData.user.name;
        this.user.currentUnit = app.globalData.user.currentUnit;
        this.user.statistics.areaSize = app.globalData.user.statistics.areaSize;
        this.user.statistics.missionRecord = app.globalData.user.statistics.missionRecord;
        this.user.statistics.investigateMissionRecord = app.globalData.user.statistics.investigateMissionRecord;
        this.user.statistics.investigateArea = app.globalData.user.statistics.investigateArea;
        this.user.statistics.dealMissionRecord = app.globalData.user.statistics.dealMissionRecord;
        this.user.statistics.dealArea = app.globalData.user.statistics.dealArea;
      }
      if (this.user.isSignIn) {
        return (this.record.status === this.record.statusEnum.noInit.value) && this.getNextRecord();
      } else {
        return Promise.reject({
          status: -1003,
          msg: cn.user.noSignIn
        });
      }
    })
        .catch(err => {
          this.showSignIn(err);
        })
    ;
  }
}
</script>

<style scoped>
@import "index.css";
</style>