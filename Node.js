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

    
}