import { BaseView } from "./core/baseView";
import { WidgetView } from "./core/widgetView";
import { TemplatePageModel } from "./templatePageModel";

export class TemplatePage extends BaseView {
    constructor() {
        super();
        this.templatePageModel = new TemplatePageModel();
    }

    render() {
        return (this.renderTemplatePage());
    }

    componentDidMount() {
        this.bindModel(this.templatePageModel); // 绑定model，主要是触发refreshView
        this.templatePageModel.initData(); // init完毕后refreshView
    }

    renderTemplatePage() {
        if (!this.templatePageModel.viewModel) {
            return null;
        }

        return (
            <div>
                <WidgetView viewModel={this.templatePageModel.viewModel} />
            </div>
        );
    }
}