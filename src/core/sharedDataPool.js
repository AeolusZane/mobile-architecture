export class SharedDataPool {
  constructor() {
    this.callbacks = [];
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
