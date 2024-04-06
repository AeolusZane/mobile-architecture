import { BaseModel } from "./baseModel";
import store from "../reducer/store";
import {
  registerLinkageToWidgetMessage,
  queryLinkageToWidgetMessage,
} from "../reducer/sharedDataPoolSlice";

const EVENT_NAMES = {
  DATA_LOADED: "dataLoaded",
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

  triggerLinkageEvent(type) {
    this.loadAllData(type);
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
