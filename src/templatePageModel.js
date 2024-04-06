import { BaseModel } from "./core/baseModel";
import { Model } from "./core/model";
import { SharedDataPool } from "./core/sharedDataPool";
import { ViewModel } from "./core/viewModel";

export class TemplatePageModel extends BaseModel{
    constructor() {
        super();
        // 这里简化一下，只有一个组件的model和viewModel
        this.model = null;
        this.viewModel = null;
    }

    async initData(){
        const data = {widgetBean:'widgetBean'}
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
        this.initModel(data);
        this.initViewModel();

        this.refreshViews();
    }

    initModel(){
        this.model = new Model();
        this.sharedDataPool = new SharedDataPool();
    }

    initViewModel(){
        this.viewModel = new ViewModel(this.sharedDataPool, this.model);
    }
}