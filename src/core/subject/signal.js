import Subscriber from './subscriber';

const defaultValue = '$@%%^&%#&*6';

class Signal {
    constructor(didSubscribe) {
        this.subscribers = [];
        this.didSubscribe = didSubscribe;
        this.isClean = false;
        this.extendSignals = [];
        this.disposeCbs = [];
    }

    isActive() {
        return !this.isClean;
    }

    subscribeNext(next, complete = null, error = null) {
        if (this.isActive()) {
            let s = new Subscriber(next, complete, error);
            this._subscribe(s);
            return () => {
                s.dispose();
            };
        }
        return null;
    }

    _subscribe(s) {
        this.subscribers.push(s);
        s.addDisposeCb(() => {
            let index = this.subscribers.findIndex(item => item == s);
            this.subscribers.splice(index, 1);
        });
        if (this.didSubscribe == null) {
            return;
        }
        let cb = this.didSubscribe(s);
        if (cb != null) {
            s.addDisposeCb(cb);
        }
    }

    subscribeClean(listener) {
        if (!this.isClean) {
            this.disposeCbs.push(listener);
        } else {
            listener && listener();
        }
    }

    clean() {
        if (this.isClean) {
            return;
        }
        this.isClean = true;
        this.extendSignals.forEach(s => {
            s.clean();
        });
        this.subscribers.forEach(s => {
            s && s.dispose();
        });
        this.disposeCbs.forEach(cb => {
            cb && cb();
        });
        this.subscribers = [];
        this.disposeCbs = [];
    }

    map(mapf) {
        let signal = new Signal(s => {
            let cb = this.subscribeNext(
                v => {
                    s.sendNext(mapf(v));
                },
                () => {
                    s.sendComplete();
                },
                err => {
                    s.sendError(err);
                }
            );
            return cb;
        });
        this.extendSignals.push(signal);
        return signal;
    }

    filter(filterf) {
        let signal = new Signal(s => {
            let cb = this.subscribeNext(
                v => {
                    if (filterf(v)) {
                        s.sendNext(v);
                    }
                },
                () => {
                    s.sendComplete();
                },
                err => {
                    s.sendError(err);
                }
            );
            return cb;
        });
        this.extendSignals.push(signal);
        return signal;
    }

    take(count) {
        let n = 0;
        let signal = new Signal(s => {
            let cb = this.subscribeNext(
                v => {
                    if (n < count) {
                        s.sendNext(v);
                        n++;
                    } else {
                        s.sendComplete();
                    }
                },
                () => {
                    s.sendComplete();
                },
                err => {
                    s.sendError(err);
                }
            );
            return cb;
        });
        this.extendSignals.push(signal);
        return signal;
    }

    delay(time) {
        let signal = new Signal(s => {
            let idss = [];
            let cb = this.subscribeNext(
                v => {
                    idss.push(
                        setTimeout(() => {
                            s.sendNext(v);
                        }, time)
                    );
                },
                () => {
                    setTimeout(() => {
                        s.sendComplete();
                    }, time);
                },
                err => {
                    s.sendError(err);
                }
            );
            return () => {
                cb && cb();
                idss.forEach(ids => {
                    clearTimeout(idss);
                });
                idss = null;
            };
        });
        this.extendSignals.push(signal);
        return signal;
    }

    throtlle(time) {
        let signal = new Signal(s => {
            let idss = null;
            let currentValue = defaultValue;
            let cb = this.subscribeNext(
                v => {
                    if (idss != null) {
                        clearTimeout(idss);
                        idss = null;
                    }
                    currentValue = v;
                    idss = setTimeout(() => {
                        s.sendNext(v);
                        currentValue = defaultValue;
                    }, time);
                },
                () => {
                    if (idss != null) {
                        clearTimeout(idss);
                    }
                    if (currentValue != defaultValue) {
                        s.sendNext(currentValue);
                        currentValue = defaultValue;
                    }
                    s.sendComplete();
                },
                err => {
                    s.sendError(err);
                }
            );
            return () => {
                cb && cb();
                clearTimeout(idss);
            };
        });
        this.extendSignals.push(signal);
        return signal;
    }

