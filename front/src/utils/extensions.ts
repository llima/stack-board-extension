export { };

declare global {
    interface Array<T> {
        sortByProp(prop: string): Array<T>;
    }
    interface Object {
        deepcopy(): any;
    }
}

// eslint-disable-next-line
Array.prototype.sortByProp = function (prop: string) {
    var _self = this as Array<any>;
    try {
        return _self.sort((n1, n2) => {
            if (n1[prop].toLowerCase() > n2[prop].toLowerCase()) { return 1; }
            if (n1[prop].toLowerCase() < n2[prop].toLowerCase()) { return -1; } return 0;
        })
    }
    catch
    {
        return _self;
    }
};

// eslint-disable-next-line
Object.prototype.deepcopy = function (): any {
    var _self = this;
    var copy;

    if (null == _self || "object" != typeof _self) return _self;

    if (_self instanceof Date) {
        copy = new Date();
        copy.setTime(_self.getTime());
        return copy;
    }

    if (_self instanceof Array) {
        copy = [];
        for (var i = 0, len = _self.length; i < len; i++) {
            copy[i] = _self[i].deepcopy();
        }
        return copy;
    }

    if (_self instanceof Object) {
        copy = {};
        for (var attr in _self) {
            if (_self.hasOwnProperty(attr)) copy[attr] = _self[attr].deepcopy();
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
};