class Subscriber {
    constructor(next, complete, error) {
        this.next = next;
        this.complete = complete;
        this.error = error;
        this.disposeCbs = [];
        this._disposable = false;
    }

    sendNext(v) {
        if (this._disposable) {
            return;
        }
        this.next && this.next(v);
    }

    sendComplete() {
        if (this._disposable) {
            return;
        }
        this.complete && this.complete();
        this.dispose();
    }

    sendError(err) {
        if (this._disposable) {
            return;
        }
        this.error && this.error(err);
        this.dispose();
    }

    addDisposeCb(disposeCb) {
        if (this._disposable) {
            disposeCb && disposeCb();
        } else {
            this.disposeCbs.push(disposeCb);
        }
    }

    dispose() {
        if (this._disposable) {
            return;
        }
        this.next = null;
        this.complete = null;
        this.error = null;
        this.disposeCbs.forEach(cb => {
            cb && cb();
        });
        this.disposeCbs = [];
        this._disposable = true;
    }
}

export default Subscriber;