    combine(signals) {
        let allSignals = [this].concat(signals);
        let cSignal = new Signal(s => {
            let rets = allSignals.map(i => defaultValue);
            let allCompleted = allSignals.map(i => false);
            let disposeCbs = [];
            allSignals.forEach((signal, index) => {
                let cb = signal.subscribeNext(
                    v => {
                        rets[index] = v;
                        if (rets.every(vv => vv != defaultValue)) {
                            let retsCopy = rets.concat();
                            s.sendNext(retsCopy);
                        }
                    },
                    () => {
                        allCompleted[index] = true;
                        if (allCompleted.every(cp => cp)) {
                            s.sendComplete();
                        }
                    },
                    err => {
                        s.sendError(err);
                    }
                );
                disposeCbs.push(cb);
            });
            return () => {
                disposeCbs.forEach(cb => {
                    cb && cb();
                });
            };
        });
        allSignals.forEach(signal => {
            signal.disposeCbs.push(() => {
                if (allSignals.every(sig => sig.isClean)) {
                    cSignal.clean();
                    allSignals = null;
                }
            });
        });
        return cSignal;
    }

    zip(signals) {
        let allSignals = [this].concat(signals);
        let vArrays = allSignals.map(signal => {
            return {
                values: [],
                completed: false,
            };
        });
        let cSignal = new Signal(s => {
            let sendComplete = () => {
                let hasCompleted = vArrays.some(v => {
                    return v.values.length === 0 && v.completed;
                });
                if (hasCompleted) {
                    s.sendComplete();
                }
            };
            let sendNext = () => {
                let canSendNext = vArrays.every(v => {
                    return v.values.length > 0;
                });
                if (canSendNext) {
                    let rets = vArrays.map(v => v.values[0]);
                    vArrays.forEach(v => {
                        v.values.splice(0, 1);
                    });
                    s.sendNext(rets);
                    sendComplete();
                }
            };
            let disposeCbs = [];
            allSignals.forEach((signal, index) => {
                let cb = signal.subscribeNext(
                    v => {
                        vArrays[index].values.push(v);
                        sendNext();
                    },
                    () => {
                        vArrays[index].completed = true;
                        sendComplete();
                    },
                    err => {
                        s.sendError(err);
                    }
                );
                disposeCbs.push(cb);
            });
            return () => {
                disposeCbs.forEach(cb => {
                    cb && cb();
                });
            };
        });
        allSignals.forEach(signal => {
            signal.disposeCbs.push(() => {
                if (allSignals.every(sig => sig.isClean)) {
                    cSignal.clean();
                    allSignals = null;
                }
            });
        });
        return cSignal;
    }

    merge(signals) {
        let allSignals = [this].concat(signals);
        let mSignal = new Signal(s => {
            let allCompleted = allSignals.map(i => false);
            let disposeCbs = [];
            allSignals.forEach((signal, index) => {
                let cb = signal.subscribeNext(
                    v => {
                        s.sendNext(v);
                    },
                    () => {
                        allCompleted[index] = true;
                        if (allCompleted.every(cp => cp)) {
                            s.sendComplete();
                        }
                    },
                    err => {
                        s.sendError(err);
                    }
                );
                disposeCbs.push(cb);
            });
            return () => {
                disposeCbs.forEach(cb => {
                    cb && cb();
                });
            };
        });
        allSignals.forEach(signal => {
            signal.disposeCbs.push(() => {
                if (allSignals.every(sig => sig.isClean)) {
                    mSignal.clean();
                    allSignals = null;
                }
            });
        });
        return mSignal;
    }

    concat(signal) {
        if (this.isClean || signal.isClean) {
            //不能链接一个已经被释放的signal
            return null;
        }
        let nsignal = new Signal(s => {
            let cb = null;
            cb = this.subscribeNext(
                v => {
                    s.sendNext(v);
                },
                () => {
                    cb = signal.subscribeNext(
                        v => {
                            s.sendNext(v);
                        },
                        () => {
                            s.sendComplete();
                        },
                        err => {
                            s.sendError(err);
                        }
                    );
                },
                err => {
                    s.sendError(err);
                }
            );
            return () => {
                cb && cb();
            };
        });
        this.subscribeClean(() => {
            nsignal.clean();
        });
        signal.subscribeClean(() => {
            nsignal.clean();
        });
        return nsignal;
    }
}

export default Signal;
