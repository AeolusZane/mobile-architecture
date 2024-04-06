import { BaseModel } from "./core/baseModel";
import { Model } from "./core/model";
import { SharedDataPool } from "./core/sharedDataPool";
import { ViewModel } from "./core/viewModel";
import store from "./reducer/store";
import {
  registerViewModel,
  setTemplateSharedDataPool,
  registerModel
} from "./reducer/sharedDataPoolSlice";

export class TemplatePageModel extends BaseModel {
  constructor() {
    super();
  }

  async initData() {
    const data = { widgetBean: "widgetBean" };
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    this.initModel(data);
    this.initViewModel();

    this.refreshViews();
  }

  initModel() {
    const model = new Model();
    const sharedDataPool = new SharedDataPool();
    store.dispatch(registerModel(model));
    store.dispatch(setTemplateSharedDataPool(sharedDataPool));
  }

  initViewModel() {
    const sharedDataPool = store.getState().sharedDataPool.sharedDataPool;
    const model = store.getState().sharedDataPool.models[0];
    const viewModel = new ViewModel(sharedDataPool, model);
    console.log('initViewModel');
    store.dispatch(registerViewModel(viewModel));
  }
}
