
import { BaseView } from "./baseView";

export class WidgetView extends BaseView {
    constructor(props) { 
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.viewModel !== nextProps.viewModel) {
            // this.unBindModel();
            this.bindModel(nextProps.viewModel);
            // this.loadAllData(nextProps.viewModel);
        }
    }
    
    loadAllData(viewModel = this.props.viewModel, triggerType = 'linkage') {
        viewModel.loadAllData(triggerType);
    }

    onModelDataLoaded({triggerType,data}) {
        console.log('onModelDataLoaded', data);
        this.setState({
            ...data
        });
    }

    render() {
        return <div>hello</div>
    }
}
