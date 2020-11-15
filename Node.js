class Node {
    constructor() {
        this.name = []
        this.children = []

    }

    isLeaf = function() { return false; };

    getItem(key) {
        var vals = this.name;
        for (var i = 0, len = vals.length; i < len; i++) {
            if (key < vals[i]) return i;
        }
        return vals.length;
    };

    addKey(key, ptrL, ptrR) {
        var vals = this.name;
        var itm = vals.length;
        for (var i = 0, len = vals.length; i < len; i++) {
            if (key <= vals[i]) {
                itm = i;
                break;
            }
        }
        for (var i = vals.length; i > itm; i--) {
            vals[i] = vals[i - 1];
            this.children[i + 1] = this.children[i];
        }
        vals[itm] = key;
        this.children[itm] = ptrL;
        this.children[itm + 1] = ptrR;
    };

    split() {
        var mov = Math.ceil(this.name.length / 2) - 1;
        var newN = new Node();
        newN.children[mov] = this.children.pop();
        for (var i = mov - 1; i >= 0; i--) {
            newN.name[i] = this.name.pop();
            newN.children[i] = this.children.pop();
        }
        return newN;
    };

    merge(frNod, paNod, paItm) {
        var del = paNod.name[paItm];
        this.name.push(del);
        for (var i = 0, len = frNod.name.length; i < len; i++) {
            this.name.push(frNod.name[i]);
            this.children.push(frNod.children[i]);
        }
        this.children.push(frNod.children[frNod.children.length - 1]);
        for (var i = paItm, len = paNod.name.length - 1; i < len; i++) {
            paNod.name[i] = paNod.name[i + 1];
            paNod.children[i + 1] = paNod.children[i + 2];
        }
        paNod.name.pop();
        paNod.children.pop();
        return del;
    };
}