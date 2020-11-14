class Leaf {
    constructor() {
        this.keyval = []
        this.recnum = []
        this.prevLeaf = null
        this.nextLeaf = null
    }

    isLeaf() {
        return true
    }

    getItem(key, near) {
        var vals = this.keyval;
        if (near) {
            for (var i = 0, len = vals.length; i < len; i++) {
                if (key <= vals[i]) return i;
            }
        } else {
            for (var i = 0, len = vals.length; i < len; i++) {
                if (key === vals[i]) return i;
            }
        }
        return -1;
    }

    addKey(key, rec) {
        var vals = this.keyval;
        var itm = vals.length;
        for (var i = 0, len = itm; i < len; i++) {
            if (key === vals[i]) {
                itm = -1;
                break;
            }
            if (key <= vals[i]) {
                itm = i;
                break;
            }
        }
        if (itm != -1) {
            for (var i = vals.length; i > itm; i--) {
                vals[i] = vals[i - 1];
                this.recnum[i] = this.recnum[i - 1];
            }
            vals[itm] = key;
            this.recnum[itm] = rec;
        }
        return itm;
    };

    split() {
        var mov = Math.floor(this.keyval.length / 2);
        var newL = new Leaf();
        for (var i = mov - 1; i >= 0; i--) {
            newL.keyval[i] = this.keyval.pop();
            newL.recnum[i] = this.recnum.pop();
        }
        newL.prevLeaf = this;
        newL.nextLeaf = this.nextLeaf;
        if (this.nextLeaf !== null) this.nextLeaf.prevLeaf = newL;
        this.nextLeaf = newL;
        return newL;
    };

    merge(frNod, paNod, frKey) {
        for (var i = 0, len = frNod.keyval.length; i < len; i++) {
            this.keyval.push(frNod.keyval[i]);
            this.recnum.push(frNod.recnum[i]);
        }
        this.nextLf = frNod.nextLf;
        if (frNod.nextLeaf !== null) frNod.nextLeaf.prevLeaf = this;
        frNod.prevLeaf = null;
        frNod.nextLeaf = null;
        var itm = paNod.keyval.length - 1;
        for (var i = itm; i >= 0; i--) {
            if (paNod.keyval[i] == frKey) {
                itm = i;
                break;
            }
        }
        for (var i = itm, len = paNod.keyval.length - 1; i < len; i++) {
            paNod.keyval[i] = paNod.keyval[i + 1];
            paNod.nodptr[i + 1] = paNod.nodptr[i + 2];
        }
        paNod.keyval.pop();
        paNod.nodptr.pop();
    };

}