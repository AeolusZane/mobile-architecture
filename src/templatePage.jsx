import { BaseView } from "./core/baseView";
import { WidgetView } from "./core/widgetView";
import store from "./reducer/store";
import { TemplatePageModel } from "./templatePageModel";

function getViewModels() {
    return store.getState().sharedDataPool.viewModels;
}

export class TemplatePage extends BaseView {
    constructor() {
        super();
        this.templatePageModel = new TemplatePageModel();
    }

    render() {
        return (this.renderTemplatePage());
    }

    componentDidMount() {
        this.bindModel(this.templatePageModel); // 绑定model，主要是注册refreshView的回调
        /**
         * 这里创建了sharedDataPool和所有的model和viewModel
         * 重构把这里的sharedDataPool注册到全局的store里
         */
        this.templatePageModel.initData(); // init完毕后refreshView
    }

    renderTemplatePage() {
        const viewModels = getViewModels();
        if (viewModels.length === 0) {
            return null;
        }

        return (
            <div>
                {viewModels.map((viewModel, index) => {
                    return (
                        <WidgetView key={index} viewModel={viewModel} widgetIndex={index}/>
                    );
                })}
            </div>
        );
    }
}