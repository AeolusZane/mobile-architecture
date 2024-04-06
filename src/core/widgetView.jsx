
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

    onModelLinkage(data) {
        console.log('onModelLinkage',data);
        this.loadAllData();
    }

    render() {
        return <div>
            <div>
                demo widget data:{this.state.loading?'loading...':this.state.data}
            </div>
            <button 
                onClick={() => {
                    this.setState({
                        loading:true,
                    });
                    const viewModel =this.props.viewModel;
                    viewModel.directLinkWidget();
                }}
            >
                linkage click
            </button>
        </div>
    }
}
