import Subject from "./subject";

const MESSAGE_TYPE = {
    EVENT: "event",
}

export class BaseModel {
  constructor() {
    this.modelSignal = new Subject();
  }

  triggerEvent(eventName, data) {
    this.modelSignal.sendNext({
        type: MESSAGE_TYPE.EVENT,
        eventName,
        data,
    });
}
}
