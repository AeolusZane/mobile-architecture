import { Component } from "react";

export class WidgetView extends Component {
    constructor(props) { 
        super(props);
    }

    bindModel(viewModel) {
        viewModel.modelSignal.subscribeNext((message) => {
            this.onReceiveEventMessage(message);
        });
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

    onReceiveEventMessage(data) { 
        console.log('onReceiveEventMessage', data);
        const eventName = data.eventName;
        const funcName = 'onModel' + eventName.substring(0, 1).toUpperCase() + eventName.substring(1);
        const args = data.data;
        this[funcName](args);
        this.props[funcName](args);
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
