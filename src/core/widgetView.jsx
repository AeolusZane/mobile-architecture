
import { BaseView } from "./baseView";
import store from "../reducer/store";
export class WidgetView extends BaseView {
    constructor(props) { 
        super(props);
        this.state = {
            data:'',
            loading:true,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.viewModel !== nextProps.viewModel) {
            // this.unBindModel();
            this.bindModel(nextProps.viewModel);
            this.loadAllData(nextProps.viewModel);
        }
    }
    componentDidMount() {
        this.bindModel(this.props.viewModel);
        this.loadAllData();
    }
    
    loadAllData(viewModel = this.props.viewModel, triggerType = 'init') {
        viewModel.loadAllData(triggerType);
    }

    onModelDataLoaded({triggerType,data}) {
        console.log('onModelDataLoaded',triggerType, data);
        this.setState({
            data:data,
            loading:false,
        });
    }

    // 其它组件触发了联动
    onModelLinkage(data) {
        console.log('onModelLinkage',data);
        this.setState({
            loading:true,
        });
        this.loadAllData();
    }

    render() {
        return <div>
            <div>
                demo widget:{this.props.widgetIndex} data:{this.state.loading?'loading...':this.state.data}
            </div>
            <button 
                onClick={() => {
                    if(this.state.loading){
                        return;
                    }
                    const viewModel =this.props.viewModel;
                    viewModel.directLinkWidget();
                }}
            >
                linkage click
            </button>
        </div>
    }
}
