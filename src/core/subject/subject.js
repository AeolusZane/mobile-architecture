import Signal from './signal';

class Subject extends Signal {
    constructor(didSubscribe) {
        super();
        this._dispose = false;
    }

    isActive() {
        return !this.isClean && !this._dispose;
    }

    sendNext(v) {
        if (!this.isActive()) {
            return;
        }
        this.subscribers.forEach(s => {
            s && s.sendNext(v);
        });
    }

    sendError(error) {
        if (!this.isActive()) {
            return;
        }
        this.subscribers.forEach(s => {
            s && s.sendError(error);
        });
        this._dispose = true;
    }

    sendComplete() {
        if (!this.isActive()) {
            return;
        }
        this.subscribers.forEach(s => {
            s && s.sendComplete();
        });
        this._dispose = true;
    }

    addDisposeCb(disposeCb) {
        if (!this.isActive()) {
            disposeCb && disposeCb();
        } else {
            this.disposeCbs.push(disposeCb);
        }
    }

    dispose() {
        this.clean();
    }
}

// let subject = new Subject()
// let cb = subject.map(v => v + 2).filter(v => v > 4).subscribeNext(v => {
// 	console.log(v)
// })
// subject.sendNext(2)
// //subject.clean()
// subject.sendNext(3)
// //subject.sendComplete()
// subject.sendNext(4)
export default Subject;
