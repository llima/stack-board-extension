export { };

declare global {
    interface Array<T> {
        sortByProp(prop: string): Array<T>;
    }
}

Array.prototype.sortByProp = function (prop: string) {
    var _self = this as Array<any>;
    return _self.sort((n1, n2) => {
        if (n1[prop].toLowerCase() > n2[prop].toLowerCase()) { return 1; }
        if (n1[prop].toLowerCase() < n2[prop].toLowerCase()) { return -1; } return 0;
    })
};
