class Leaf {
    constructor() {
        this.name = []
        this.prevLeaf = null
        this.nextLeaf = null
    }

    isLeaf() {
        return true
    }

    getItem(key, near) {
        var vals = this.name;
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

    addKey(key) {
        var vals = this.name;
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
                
            }
            vals[itm] = key;
            
        }
        return itm;
    };

    split() {
        var mov = Math.floor(this.name.length / 2);
        var newL = new Leaf();
        for (var i = mov - 1; i >= 0; i--) {
            newL.name[i] = this.name.pop(); 
        }
        newL.prevLeaf = this;
        newL.nextLeaf = this.nextLeaf;
        if (this.nextLeaf !== null) this.nextLeaf.prevLeaf = newL;
        this.nextLeaf = newL;
        return newL;
    };

    

}