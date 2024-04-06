import { BaseModel } from "./baseModel";

const EVENT_NAMES = {
  DATA_LOADED: "dataLoaded",
};

async function request(params) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  })
  return { widgetData: "widgetData" };
}

const LINKAGE = 'linkage'

export class ViewModel extends BaseModel {
  constructor(sharedDataPool, model) {
    super();
    this.sharedDataPool = sharedDataPool;
    this.model = model; 
    // 注册联动回调
    sharedDataPool.registerLinkageToWidgetMessage(this);
  }

  onReceiveLinkageWidgetMessage(msg = { type: LINKAGE }) {
    const { type } = msg;
    // 处理消息
    this.triggerLinkageEvent(type);
  }

  directLinkWidget(){
    this.sharedDataPool.queryLinkageToWidgetMessage({ type: LINKAGE });
  }

  triggerLinkageEvent(type) {
    // 处理消息
    this.triggerEvent(type,{
      data:'linkageData'
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
