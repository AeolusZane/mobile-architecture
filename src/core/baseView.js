import { Component } from "react";

export class BaseView extends Component {
    constructor(props) { 
        super(props);
    }

    bindModel(viewModel) {
        viewModel.modelSignal.subscribeNext((message) => {
            if(message.type === 'refresh'){
                console.log('refresh')
                this.onReceiveRefreshMessage(message.data);
            }else{
                console.log('event')
                this.onReceiveEventMessage(message);
            }
        });
    }
    onReceiveRefreshMessage(){
        this.forceUpdate();
    }

    onReceiveEventMessage(data) { 
        console.log('onReceiveEventMessage', data);
        const eventName = data.eventName;
        const funcName = 'onModel' + eventName.substring(0, 1).toUpperCase() + eventName.substring(1);
        const args = data.data;
        this[funcName](args);
        this.props[funcName](args);
    }
}