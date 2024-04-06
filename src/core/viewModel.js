import { BaseModel } from "./baseModel";
import store from "../reducer/store";
import {
  registerLinkageToWidgetMessage,
  queryLinkageToWidgetMessage,
} from "../reducer/sharedDataPoolSlice";

const EVENT_NAMES = {
  DATA_LOADED: "dataLoaded",
  LINKAGE: "linkage",
};

async function request(params) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  return { widgetData: "widgetData" };
}

const LINKAGE = "linkage";

export class ViewModel extends BaseModel {
  constructor() {
    super();
    // 注册联动回调
    // sharedDataPool.registerLinkageToWidgetMessage(this); 之前是这样
    store.dispatch(
      registerLinkageToWidgetMessage({
        viewModel: this,
      })
    );
  }

  onReceiveLinkageWidgetMessage = (msg = { type: LINKAGE }) => {
    console.log('onReceiveLinkageWidgetMessage', msg)
    const { type } = msg;
    // 处理消息
    this.triggerLinkageEvent(type);
  };

  directLinkWidget() {
    store.dispatch(queryLinkageToWidgetMessage({ type: LINKAGE }));
  }

  /**
   * 这里做了点改造，finereact里是直接调用loadAllData
   * 这里通过触发联动事件，通知其他组件联动状态发生了变化，其它组件监听到联动事件后再调用loadAllData
   */
  triggerLinkageEvent(type) {
    this.triggerEvent(EVENT_NAMES.LINKAGE, {
      type,
    });
  }

  loadAllData(triggerType) {
    this.loadData(triggerType);
  }

  loadData(triggerType) {
    request(this.getWidgetParams()).then((r) => {
      //这里model通过处理model获取请求参数
      // 请求获取的data
      const data = r.widgetData;
      this.triggerEvent(EVENT_NAMES.DATA_LOADED, {
        triggerType,
        data,
      });
    });
  }

  getWidgetParams() {
    function processModel(sharedDataPool, model) {
      // 利用model和shareDataPool做计算获取请求参数
      return {
        model,
        sharedDataPool,
      };
    }
    const params = processModel(this.sharedDataPool, this.model);

    return params;
  }
}
