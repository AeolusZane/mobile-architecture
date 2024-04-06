const MSG_LINKAGE_TO_WIDGET = "MSG_LINKAGE_TO_WIDGET";
export class SharedDataPool {
  constructor() {
    this.callbacks = [];
  }

  registerLinkageToWidgetMessage(viewModel) {
    this.registerMessage(MSG_LINKAGE_TO_WIDGET, viewModel, (msg) => {
      viewModel.onReceiveLinkageWidgetMessage(msg);
    });
  }

  queryLinkageToWidgetMessage(msg) {
    this.queryMessage(MSG_LINKAGE_TO_WIDGET, msg);
  }

  registerMessage(msgName, viewModel, callback) {
    this.callbacks.push({
      msgName,
      viewModel,
      callback,
    });
  }

  queryMessage(msgName, msg) {
    this.callbacks.forEach(({ msgName: name, callback }) => {
      if (msgName === name) {
        callback(msg);
      }
    });
  }
}
